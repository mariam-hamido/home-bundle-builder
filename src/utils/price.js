export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function flattenSelectedItems(selectedItems, bundleData) {
  const lines = []
  if (!selectedItems || !bundleData) return lines

  const categories = ['cameras', 'plans', 'sensors', 'protections']

  for (const key of categories) {
    const products = bundleData[key]
    if (!Array.isArray(products)) continue

    for (const product of products) {
      const entry = selectedItems[product.id]
      if (!entry) continue

      const variants = product.variants || []

      if (variants.length > 0) {
        for (const variant of variants) {
          const qty = entry.quantities?.[variant.id] ?? 0
          if (qty > 0) {
            lines.push({
              quantity: qty,
              price: product.price,
              originalPrice: product.originalPrice,
            })
          }
        }
      } else {
        const qty = entry.quantity ?? 0
        if (qty > 0) {
          lines.push({
            quantity: qty,
            price: product.price,
            originalPrice: product.originalPrice,
          })
        }
      }
    }
  }

  return lines
}

export function calculateSubtotal(selectedItems, bundleData) {
  return flattenSelectedItems(selectedItems, bundleData)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function calculateDiscount(selectedItems, bundleData) {
  return flattenSelectedItems(selectedItems, bundleData)
    .reduce((sum, item) => {
      if (item.originalPrice != null && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * item.quantity
      }
      return sum
    }, 0)
}

export function calculateSavings(selectedItems, bundleData) {
  return calculateDiscount(selectedItems, bundleData)
}

export function calculateTotal(selectedItems, bundleData, shipping = 0) {
  return calculateSubtotal(selectedItems, bundleData) + shipping
}
