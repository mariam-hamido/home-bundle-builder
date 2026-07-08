function ProductCard({ product }) {
  const hasOriginalPrice = typeof product?.originalPrice === 'number'
  const hasDescription = Boolean(product?.description?.trim())
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0

  const formatPrice = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={product?.image} alt={product?.title} className="product-card__image" />
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
            {product.variants.map((variant) => (
              <button key={variant.id} type="button" className="product-card__variant-chip">
                {variant.swatch ? (
                  <span
                    className="product-card__variant-swatch"
                    style={{ backgroundColor: variant.swatch }}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{variant.name}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="product-card__footer">
          <a href="#" className="product-card__link">
            Learn More
          </a>

          <div className="product-card__quantity" aria-label="Quantity selector">
            <button type="button" className="product-card__quantity-button" disabled aria-label="Decrease quantity">
              −
            </button>
            <span className="product-card__quantity-value">0</span>
            <button type="button" className="product-card__quantity-button" disabled aria-label="Increase quantity">
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
