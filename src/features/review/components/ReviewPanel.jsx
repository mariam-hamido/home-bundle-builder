import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBundleBuilder } from '../../bundle-builder/context/BundleBuilderContext'
import { CHECKOUT, DECREMENT_QUANTITY, INCREMENT_QUANTITY, RESET_BUNDLE, RESET_CHECKOUT, SAVE_BUNDLE } from '../../bundle-builder/context/actions'
import { calculateSubtotal, calculateDiscount, calculateTotal } from '../../../utils/price'
import { formatPrice } from '../../../utils/price'
import { buildReviewGroups, countSelectedInCategory } from '../../../utils/selections'
import ReviewItem from './ReviewItem'

const SHIPPING = 5.99

const CATEGORY_GROUPS = [
  { key: 'cameras', title: 'Cameras' },
  { key: 'plans', title: 'Plan' },
  { key: 'sensors', title: 'Sensors' },
  { key: 'protections', title: 'Accessories' },
]

const REQUIRED_CATEGORIES = [
  { key: 'cameras', label: 'at least one Camera' },
  { key: 'plans', label: 'at least one Plan' },
  { key: 'sensors', label: 'at least one Sensor' },
]

function ReviewPanel() {
  const { state, dispatch, saved, canSave } = useBundleBuilder()

  const hasItems = Object.keys(state.selectedItems ?? {}).length > 0

  const [validationError, setValidationError] = useState(null)

  const modalCloseRef = useRef(null)
  const validationCloseRef = useRef(null)

  const handleCheckout = useCallback(() => {
    if (!state.bundleData) return

    const missing = REQUIRED_CATEGORIES.filter(({ key }) => {
      const products = state.bundleData[key]
      if (!products) return true
      return countSelectedInCategory(state.selectedItems, products) === 0
    })

    if (missing.length > 0) {
      setValidationError(missing.map(({ label }) => label))
      return
    }

    dispatch({ type: CHECKOUT })
  }, [dispatch, state.selectedItems, state.bundleData])

  const handleCloseModal = useCallback(() => {
    dispatch({ type: RESET_CHECKOUT })
  }, [dispatch])

  const handleCloseValidation = useCallback(() => {
    setValidationError(null)
  }, [])

  const handleResetBundle = useCallback(() => {
    setValidationError(null)
    dispatch({ type: RESET_BUNDLE })
  }, [dispatch])

  const handleBackdropClick = useCallback((e) => {
    if (e.target !== e.currentTarget) return
    if (validationError) {
      handleCloseValidation()
    } else {
      handleCloseModal()
    }
  }, [handleCloseModal, handleCloseValidation, validationError])

  const handleSaveBundle = useCallback(() => {
    dispatch({ type: SAVE_BUNDLE })
  }, [dispatch])

  const handleIncrementQuantity = useCallback((productId, variantId, variantIds) => {
    dispatch({
      type: INCREMENT_QUANTITY,
      payload: { productId, variantId, variantIds },
    })
  }, [dispatch])

  const handleDecrementQuantity = useCallback((productId, variantId, variantIds) => {
    dispatch({
      type: DECREMENT_QUANTITY,
      payload: { productId, variantId, variantIds },
    })
  }, [dispatch])

  useEffect(() => {
    if (state.checkoutStatus === 'confirmed' && modalCloseRef.current) {
      modalCloseRef.current.focus()
    }
  }, [state.checkoutStatus])

  useEffect(() => {
    if (validationError && validationCloseRef.current) {
      validationCloseRef.current.focus()
    }
  }, [validationError])

  useEffect(() => {
    if (state.checkoutStatus !== 'confirmed' && !validationError) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (validationError) {
          setValidationError(null)
        } else {
          handleCloseModal()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.checkoutStatus, handleCloseModal, validationError])

  const reviewGroups = useMemo(
    () => buildReviewGroups(state.selectedItems, state.bundleData, CATEGORY_GROUPS),
    [state.selectedItems, state.bundleData],
  )

  const orderSummary = useMemo(() => {
    const subtotal = calculateSubtotal(state.selectedItems, state.bundleData)
    const discount = calculateDiscount(state.selectedItems, state.bundleData)
    const total = calculateTotal(state.selectedItems, state.bundleData, SHIPPING)
    const hasDiscount = discount > 0
    const originalTotal = subtotal + discount
    const savingsPercent = hasDiscount ? Math.round((discount / originalTotal) * 100) : 0
    return {
      subtotal,
      discount,
      total,
      originalTotal,
      hasDiscount,
      savingsPercent,
    }
  }, [state.selectedItems, state.bundleData])

  return (
    <aside className="review-panel" aria-label="Review panel">
      <div className="review-panel__header">
        <p className="review-panel__eyebrow">Review</p>
        <h2>Your Security System</h2>
      </div>

      {reviewGroups.length === 0 ? (
        <div className="review-panel__placeholder" aria-label="Empty review state">
          <p>Your selections will appear here</p>
        </div>
      ) : (
        <>
          <div className="review-panel__scrollable">
            <div className="review-panel__groups">
              {reviewGroups.map((group) => (
                <section key={group.key} className="review-panel__group">
                  <h3 className="review-panel__group-title">{group.title}</h3>

                  <div className="review-panel__items">
                    {group.items.map((item) => (
                      <ReviewItem
                        key={item.id}
                        item={item}
                        required={group.key === 'plans'}
                        onIncrement={() => handleIncrementQuantity(item.productId, item.variantId, item.variantIds)}
                        onDecrement={() => handleDecrementQuantity(item.productId, item.variantId, item.variantIds)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="review-panel__summary-row review-panel__summary-row--shipping">
              <div className="review-panel__label-group">
                <span className="review-panel__label">Standard Shipping</span>
                <span className="review-panel__label-note">5–7 business days</span>
              </div>
              <span className="review-panel__value">{formatPrice(SHIPPING)}</span>
            </div>
          </div>

          <div className="review-panel__footer">
            <div className="review-panel__summary">
              <div className="review-panel__summary-container">
                <div className="review-panel__badge">
                  <div className="review-panel__badge-circle">
                    <span className="review-panel__badge-number">100%</span>
                    <span className="review-panel__badge-label">Satisfaction</span>
                    <span className="review-panel__badge-label">Guarantee</span>
                  </div>
                </div>

                <div className="review-panel__summary-rows">
                  <div className="review-panel__summary-row">
                    <span className="review-panel__label">Subtotal</span>
                    <span className="review-panel__pricing">
                      {orderSummary.hasDiscount && (
                        <span className="review-panel__value--original">{formatPrice(orderSummary.originalTotal)}</span>
                      )}
                      <span className="review-panel__value">{formatPrice(orderSummary.subtotal)}</span>
                    </span>
                  </div>
                  {orderSummary.hasDiscount && (
                    <div className="review-panel__summary-row review-panel__summary-row--savings">
                      <span className="review-panel__label">You save {orderSummary.savingsPercent}%</span>
                      <span className="review-panel__value">−{formatPrice(orderSummary.discount)}</span>
                    </div>
                  )}
                  <div className="review-panel__summary-row review-panel__summary-row--total">
                    <span className="review-panel__label">Total</span>
                    <span className="review-panel__value">{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-panel__guarantee">
              <span className="review-panel__guarantee-icon" aria-hidden="true">✓</span>
              <div className="review-panel__guarantee-text">
                <strong>30-Day Money-Back Guarantee</strong>
                <span>Shop with confidence</span>
              </div>
            </div>

            <div className="review-panel__actions">
              <button
                type="button"
                className="review-panel__checkout-button"
                disabled={!hasItems}
                aria-disabled={!hasItems}
                onClick={handleCheckout}
              >
                Checkout — {formatPrice(orderSummary.total)}
              </button>
              <button
                type="button"
                className="review-panel__save-button"
                disabled={!canSave}
                aria-disabled={!canSave}
                onClick={handleSaveBundle}
              >
                Save my system for later
              </button>
              {saved && <p className="review-panel__toast">Bundle saved!</p>}
            </div>
          </div>
        </>
      )}

      {state.checkoutStatus === 'confirmed' && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          onClick={handleBackdropClick}
        >
          <div className="modal">
            <div className="modal__header">
              <h2 id="checkout-modal-title">Bundle confirmed!</h2>
              <button
                type="button"
                className="modal__close"
                ref={modalCloseRef}
                onClick={handleCloseModal}
                aria-label="Close confirmation"
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Thank you for building your security system.</p>
              <p>Your configuration has been successfully submitted.</p>
            </div>
            <div className="modal__footer">
              <button type="button" className="modal__button" onClick={handleResetBundle}>
                Start New Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="validation-modal-title"
          onClick={handleBackdropClick}
        >
          <div className="modal modal--validation">
            <div className="modal__header">
              <h2 id="validation-modal-title">Your bundle is incomplete</h2>
              <button
                type="button"
                className="modal__close"
                ref={validationCloseRef}
                onClick={handleCloseValidation}
                aria-label="Close validation"
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Before checking out, please add:</p>
              <ul className="modal__list">
                {validationError.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="modal__footer">
              <button type="button" className="modal__button" onClick={handleCloseValidation}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default ReviewPanel
