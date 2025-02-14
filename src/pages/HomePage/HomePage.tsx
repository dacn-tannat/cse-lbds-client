import { Button } from '@/components/ui/button'

export default function HomePage() {
  const getGoogleAuthUrl = () => {
    const query = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      prompt: 'consent'
    }
    return `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(query).toString()}`
  }

  const googleAuthUrl = getGoogleAuthUrl()
  console.log('googleAuthUrl =', googleAuthUrl)

  return (
    <div className='bg-gray-50 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8'>
        Welcome to CSE-LBDS
      </div>
      <div className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-6 sm:mb-8 md:mb-10 text-gray-500 italic px-5 lg:px-24'>
        Hệ thống phát hiện và gợi ý sửa lỗi logic cho các bài tập trong khoá học Thực hành - Kỹ thuật Lập trình
      </div>
      <Button className='hover:bg-gray-300 rounded-xl text-lg px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 shadow bg-gray-200'>
        <a href={googleAuthUrl} className='flex gap-3 sm:gap-5 items-center'>
          <img src='src/assets/google.png' className='size-6' />
          <span className='text-sm sm:text-base md:text-lg'>Đăng nhập với Google</span>
        </a>
      </Button>
    </div>
  )
}
