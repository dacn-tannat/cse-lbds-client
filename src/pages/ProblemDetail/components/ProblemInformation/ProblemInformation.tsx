import parse from 'html-react-parser'
import { Problem } from '@/types'

export default function ProblemInformation({ problem }: { problem: Problem }) {
  return (
    <>
      <div className='text-2xl font-bold mb-6'>{problem.name}</div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-2'>
          <div className='bg-gray-100 shadow rounded-xl p-6 border-2'>
            <div className='text-xl font-semibold mb-4'>Mô tả</div>
            <p className='text-gray-800 mb-4 '>{parse(problem.description)}</p>
            {problem.examples.map((example) => (
              <div key={example.id} className='bg-[#efefef] p-4 rounded-xl mb-4'>
                <div className='font-bold mb-2 text-lg'>Ví dụ {example.id}:</div>
                <div className='border-l-4 border-gray-300'>
                  <div className='px-4 pt-1'>
                    <p className='mb-2'>
                      <strong>Input:</strong> {parse(example.input)}
                    </p>
                    <p className='mb-2'>
                      <strong>Output:</strong> {parse(example.output)}
                    </p>
                    <p className='mb-2'>
                      <strong>Giải thích:</strong> {parse(example.explanation)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {problem.image && (
            <div className='bg-white shadow rounded-lg p-6 mb-4'>
              <div className='text-xl font-semibold mb-2'>Minh hoạ</div>
              <div className='bg-gray-200 w-full h-48 flex items-center justify-center'>
                <img src='/placeholder.svg?height=200&width=400' alt={`${problem.name}-image`} className='rounded-md' />
              </div>
            </div>
          )}
        </div>
        <div className='md:col-span-1'>
          <div className='bg-gray-100 shadow rounded-xl p-6 border-2'>
            <div className='text-xl font-semibold mb-2'>Ràng buộc</div>
            <ul className='list-disc list-inside text-gray-700 '>
              {problem.constraints.map((constraint, index) => (
                <li key={`constraint-${index}`}>{parse(constraint)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
