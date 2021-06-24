import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ActionType } from './action-types';
import reducers from './reducers';
import { persistMiddleware } from './middlewares/persist-middleware';

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);
