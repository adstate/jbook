import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';
import dragReducer from './dragReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  drag: dragReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
