export const DEFAULT_MARGIN = 0.15

export const CLASS_COLORS: Record<string, string> = {
  'Ações': '#6c5ce7',
  'FIIs': '#00b894',
  'Criptomoedas': '#fdcb6e',
  'ETFs': '#e84393',
  'ETFs Intern.': '#e17055',
  'Reits': '#55efc4',
  'REITs': '#55efc4',
  'Stocks': '#fd79a8',
  'BDRs': '#fab1a0',
  'Tesouro Direto': '#74b9ff',
  'Renda Fixa': '#a29bfe',
  'Fundos de Investimentos': '#0984e3',
}

export const DEFAULT_COLOR = '#636e72'

export function getColor(className: string): string {
  return CLASS_COLORS[className] || DEFAULT_COLOR
}
