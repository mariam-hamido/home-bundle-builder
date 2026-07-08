import { LOAD_BUNDLE, NEXT_STEP, PREVIOUS_STEP, RESET_BUNDLE, RESTORE_BUNDLE, SELECT_VARIANT, SET_ACTIVE_STEP, UPDATE_QUANTITY } from './actions'
import initialState from './initialState'

function bundleReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BUNDLE:
      return {
        ...state,
        bundleData: action.payload,
        isLoaded: true,
      }

    case SET_ACTIVE_STEP:
      return {
        ...state,
        currentStep: action.payload,
      }

    case NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3),
      }

    case PREVIOUS_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      }

    case SELECT_VARIANT:
      return {
        ...state,
        selectedVariants: {
          ...state.selectedVariants,
          [action.payload.productId]: action.payload.variantId,
        },
      }

    case UPDATE_QUANTITY:
      return state

    case RESTORE_BUNDLE:
      return state

    case RESET_BUNDLE:
      return state

    default:
      return state
  }
}

export default bundleReducer
