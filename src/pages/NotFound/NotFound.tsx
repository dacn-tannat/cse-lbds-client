import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import AreYouLostMeme from '@/assets/are-you-lost-meme.jpg'

export default function NotFound() {
  return (
    <div className='bg-gray-50 w-full h-[100vh] flex items-center justify-center space-y-16 lg:space-y-0 lg:space-x-8 2xl:space-x-0' role='main'>
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center'>
        <p className='text-6xl text-gray-800 md:text-7xl lg:text-8xl font-bold tracking-wider'>404</p>
        <p className='text-3xl text-gray-600 md:text-5xl lg:text-6xl font-bold tracking-wider mt-4'>Page Not Found</p>

        <img src={AreYouLostMeme} alt="Are you lost meme" className='w-60 md:w-96 lg:w-[30rem] mt-4 rounded-xl' />
        <Button asChild className='bg-black text-white rounded-xl font-medium px-4 py-3 hover:bg-black/80 mt-4'>
          <Link to='/'>
            <Home className='block mr-2' /> Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
