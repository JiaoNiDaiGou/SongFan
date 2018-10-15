const INIT_STATE = {
  menu: null,
}

const songfanApp = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "LOAD_MENU":
      return Object.assign({}, state, {
        menu: action.menu
      })
    default:
      return state;
  }
}

export default songfanApp;