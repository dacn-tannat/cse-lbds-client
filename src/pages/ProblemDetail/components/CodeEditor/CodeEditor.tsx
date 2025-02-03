import { useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { Moon, Sun, TypeIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { FONT_SIZE } from '@/utils/constants'
import { submitCode } from '@/utils/apis'

export default function CodeEditor({ problem_id }: { problem_id: number }) {
  const [fontSize, setFontSize] = useState<number>(FONT_SIZE.DEFAULT)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const editorContentRef = useRef<string>('')

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, FONT_SIZE.MIN), FONT_SIZE.MAX)
    setFontSize(size)
  }

  const handleEditorChange = (value: string | undefined) => {
    editorContentRef.current = value || ''
  }

  const handleSubmit = () => {
    const data = {
      problem_id,
      source_code: editorContentRef.current
    }
    submitCode(data)
  }

  return (
    <>
      <div className='relative mt-4'>
        <div className='relative bg-gray-100 backdrop-blur rounded-xl border-2 p-6 shadow'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <Badge className='text-black bg-gray-200 border-lg rounded-xl py-2 px-4 font-semibold text-sm'>C++</Badge>
            <div className='flex flex-row items-center gap-4'>
              <div>
                <Button
                  className='border-2 p-5 rounded-xl'
                  variant='ghost'
                  size='icon'
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light' ? <Sun /> : <Moon />}
                </Button>
              </div>
              {/* Font Size */}
              <div className='flex items-center gap-3 border-2 p-2 rounded-xl'>
                <TypeIcon className='size-4 text-zinc-600' />
                <Slider
                  defaultValue={[16]}
                  min={12}
                  max={24}
                  step={1}
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
              onChange={handleEditorChange}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              // beforeMount={defineMonacoThemes}
              // onMount={(editor) => setEditor(editor)}
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
            onClick={handleSubmit}
            className='mt-4 px-4 py-2 rounded-xl border-1 text-white bg-zinc-800 hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out shadow'
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}
