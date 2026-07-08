import { useCallback, useMemo } from 'react'
import { useBundleBuilder } from '../context/BundleBuilderContext'
import { NEXT_STEP, SET_ACTIVE_STEP } from '../context/actions'
import { countSelectedInCategory } from '../../../utils/selections'
import BundleSection from './BundleSection'

const SECTION_DEFS = [
  { key: 'cameras', title: 'Choose your cameras' },
  { key: 'plans', title: 'Choose your plan' },
  { key: 'sensors', title: 'Add sensors' },
  { key: 'protections', title: 'Add protections' },
]

function BundleBuilder() {
  const { state, dispatch } = useBundleBuilder()

  const sections = useMemo(() => {
    if (!state.bundleData) return []

    return SECTION_DEFS.map((section, index) => ({
      ...section,
      stepNumber: index + 1,
      totalSteps: SECTION_DEFS.length,
    }))
  }, [state.bundleData])

  const activeStep = state.currentStep ?? 0

  const handleToggle = useCallback((index) => {
    dispatch({ type: SET_ACTIVE_STEP, payload: index })
  }, [dispatch])

  const handleNext = useCallback(() => {
    dispatch({ type: NEXT_STEP })
  }, [dispatch])

  const sectionCounts = useMemo(() => {
    if (!state.selectedItems || !state.bundleData) return {}
    return sections.reduce((counts, section) => {
      const products = state.bundleData[section.key] ?? []
      counts[section.key] = countSelectedInCategory(state.selectedItems, products)
      return counts
    }, {})
  }, [state.selectedItems, state.bundleData, sections])

  return (
    <section className="bundle-builder" aria-label="Bundle builder">
      <div className="bundle-builder__header">
        <p className="bundle-builder__eyebrow">Bundle Builder</p>
        <h1>Create your security system</h1>
      </div>

      <div className="bundle-builder__steps">
        {sections.map((section, index) => {
          const selectedCount = sectionCounts[section.key] ?? 0

          return (
            <BundleSection
              key={section.key}
              stepNumber={section.stepNumber}
              totalSteps={section.totalSteps}
              title={section.title}
              isOpen={activeStep === index}
              selectedCount={`${selectedCount} selected`}
              products={state.bundleData?.[section.key] ?? []}
              onToggle={() => handleToggle(index)}
              onNext={handleNext}
            />
          )
        })}
      </div>
    </section>
  )
}

export default BundleBuilder
