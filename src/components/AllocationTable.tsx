import type { AssetClass } from '../types'
import { getColor } from '../constants'
import { formatBRL, formatPercent } from '../utils/format'

interface Props {
  portfolio: AssetClass[]
  margin: number
  onIdealChange: (index: number, value: number) => void
  onMarginChange: (value: number) => void
}

function getStatus(current: number, ideal: number, margin: number) {
  const low = ideal * (1 - margin)
  const high = ideal * (1 + margin)

  if (current >= low && current <= high) return { cls: 'badge-ok', text: 'OK' }
  if (current < low) return { cls: 'badge-alert', text: 'Abaixo' }
  return { cls: 'badge-warn', text: 'Acima' }
}

export default function AllocationTable({ portfolio, margin, onIdealChange, onMarginChange }: Props) {
  const totalIdeal = portfolio.reduce((s, a) => s + a.idealPercent, 0)
  const totalCurrent = portfolio.reduce((s, a) => s + a.currentPercent, 0)
  const sumOk = Math.abs(totalIdeal - 100) <= 1

  return (
    <div className="card">
      <div className="card-title">Alocacao Atual vs Ideal</div>
      <div className="info-text" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span>Margem de tolerancia:</span>
        <div className="ideal-field">
          <input
            type="number"
            step={1}
            min={0}
            max={100}
            value={Math.round(margin * 100)}
            onChange={e => onMarginChange((parseFloat(e.target.value) || 15) / 100)}
            style={{ width: 55 }}
          />
          <span style={{ color: 'var(--text-muted)' }}>%</span>
        </div>
        <span>acima ou abaixo do ideal.</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Classe</th>
            <th className="text-right">Valor Atual</th>
            <th className="text-right">% Atual</th>
            <th className="text-center">% Ideal</th>
            <th className="text-center">Margem</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((asset, i) => {
            const color = getColor(asset.className)
            const status = getStatus(asset.currentPercent, asset.idealPercent, margin)
            const low = asset.idealPercent * (1 - margin)
            const high = asset.idealPercent * (1 + margin)

            return (
              <tr key={i}>
                <td data-label="">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="color-dot" style={{ background: color }} />
                    <strong>{asset.className}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      ({asset.count} ativos)
                    </span>
                  </div>
                </td>
                <td className="text-right" data-label="Valor Atual">{formatBRL(asset.equity)}</td>
                <td className="text-right" data-label="% Atual">
                  <div className="bar-container">
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${Math.min(asset.currentPercent, 100)}%`, background: color }}
                      />
                    </div>
                    <span className="bar-label">{formatPercent(asset.currentPercent)}</span>
                  </div>
                </td>
                <td className="text-center" data-label="% Ideal">
                  <div className="ideal-field">
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={100}
                      value={asset.idealPercent.toFixed(1)}
                      onChange={e => onIdealChange(i, parseFloat(e.target.value) || 0)}
                    />
                    <span style={{ color: 'var(--text-muted)' }}>%</span>
                  </div>
                </td>
                <td className="text-center" data-label="Margem">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatPercent(low)} - {formatPercent(high)}
                  </span>
                </td>
                <td className="text-center" data-label="Status">
                  <span className={`badge ${status.cls}`}>{status.text}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="ideal-sum ideal-sum-ok" style={{ marginBottom: 4 }}>
        Soma do valor atual: {formatPercent(totalCurrent)}
      </div>
      <div className={`ideal-sum ${sumOk ? 'ideal-sum-ok' : 'ideal-sum-error'}`}>
        Soma dos ideais: {formatPercent(totalIdeal)}{!sumOk && ' (deve ser 100%)'}
      </div>
    </div>
  )
}
