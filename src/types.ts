export interface AssetClass {
  className: string
  type: string
  percent: number
  balancing: number
  equity: number
  rentability: number
  count: number
  currentPercent: number
  idealPercent: number
}

export interface SimulationAllocation extends AssetClass {
  targetValue: number
  deficit: number
  canReceive: boolean
  isAboveMargin: boolean
  aporteValue: number
  newEquity: number
  newPercent: number
}

export type StatusType = 'error' | 'success' | 'loading' | null

export interface WalletApiTicker {
  class: string
  type: string
  percent: number
  balancing: number
  equity: string
  rentability: number
  count: number
}

export interface WalletApiResponse {
  tickers: WalletApiTicker[]
  others_tickers: WalletApiTicker[]
}
