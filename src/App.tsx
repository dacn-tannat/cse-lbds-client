import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProblemList from './pages/ProblemList'
import ProblemDetail from './pages/ProblemDetail'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path='/problems'
            element={
              <AppLayout>
                <ProblemList />
              </AppLayout>
            }
          />
          <Route
            path='/problems/:id'
            element={
              <AppLayout>
                <ProblemDetail />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
