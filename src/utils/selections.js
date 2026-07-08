export function countSelectedInCategory(selectedItems, products) {
  if (!selectedItems || !products) return 0

  return products.reduce((count, product) => {
    const entry = selectedItems[product.id]
    if (!entry) return count

    const variants = product.variants || []

    if (variants.length > 0) {
      const hasSelection = variants.some((variant) => {
        const qty = entry.quantities?.[variant.id] ?? 0
        return qty > 0
      })
      return hasSelection ? count + 1 : count
    }

    const qty = entry.quantity ?? 0
    return qty > 0 ? count + 1 : count
  }, 0)
}
