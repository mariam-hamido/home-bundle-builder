import {
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  LOAD_BUNDLE,
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_BUNDLE,
  RESTORE_BUNDLE,
  SELECT_VARIANT,
  SET_ACTIVE_STEP,
  UPDATE_QUANTITY,
} from './actions'
import initialState from './initialState'

function buildVariantQuantities(variantIds = [], existingQuantities = {}) {
  return variantIds.reduce((accumulator, variantId) => {
    accumulator[variantId] = existingQuantities[variantId] ?? 0
    return accumulator
  }, {})
}

function getSelectionEntry(state, productId) {
  return state.selectedItems?.[productId] ?? {}
}

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

    case SELECT_VARIANT: {
      const productId = action.payload?.productId
      const variantIds = Array.isArray(action.payload?.variantIds) ? action.payload.variantIds : []
      const existingEntry = getSelectionEntry(state, productId, action.payload)
      const selectedVariant = action.payload?.variantId || existingEntry.selectedVariant || variantIds[0]
      const quantities = variantIds.length > 0
        ? buildVariantQuantities(variantIds, existingEntry.quantities ?? {})
        : existingEntry.quantities ?? {}

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [productId]: {
            ...(variantIds.length > 0 ? {} : existingEntry),
            ...(variantIds.length > 0
              ? { selectedVariant, quantities }
              : { quantity: existingEntry.quantity ?? 0 }),
          },
        },
      }
    }

    case INCREMENT_QUANTITY: {
      const productId = action.payload?.productId
      const existingEntry = getSelectionEntry(state, productId, action.payload)
      const variantIds = Array.isArray(action.payload?.variantIds) ? action.payload.variantIds : []

      if (variantIds.length > 0) {
        const selectedVariant = action.payload?.variantId || existingEntry.selectedVariant || variantIds[0]
        const quantities = buildVariantQuantities(variantIds, existingEntry.quantities ?? {})
        quantities[selectedVariant] = (quantities[selectedVariant] ?? 0) + 1

        return {
          ...state,
          selectedItems: {
            ...state.selectedItems,
            [productId]: {
              selectedVariant,
              quantities,
            },
          },
        }
      }

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [productId]: {
            ...existingEntry,
            quantity: (existingEntry.quantity ?? 0) + 1,
          },
        },
      }
    }

    case DECREMENT_QUANTITY: {
      const productId = action.payload?.productId
      const existingEntry = getSelectionEntry(state, productId, action.payload)
      const variantIds = Array.isArray(action.payload?.variantIds) ? action.payload.variantIds : []

      if (variantIds.length > 0) {
        const selectedVariant = action.payload?.variantId || existingEntry.selectedVariant || variantIds[0]
        const quantities = buildVariantQuantities(variantIds, existingEntry.quantities ?? {})
        quantities[selectedVariant] = Math.max(0, (quantities[selectedVariant] ?? 0) - 1)

        return {
          ...state,
          selectedItems: {
            ...state.selectedItems,
            [productId]: {
              selectedVariant,
              quantities,
            },
          },
        }
      }

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [productId]: {
            ...existingEntry,
            quantity: Math.max(0, (existingEntry.quantity ?? 0) - 1),
          },
        },
      }
    }

    case UPDATE_QUANTITY:
      return state

    case RESTORE_BUNDLE:
      return state

    case RESET_BUNDLE:
      return {
        ...state,
        selectedItems: {},
      }

    default:
      return state
  }
}

export default bundleReducer
