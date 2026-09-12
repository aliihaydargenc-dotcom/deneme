import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider'
import { checkVersion } from './lib/versionCheck'
import { initI18n } from './lib/i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

// Initialize the bilingual UI after React mounts. Turkish is the default;
// the user's TR/EN choice is remembered in localStorage.
window.requestAnimationFrame(() => {
  initI18n()
})

// Check for newer builds after the UI is on screen so a slow network request
// to version.json does not delay the initial render of the app shell.
const scheduleVersionCheck = window.requestIdleCallback
  ? window.requestIdleCallback.bind(window)
  : (callback) => window.setTimeout(callback, 0)

scheduleVersionCheck(() => {
  checkVersion()
})
