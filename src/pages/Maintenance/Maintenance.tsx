import { AlertTriangle } from 'lucide-react'

export default function Maintenance() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center' role='main'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-amber-100 p-3' data-testid='icon-container'>
            <AlertTriangle className='h-12 w-12 text-amber-600' data-testid='alert-triangle-icon' />
          </div>
        </div>

        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Server is under maintenance</h1>

        <p className='text-lg text-gray-600'>
          We are upgrading our system to provide a better experience. Please come back later.
        </p>
      </div>
    </div>
  )
}
