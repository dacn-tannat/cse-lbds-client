import { useLocation } from 'react-router-dom'
import useAppRoutes from './hooks/use-app-routes'
import { useEffect } from 'react'
import { LogoutEventTarget } from './utils/auth'
import { LOGOUT_EVENT } from './utils/constants'
import { useAuthStore } from './store/useAuthStore'
import { envConfig } from './config/env.config'
import Maintenance from './pages/Maintenance'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const reset = useAuthStore((state) => state.reset)
  useEffect(() => {
    LogoutEventTarget.addEventListener(LOGOUT_EVENT, reset)
    // clear event when component is unmounted -> avoid memory leak
    return () => {
      LogoutEventTarget.removeEventListener(LOGOUT_EVENT, reset)
    }
  }, [reset])

  const routes = useAppRoutes()

  return (
    <>
      <ScrollToTop />
      {envConfig.MAINTENANCE === 'true' ? <Maintenance /> : routes}
    </>
  )
}

export default App
