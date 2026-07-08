import test from 'node:test'
import assert from 'node:assert/strict'
import bundleReducer from './bundleReducer.js'
import { DECREMENT_QUANTITY, INCREMENT_QUANTITY, SELECT_VARIANT } from './actions.js'
import initialState from './initialState.js'

test('tracks quantities independently for each selected variant', () => {
  const selectedWhite = bundleReducer(initialState, {
    type: SELECT_VARIANT,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  const whiteIncremented = bundleReducer(selectedWhite, {
    type: INCREMENT_QUANTITY,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  const whiteIncrementedAgain = bundleReducer(whiteIncremented, {
    type: INCREMENT_QUANTITY,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  const selectedBlack = bundleReducer(whiteIncrementedAgain, {
    type: SELECT_VARIANT,
    payload: { productId: 'wyze-cam-v4', variantId: 'black', variantIds: ['white', 'black', 'gray'] },
  })

  const blackIncremented = bundleReducer(selectedBlack, {
    type: INCREMENT_QUANTITY,
    payload: { productId: 'wyze-cam-v4', variantId: 'black', variantIds: ['white', 'black', 'gray'] },
  })

  const selectedWhiteAgain = bundleReducer(blackIncremented, {
    type: SELECT_VARIANT,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  assert.equal(selectedWhiteAgain.selectedItems['wyze-cam-v4'].selectedVariant, 'white')
  assert.equal(selectedWhiteAgain.selectedItems['wyze-cam-v4'].quantities.white, 2)
  assert.equal(selectedWhiteAgain.selectedItems['wyze-cam-v4'].quantities.black, 1)
})

test('removes a variant selection once all quantities reach zero', () => {
  const selectedWhite = bundleReducer(initialState, {
    type: SELECT_VARIANT,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  const decremented = bundleReducer(selectedWhite, {
    type: DECREMENT_QUANTITY,
    payload: { productId: 'wyze-cam-v4', variantId: 'white', variantIds: ['white', 'black', 'gray'] },
  })

  assert.equal(decremented.selectedItems['wyze-cam-v4'], undefined)
})

test('prevents quantity from going below zero and supports simple products', () => {
  const decremented = bundleReducer(initialState, {
    type: DECREMENT_QUANTITY,
    payload: { productId: 'wyze-sense-hub' },
  })

  const incremented = bundleReducer(decremented, {
    type: INCREMENT_QUANTITY,
    payload: { productId: 'wyze-sense-hub' },
  })

  assert.equal(decremented.selectedItems['wyze-sense-hub']?.quantity ?? 0, 0)
  assert.equal(incremented.selectedItems['wyze-sense-hub'].quantity, 1)
})
