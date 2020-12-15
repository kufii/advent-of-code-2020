import { useEffect, useState } from 'preact/hooks'
import input from './input'
import { m } from '/vdom'

const parseInput = () => input.split(',').map(Number)

const run = function* (numbers: number[], times: number, yieldEvery?: number) {
  const audit = new Map<number, number>(
    numbers.slice(0, numbers.length).map((n, i) => [n, i])
  )
  let prev = numbers[numbers.length - 1]
  for (let i = numbers.length; i < times; i++) {
    const last = audit.get(prev)
    const current = last == null ? 0 : i - 1 - last
    audit.set(prev, i - 1)
    prev = current
    if (yieldEvery && i % yieldEvery === 0) yield
  }
  yield prev
}

export const Part1 = () => {
  const [num] = [...run(parseInput(), 2020)]
  return m(
    'div',
    'The number read at the 2020th round is ',
    m('strong', num),
    '.'
  )
}

export const Part2 = () => {
  const [running, setRunning] = useState(true)
  const [num, setNum] = useState<number | null>(null)

  useEffect(() => {
    if (!running) return
    const gen = run(parseInput(), 30000000, 100000)
    const interval = setInterval(() => {
      const { done, value } = gen.next()
      if (done) setRunning(false)
      if (value != null) setNum(value)
    }, 0)
    return () => clearInterval(interval)
  }, [running])

  return m(
    'div',
    running
      ? 'Running...'
      : m(
          'span',
          'The number read at the 30000000th round is ',
          m('strong', num),
          '.'
        )
  )
}
