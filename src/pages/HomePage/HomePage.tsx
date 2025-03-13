import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { generateGoogleAuthUrl } from '@/utils/auth'
import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import GoogleLogo from '@/assets/google.png'
import SplitText from '@/components/animation/SplitText'
import BlurText from '@/components/animation/BlurText'

export default function HomePage() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const user = useAuthStore((state) => state.user)

  const googleAuthUrl = generateGoogleAuthUrl()

  return (
    <div className='bg-gray-50'>
      <div className='text-gray-900 max-w-7xl min-h-screen mx-auto p-8 flex flex-col items-center justify-center text-center'>
        {/* <div className='text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-extrabold tracking-[0.05rem] md:tracking-[0.075rem] lg:tracking-[0.1rem]'>
          Welcome to CSE-LBDS
        </div> */}
        <SplitText
          text='Welcome to CSE-LBDS'
          className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-extrabold tracking-[0.05rem] md:tracking-[0.075rem] lg:tracking-[0.1rem]'
          delay={50}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          threshold={0.2}
          rootMargin='-50px'
        />
        <BlurText
          text='Hệ thống phát hiện và gợi ý sửa lỗi logic cho các bài tập trong khoá học Thực hành - Kỹ thuật Lập trình'
          delay={20}
          animateBy='words'
          direction='top'
          className='text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-8 md:mb-12 font-normal text-gray-600'
        />
        {/* <div className='text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-8 md:mb-12 font-normal text-gray-600'>
          Hệ thống phát hiện và gợi ý sửa lỗi logic cho các bài tập trong khoá học Thực hành - Kỹ thuật Lập trình
        </div> */}
        {isAuth && user ? (
          <div>
            <Link to='/problems' className='flex gap-2 items-center justify-center text-blue-700 hover:underline'>
              <ChevronRightIcon className='size-6' />
              <div className='italic text-sm sm:text-base md:text-lg lg:text-xl'>Danh sách bài tập</div>
            </Link>
          </div>
        ) : (
          <Button className='hover:bg-gray-300 rounded-xl text-lg px-8 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 shadow bg-gray-200'>
            <Link to={googleAuthUrl} className='flex gap-3 sm:gap-5 items-center'>
              <img src={GoogleLogo} className='size-6' alt='Google Logo' />
              <span className='text-sm sm:text-base md:text-lg'>Đăng nhập với Google</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
