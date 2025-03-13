// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/shared/ErrorBoundary'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <QueryClientProvider client={queryClient}>
  //     <App />
  //   </QueryClientProvider>
  // </StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
)
