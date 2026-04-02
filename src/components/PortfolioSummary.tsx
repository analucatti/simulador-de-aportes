import type { AssetClass } from '../types'
import { formatBRL } from '../utils/format'

interface Props {
  portfolio: AssetClass[]
}

export default function PortfolioSummary({ portfolio }: Props) {
  const totalEquity = portfolio.reduce((s, a) => s + a.equity, 0)
  const totalAssets = portfolio.reduce((s, a) => s + a.count, 0)

  return (
    <div className="card">
      <div className="card-title">Resumo da Carteira</div>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="value">{formatBRL(totalEquity)}</div>
          <div className="label">Patrimonio Total</div>
        </div>
        <div className="summary-item">
          <div className="value">{portfolio.length}</div>
          <div className="label">Classes de Ativos</div>
        </div>
        <div className="summary-item">
          <div className="value">{totalAssets}</div>
          <div className="label">Total de Ativos</div>
        </div>
      </div>
    </div>
  )
}
