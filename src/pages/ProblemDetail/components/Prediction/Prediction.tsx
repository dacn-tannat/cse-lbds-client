import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { BuggyPosition, PredictionResponse } from '@/types'
import { submitBugCheck } from '@/utils/apis'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

/* Function to Highlight Buggy Tokens */
const highlightBugs = (code: string, bugs: BuggyPosition[]) => {
  let highlightedCode = ''
  let lastIndex = 0

  console.log('bugs:', bugs)

  bugs.forEach(({ start_index, original_token }) => {
    highlightedCode +=
      escapeHtml(code.slice(lastIndex, start_index)) + // Add normal code
      `<span class="bg-red-100 text-black px-1 rounded">${original_token}</span>` // Highlight bug
    lastIndex = start_index + original_token.length
  })

  highlightedCode += escapeHtml(code.slice(lastIndex)) // Add remaining text
  console.log(highlightedCode)
  return highlightedCode
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface PredictionProps {
  predictions: PredictionResponse
  source_code: string
}

export default function Prediction({ predictions, source_code }: PredictionProps) {
  const { buggy_position } = predictions
  console.log('buggy_position: ', buggy_position)
  const highlightedCode = highlightBugs(source_code, buggy_position)

  const [selectedBugs, setSelectedBugs] = useState<number[]>([])

  const submitMutation = useMutation({
    mutationFn: submitBugCheck
  })

  const handleCheckboxChange = (position: number) => {
    setSelectedBugs(
      (prevSelected) =>
        prevSelected.includes(position)
          ? prevSelected.filter((pos) => pos !== position) // Remove if already selected
          : [...prevSelected, position] // Add if not selected
    )
  }

  const handleBugCheck = async () => {
    if (selectedBugs.length === 0) {
      alert('Please select at least one bug before submitting!')
      return
    }

    const payload = {
      prediction_id: predictions.id,
      position: selectedBugs
    }
    submitMutation.mutate(payload)
  }

  return (
    <div className='grid grid-cols-2 mt-6 space-x-4'>
      <div className='col-span-1'>
        <div className='text-2xl font-bold mb-4'>Source code</div>
        <div className='p-6 bg-gray-100 text-black rounded-lg shadow-lg'>
          <pre
            className='whitespace-pre-wrap font-mono text-md '
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </div>
      <div className='col-span-1'>
        <div className='text-2xl font-bold mb-4'>Gợi ý sửa lỗi</div>
        <table className='w-full border-collapse mb-4'>
          <thead>
            <tr className='bg-gray-100 dark:bg-gray-800'>
              <th className='border p-2'>Thứ tự</th>
              <th className='border p-2'>Token lỗi</th>
              <th className='border p-2'>Gợi ý</th>
              <th className='border p-2'></th>
            </tr>
          </thead>
          <tbody>
            {buggy_position.map((bug, index) => (
              <tr key={index}>
                <td className='border p-2'>{bug.id}</td>
                <td className='border p-2'>{bug.original_token}</td>
                <td className='border p-2'>{bug.predicted_token}</td>
                <td className='border p-2'>
                  {' '}
                  <Checkbox
                    checked={selectedBugs.includes(bug.id)}
                    onCheckedChange={() => handleCheckboxChange(bug.id)}
                  />{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='text-gray-500 mb-2 italic'>Hãy tick vào các suggestion mà bạn đã sử dụng</p>
        <Button
          onClick={handleBugCheck}
          className='mt-4 px-4 py-2 rounded-xl border-1 text-white bg-zinc-800 hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out shadow'
        >
          Submit feedback
        </Button>
      </div>
    </div>
  )
}
