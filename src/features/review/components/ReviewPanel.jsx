function ReviewPanel() {
  return (
    <aside className="review-panel" aria-label="Review panel">
      <div className="review-panel__header">
        <p className="review-panel__eyebrow">Review</p>
        <h2>Your Security System</h2>
      </div>

      <div className="review-panel__placeholder" aria-label="Empty review state">
        <p>Your selections will appear here</p>
      </div>
    </aside>
  )
}

export default ReviewPanel
