import {
  SUCCESS,
  LOAD_MENU,
  GET_CLIENT_TOKEN,
  SELECT_DISHES,
  INIT_ORDER
} from './actions'
import {
  combineReducers
} from 'redux'

const loadMenu = (state = null, action) => {
  switch (action.type) {
    case LOAD_MENU + SUCCESS:
      return action.res;
    default:
      return state;
  }
}

const getClientToken = (state = null, action) => {
  switch (action.type) {
    case GET_CLIENT_TOKEN + SUCCESS:
      return action.res.clientToken
    default:
      return state;
  }
}

const selectDishes = (state = {}, action) => {
  switch (action.type) {
    case SELECT_DISHES:
      return action.res
    default:
      return state
  }
}

const initOrder = (state = null, action) => {
  switch (action.type) {
    case INIT_ORDER + SUCCESS:
      return action.res
    default:
      return state;
  }
}

const mainReducer = combineReducers({
  menu: loadMenu,
  order: initOrder,
  braintreeClientToken: getClientToken,
  selectedDishes: selectDishes
})

export default mainReducer;