import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { clearAccessTokenFromLS } from '@/utils/auth'
import { Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    useAuthStore.setState({ isAuth: false })
    useAuthStore.setState({ user: null })
    clearAccessTokenFromLS()
    toast({
      variant: 'success',
      title: 'Thành công',
      description: 'Đăng xuất thành công'
    })
    navigate('/')
  }

  return (
    <header className='border-b sticky z-50 top-0 bg-gray-100'>
      <div className='max-w-7xl mx-auto px-8 py-4 flex justify-between items-center'>
        <div className='flex gap-4 md:gap-6 lg:gap-10'>
          <Link to='/' className='text-md md:text-lg lg:text-xl font-semibold text-gray-700 hover:text-black'>
            <Home />
          </Link>
          <Link to='/problems' className='text-md md:text-lg lg:text-xl font-normal text-gray-700 hover:text-black'>
            <span>Problem List</span>
          </Link>
        </div>
        {isAuth && user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.picture} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button variant='link' onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
