export const DEFAULT_MARGIN = 0.15

export const CLASS_COLORS: Record<string, string> = {
  'Ações': '#6c5ce7',
  'FIIs': '#00b894',
  'Criptomoedas': '#fdcb6e',
  'ETFs Intern.': '#e17055',
  'Tesouro Direto': '#74b9ff',
  'Renda Fixa': '#a29bfe',
  'Stocks': '#fd79a8',
  'REITs': '#55efc4',
  'BDRs': '#fab1a0',
}

export const DEFAULT_COLOR = '#636e72'

export function getColor(className: string): string {
  return CLASS_COLORS[className] || DEFAULT_COLOR
}
