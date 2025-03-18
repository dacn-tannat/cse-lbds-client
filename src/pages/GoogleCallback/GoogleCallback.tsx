import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginWithGoogle } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from '@/utils/error'
import { ErrorResponse } from '@/types'

export default function GoogleCallback() {
  const navigate = useNavigate()

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginWithGoogle
  })

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (!code) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred while logging in. Please try again'
        })
        navigate('/')
      } else {
        try {
          const response = await loginWithGoogleMutation.mutateAsync(code)
          toast({
            variant: 'success',
            title: 'Success',
            description: response.data.detail // Login successfully
          })
          navigate('/problems')
        } catch (error) {
          if (isAxiosError<ErrorResponse>(error)) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: error?.response?.data.detail || 'You do not have permission to access to the system'
            })
          }
          navigate('/')
        }
      }
    }

    handleGoogleCallback()
  }, [navigate])

  return (
    <div className='max-w-7xl mx-auto p-8'>
      <div className='min-h-screen flex flex-col items-center justify-center gap-8'>
        <Loader2 className='size-16 animate-spin' />
        <div className='text-gray-700 font-medium text-lg md:text-xl lg:text-2xl italic'>
          Your request is processing. Please wait...
        </div>
      </div>
    </div>
  )
}
