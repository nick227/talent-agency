import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createApiClient } from '@talent/sdk'
import { Toaster } from 'sonner'
import { App } from './App'
import { queryClient } from './lib/queryClient'
import './index.css'

createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid #000000',
            color: '#1b1b1b',
            borderRadius: '0',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
