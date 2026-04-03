import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'
import type { IncomingMessage } from 'node:http'

function fetchFollowingRedirects(url: string): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        res.resume()
        fetchFollowingRedirects(res.headers.location).then(resolve, reject)
      } else {
        resolve(res)
      }
    }).on('error', reject)
  })
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'investidor10-proxy',
      configureServer(server) {
        server.middlewares.use('/api', (req, res) => {
          const targetUrl = `https://investidor10.com.br/wallet/api/proxy/wallet-app${req.url}`
          fetchFollowingRedirects(targetUrl)
            .then((proxyRes) => {
              res.writeHead(proxyRes.statusCode ?? 200, {
                'Content-Type': proxyRes.headers['content-type'] || 'application/json',
                'Access-Control-Allow-Origin': '*',
              })
              proxyRes.pipe(res)
            })
            .catch((err) => {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            })
        })
      },
    },
  ],
  preview: {
    allowedHosts: ['simulador-de-aportes.onrender.com'],
  },
  server: {
    port: 5173,
  },
})
