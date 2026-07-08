import { createContext, useContext, useReducer } from 'react'
import bundleReducer from './bundleReducer'
import initialState from './initialState'

const BundleBuilderContext = createContext(null)

export function BundleBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(bundleReducer, initialState)

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
