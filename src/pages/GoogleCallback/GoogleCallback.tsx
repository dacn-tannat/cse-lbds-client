import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginWithGoogle } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { saveAccessTokenToLS } from '@/utils/auth'

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

  return <div>Đang xử lý đăng nhập...</div>
}
