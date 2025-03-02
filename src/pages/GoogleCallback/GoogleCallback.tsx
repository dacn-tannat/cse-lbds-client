import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginWithGoogle } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

export default function GoogleCallback() {
  const navigate = useNavigate()

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Thành công',
        description: 'Đăng nhập thành công'
      })
      navigate('/problems')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại'
      })
      navigate('/')
    }
  })

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
        navigate('/')
      } else {
        loginWithGoogleMutation.mutate(code)
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
