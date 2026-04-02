export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%'
}

export function parseCurrency(str: string): number {
  if (!str) return 0
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0
}

export function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  const num = (parseInt(digits) / 100).toFixed(2)
  return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
