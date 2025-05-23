import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { memo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { BugCheckRequest, BugCheckTypeValue, PredictionLS } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { highlightBugs } from '@/utils/source-code'
import {
  clearPredictionFromLS,
  getRemainingEmptyFeedbackSubmits,
  saveRemainingEmptyFeedbackSubmits
} from '@/utils/local-storage'
import { Checkbox } from '@/components/ui/checkbox'
import { BUG_CHECK_TYPE } from '@/utils/constants'
import { useMutation } from '@tanstack/react-query'
import { bugCheck, restrictUser } from '@/utils/apis'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { logout } from '@/utils/auth'
import { cn } from '@/lib/utils'

interface FeedbackModalProps {
  lastPrediction: PredictionLS | null
  onSubmittedFeedback: () => void
}

const FeedbackModal = ({ lastPrediction, onSubmittedFeedback }: FeedbackModalProps) => {
  if (!lastPrediction) {
    return null
  }

  const { predictionId, buggyPositions, sourceCode } = lastPrediction

  const remainingSubmits = getRemainingEmptyFeedbackSubmits()

  // close modal by clicking DialogClose button
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<{
    TOKEN_ERROR: number[]
    SUGGESTION_USEFUL: number[]
  }>({
    TOKEN_ERROR: [],
    SUGGESTION_USEFUL: []
  })
  // const [toggledBoth, setToggledBoth] = useState<number[]>([])
  // const [didNotUtilize, setDidNotUtilize] = useState(false)

  console.log(selectedCheckboxes)

  const handleCheckboxChange = (bugId: number, type: BugCheckTypeValue, checked: boolean) => {
    setSelectedCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev }

      if (checked) {
        updatedCheckboxes[type] = [...prev[type], bugId]

        // Nếu check vào "Position to review" thì tự động check "Suggestion" nếu chưa check
        if (type === BUG_CHECK_TYPE.TOKEN_ERROR && !prev[BUG_CHECK_TYPE.SUGGESTION_USEFUL].includes(bugId)) {
          updatedCheckboxes[BUG_CHECK_TYPE.SUGGESTION_USEFUL] = [...prev[BUG_CHECK_TYPE.SUGGESTION_USEFUL], bugId]
        }
      } else {
        updatedCheckboxes[type] = prev[type].filter((id) => id !== bugId)
      }

      return updatedCheckboxes
    })
  }

  const restrictUserMutation = useMutation({
    mutationFn: restrictUser,
    onSuccess: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Your account has been temporarily suspended. You will not be able to access our services for the next 12 hours.'
      })
      logout()
    }
  })

  const bugCheckMutation = useMutation({
    mutationFn: (payloads: BugCheckRequest[]) => Promise.all(payloads.map(bugCheck)),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Feedback sent successfully',
        description: 'You can continue submitting your code'
      })
      clearPredictionFromLS()
      closeButtonRef.current?.click()
      onSubmittedFeedback()
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while sending feedback. Please try again'
      })
    }
  })

  const handleDecreaseRemainingEmptySubmit = () => {
    if (remainingSubmits === 0) {
      saveRemainingEmptyFeedbackSubmits(3)
      clearPredictionFromLS()
      restrictUserMutation.mutate()
    } else {
      saveRemainingEmptyFeedbackSubmits(remainingSubmits - 1)
      clearPredictionFromLS()
      closeButtonRef.current?.click()
      onSubmittedFeedback()
      toast({
        variant: 'success',
        title: 'Feedback sent successfully',
        description: `You can only submit ${remainingSubmits - 1} more empty feedbacks. Be careful!`
      })
    }
  }

  const handleSubmitFeedback = () => {
    const { TOKEN_ERROR: checkedErrors, SUGGESTION_USEFUL: checkedSuggestions } = selectedCheckboxes

    if (checkedErrors.length === 0 && checkedSuggestions.length === 0) {
      toast({
        variant: 'warning',
        title: 'Empty feedback',
        description: (
          <>
            We only allow to submit empty feedback up to <span className='font-semibold'>3 times</span>. After that,
            your account will be <span className='font-semibold'>suspended</span> from website within{' '}
            <span className='font-semibold'>12 hours.</span>.
            <br />
            {/* If you didn't use any bug position or suggestion, please check{' '}
            <span className='font-semibold'>"I did not utilize any bug position or suggestion"</span> */}
          </>
        ),

        action: (
          <ToastAction
            altText='Confirm'
            onClick={async () => {
              await handleDecreaseRemainingEmptySubmit()
            }}
          >
            Confirm
          </ToastAction>
        ),
        className: cn('w-[650px] bottom-0 right-0 fixed mr-4 mb-4')
      })
    } else {
      const payloads: BugCheckRequest[] = []

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
          <DialogTitle className='text-2xl'>Send Feedback</DialogTitle>
          <DialogDescription>
            <span className='mb-2 italic text-gray-500 block'>
              Please send feedback before submitting new source code
            </span>
            <span>
              <span className='font-bold'>Note: </span>The table includes some error positions that{' '}
              <span className='font-bold'>may be correct or incorrect</span>. Students should use the suggestions to
              make corrections.
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
            <div className='text-xl mb-2 font-bold text-gray-700'>Suggestion</div>
            <div className='max-h-[400px] overflow-y-auto mb-2'>
              <Table className='border-collapse'>
                <TableHeader className='sticky top-0 bg-gray-200 border-2 border-gray-300 text-center text-base'>
                  <TableRow>
                    <TableHead className='w-[50px] border-2 border-gray-300 bg-gray-200 text-center text-base'>
                      #
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Line
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Column
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Position to review <span className='text-red-600 text-sm'>*</span>
                    </TableHead>
                    <TableHead className='border-2 border-gray-300 font-semibold bg-gray-200 text-center text-base'>
                      Suggestion <span className='text-yellow-700 text-sm'>**</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buggyPositions.map((bug, index) => (
                    <TableRow key={bug.id}>
                      {/* # */}
                      <TableCell
                        className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        {bug.id}
                      </TableCell>
                      {/* Line */}
                      <TableCell
                        className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        {bug.line_number}
                      </TableCell>
                      {/* Column */}
                      <TableCell
                        className={`border-2 border-gray-300 text-center ${index % 2 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        {bug.col_number}
                      </TableCell>
                      {/* Position to review */}
                      <TableCell
                        className={`border-2 border-gray-300 text-center font-mono ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-row justify-center items-center gap-4 mx-2'>
                          {bug.original_token}
                          <Checkbox
                            checked={selectedCheckboxes.TOKEN_ERROR.includes(bug.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(bug.id, BUG_CHECK_TYPE.TOKEN_ERROR, Boolean(checked))
                            }
                          />
                        </div>
                      </TableCell>
                      {/* Suggestion */}
                      <TableCell
                        className={`border-2 border-gray-300 text-center font-mono ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <div className='flex flex-row justify-center items-center gap-4 mx-2'>
                          {bug.predicted_token}
                          <Checkbox
                            checked={selectedCheckboxes.SUGGESTION_USEFUL.includes(bug.id)}
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
              <div className='text-red-600 italic text-sm' data-testid="position-note">
                [*] Mark all the <span className='font-bold'>positions</span> you used to correct the errors
              </div>
              <div className='text-yellow-700 italic text-sm' data-testid="suggestion-note">
                [**] Mark all the <span className='font-bold'>suggestions</span> you used to correct the errors
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
