import { useMemo } from 'react'
import { useBundleBuilder } from '../context/BundleBuilderContext'
import BundleSection from './BundleSection'

function BundleBuilder() {
  const { state } = useBundleBuilder()

  const sections = useMemo(() => {
    if (!state.bundleData) {
      return []
    }

    return [
      { key: 'cameras', title: 'Choose your cameras' },
      { key: 'plans', title: 'Choose your plan' },
      { key: 'sensors', title: 'Add sensors' },
      { key: 'protections', title: 'Add protections' },
    ].map((section, index) => ({
      ...section,
      stepNumber: index + 1,
      totalSteps: 4,
    }))
  }, [state.bundleData])

  return (
    <section className="bundle-builder" aria-label="Bundle builder">
      <div className="bundle-builder__header">
        <p className="bundle-builder__eyebrow">Bundle Builder</p>
        <h1>Create your security system</h1>
      </div>

      <div className="bundle-builder__steps">
        {sections.map((section) => (
          <BundleSection
            key={section.key}
            stepNumber={section.stepNumber}
            totalSteps={section.totalSteps}
            title={section.title}
          />
        ))}
      </div>
    </section>
  )
}

export default BundleBuilder
