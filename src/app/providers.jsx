import { BundleBuilderProvider } from '../features/bundle-builder/context/BundleBuilderContext'

export default function Providers({ children }) {
  return <BundleBuilderProvider>{children}</BundleBuilderProvider>
}
