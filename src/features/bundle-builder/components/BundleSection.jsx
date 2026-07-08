import { ChevronDown, ChevronUp } from 'lucide-react'

function BundleSection({
  stepNumber,
  totalSteps,
  title,
  description,
  isOpen,
  selectedCount,
  onToggle,
  onNext,
}) {
  return (
    <section className={`bundle-section ${isOpen ? 'is-open' : ''}`}>
      <button type="button" className="bundle-section__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="bundle-section__trigger-content">
          <p className="bundle-section__eyebrow">STEP {stepNumber} OF {totalSteps}</p>
          <div className="bundle-section__title-row">
            <h2>{title}</h2>
            <span className="bundle-section__selected-count">{selectedCount}</span>
          </div>
          {description ? <p className="bundle-section__description">{description}</p> : null}
        </div>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen ? (
        <div className="bundle-section__body">
          <div className="bundle-section__placeholder" aria-label="Placeholder content">
            <p>Selection area coming soon</p>
          </div>

          <button type="button" className="bundle-section__next" onClick={onNext}>
            Next
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default BundleSection
