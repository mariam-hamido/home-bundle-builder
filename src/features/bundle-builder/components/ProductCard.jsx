import { useCallback } from 'react'
import { useBundleBuilder } from '../context/BundleBuilderContext'
import { DECREMENT_QUANTITY, INCREMENT_QUANTITY, SELECT_VARIANT } from '../context/actions'
import { formatPrice } from '../../../utils/price'
import QuantityControl from '../../../components/QuantityControl'

function ProductCard({ product }) {
  const { state, dispatch } = useBundleBuilder()
  const hasOriginalPrice = typeof product?.originalPrice === 'number'
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

  const handleVariantSelect = useCallback((variantId) => {
    dispatch({ type: SELECT_VARIANT, payload: { productId: product.id, variantId, variantIds } })
  }, [dispatch, product.id, variantIds])

  const handleIncrement = useCallback(() => {
    dispatch({ type: INCREMENT_QUANTITY, payload: { productId: product.id, variantId: selectedVariantId, variantIds } })
  }, [dispatch, product.id, selectedVariantId, variantIds])

  const handleDecrement = useCallback(() => {
    dispatch({ type: DECREMENT_QUANTITY, payload: { productId: product.id, variantId: selectedVariantId, variantIds } })
  }, [dispatch, product.id, selectedVariantId, variantIds])

  return (
    <article className={`product-card${activeQuantity > 0 ? ' product-card--selected' : ''}`}>
      <div className="product-card__media">
        <img src={displayImage} alt={product?.title} className="product-card__image" />
        {hasOriginalPrice ? <span className="product-card__badge">Sale</span> : null}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product?.title}</h3>

        {product?.description?.trim() ? <p className="product-card__description">{product.description}</p> : null}

        <a href="#" className="product-card__link">Learn More</a>

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
                  {variant.image ? (
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="product-card__variant-thumb"
                    />
                  ) : variant.swatch ? (
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
          <QuantityControl
            quantity={activeQuantity}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
          />

          <div className="product-card__pricing">
            {hasOriginalPrice ? (
              <span className="product-card__original-price">{formatPrice(product.originalPrice)}</span>
            ) : null}
            <span className="product-card__current-price">{formatPrice(product?.price)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
