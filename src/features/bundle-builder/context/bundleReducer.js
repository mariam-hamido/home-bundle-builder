import initialState from './initialState'

function bundleReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_BUNDLE':
      // TODO: implement loading the bundle data.
      return state

    case 'NEXT_STEP':
      // TODO: implement advancing to the next step.
      return state

    case 'PREVIOUS_STEP':
      // TODO: implement moving to the previous step.
      return state

    case 'SELECT_VARIANT':
      // TODO: implement selecting a variant.
      return state

    case 'UPDATE_QUANTITY':
      // TODO: implement updating item quantity.
      return state

    case 'RESTORE_BUNDLE':
      // TODO: implement restoring a previously saved bundle state.
      return state

    case 'RESET_BUNDLE':
      // TODO: implement resetting the bundle state.
      return state

    default:
      return state
  }
}

export default bundleReducer
