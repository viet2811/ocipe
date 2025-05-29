import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'non.geist'
import 'non.geist/mono'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <BrowserRouter></BrowserRouter> */}
    <App />
  </StrictMode>,
)
