import { ActionType } from '../action-types';
import { Cell, CellTypes } from '../cell';

export type Direction = 'up' | 'down';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      err: string;
    };
  };
}

export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

export interface FetchCellsCompleteAction {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

export interface SaveCellsErrorAction {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}

export interface InitDragMapAction {
  type: ActionType.INIT_DRAG_MAP;
  payload: Cell[];
}

export interface RegisterElemRect {
  type: ActionType.REGISTER_ELEM_RECT;
  payload: {
    cellId: string;
    rect: ClientRect;
  };
}

export interface SlideCellsAction {
  type: ActionType.SLIDE_CELLS;
  payload: {
    cells: string[];
    shiftY: number;
  };
}

export interface SetTargetCell {
  type: ActionType.SET_TARGET_CELL;
  payload: string;
}

export interface DragCellStartAction {
  type: ActionType.DRAG_CELL_START;
  payload: {
    id: string;
    rect: ClientRect;
  };
}

export interface DragCellAction {
  type: ActionType.DRAG_CELL;
  payload: {
    id: string;
    shiftY: number;
  };
}

export interface DragCellEndAction {
  type: ActionType.DRAG_CELL_END;
  payload: string;
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FetchCellsCompleteAction
  | FetchCellsErrorAction
  | SaveCellsErrorAction
  | InitDragMapAction
  | SlideCellsAction
  | DragCellStartAction
  | DragCellAction
  | DragCellEndAction
  | RegisterElemRect
  | SetTargetCell;
