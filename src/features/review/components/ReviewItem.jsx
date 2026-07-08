import { formatPrice } from '../../../utils/price'
import QuantityControl from '../../../components/QuantityControl'

function ReviewItem({ item, required, onIncrement, onDecrement }) {
  const hasDiscount =
    item.product.originalPrice != null && item.product.originalPrice > item.price

  return (
    <article className="review-item">
      <div className="review-item__thumbnail">
        <img src={item.image} alt={item.product.title} />
      </div>

      <div className="review-item__info">
        <span className="review-item__title">{item.product.title}</span>
        {item.variantName && <span className="review-item__variant">{item.variantName}</span>}
        {required && <span className="review-item__required">Required</span>}
      </div>

      <div className="review-item__quantity">
        <QuantityControl
          quantity={item.quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
      </div>

      <div className="review-item__pricing">
        {hasDiscount && (
          <span className="review-item__price--original">
            {formatPrice(item.product.originalPrice)}
          </span>
        )}
        <span className={`review-item__price ${hasDiscount ? 'review-item__price--current' : ''}`}>
          {formatPrice(item.price)}
        </span>
      </div>
    </article>
  )
}

export default ReviewItem
