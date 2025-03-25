import { memo, useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { AlertCircle, Loader2, Moon, Sun, TypeIcon } from 'lucide-react'

import FeedbackModal from '../FeedbackModal'
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
import { Alert, AlertTitle } from '@/components/ui/alert'
import useCodeStore from '@/store/useCodeStore'
import { useLocation } from 'react-router-dom'

interface CodeEditorProps {
  problem_id: number
  sample_code: string | null
}

const CodeEditor = ({ problem_id, sample_code }: CodeEditorProps) => {
  // Current URL
  const location = useLocation()

  // Editor setting
  const [fontSize, setFontSize] = useState<number>(FONT_SIZE.DEFAULT)
  const [theme, setTheme] = useState<keyof typeof EDITOR_THEME>(EDITOR_THEME.DARK)

  // This ref to saved source code typed from user or loaded from session storage
  const editorContentRef = useRef<string>(sample_code ?? '')

  //! [UNSTABLE] Last prediction:
  const lastPrediction = getPredictionFromLS()
  const hasSubmittedFeedback = !Boolean(lastPrediction)
  // To be triggered by Feedback Modal
  const [_, setFeedbackSubmitted] = useState(false)

  // Problem Detail Store
  const isSubmitting = useProblemDetailStore((state) => state.isSubmitting)
  const isPredicting = useProblemDetailStore((state) => state.isPredicting)
  const setIsSubmitting = useProblemDetailStore((state) => state.setIsSubmitting)
  const setSubmission = useProblemDetailStore((state) => state.setSubmission)
  const setPrediction = useProblemDetailStore((state) => state.setPrediction)

  // Code Store
  const code = useCodeStore((state) => state.getProblemCode(problem_id))
  const setCodes = useCodeStore((state) => state.setCodes)
  const saveCodes = useCodeStore((state) => state.saveCodes)

  /* ----------------- HANDLER ----------------- */

  // Theme
  const toggleTheme = () => {
    setTheme(theme === EDITOR_THEME.LIGHT ? EDITOR_THEME.DARK : EDITOR_THEME.LIGHT)
  }

  // Font size
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
        title: 'An error occurred while submitting source code. Please try again',
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
        description: 'Empty source code. Please try again'
      })
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

  // Save code into session storage and zustand when
  useEffect(() => {
    // Update ref if it's the first load or problem_id changes
    const storedCode = code || sample_code || ''
    if (editorContentRef.current !== storedCode) {
      editorContentRef.current = storedCode
    }
  }, [problem_id, sample_code, code])

  useEffect(() => {
    const handleSave = () => {
      setCodes(problem_id, editorContentRef.current) // Update zustand
      saveCodes() // Save into session storage
    }

    // Save when F5
    window.addEventListener('beforeunload', handleSave)

    // Save when changing route
    return () => {
      handleSave()
      window.removeEventListener('beforeunload', handleSave)
    }
  }, [location.pathname]) // activate when url is changed

  return (
    <div className='relative mb-4'>
      <div className='relative bg-gray-100 backdrop-blur rounded-xl border-2 p-6 shadow'>
        {/* Header */}
        <div className='relative flex flex-wrap items-center justify-between mb-4 gap-2'>
          <Badge className='text-black bg-gray-200 border-lg rounded-xl py-2 px-4 font-semibold text-sm'>C++</Badge>
          <div className='flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto'>
            <div>
              <Button className='border-2 p-5 rounded-xl' variant='ghost' size='icon' onClick={toggleTheme}>
                {theme === EDITOR_THEME.LIGHT ? <Sun /> : <Moon />}
              </Button>
            </div>
            {/* Font Size */}
            <div className='flex w-full sm:w-auto items-center gap-2 border-2 p-2 rounded-xl'>
              <TypeIcon className='size-4 text-zinc-600' />
              <Slider
                defaultValue={[FONT_SIZE.DEFAULT]}
                min={FONT_SIZE.MIN}
                max={FONT_SIZE.MAX}
                step={FONT_SIZE.STEP}
                onValueChange={(value) => handleFontSizeChange(value[0])}
                className='w-full min-w-[100px] h-[0.2rem] bg-zinc-700 text-zinc-700 rounded-lg cursor-pointer'
              />
              <span className='text-base min-w-[1.5rem] text-center'>{fontSize}</span>
            </div>
          </div>
        </div>
        {/* Code Editor */}
        <div className='relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]'>
          <Editor
            height='350px'
            language='cpp'
            defaultValue={editorContentRef.current}
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
                horizontalScrollbarSize: 8,
                alwaysConsumeMouseWheel: false
              }
            }}
          />
        </div>
        {/* Submit */}
        <div className='relative mt-4 flex flex-wrap items-center justify-between gap-2'>
          {/* Buttons Section */}
          <div className='flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end'>
            <Button
              disabled={!hasSubmittedFeedback || submitMutation.isPending || isSubmitting || isPredicting}
              onClick={handleSubmit}
              className='text-base px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white bg-zinc-800 hover:bg-zinc-800/80 w-full sm:w-fit'
            >
              {(submitMutation.isPending || isSubmitting || isPredicting) && (
                <Loader2 className='size-4 animate-spin' />
              )}
              Submit Code
            </Button>
            {!hasSubmittedFeedback && (
              <FeedbackModal
                lastPrediction={lastPrediction}
                onSubmittedFeedback={() => {
                  setFeedbackSubmitted((prev) => !prev)
                }}
              />
            )}
            {/* {!hasSubmittedFeedback && <FeedbackModal lastPrediction={lastPrediction} />} */}
          </div>
          {/* Alert Message */}
          {!hasSubmittedFeedback && (
            <div className='w-full sm:w-auto'>
              <Alert className='p-2 border-[1px] border-yellow-500 text-yellow-500 bg-yellow-50 rounded-xl flex items-center space-x-2'>
                <div>
                  <AlertCircle className='h-4 w-4' />
                </div>
                <AlertTitle className='mb-0 text-sm sm:text-base italic'>
                  You need to send feedback on the previous prediction before submitting again.
                </AlertTitle>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(CodeEditor)
