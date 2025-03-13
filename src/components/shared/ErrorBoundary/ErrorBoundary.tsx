import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='bg-gray-50 w-full h-[100vh] flex items-center justify-center space-y-16 lg:space-y-0 lg:space-x-8 2xl:space-x-0'>
          {/* Left column - Content */}
          <div className='w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center'>
            <p className='text-7xl text-gray-800 md:text-8xl lg:text-9xl font-bold tracking-wider'>500</p>
            <p className='text-4xl text-gray-600 md:text-5xl lg:text-6xl font-bold tracking-wider mt-4'>
              Something went wrong...
            </p>
            <p className='text-lg text-gray-500 md:text-xl lg:text-2xl my-12'>Đi ra chỗ khác chơi!!!</p>
            <Button asChild className='bg-black text-white rounded-xl font-medium px-8 py-6 hover:bg-black/80 text-lg'>
              <a href='/'>
                <Home className='block mr-2' /> Home
              </a>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
