import { createContext, useContext, useEffect, useReducer } from 'react'
import bundleData from '../../../data/bundle.json'
import bundleReducer from './bundleReducer'
import initialState from './initialState'
import { LOAD_BUNDLE } from './actions'

const BundleBuilderContext = createContext(null)

export function BundleBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(bundleReducer, initialState)

  useEffect(() => {
    dispatch({ type: LOAD_BUNDLE, payload: bundleData })
  }, [])

  return (
    <BundleBuilderContext.Provider value={{ state, dispatch }}>
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
