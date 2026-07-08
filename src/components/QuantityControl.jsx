function QuantityControl({ quantity, onDecrement, onIncrement }) {
  return (
    <div className="product-card__quantity" aria-label="Quantity selector">
      <button
        type="button"
        className="product-card__quantity-button"
        onClick={onDecrement}
        disabled={quantity <= 0}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="product-card__quantity-value">{quantity}</span>
      <button
        type="button"
        className="product-card__quantity-button"
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantityControl
