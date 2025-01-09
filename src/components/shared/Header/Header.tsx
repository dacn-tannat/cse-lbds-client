import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='border-b p-2 sticky z-50 top-0 bg-gray-100'>
      <div className='container mx-auto px-4 py-2 flex justify-between items-center'>
        <Link to='/' className='text-xl font-semibold'>
          <Home />
        </Link>
      </div>
    </header>
  )
}
