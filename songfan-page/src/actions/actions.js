export const REQ = '@REQ'
export const SUCCESS = '@SUCCESS'
export const ERROR = '@ERROR'

export const LOAD_MENU = 'LOAD_MENU'
export const INIT_ORDER = 'INIT_ORDER'
export const GET_CLIENT_TOKEN = 'GET_CLIENT_TOKEN'
export const SELECT_DISHES = 'SELECT_DISHES'

const SERVER = 'https://dev-dot-songfan-dot-fluid-crane-200921.appspot.com'

export const loadMenu = () => backendAction(LOAD_MENU, 'GET', '/api/menus/test')
export const initOrder = (request, callback) => backendAction(INIT_ORDER, 'POST', '/api/orders/init', request, callback)
export const getClientToken = () => backendAction(GET_CLIENT_TOKEN, 'GET', '/api/orders/braintreeClientToken')
export const selectDishes = (dishIds) => ({
  type: SELECT_DISHES,
  res: dishIds
})

const backendAction = (actionName, verb, path, data, callbackOnSuccess) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionName + REQ
    })
    callBackend(verb, path, data)
      .then(res => {
        dispatch({
          type: actionName + SUCCESS,
          res
        })
        if (!!callbackOnSuccess) {
          console.log('CALLBACK on SUCCESS after ' + actionName)
          callbackOnSuccess();
        }
      })
      .catch(err => dispatch({
        type: actionName + ERROR,
        err
      }))
  }
}

const callBackend = (verb, path, body) => {
  var url = SERVER + path
  console.log('CALL: ' + verb + ': ' + url)
  return new Promise((resolve, reject) => {
    fetch(url, {
        method: verb,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
      })
      .then(res => {
        if (res.status >= 400) {
          console.log('CALL FAIL:' + verb + ': ' + url)
          reject(res.statusText)
          return
        }
        console.log('CALL OK:' + verb + ': ' + url)
        resolve(res.json())
      })
  })
}