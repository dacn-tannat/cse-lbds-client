import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginWithGoogle } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'

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

        const { access_token } = response.data
        console.log(access_token)

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
