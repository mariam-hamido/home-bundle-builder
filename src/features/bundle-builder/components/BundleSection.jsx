function BundleSection({ stepNumber, totalSteps, title, description }) {
  return (
    <section className="bundle-section">
      <div className="bundle-section__header">
        <p className="bundle-section__eyebrow">STEP {stepNumber} OF {totalSteps}</p>
        <h2>{title}</h2>
        {description ? <p className="bundle-section__description">{description}</p> : null}
      </div>

      <div className="bundle-section__placeholder" aria-label="Placeholder content">
        <p>Selection area coming soon</p>
      </div>
    </section>
  )
}

export default BundleSection
