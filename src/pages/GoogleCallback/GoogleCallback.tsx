import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginWithGoogle } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { saveAccessTokenToLS, saveUserToLS } from '@/utils/auth'
import { Loader2 } from 'lucide-react'

export default function GoogleCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (!code) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Có lỗi xảy ra trong quá trình đăng nhập'
        })
        return navigate('/')
      }

      try {
        const response = await loginWithGoogle(code)
        const { access_token, user } = response.data

        saveAccessTokenToLS(access_token)
        saveUserToLS(user)
        useAuthStore.setState({ isAuth: true })
        useAuthStore.setState({ user })

        toast({
          variant: 'success',
          title: 'Thành công',
          description: 'Đăng nhập thành công'
        })

        return navigate('/problems')
      } catch (error) {
        console.error('Error: ', error)
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Có lỗi xảy ra trong quá trình đăng nhập'
        })
        return navigate('/')
      }
    }

    handleGoogleCallback()
  }, [navigate])

  return (
    <div className='max-w-7xl mx-auto p-8'>
      <div className='min-h-screen flex flex-col items-center justify-center gap-8'>
        <Loader2 className='size-16 animate-spin' />
        <div className='text-gray-700 font-medium text-xl md:text-2xl lg:text-3xl italic'>
          Google đang xử lý yêu cầu của bạn. Xin vui lòng đợi...
        </div>
      </div>
    </div>
  )
}
