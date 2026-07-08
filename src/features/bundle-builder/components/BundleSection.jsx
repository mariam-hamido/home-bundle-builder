import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import ProductCard from './ProductCard'

function BundleSection({
  stepNumber,
  totalSteps,
  icon: Icon,
  title,
  description,
  isOpen,
  selectedCount,
  products,
  onToggle,
  onNext,
  nextTitle,
}) {
  return (
    <section className={`bundle-section ${isOpen ? 'is-open' : ''}`}>
      <button type="button" className="bundle-section__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="bundle-section__trigger-content">
          <p className="bundle-section__eyebrow">STEP {stepNumber} OF {totalSteps}</p>
          <div className="bundle-section__title-row">
            <div className="bundle-section__title-left">
              {Icon ? <Icon size={20} className="bundle-section__title-icon" /> : null}
              <h2>{title}</h2>
            </div>
            <span className="bundle-section__selected-count">{selectedCount}</span>
          </div>
          {description ? <p className="bundle-section__description">{description}</p> : null}
        </div>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen ? (
        <div className="bundle-section__body">
          <div className="bundle-section__product-grid">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button type="button" className="bundle-section__next" onClick={onNext}>
            <span>{nextTitle}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default BundleSection
