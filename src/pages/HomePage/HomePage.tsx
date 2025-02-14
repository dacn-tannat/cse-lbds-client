import { Button } from '@/components/ui/button'
import { generateGoogleAuthUrl } from '@/utils/auth'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const googleAuthUrl = generateGoogleAuthUrl()
  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl min-h-screen mx-auto p-8 flex flex-col items-center justify-center text-center'>
        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 md:mb-8 font-bold'>
          Welcome to CSE-LBDS
        </div>
        <div className='text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 font-normal text-gray-500 italic'>
          Hệ thống phát hiện và gợi ý sửa lỗi logic cho các bài tập trong khoá học Thực hành - Kỹ thuật Lập trình
        </div>
        <Button className='hover:bg-gray-300 rounded-xl text-lg px-8 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 shadow bg-gray-200'>
          <Link to={googleAuthUrl} className='flex gap-3 sm:gap-5 items-center'>
            <img src='src/assets/google.png' className='size-6' />
            <span className='text-sm sm:text-base md:text-lg'>Đăng nhập với Google</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
