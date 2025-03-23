import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AlertProvider } from './AlertContext'
import Alert from './Alert'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AlertProvider>
      <Alert />
      <App />
    </AlertProvider>
    </BrowserRouter>
  </StrictMode>,
)
