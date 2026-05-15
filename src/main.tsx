import { Component, StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

type ErrorBoundaryState = {
  hasError: boolean
  message: string
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    }
  }

  override componentDidCatch(error: unknown) {
    console.error('App render error:', error)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', margin: 0, padding: '16px', background: '#111827', color: '#f9fafb' }}>
          <h1 style={{ margin: '0 0 12px', fontSize: '18px' }}>App failed to render</h1>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{this.state.message}</pre>
        </main>
      )
    }
    return this.props.children
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Missing #root element in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
