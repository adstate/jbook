import { ActionType } from '../action-types';
import {
  Action,
  Direction,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  DragCellStartAction,
  DragCellAction,
  DragCellEndAction,
  RegisterElemRect,
} from '../actions';
import { Cell, CellTypes } from '../cell';
import bundle from '../../bundler';
import { Dispatch } from 'react';
import axios from 'axios';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');

      // init drag map
      // dispatch({ type: ActionType.INIT_DRAG_MAP, payload: data });

      dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { data, order },
    } = getState();

    const cells = order.map((id) => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (err) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const registerElemRect = (
  cellId: string,
  rect: ClientRect
): RegisterElemRect => {
  return {
    type: ActionType.REGISTER_ELEM_RECT,
    payload: {
      cellId,
      rect,
    },
  };
};

export const dragCellStart = (id: string, cellRect: ClientRect) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { order },
    } = getState();

    dispatch({
      type: ActionType.DRAG_CELL_START,
      payload: {
        id,
        rect: cellRect,
      },
    });

    const slide = order.slice(order.indexOf(id) + 1);

    dispatch({
      type: ActionType.SLIDE_CELLS,
      payload: {
        cells: slide,
        shiftY: cellRect.height + 10,
      },
    });
  };
};

export const dragCell = (id: string, shiftY: number) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    dispatch({
      type: ActionType.DRAG_CELL,
      payload: {
        id,
        shiftY: shiftY,
      },
    });

    const {
      cells: { order },
      drag: { cells, dragging },
    } = getState();

    if (!dragging) {
      return;
    }

    // if (Math.abs(shiftY) > 600) {
    const { targetCell, shiftY: draggedShiftY } = cells[id];
    const curDraggedCellRect = {
      top: dragging.rect.top + draggedShiftY,
      left: dragging.rect.left,
      right: dragging.rect.right,
      bottom: dragging.rect.bottom + draggedShiftY,
      height: dragging.rect.height,
      width: dragging.rect.width,
    };

    const direction = Math.sign(shiftY);

    const target = order.filter((cellId) => {
      const cellRect = cells[cellId].rect;

      if (!cellRect) {
        return false;
      }

      const hasOverlap = getHasOverlap(curDraggedCellRect, cellRect);

      if (!hasOverlap) {
        return false;
      }

      return hasOverlapEnough(curDraggedCellRect, cellRect, direction);
    });

    if (target.length === 0) {
      return;
    }

    const targetElement = direction > 0 ? target[target.length - 1] : target[0];
    const delta = direction > 0 ? 1 : 0;

    dispatch({
      type: ActionType.SET_TARGET_CELL,
      payload: targetElement,
    });

    const slide = order.slice(order.indexOf(targetElement || id) + delta);

    dispatch({
      type: ActionType.SLIDE_CELLS,
      payload: {
        cells: slide,
        shiftY: dragging.rect.height + 10,
      },
    });
    // } else {
    //   const slide = order.slice(order.indexOf(id) + 1);

    //   dispatch({
    //     type: ActionType.SLIDE_CELLS,
    //     payload: {
    //       cells: slide,
    //       shiftY: dragging.rect.height + 10,
    //     },
    //   });
    // }
  };
};

export const dragCellEnd = (id: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { order },
      drag: { dragging },
    } = getState();

    if (!dragging) {
      return;
    }

    const prevCellIndex = order.indexOf(id);
    const newCellIndex = order.indexOf(dragging.targetCell);
    const moveSteps = newCellIndex - prevCellIndex;
    const direction = moveSteps > 0 ? 'down' : 'up';

    for (let i = 0; i < Math.abs(moveSteps); i++) {
      dispatch({
        type: ActionType.MOVE_CELL,
        payload: {
          id,
          direction,
        },
      });
    }

    dispatch({
      type: ActionType.DRAG_CELL_END,
      payload: id,
    });
  };
};

function getHasOverlap(first: ClientRect, second: ClientRect): boolean {
  return (
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  );
}

function hasOverlapEnough(
  first: ClientRect,
  second: ClientRect,
  direction: number
): boolean {
  return direction > 0
    ? Math.abs(first.bottom - second.top) > 55
    : Math.abs(first.top - second.bottom) > 55;
}
