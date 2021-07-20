import produce, { current } from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface DragPosition {
  dragging?: boolean;
  shiftY: number;
  targetCell?: string;
  rect?: ClientRect;
}

export interface DragMap {
  [key: string]: DragPosition;
}

interface DragState {
  cells: DragMap;
  dragging: {
    rect: ClientRect;
    prevTargetCell: string;
    targetCell: string;
    // rect: {
    //   width: number;
    //   height: number;
    // };
  } | null;
}

const initialState: DragState = {
  cells: {},
  dragging: null,
};

const reducer = produce((state: DragState, action: Action): DragState => {
  const copy = current(state);

  switch (action.type) {
    // unused
    case ActionType.INIT_DRAG_MAP:
      const map = action.payload.reduce((res: DragMap, cell: Cell) => {
        res[cell.id] = {
          shiftY: 0,
        };

        return res;
      }, {});

      state.cells = map;

      return state;

    case ActionType.REGISTER_ELEM_RECT:
      if (state.cells[action.payload.cellId]) {
        state.cells[action.payload.cellId].rect = action.payload.rect;
      } else {
        state.cells[action.payload.cellId] = {
          shiftY: 0,
          rect: action.payload.rect,
        };
      }

      return state;

    case ActionType.SLIDE_CELLS:
      for (let cell of Object.keys(state.cells)) {
        if (!state.cells[cell].dragging) {
          state.cells[cell].shiftY = 0;
        }
      }

      for (let cell of action.payload.cells) {
        if (!state.cells[cell].dragging) {
          state.cells[cell].shiftY = action.payload.shiftY;
        }
      }

      return state;

    case ActionType.SET_TARGET_CELL:
      if (!state.dragging) {
        return state;
      }

      const prevValue = state.dragging.targetCell;
      state.dragging.targetCell = action.payload;

      if (state.dragging.targetCell !== prevValue) {
        state.dragging.prevTargetCell = prevValue;
      }

      return state;

    case ActionType.DRAG_CELL_START:
      // state.dragging = {
      //   cellId: action.payload,
      //   shiftY: 0,
      //   targetCellId: action.payload,
      // };

      state.cells[action.payload.id] = {
        shiftY: 0,
        dragging: true,
        rect: action.payload.rect,
        targetCell: action.payload.id,
      };

      state.dragging = {
        rect: action.payload.rect,
        prevTargetCell: action.payload.id,
        targetCell: action.payload.id,
      };

      return state;

    case ActionType.DRAG_CELL:
      const cellId = action.payload.id;
      const shiftY = action.payload.shiftY;

      const draggedCell = state.cells[cellId];

      if (!draggedCell.dragging) {
        return state;
      }

      draggedCell.shiftY = shiftY;

      // if (Math.abs(shiftY) > 100) {
      //   const curIndex = state.order.indexOf(cellId);
      //   state.dragging.targetCellId =
      //     shiftY > 0 ? state.order[curIndex + 1] : state.order[curIndex - 1];
      // }

      return state;

    case ActionType.DRAG_CELL_END:
      const cell = state.cells[action.payload];

      if (!cell.dragging) {
        return state;
      }

      //const dragedCell = state.dragging.cellId;
      //const targetCell = state.dragging.targetCellId;

      // const i = state.order.indexOf(dragedCell);
      // const targetI = state.order.indexOf(targetCell);

      // state.order.splice(i, 1);
      // state.order.splice(targetI, 0, dragedCell);

      state.dragging = null;

      for (let cell of Object.keys(state.cells)) {
        state.cells[cell].shiftY = 0;
      }

      cell.dragging = false;

      return state;

    default:
      return state;
  }
}, initialState);

export default reducer;
