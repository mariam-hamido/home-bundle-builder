import { useBundleBuilder } from '../../bundle-builder/context/BundleBuilderContext'
import { DECREMENT_QUANTITY, INCREMENT_QUANTITY } from '../../bundle-builder/context/actions'

const categoryGroups = [
  { key: 'cameras', title: 'Cameras' },
  { key: 'plans', title: 'Plan' },
  { key: 'sensors', title: 'Sensors' },
  { key: 'protections', title: 'Accessories' },
]

function ReviewPanel() {
  const { state, dispatch } = useBundleBuilder()

  const formatPrice = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)

  const handleIncrementQuantity = (productId, variantId, variantIds) => {
    dispatch({
      type: INCREMENT_QUANTITY,
      payload: { productId, variantId, variantIds },
    })
  }

  const handleDecrementQuantity = (productId, variantId, variantIds) => {
    dispatch({
      type: DECREMENT_QUANTITY,
      payload: { productId, variantId, variantIds },
    })
  }

  const reviewGroups = categoryGroups.reduce((groups, category) => {
    const products = Array.isArray(state.bundleData?.[category.key]) ? state.bundleData[category.key] : []
    const items = products.flatMap((product) => {
      const selectionEntry = state.selectedItems?.[product.id]
      const variantIds = Array.isArray(product?.variants) ? product.variants.map((variant) => variant.id) : []

      if (variantIds.length > 0) {
        return product.variants.flatMap((variant) => {
          const quantity = selectionEntry?.quantities?.[variant.id] ?? 0

          if (quantity <= 0) {
            return []
          }

          return [{
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            product,
            variantId: variant.id,
            variantName: variant.name,
            quantity,
            image: variant.image || product.image,
            price: product.price,
            variantIds,
          }]
        })
      }

      const quantity = selectionEntry?.quantity ?? 0

      if (quantity <= 0) {
        return []
      }

      return [{
        id: product.id,
        productId: product.id,
        product,
        variantId: null,
        variantName: null,
        quantity,
        image: product.image,
        price: product.price,
        variantIds: [],
      }]
    })

    if (items.length === 0) {
      return groups
    }

    return [...groups, { ...category, items }]
  }, [])

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
        <div className="review-panel__groups">
          {reviewGroups.map((group) => (
            <section key={group.key} className="review-panel__group">
              <h3 className="review-panel__group-title">{group.title}</h3>

              <div className="review-panel__items">
                {group.items.map((item) => (
                  <article key={item.id} className="review-panel__item">
                    <div className="review-panel__media">
                      <img src={item.image} alt={item.product.title} className="review-panel__image" />
                    </div>

                    <div className="review-panel__details">
                      <div className="review-panel__title-row">
                        <h4 className="review-panel__item-title">{item.product.title}</h4>
                        <span className="review-panel__price">{formatPrice(item.price)}</span>
                      </div>

                      {item.variantName ? <p className="review-panel__variant">{item.variantName}</p> : null}

                      <div className="review-panel__quantity" aria-label="Quantity selector">
                        <button
                          type="button"
                          className="product-card__quantity-button"
                          onClick={() => handleDecrementQuantity(item.productId, item.variantId, item.variantIds)}
                          disabled={item.quantity <= 0}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="product-card__quantity-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="product-card__quantity-button"
                          onClick={() => handleIncrementQuantity(item.productId, item.variantId, item.variantIds)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </aside>
  )
}

export default ReviewPanel
