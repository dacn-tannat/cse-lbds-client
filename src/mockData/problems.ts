import { Problem } from '@/types'

export const problems: Problem[] = [
  {
    id: 1,
    name: 'Greatest Common Divisor (GCD)',
    category: 'Math',
    description:
      'Viết chương trình tìm ước chung lớn nhất cho 2 số nguyên dương <code class="code-style">a</code> và <code class="code-style">b</code>',
    examples: [
      {
        id: 1,
        input: '<code class="code-style">54 20</code>',
        output: '<code class="code-style">2</code>',
        explanation:
          'Ước của <code class="code-style">54</code> là [1, 2, 3, 6, 9, 18, 27, 54], ước của <code class="code-style">20</code> là [1, 2, 4, 5, 10, 20]. Ước chung của <code class="code-style">54</code> và <code class="code-style">20</code> là [1, 2], nên ước chung lớn nhất là <code class="code-style">2</code>.'
      }
    ],
    image: null,
    constraints: [
      '1 ≤ <code class="code-style">a</code>, <code class="code-style">b</code> ≤ 10<sup>9</sup>',
      '<code class="code-style">a</code> và <code class="code-style">b</code> là các số nguyên dương'
    ]
  }
]
