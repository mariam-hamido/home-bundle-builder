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

function buildReviewItem(product, selectionEntry, variant) {
  const quantity = variant
    ? (selectionEntry?.quantities?.[variant.id] ?? 0)
    : (selectionEntry?.quantity ?? 0)

  if (quantity <= 0) return null

  return {
    id: variant ? `${product.id}-${variant.id}` : product.id,
    productId: product.id,
    product,
    variantId: variant?.id ?? null,
    variantName: variant?.name ?? null,
    quantity,
    image: variant?.image || product.image,
    price: product.price,
    variantIds: Array.isArray(product.variants) ? product.variants.map((v) => v.id) : [],
  }
}

export function buildReviewGroups(selectedItems, bundleData, categoryGroups) {
  if (!selectedItems || !bundleData) return []

  return categoryGroups.reduce((groups, category) => {
    const products = Array.isArray(bundleData[category.key]) ? bundleData[category.key] : []
    const items = products.flatMap((product) => {
      const selectionEntry = selectedItems[product.id]
      if (!selectionEntry) return []

      const variants = Array.isArray(product.variants) ? product.variants : []

      if (variants.length > 0) {
        return variants
          .map((variant) => buildReviewItem(product, selectionEntry, variant))
          .filter(Boolean)
      }

      const item = buildReviewItem(product, selectionEntry, null)
      return item ? [item] : []
    })

    if (items.length === 0) return groups

    return [...groups, { ...category, items }]
  }, [])
}
