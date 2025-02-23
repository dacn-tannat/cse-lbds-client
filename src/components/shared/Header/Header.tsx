import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { clearAccessTokenFromLS, clearUserFromLS } from '@/utils/auth'
import { Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    useAuthStore.setState({ isAuth: false, user: null })
    clearAccessTokenFromLS()
    clearUserFromLS()
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
            <DropdownMenuTrigger className='cursor-pointer'>
              <Avatar>
                <AvatarImage src={user.picture} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40 bg-slate-50 rounded-xl shadow-lg'>
              <DropdownMenuItem className='p-2 cursor-pointer border-b-[1px]'>Lịch sử nộp bài</DropdownMenuItem>
              <DropdownMenuItem className='p-2 cursor-pointer' onClick={handleLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
