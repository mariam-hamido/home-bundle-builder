import BundleBuilder from '../features/bundle-builder/components/BundleBuilder'
import ReviewPanel from '../features/review/components/ReviewPanel'
import '../App.css'

function App() {
  return (
    <main className="app-shell">
      <div className="app-shell__content">
        <BundleBuilder />
        <ReviewPanel />
      </div>
    </main>
  )
}

export default App
