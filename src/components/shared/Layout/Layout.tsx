import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  )
}
