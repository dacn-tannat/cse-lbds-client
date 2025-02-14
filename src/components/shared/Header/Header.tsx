import { Button } from '@/components/ui/button'
import { Home, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='border-b sticky z-50 top-0 bg-gray-100'>
      <div className='max-w-7xl mx-auto px-8 py-4 flex justify-between items-center'>
        <div className='flex gap-4 md:gap-6 lg:gap-10'>
          <Link to='/' className='text-md md:text-lg lg:text-xl font-semibold text-gray-700 hover:text-black'>
            <Home />
          </Link>
          <Link to='/problems' className='text-md md:text-lg lg:text-xl font-normal text-gray-700 hover:text-black'>
            <span>Problem List</span>
          </Link>
        </div>
        <Button
          variant='link'
          className='hover:no-underline !text-gray-500 hover:!text-black transition-colors duration-200'
        >
          <div className='flex gap-2 items-center text-md md:text-lg lg:text-xl'>
            <LogOut className='text-inherit' />
            <span className='font-normal text-inherit'>Log out</span>
          </div>
        </Button>
      </div>
    </header>
  )
}
