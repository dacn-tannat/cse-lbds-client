import { memo, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { Loader2, Moon, Sun, TypeIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { EDITOR_THEME, FONT_SIZE } from '@/utils/constants'
import { submitCode } from '@/utils/apis'
import { SubmissionRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useProblemDetailStore } from '@/store/useProblemDetailStore'
import { getPredictionFromLS } from '@/utils/local-storage'
import FeedbackModal from '../FeedbackModal'

interface CodeEditorProps {
  problem_id: number
}

const CodeEditor = ({ problem_id }: CodeEditorProps) => {
  const [fontSize, setFontSize] = useState<number>(FONT_SIZE.DEFAULT)
  const [theme, setTheme] = useState<keyof typeof EDITOR_THEME>(EDITOR_THEME.DARK)

  const editorContentRef = useRef<string>('')

  const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false)
  const lastPrediction = getPredictionFromLS()

  // Problem Detail Store
  const isSubmitting = useProblemDetailStore((state) => state.isSubmitting)
  const isPredicting = useProblemDetailStore((state) => state.isPredicting)
  const setIsSubmitting = useProblemDetailStore((state) => state.setIsSubmitting)
  const setSubmission = useProblemDetailStore((state) => state.setSubmission)
  const setPrediction = useProblemDetailStore((state) => state.setPrediction)

  const toggleTheme = () => {
    setTheme(theme === EDITOR_THEME.LIGHT ? EDITOR_THEME.DARK : EDITOR_THEME.LIGHT)
  }

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, FONT_SIZE.MIN), FONT_SIZE.MAX)
    setFontSize(size)
  }

  const handleEditorChange = (value?: string) => {
    editorContentRef.current = value || ''
  }

  const submitMutation = useMutation({
    mutationFn: submitCode,
    onSuccess: (response) => {
      setSubmission(response.data.data)
      setIsSubmitting(false)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra trong quá trình nộp bài',
        description: error.message
      })
      setIsSubmitting(false)
      setSubmission(undefined)
    }
  })

  const handleSubmit = () => {
    // Empty source code
    if (!editorContentRef.current) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Source code rỗng. Vui lòng thử lại'
      })
      return
    }
    // Check if user has submitted feedback of the previous prediction or not
    if (lastPrediction) {
      setOpenFeedbackModal(true)
      return
    }
    const payload: SubmissionRequest = {
      problem_id: problem_id,
      source_code: editorContentRef.current
    }
    setPrediction(undefined)
    setSubmission(undefined)
    setIsSubmitting(true)
    submitMutation.mutate(payload)
  }

  return (
    <div className='relative mb-4'>
      <div className='relative bg-gray-100 backdrop-blur rounded-xl border-2 p-6 shadow'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <Badge className='text-black bg-gray-200 border-lg rounded-xl py-2 px-4 font-semibold text-sm'>C++</Badge>
          <div className='flex flex-row items-center gap-4'>
            <div>
              <Button className='border-2 p-5 rounded-xl' variant='ghost' size='icon' onClick={toggleTheme}>
                {theme === EDITOR_THEME.LIGHT ? <Sun /> : <Moon />}
              </Button>
            </div>
            {/* Font Size */}
            <div className='flex items-center gap-3 border-2 p-2 rounded-xl'>
              <TypeIcon className='size-4 text-zinc-600' />
              <Slider
                defaultValue={[FONT_SIZE.DEFAULT]}
                min={FONT_SIZE.MIN}
                max={FONT_SIZE.MAX}
                step={FONT_SIZE.STEP}
                onValueChange={(value) => handleFontSizeChange(value[0])}
                className='w-24 h-[0.2rem] bg-zinc-900 text-black rounded-lg cursor-pointer'
              />
              <span className='text-base min-w-[1.5rem] text-center'>{fontSize}</span>
            </div>
          </div>
        </div>
        <div></div>
        {/* Code Editor */}
        <div className='relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]'>
          <Editor
            height='400px'
            language='cpp'
            value={editorContentRef.current}
            onChange={handleEditorChange}
            theme={`vs-${theme.toLowerCase()}`} // vs-dark, vs-light
            options={{
              minimap: { enabled: false },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: 'selection',
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: 'all',
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8
              }
            }}
          />
        </div>
        <Button
          disabled={submitMutation.isPending || isSubmitting || isPredicting}
          onClick={handleSubmit}
          className={`text-base mt-4 px-8 py-4 rounded-xl text-white bg-zinc-800 hover:bg-zinc-800/80`}
        >
          {(submitMutation.isPending || isSubmitting || isPredicting) && <Loader2 className='size-4 animate-spin' />}
          Submit
        </Button>
        <FeedbackModal open={openFeedbackModal} onOpenChange={setOpenFeedbackModal} lastPrediction={lastPrediction} />
      </div>
    </div>
  )
}

export default memo(CodeEditor)
