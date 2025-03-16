import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BuggyPosition } from '@/types'
import { highlightBugs } from '@/utils/source-code'
import DOMPurify from 'dompurify'
import { memo } from 'react'

export interface PredictionResultProps {
  source_code: string
  buggyPositions: BuggyPosition[]
}

const PredictionResult = ({ buggyPositions, source_code }: PredictionResultProps) => {
  return (
    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
      {/* Source code */}
      <div className='col-span-1'>
        <div className='text-2xl mb-4 font-bold text-gray-700'>Source code</div>
        <div className='p-4 bg-gray-100 text-gray-700 rounded-xl shadow-md border-b-2 border-gray-200 overflow-x-auto max-h-[400px] overflow-y-auto'>
          <pre
            className='whitespace-pre font-mono text-md'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightBugs(source_code, buggyPositions)) }}
          />
        </div>
      </div>
      {/* Suggestions */}
      <div className='col-span-1'>
        <div className='text-2xl mb-4 font-bold text-gray-700'>Gợi ý sửa lỗi</div>
        <div className='max-h-[400px] overflow-y-auto mb-2'>
          <Table className='border-collapse'>
            <TableHeader className='sticky top-0 bg-gray-200 border-2 border-gray-300 text-center text-base'>
              <TableRow>
                <TableHead className='w-[50px] border-2 border-gray-300 bg-gray-200 text-center text-base'>#</TableHead>
                <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                  Dòng
                </TableHead>
                <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                  Cột
                </TableHead>
                <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                  Ký tự lỗi
                </TableHead>
                <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                  Gợi ý
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buggyPositions.map((bug, index) => (
                <TableRow key={index}>
                  <TableCell
                    className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    {bug.id}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-300 text-center whitespace-pre-wrap ${
                      index % 2 ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    {bug.line_number}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-300 text-center whitespace-pre-wrap ${
                      index % 2 ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    {bug.col_number}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-300 text-center font-mono ${
                      index % 2 ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    {bug.original_token}
                  </TableCell>
                  <TableCell
                    className={`border-2 border-gray-300 text-center font-mono ${
                      index % 2 ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    {bug.predicted_token}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='text-gray-600 italic'>
          <span className='font-bold'>Lưu ý: </span>Bảng trên bao gồm một số vị trí lỗi{' '}
          <span className='font-bold'>có thể đúng hoặc sai</span>. Các bạn sinh viên hãy dựa vào bảng gợi ý để chỉnh sửa
          bài làm.
        </div>
      </div>
    </div>
  )
}

export default memo(PredictionResult)
