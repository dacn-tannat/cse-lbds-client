import { ChevronsRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className='bg-gray-50 flex min-h-screen flex-col items-center justify-center'>
      <div className='text-6xl font-bold mb-8'>Welcome to CSE-LBDS</div>
      <div className='text-2xl font-normal mb-10 text-gray-500 italic'>
        Hệ thống phát hiện và gợi ý sửa lỗi logic cho các bài tập trong khoá học Thực hành - Kỹ thuật Lập trình
      </div>
      <Button variant='link' className='text-xl italic font-normal text-blue-500' onClick={() => navigate('/problems')}>
        <ChevronsRight />
        Danh sách bài tập
      </Button>
    </div>
  )
}
