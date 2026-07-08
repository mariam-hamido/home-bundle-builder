import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import bundleData from '../../../data/bundle.json'
import { loadBundle, saveBundle as persistBundle } from '../../../utils/storage'
import bundleReducer from './bundleReducer'
import initialState from './initialState'
import { LOAD_BUNDLE, RESTORE_BUNDLE, SAVE_BUNDLE } from './actions'

const BundleBuilderContext = createContext(null)

export function BundleBuilderProvider({ children }) {
  const [state, rawDispatch] = useReducer(bundleReducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const lastSavedHashRef = useRef('')

  const [saved, setSaved] = useState(false)
  const [lastSavedHash, setLastSavedHash] = useState('')

  const currentHash = useMemo(
    () => JSON.stringify({ selectedItems: state.selectedItems, currentStep: state.currentStep }),
    [state.selectedItems, state.currentStep],
  )
  const canSave = currentHash !== lastSavedHash

  const dispatch = useCallback((action) => {
    if (action.type === SAVE_BUNDLE) {
      const config = {
        selectedItems: stateRef.current.selectedItems,
        currentStep: stateRef.current.currentStep,
      }
      const hash = JSON.stringify(config)
      if (hash !== lastSavedHashRef.current) {
        persistBundle(config)
        lastSavedHashRef.current = hash
        setLastSavedHash(hash)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
      rawDispatch(action)
      return
    }
    rawDispatch(action)
  }, [rawDispatch])

  useEffect(() => {
    rawDispatch({ type: LOAD_BUNDLE, payload: bundleData })

    const savedConfig = loadBundle()
    if (savedConfig) {
      rawDispatch({ type: RESTORE_BUNDLE, payload: savedConfig })
    }
  }, [])

  const contextValue = useMemo(
    () => ({ state, dispatch, saved, canSave }),
    [state, dispatch, saved, canSave],
  )

  return (
    <BundleBuilderContext.Provider value={contextValue}>
      {children}
    </BundleBuilderContext.Provider>
  )
}

export function useBundleBuilder() {
  const context = useContext(BundleBuilderContext)

  if (!context) {
    throw new Error('useBundleBuilder must be used within a BundleBuilderProvider')
  }

  return context
}

export default BundleBuilderContext
