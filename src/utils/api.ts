import type { AssetClass, WalletApiResponse } from '../types'

export function extractWalletId(url: string): string | null {
  const match = url.match(/my-wallet\/(\d+)/)
  return match ? match[1] : null
}

export async function fetchWallet(walletId: string): Promise<AssetClass[]> {
  const response = await fetch(`/api/summary/info/${walletId}`)

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}. A carteira esta publica?`)
  }

  const data: WalletApiResponse = await response.json()

  if (!data.tickers || data.tickers.length === 0) {
    throw new Error('Nenhum ativo encontrado na carteira.')
  }

  const assets: AssetClass[] = data.tickers.map(t => ({
    className: t.class,
    type: t.type,
    percent: t.percent,
    balancing: t.balancing || 0,
    equity: parseFloat(t.equity) || 0,
    rentability: t.rentability,
    count: t.count,
    currentPercent: 0,
    idealPercent: 0,
  }))

  const totalEquity = assets.reduce((s, a) => s + a.equity, 0)

  assets.forEach(a => {
    a.currentPercent = totalEquity > 0 ? (a.equity / totalEquity) * 100 : 0
    a.idealPercent = a.balancing > 0 ? a.balancing : a.currentPercent
  })

  return assets
}
