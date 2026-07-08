import { useMemo } from 'react'
import { useBundleBuilder } from '../context/BundleBuilderContext'
import { NEXT_STEP, SET_ACTIVE_STEP } from '../context/actions'
import BundleSection from './BundleSection'

function BundleBuilder() {
  const { state, dispatch } = useBundleBuilder()

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

  const activeStep = state.currentStep ?? 0

  const handleToggle = (index) => {
    dispatch({ type: SET_ACTIVE_STEP, payload: index })
  }

  const handleNext = () => {
    dispatch({ type: NEXT_STEP })
  }

  return (
    <section className="bundle-builder" aria-label="Bundle builder">
      <div className="bundle-builder__header">
        <p className="bundle-builder__eyebrow">Bundle Builder</p>
        <h1>Create your security system</h1>
      </div>

      <div className="bundle-builder__steps">
        {sections.map((section, index) => (
          <BundleSection
            key={section.key}
            stepNumber={section.stepNumber}
            totalSteps={section.totalSteps}
            title={section.title}
            isOpen={activeStep === index}
            selectedCount="0 selected"
            products={state.bundleData?.[section.key] ?? []}
            onToggle={() => handleToggle(index)}
            onNext={handleNext}
          />
        ))}
      </div>
    </section>
  )
}

export default BundleBuilder
