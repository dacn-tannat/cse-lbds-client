import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ProblemList from '@/pages/ProblemList'
import ProblemDetail from '@/pages/ProblemDetail'
import GoogleCallback from '@/pages/GoogleCallback'
import { useAuthStore } from '@/store/useAuthStore'
import Layout from '@/components/shared/Layout'

// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoutes = () => {
  const isAuth = useAuthStore((state) => state.isAuth)
  return isAuth ? <Outlet /> : <Navigate to='/' />
}

// eslint-disable-next-line react-refresh/only-export-components
const RejectedRoutes = () => {
  const isAuth = useAuthStore((state) => state.isAuth)
  return !isAuth ? <Outlet /> : <Navigate to='/' />
}

export default function useAppRoutes() {
  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <Layout>
          <HomePage />
        </Layout>
      )
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: '/problems',
          element: (
            <Layout>
              <ProblemList />
            </Layout>
          )
        },
        {
          path: '/problems/:slug',
          element: (
            <Layout>
              <ProblemDetail />
            </Layout>
          )
        }
      ]
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: 'auth/google/callback',
          element: <GoogleCallback />
        }
      ]
    }
  ])

  return routes
}
