import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { memo, useState } from 'react'
import DOMPurify from 'dompurify'
import { BugCheckRequest, BugCheckTypeValue, PredictionLS } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { highlightBugs } from '@/utils/source-code'
import { clearPredictionFromLS } from '@/utils/local-storage'
import { Checkbox } from '@/components/ui/checkbox'
import { BUG_CHECK_TYPE } from '@/utils/constants'
import { useMutation } from '@tanstack/react-query'
import { bugCheck } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lastPrediction: PredictionLS | null
}

const FeedbackModal = ({ open, onOpenChange, lastPrediction }: FeedbackModalProps) => {
  if (!lastPrediction) {
    clearPredictionFromLS()
    onOpenChange(false)
    return null
  }

  const { predictionId, buggyPositions, sourceCode } = lastPrediction

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<{
    TOKEN_ERROR: number[]
    SUGGESTION_USEFUL: number[]
  }>({
    TOKEN_ERROR: [],
    SUGGESTION_USEFUL: []
  })

  const handleCheckboxChange = (bugId: number, column: BugCheckTypeValue, checked: boolean) => {
    setSelectedCheckboxes((prev) => {
      return {
        ...prev,
        [column]: checked
          ? [...prev[column], bugId] // if checked, append bugId
          : prev[column].filter((_bugId) => _bugId !== bugId) // if unchecked, remove bugId
      }
    })
  }

  const bugCheckMutation = useMutation({
    mutationFn: (payloads: BugCheckRequest[]) => Promise.all(payloads.map(bugCheck)),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Thành công',
        description: 'Đã gửi phản hồi thành công. Bạn có thể tiếp tục nộp bài'
      })
      clearPredictionFromLS()
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra trong quá trình gửi phản hồi về hệ thống',
        description: error.message
      })
    }
  })

  const handleSubmitFeedback = () => {
    const payloads: BugCheckRequest[] = []

    if (selectedCheckboxes.TOKEN_ERROR.length > 0) {
      payloads.push({
        prediction_id: predictionId,
        type: BUG_CHECK_TYPE.TOKEN_ERROR,
        position: selectedCheckboxes.TOKEN_ERROR
      })
    }

    if (selectedCheckboxes.SUGGESTION_USEFUL.length > 0) {
      payloads.push({
        prediction_id: predictionId,
        type: BUG_CHECK_TYPE.SUGGESTION_USEFUL,
        position: selectedCheckboxes.SUGGESTION_USEFUL
      })
    }

    if (payloads.length === 0) return

    bugCheckMutation.mutate(payloads)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-3/4 max-w-[100vw] max-h-[80vh] bg-white overflow-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Submit Feedback </DialogTitle>
          <DialogDescription>
            <span className='mb-2 italic text-gray-500 block'>Vui lòng phản hồi trước khi nộp bài mới.</span>
            <span>
              <span className='font-bold'>Lưu ý: </span>Bảng trên bao gồm một số vị trí lỗi{' '}
              <span className='font-bold'>có thể đúng hoặc sai</span>. Các bạn sinh viên hãy dựa vào bảng gợi ý để chỉnh
              sửa bài làm.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
          {/* Source code */}
          <div className='col-span-1'>
            <div className='text-xl mb-2 font-bold text-gray-700'>Source code</div>
            <div className='p-4 bg-gray-100 text-gray-700 rounded-xl shadow-md border-b-2 border-gray-200 overflow-x-auto max-h-[400px] overflow-y-auto'>
              <pre
                className='whitespace-pre font-mono text-md'
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightBugs(sourceCode, buggyPositions)) }}
              />
            </div>
          </div>
          {/* Suggestions */}
          <div className='col-span-1'>
            <div className='text-xl mb-2 font-bold text-gray-700'>Gợi ý sửa lỗi</div>
            <div className='max-h-[400px] overflow-y-auto mb-2'>
              <Table className='border-collapse'>
                <TableHeader className='sticky top-0 bg-gray-200 border-2 border-gray-300 text-center text-base'>
                  <TableRow>
                    <TableHead className='w-[50px] border-2 border-gray-300 bg-gray-200 text-center text-base'>
                      #
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Dòng
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Ký tự lỗi <span className='text-red-600 text-sm'>*</span>
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Gợi ý <span className='text-yellow-700 text-sm'>**</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buggyPositions.map((bug, index) => (
                    <TableRow key={bug.id}>
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
                        className={`border-2 border-gray-300 text-center font-mono ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-row justify-center items-center gap-4 mx-2'>
                          {bug.original_token}
                          <Checkbox
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(bug.id, BUG_CHECK_TYPE.TOKEN_ERROR, Boolean(checked))
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        className={`border-2 border-gray-300 text-center font-mono ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-row justify-center items-center gap-4 mx-2'>
                          {bug.predicted_token}
                          <Checkbox
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(bug.id, BUG_CHECK_TYPE.SUGGESTION_USEFUL, Boolean(checked))
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='space-y-2'>
              <div className='text-red-600 italic text-sm'>
                [*] Đánh dấu những <span className='font-bold'>ký tự</span> bạn đã sử dụng để sửa lỗi
              </div>
              <div className='text-yellow-700 italic text-sm'>
                [**] Đánh dấu những <span className='font-bold'>gợi ý</span> bạn đã sử dụng để sửa lỗi
              </div>
              <Button
                onClick={handleSubmitFeedback}
                className='px-6 py-3 rounded-xl text-white bg-zinc-800 hover:bg-zinc-800/80'
              >
                Submit feedback
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(FeedbackModal)
