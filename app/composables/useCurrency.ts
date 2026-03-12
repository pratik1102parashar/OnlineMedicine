export function useCurrency() {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  })

  return {
    formatCurrency(value: number) {
      return formatter.format(value)
    }
  }
}
