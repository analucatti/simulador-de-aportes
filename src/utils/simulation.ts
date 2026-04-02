import type { AssetClass, SimulationAllocation } from '../types'

export function calculateSimulation(
  portfolio: AssetClass[],
  depositAmount: number,
  margin: number,
  selectedIndices: Set<number> | null,
): SimulationAllocation[] {
  const totalEquity = portfolio.reduce((s, a) => s + a.equity, 0)
  const newTotal = totalEquity + depositAmount

  const allocations: SimulationAllocation[] = portfolio.map((asset, i) => {
    const isSelected = !selectedIndices || selectedIndices.has(i)
    const upperMargin = asset.idealPercent * (1 + margin)
    const isAboveMargin = asset.currentPercent > upperMargin

    const canReceive = isSelected && !isAboveMargin
    const targetValue = (asset.idealPercent / 100) * newTotal
    const deficit = canReceive ? Math.max(0, targetValue - asset.equity) : 0

    return {
      ...asset,
      targetValue,
      deficit,
      canReceive,
      isAboveMargin,
      aporteValue: 0,
      newEquity: 0,
      newPercent: 0,
    }
  })

  const totalDeficit = allocations.reduce((s, a) => s + a.deficit, 0)

  allocations.forEach(a => {
    if (!a.canReceive) {
      a.aporteValue = 0
    } else if (totalDeficit > 0) {
      a.aporteValue = (a.deficit / totalDeficit) * depositAmount
    } else {
      const totalIdealEligible = allocations
        .filter(x => x.canReceive)
        .reduce((s, x) => s + x.idealPercent, 0)
      a.aporteValue = totalIdealEligible > 0
        ? (a.idealPercent / totalIdealEligible) * depositAmount
        : 0
    }
  })

  const totalAllocated = allocations.reduce((s, a) => s + a.aporteValue, 0)
  if (totalAllocated > 0) {
    const factor = depositAmount / totalAllocated
    allocations.forEach(a => { a.aporteValue *= factor })
  }

  allocations.forEach(a => {
    a.newEquity = a.equity + a.aporteValue
    a.newPercent = (a.newEquity / newTotal) * 100
  })

  return allocations
}
