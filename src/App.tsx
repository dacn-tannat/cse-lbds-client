import { useLocation } from 'react-router-dom'
import useAppRoutes from './hooks/use-app-routes'
import { useEffect } from 'react'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const appRoutes = useAppRoutes()
  return (
    <>
      <ScrollToTop />
      {appRoutes}
    </>
  )
}

export default App
