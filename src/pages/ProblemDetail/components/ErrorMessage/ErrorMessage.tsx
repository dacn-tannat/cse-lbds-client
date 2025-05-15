import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { STATUS_TITLE_MAPPING } from '@/utils/constants'
import { AlertCircle } from 'lucide-react'
import { memo } from 'react'

interface ErrorMessageProps {
  message: string
  status: number
}

const ErrorMessage = ({ message, status }: ErrorMessageProps) => {
  return (
    <Alert data-testid="error-container" className='mt-6 border-[1px] border-red-600 text-red-600 bg-red-100 rounded-xl'>
      <AlertCircle data-testid="error-icon" className='h-4 w-4' />
      <AlertTitle className='text-lg'>{STATUS_TITLE_MAPPING[status]}</AlertTitle>
      <AlertDescription>
        <pre className='whitespace-pre-wrap'>{message}</pre>
      </AlertDescription>
    </Alert>
  )
}

export default memo(ErrorMessage)
