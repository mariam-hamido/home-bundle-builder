import { useBundleBuilder } from '../context/BundleBuilderContext'
import { DECREMENT_QUANTITY, INCREMENT_QUANTITY, SELECT_VARIANT } from '../context/actions'

function ProductCard({ product }) {
  const { state, dispatch } = useBundleBuilder()
  const hasOriginalPrice = typeof product?.originalPrice === 'number'
  const hasDescription = Boolean(product?.description?.trim())
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0
  const selectionEntry = state.selectedItems?.[product?.id]
  const selectedVariantId = hasVariants
    ? selectionEntry?.selectedVariant ?? product.variants[0]?.id
    : null
  const selectedVariant = hasVariants
    ? product.variants.find((variant) => variant.id === selectedVariantId)
    : null
  const displayImage = selectedVariant?.image || product?.image
  const activeQuantity = hasVariants
    ? selectionEntry?.quantities?.[selectedVariantId] ?? 0
    : selectionEntry?.quantity ?? 0
  const variantIds = hasVariants ? product.variants.map((variant) => variant.id) : []

  const formatPrice = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)

  const handleVariantSelect = (variantId) => {
    dispatch({ type: SELECT_VARIANT, payload: { productId: product.id, variantId, variantIds } })
  }

  const handleIncrementQuantity = () => {
    dispatch({ type: INCREMENT_QUANTITY, payload: { productId: product.id, variantId: selectedVariantId, variantIds } })
  }

  const handleDecrementQuantity = () => {
    dispatch({ type: DECREMENT_QUANTITY, payload: { productId: product.id, variantId: selectedVariantId, variantIds } })
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={displayImage} alt={product?.title} className="product-card__image" />
        {hasOriginalPrice ? <span className="product-card__badge">Sale</span> : null}
      </div>

      <div className="product-card__content">
        <div className="product-card__header">
          <h3 className="product-card__title">{product?.title}</h3>
          {hasDescription ? <p className="product-card__description">{product.description}</p> : null}
        </div>

        <div className="product-card__pricing">
          {hasOriginalPrice ? (
            <span className="product-card__original-price">{formatPrice(product.originalPrice)}</span>
          ) : null}
          <span className="product-card__current-price">{formatPrice(product?.price)}</span>
        </div>

        {hasVariants ? (
          <div className="product-card__variants" aria-label="Product variants">
            {product.variants.map((variant) => {
              const isActive = selectedVariantId === variant.id

              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`product-card__variant-chip${isActive ? ' product-card__variant-chip--active' : ''}`}
                  onClick={() => handleVariantSelect(variant.id)}
                  aria-pressed={isActive}
                >
                  {variant.swatch ? (
                    <span
                      className="product-card__variant-swatch"
                      style={{ backgroundColor: variant.swatch }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span>{variant.name}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        <div className="product-card__footer">
          <a href="#" className="product-card__link">
            Learn More
          </a>

          <div className="product-card__quantity" aria-label="Quantity selector">
            <button
              type="button"
              className="product-card__quantity-button"
              onClick={handleDecrementQuantity}
              disabled={activeQuantity <= 0}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="product-card__quantity-value">{activeQuantity}</span>
            <button
              type="button"
              className="product-card__quantity-button"
              onClick={handleIncrementQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
