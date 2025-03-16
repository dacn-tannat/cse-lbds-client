import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { memo, useRef } from 'react'
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
  lastPrediction: PredictionLS | null
  onSubmittedFeedback: () => void
}

const FeedbackModal = ({ lastPrediction, onSubmittedFeedback }: FeedbackModalProps) => {
  if (!lastPrediction) {
    return null
  }

  const { predictionId, buggyPositions, sourceCode } = lastPrediction
  const bugIdList = Array.from({ length: buggyPositions.length }, (_, i) => i)

  // close modal by clicking DialogClose button
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const selectedCheckboxesRef = useRef<{
    TOKEN_ERROR: number[]
    SUGGESTION_USEFUL: number[]
  }>({
    TOKEN_ERROR: [...bugIdList],
    SUGGESTION_USEFUL: [...bugIdList]
  })

  const handleCheckboxChange = (bugId: number, column: BugCheckTypeValue, checked: boolean) => {
    if (checked) {
      selectedCheckboxesRef.current[column] = [...selectedCheckboxesRef.current[column], bugId]
    } else {
      selectedCheckboxesRef.current[column] = selectedCheckboxesRef.current[column].filter((_bugId) => _bugId !== bugId)
    }
  }

  const bugCheckMutation = useMutation({
    mutationFn: (payloads: BugCheckRequest[]) => Promise.all(payloads.map(bugCheck)),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Gửi phản hồi thành công',
        description: 'Bạn có thể tiếp tục nộp bài'
      })
      clearPredictionFromLS()
      closeButtonRef.current?.click()
      onSubmittedFeedback()
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

    const { TOKEN_ERROR: checkedErrors, SUGGESTION_USEFUL: checkedSuggestions } = selectedCheckboxesRef.current

    if (checkedErrors.length > 0) {
      payloads.push({
        prediction_id: predictionId,
        type: BUG_CHECK_TYPE.TOKEN_ERROR,
        position: checkedErrors
      })
    }

    if (checkedSuggestions.length > 0) {
      payloads.push({
        prediction_id: predictionId,
        type: BUG_CHECK_TYPE.SUGGESTION_USEFUL,
        position: checkedSuggestions
      })
    }

    bugCheckMutation.mutate(payloads)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='text-base px-8 py-4 rounded-xl text-white bg-yellow-500 hover:bg-yellow-500/80 w-full sm:w-fit'>
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className='w-3/4 max-w-[100vw] max-h-[80vh] bg-white overflow-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Submit Feedback</DialogTitle>
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
                      Cột
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
                        className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        {bug.line_number}
                      </TableCell>
                      <TableCell
                        className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        {bug.col_number}
                      </TableCell>
                      <TableCell
                        className={`border-2 border-gray-300 text-center font-mono ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-row justify-center items-center gap-4 mx-2'>
                          {bug.original_token}
                          <Checkbox
                            defaultChecked={selectedCheckboxesRef.current[BUG_CHECK_TYPE.TOKEN_ERROR].includes(bug.id)}
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
                            defaultChecked={selectedCheckboxesRef.current[BUG_CHECK_TYPE.TOKEN_ERROR].includes(bug.id)}
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
              <div className='flex flex-wrap justify-end items-center gap-2'>
                <Button
                  onClick={handleSubmitFeedback}
                  className='w-full sm:w-auto px-6 py-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-500/80 text-base'
                >
                  Send feedback
                </Button>
                <DialogClose asChild>
                  <Button
                    ref={closeButtonRef}
                    type='button'
                    className='w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-200 text-black text-base'
                  >
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(FeedbackModal)
