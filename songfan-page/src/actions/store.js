import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'
import {
  routerReducer,
  routerMiddleware
} from "react-router-redux";


import thunk from 'redux-thunk'
import mainReducer from './reducers'
import createHistory from 'history/createBrowserHistory';

export const history = createHistory()

const reducers = combineReducers({
  main: mainReducer,
  router: routerReducer
});

export const store = createStore(reducers, applyMiddleware(routerMiddleware(history), thunk))