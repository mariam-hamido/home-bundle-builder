import {
  CHECKOUT,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  LOAD_BUNDLE,
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_BUNDLE,
  RESET_CHECKOUT,
  RESTORE_BUNDLE,
  SAVE_BUNDLE,
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

function buildNextSelectedItems(previousSelectedItems = {}, productId, nextEntry) {
  if (nextEntry == null) {
    const nextItems = { ...previousSelectedItems }
    delete nextItems[productId]
    return nextItems
  }

  return {
    ...previousSelectedItems,
    [productId]: nextEntry,
  }
}

function buildVariantEntry(existingEntry = {}, variantIds = [], selectedVariantId) {
  const quantities = buildVariantQuantities(variantIds, existingEntry.quantities ?? {})

  if (selectedVariantId) {
    quantities[selectedVariantId] = quantities[selectedVariantId] ?? 0
  }

  return {
    ...(variantIds.length > 0 ? { selectedVariant: selectedVariantId, quantities } : existingEntry),
  }
}

function hasActiveQuantity(entry = {}) {
  if (entry.quantity != null) {
    return entry.quantity > 0
  }

  const quantities = entry.quantities ?? {}
  return Object.values(quantities).some((quantity) => quantity > 0)
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

      if (variantIds.length > 0) {
        const nextEntry = buildVariantEntry(existingEntry, variantIds, selectedVariant)

        return {
          ...state,
          selectedItems: buildNextSelectedItems(state.selectedItems, productId, hasActiveQuantity(nextEntry) ? nextEntry : null),
        }
      }

      return {
        ...state,
        selectedItems: buildNextSelectedItems(state.selectedItems, productId, {
          ...existingEntry,
          quantity: existingEntry.quantity ?? 0,
        }),
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
        const nextEntry = {
          selectedVariant,
          quantities,
        }

        return {
          ...state,
          selectedItems: buildNextSelectedItems(state.selectedItems, productId, nextEntry),
        }
      }

      return {
        ...state,
        selectedItems: buildNextSelectedItems(state.selectedItems, productId, {
          ...existingEntry,
          quantity: (existingEntry.quantity ?? 0) + 1,
        }),
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
        const hasAnyQuantity = Object.values(quantities).some((quantity) => quantity > 0)
        const nextEntry = hasAnyQuantity
          ? {
              selectedVariant,
              quantities,
            }
          : null

        return {
          ...state,
          selectedItems: buildNextSelectedItems(state.selectedItems, productId, nextEntry),
        }
      }

      const nextQuantity = Math.max(0, (existingEntry.quantity ?? 0) - 1)

      return {
        ...state,
        selectedItems: buildNextSelectedItems(state.selectedItems, productId, nextQuantity > 0 ? {
          ...existingEntry,
          quantity: nextQuantity,
        } : null),
      }
    }

    case UPDATE_QUANTITY:
      return state

    case SAVE_BUNDLE:
      return state

    case RESTORE_BUNDLE: {
      const saved = action.payload
      if (!saved) return state

      return {
        ...state,
        selectedItems: saved.selectedItems ?? {},
        currentStep: saved.currentStep ?? 0,
      }
    }

    case CHECKOUT:
      return {
        ...state,
        checkoutStatus: 'confirmed',
      }

    case RESET_CHECKOUT:
      return {
        ...state,
        checkoutStatus: null,
      }

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
