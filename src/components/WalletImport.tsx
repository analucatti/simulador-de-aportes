import { useState } from 'react'
import type { AssetClass, StatusType } from '../types'
import { extractWalletId, fetchWallet } from '../utils/api'
import StatusMessage from './StatusMessage'

interface Props {
  onLoaded: (data: AssetClass[]) => void
}

export default function WalletImport({ onLoaded }: Props) {
  const [url, setUrl] = useState('https://investidor10.com.br/wallet/my-wallet/1123456')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({ type: null, message: '' })

  const handleLoad = async () => {
    const walletId = extractWalletId(url)
    if (!walletId) {
      setStatus({ type: 'error', message: 'URL invalida. Use o formato: https://investidor10.com.br/wallet/my-wallet/XXXXXX' })
      return
    }

    setLoading(true)
    setStatus({ type: 'loading', message: 'Carregando carteira...' })

    try {
      const data = await fetchWallet(walletId)
      setStatus({ type: 'success', message: `Carteira carregada! ${data.length} classes de ativos encontradas.` })
      onLoaded(data)
    } catch (err) {
      setStatus({ type: 'error', message: `Erro: ${(err as Error).message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-title">Importar Carteira</div>
      <div className="input-group">
        <div className="field" style={{ flex: 1, minWidth: 250 }}>
          <label>Link da carteira Investidor10</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://investidor10.com.br/wallet/my-wallet/1123456"
          />
        </div>
        <button onClick={handleLoad} disabled={loading}>
          Carregar Carteira
        </button>
      </div>
      <StatusMessage type={status.type} message={status.message} />
    </div>
  )
}
