import { Problem } from '@/types'

export const problems: Problem[] = [
  {
    id: 1,
    name: 'Greatest Common Divisor (GCD)',
    category: 'Math',
    description:
      'Viết chương trình tìm ước chung lớn nhất cho 2 số nguyên dương <code class="code-style">a</code> và <code class="code-style">b</code>',
    lab_id: 0,
    is_active: true,
    examples: [
      {
        input: '<code class="code-style">54 20</code>',
        output: '<code class="code-style">2</code>'
      }
    ],
    constrain: [
      '1 ≤ <code class="code-style">a</code>, <code class="code-style">b</code> ≤ 10<sup>9</sup>',
      '<code class="code-style">a</code> và <code class="code-style">b</code> là các số nguyên dương'
    ]
  }
]
