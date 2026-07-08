const STORAGE_KEY = 'bundle-builder-config'

export function saveBundle(config) {
  try {
    const serialized = JSON.stringify(config)
    localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch {
    return false
  }
}

export function loadBundle() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null

    const parsed = JSON.parse(serialized)
    if (!parsed || typeof parsed !== 'object') return null

    return {
      selectedItems: parsed.selectedItems ?? {},
      currentStep: typeof parsed.currentStep === 'number' ? parsed.currentStep : 0,
    }
  } catch {
    return null
  }
}

export function clearBundle() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
