import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { STATUS_MAPPING } from '@/utils/constants'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  status: number
}

export default function ErrorMessage({ message, status }: ErrorMessageProps) {
  return (
    <Alert className='mt-6 border-[1px] border-red-600 text-red-600 bg-red-100 rounded-xl'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle className='text-xl'>{STATUS_MAPPING[status]}</AlertTitle>
      <AlertDescription className='text-lg'>{message}</AlertDescription>
    </Alert>
  )
}
