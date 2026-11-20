import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import './sections.css'
import App from './App.jsx'

const organizationSchema = document.createElement('script')
organizationSchema.type = 'application/ld+json'
organizationSchema.textContent = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hooks Software Solutions',
  url: window.location.origin,
  logo: `${window.location.origin}/logo-mark.png`,
})
document.head.appendChild(organizationSchema)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
