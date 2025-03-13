import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { Outlet } from 'react-router-dom'
import { memo } from 'react'

interface LayoutProps {
  children?: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Outlet />
      <Toaster />
      <Footer />
    </>
  )
}

export default memo(Layout)
