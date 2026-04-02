import type { AssetClass } from '../types'
import { formatCurrencyInput } from '../utils/format'
import ClassFilter from './ClassFilter'

interface Props {
  portfolio: AssetClass[]
  aporteInput: string
  onAporteChange: (value: string) => void
  selectedClasses: Set<number>
  onSelectedChange: (selected: Set<number>) => void
  onSimulate: () => void
  onReset: () => void
}

export default function SimulationForm({
  portfolio,
  aporteInput,
  onAporteChange,
  selectedClasses,
  onSelectedChange,
  onSimulate,
  onReset,
}: Props) {
  const handleInputChange = (value: string) => {
    onAporteChange(formatCurrencyInput(value))
  }

  return (
    <div className="card">
      <div className="card-title">Simular Aporte</div>
      <div className="input-group">
        <div className="field" style={{ flex: 1, minWidth: 200 }}>
          <label>Valor do aporte (R$)</label>
          <input
            type="text"
            value={aporteInput}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="1.000,00"
          />
        </div>
        <button onClick={onSimulate}>Simular</button>
        <button className="btn-secondary" onClick={onReset}>Limpar</button>
      </div>
      <ClassFilter
        portfolio={portfolio}
        selected={selectedClasses}
        onChange={onSelectedChange}
      />
    </div>
  )
}
