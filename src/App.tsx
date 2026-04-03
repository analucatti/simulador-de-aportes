import { useState, useMemo, useCallback } from 'react'
import type { AssetClass } from './types'
import { DEFAULT_MARGIN } from './constants'
import { parseCurrency, formatPercent } from './utils/format'
import { calculateSimulation } from './utils/simulation'
import WalletImport from './components/WalletImport'
import PortfolioSummary from './components/PortfolioSummary'
import AllocationTable from './components/AllocationTable'
import SimulationForm from './components/SimulationForm'
import SimulationResults from './components/SimulationResults'

export default function App() {
  const [portfolio, setPortfolio] = useState<AssetClass[] | null>(null)
  const [margin, setMargin] = useState(DEFAULT_MARGIN)
  const [aporteInput, setAporteInput] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<Set<number>>(new Set())
  const [hasSimulated, setHasSimulated] = useState(false)

  const handleLoaded = useCallback((data: AssetClass[]) => {
    setPortfolio(data)
    setSelectedClasses(new Set(data.map((_, i) => i)))
    setHasSimulated(false)
    setAporteInput('')
  }, [])

  const handleIdealChange = useCallback((index: number, value: number) => {
    setPortfolio(prev => {
      if (!prev) return prev
      return prev.map((a, i) => i === index ? { ...a, idealPercent: value } : a)
    })
  }, [])

  const aporte = parseCurrency(aporteInput)
  const allSelected = portfolio ? selectedClasses.size === portfolio.length : true
  const filterSet = allSelected ? null : selectedClasses

  const totalIdeal = portfolio?.reduce((s, a) => s + a.idealPercent, 0) ?? 0
  const idealValid = Math.abs(totalIdeal - 100) <= 1

  const simulation = useMemo(() => {
    if (!portfolio || !hasSimulated || aporte <= 0 || !idealValid) return null
    return calculateSimulation(portfolio, aporte, margin, filterSet)
  }, [portfolio, hasSimulated, aporte, margin, filterSet, idealValid])

  const handleSimulate = () => {
    if (aporte <= 0) {
      alert('Insira um valor de aporte valido.')
      return
    }
    if (!idealValid) {
      alert(`A soma dos percentuais ideais e ${formatPercent(totalIdeal)}. Ajuste para que totalize 100%.`)
      return
    }
    setHasSimulated(true)
  }

  const handleReset = () => {
    setAporteInput('')
    setHasSimulated(false)
  }

  const currentTotal = portfolio?.reduce((s, a) => s + a.equity, 0) ?? 0

  return (
    <div className="container">
      <h1>Simulador de Aportes</h1>
      <p className="subtitle">Simule aportes e mantenha sua carteira balanceada</p>

      <WalletImport onLoaded={handleLoaded} />

      {portfolio && (
        <>
          <PortfolioSummary portfolio={portfolio} />

          <AllocationTable
            portfolio={portfolio}
            margin={margin}
            onIdealChange={handleIdealChange}
            onMarginChange={setMargin}
          />

          <SimulationForm
            portfolio={portfolio}
            aporteInput={aporteInput}
            onAporteChange={setAporteInput}
            selectedClasses={selectedClasses}
            onSelectedChange={setSelectedClasses}
            onSimulate={handleSimulate}
            onReset={handleReset}
          />

          {simulation && (
            <SimulationResults
              allocations={simulation}
              aporte={aporte}
              newTotal={currentTotal + aporte}
              currentTotal={currentTotal}
              margin={margin}
            />
          )}
        </>
      )}
      <footer className="site-footer">
        <p>Lucatti Tecnologia LTDA — lucatti.tecnologia@gmail.com</p>
        <p>
          <a href="https://github.com/analucatti/simulador-de-aportes" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
