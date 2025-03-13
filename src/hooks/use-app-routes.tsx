import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import { useAuthStore } from '@/store/useAuthStore'
import Layout from '@/components/shared/Layout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ProblemList = lazy(() => import('@/pages/ProblemList'))
const ProblemDetail = lazy(() => import('@/pages/ProblemDetail'))
const GoogleCallback = lazy(() => import('@/pages/GoogleCallback'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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
      element: <ProtectedRoutes />,
      children: [
        {
          path: '/',
          element: <Layout />,
          children: [
            {
              path: '/problems',
              element: (
                <Suspense>
                  <ProblemList />
                </Suspense>
              )
            },
            {
              path: '/problems/:slug',
              element: (
                <Suspense>
                  <ProblemDetail />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: 'auth/google/callback',
          element: (
            <Suspense>
              <GoogleCallback />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: (
            <Suspense>
              <HomePage />
            </Suspense>
          ),
          index: true
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }
  ])

  return routes
}
