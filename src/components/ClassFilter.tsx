import type { AssetClass } from '../types'
import { getColor } from '../constants'

interface Props {
  portfolio: AssetClass[]
  selected: Set<number>
  onChange: (selected: Set<number>) => void
}

export default function ClassFilter({ portfolio, selected, onChange }: Props) {
  const toggle = (index: number) => {
    const next = new Set(selected)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    onChange(next)
  }

  return (
    <div style={{ marginTop: 16 }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        Aportar apenas em (opcional):
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
        {portfolio.map((asset, i) => {
          const checked = selected.has(i)
          return (
            <label
              key={i}
              className={`checkbox-pill ${checked ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(i)}
              />
              <div className="color-dot-sm" style={{ background: getColor(asset.className) }} />
              {asset.className}
            </label>
          )
        })}
      </div>
    </div>
  )
}
