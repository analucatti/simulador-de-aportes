import type { SimulationAllocation } from '../types'
import { getColor } from '../constants'
import { formatBRL, formatPercent } from '../utils/format'

interface Props {
  allocations: SimulationAllocation[]
  aporte: number
  newTotal: number
  currentTotal: number
  margin: number
}

export default function SimulationResults({ allocations, aporte, newTotal, currentTotal, margin }: Props) {
  const sorted = [...allocations].sort((a, b) => b.aporteValue - a.aporteValue)

  return (
    <>
      <div className="card">
        <div className="card-title">Resultado da Simulacao</div>

        <div className="summary-grid">
          <div className="summary-item">
            <div className="value">{formatBRL(aporte)}</div>
            <div className="label">Valor do Aporte</div>
          </div>
          <div className="summary-item">
            <div className="value">{formatBRL(currentTotal)}</div>
            <div className="label">Patrimonio Atual</div>
          </div>
          <div className="summary-item">
            <div className="value" style={{ color: 'var(--green)' }}>{formatBRL(newTotal)}</div>
            <div className="label">Patrimonio Apos Aporte</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <strong style={{ fontSize: '0.95rem' }}>Distribuicao sugerida do aporte:</strong>
        </div>

        {sorted.map((a, i) => {
          if (a.aporteValue < 0.01) return null
          const pctOfAporte = (a.aporteValue / aporte) * 100
          const color = getColor(a.className)

          return (
            <div className="suggestion-box" key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                <div>
                  <strong>{a.className}</strong>
                  <div className="label">{formatPercent(pctOfAporte)} do aporte</div>
                </div>
              </div>
              <div className="amount">{formatBRL(a.aporteValue)}</div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <div className="card-title">Comparacao: Antes vs Depois do Aporte</div>
        <table>
          <thead>
            <tr>
              <th>Classe</th>
              <th className="text-right">Aporte Sugerido</th>
              <th className="text-right">Valor Depois</th>
              <th className="text-right">% Antes</th>
              <th className="text-center">% Ideal</th>
              <th className="text-right">% Depois</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a, i) => {
              const ideal = a.idealPercent
              const low = ideal * (1 - margin)
              const high = ideal * (1 + margin)
              const color = getColor(a.className)

              let statusCls: string, statusText: string
              if (a.newPercent >= low && a.newPercent <= high) {
                statusCls = 'badge-ok'; statusText = 'OK'
              } else if (a.newPercent < low) {
                statusCls = 'badge-alert'; statusText = 'Abaixo'
              } else {
                statusCls = 'badge-warn'; statusText = 'Acima'
              }

              const diff = a.newPercent - a.currentPercent
              const arrow = diff > 0.05
                ? <span className="arrow arrow-up">&#9650;</span>
                : diff < -0.05
                  ? <span className="arrow arrow-down">&#9660;</span>
                  : null

              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="color-dot" style={{ background: color }} />
                      <strong>{a.className}</strong>
                    </div>
                  </td>
                  <td
                    className="text-right"
                    style={{ color: a.aporteValue > 0.01 ? 'var(--green)' : 'var(--text-muted)' }}
                  >
                    {a.aporteValue > 0.01 ? `+ ${formatBRL(a.aporteValue)}` : '-'}
                  </td>
                  <td className="text-right">{formatBRL(a.newEquity)}</td>
                  <td className="text-right">
                    <span style={{ color: 'var(--text-muted)' }}>{formatPercent(a.currentPercent)}</span>
                  </td>
                  <td className="text-center">
                    <span style={{ color: 'var(--accent)' }}>{formatPercent(a.idealPercent)}</span>
                  </td>
                  <td className="text-right">
                    {arrow} <strong>{formatPercent(a.newPercent)}</strong>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${statusCls}`}>{statusText}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
