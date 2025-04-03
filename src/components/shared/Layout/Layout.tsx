import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { Outlet } from 'react-router-dom'
import { memo } from 'react'

function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  )
}

export default memo(Layout)
