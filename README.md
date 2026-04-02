# Simulador de Aportes

Simulador de aportes para rebalanceamento de carteira de investimentos. Importa dados diretamente da sua carteira do [Investidor10](https://investidor10.com.br) e calcula como distribuir novos aportes para manter a alocacao ideal entre classes de ativos.

## Funcionalidades

- **Importacao automatica** da carteira publica do Investidor10 via API
- **Alocacao atual vs ideal** com margem de tolerancia configuravel
- **Simulacao de aportes** com distribuicao inteligente entre classes
- **Filtro de classes** para escolher onde aportar (opcional)
- **Comparacao antes/depois** mostrando o impacto do aporte no balanceamento
- Classes acima da margem de tolerancia nao recebem aportes automaticamente

## Tecnologias

- React 18 + TypeScript
- Vite
- Node.js (proxy backend)

## Como usar

### Pre-requisitos

- [Node.js](https://nodejs.org/) v18+

### Instalacao

```bash
npm install
```

### Executar

```bash
# Terminal 1 — proxy backend (necessario para acessar a API do Investidor10)
node server.js

# Terminal 2 — frontend
npm run dev
```

Acesse `http://localhost:5173`

### Passo a passo

1. No Investidor10, deixe sua carteira **publica** temporariamente
2. Cole o link da carteira (ex: `https://investidor10.com.br/wallet/my-wallet/1908516`)
3. Clique em **Carregar Carteira**
4. Ajuste os **percentuais ideais** de cada classe de ativo (devem somar 100%)
5. Ajuste a **margem de tolerancia** se quiser (padrao: 15%)
6. Insira o **valor do aporte** e clique em **Simular**
7. Veja a **distribuicao sugerida** e a **comparacao antes/depois**
8. Depois de usar, volte a carteira para **privada** no Investidor10

## Como funciona o algoritmo

1. Classes **acima da margem superior** de tolerancia recebem **R$ 0** de aporte
2. Classes **desmarcadas** no filtro recebem **R$ 0**
3. Para as classes elegiveis, calcula-se o **deficit** (quanto falta para o valor ideal)
4. O aporte e distribuido **proporcionalmente** aos deficits
5. Se todas as classes elegiveis ja estao acima do ideal, distribui pelo percentual ideal entre elas

## Estrutura do projeto

```
src/
  types.ts                 # Interfaces TypeScript
  constants.ts             # Cores e configuracoes
  utils/
    format.ts              # Formatacao de moeda e percentual
    api.ts                 # Chamada da API do Investidor10
    simulation.ts          # Logica de calculo de aportes
  components/
    WalletImport.tsx       # Importacao da carteira
    PortfolioSummary.tsx   # Resumo do patrimonio
    AllocationTable.tsx    # Tabela de alocacao atual vs ideal
    ClassFilter.tsx        # Filtro de classes de ativos
    SimulationForm.tsx     # Formulario de simulacao
    SimulationResults.tsx  # Resultados e comparacao
    StatusMessage.tsx      # Mensagens de status
  App.tsx                  # Componente principal
```

## Licenca

Este projeto usa uma licenca **CC BY-NC 4.0 com clausula de revenue sharing** para uso comercial.

- **Uso pessoal/educacional**: livre, desde que de os creditos
- **Uso comercial**: requer acordo de revenue sharing (5% da receita) — veja o arquivo [LICENSE](LICENSE) para detalhes

Autora: **Ana Luiza**
