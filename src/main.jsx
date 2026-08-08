import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* silent fail in dev */});
  });
}

// Global error boundary — prevents blank white screen on uncaught errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('EcoTwin crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f0fdf4', fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <h1 style={{ color: '#166534', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            EcoTwin ran into an issue
          </h1>
          <p style={{ color: '#4b7c5f', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {this.state.error?.message ?? 'Something unexpected happened.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#16a34a', color: 'white', border: 'none',
              padding: '0.75rem 2rem', borderRadius: '0.75rem',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
