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
            <p className='text-gray-800 mb-4 '>{parse(problem.description!)}</p>
            {problem.examples!.map((example, index) => (
              <div key={index} className='bg-[#efefef] p-4 rounded-xl mb-4'>
                <div className='font-bold mb-2 text-lg'>Ví dụ {index + 1}:</div>
                <div className='border-l-4 border-gray-300'>
                  <div className='px-4 pt-1'>
                    <p className='mb-2'>
                      <strong>Input:</strong> {parse(example.input)}
                    </p>
                    <p className='mb-2'>
                      <strong>Output:</strong> {parse(example.output)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='md:col-span-1'>
          <div className='bg-gray-100 shadow rounded-xl p-6 border-2'>
            <div className='text-xl font-semibold mb-2'>Ràng buộc</div>
            <ul className='list-disc list-inside text-gray-700 '>
              {problem.constrain!.map((constraint, index) => (
                <li key={`constraint-${index}`}>{parse(constraint)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
