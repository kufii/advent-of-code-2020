import { useEffect, useState } from 'preact/hooks'
import input from './input'
import { output2dArray, parse2dArray } from '/utilities'
import { m } from '/vdom'

interface Coord {
  x: number
  y: number
}

const getAdjacentCoords = function* (pos: Coord, min: Coord, max: Coord) {
  for (
    let x = Math.max(pos.x - 1, min.x);
    x <= Math.min(pos.x + 1, max.x);
    x++
  ) {
    for (
      let y = Math.max(pos.y - 1, min.y);
      y <= Math.min(pos.y + 1, max.y);
      y++
    ) {
      if (!(x === pos.x && y === pos.y)) yield { x, y }
    }
  }
}

const tick = (seats: string[][]) =>
  seats.map((row, y) =>
    row.map((seat, x) => {
      const adjacent = [
        ...getAdjacentCoords(
          { x, y },
          { x: 0, y: 0 },
          { x: seats[0].length - 1, y: seats.length - 1 }
        )
      ]
      if (seat === 'L' && adjacent.every(({ x, y }) => seats[y][x] !== '#'))
        return '#'
      if (
        seat === '#' &&
        adjacent.filter(({ x, y }) => seats[y][x] === '#').length >= 4
      )
        return 'L'
      return seat
    })
  )

const tickUntilUnchanged = function* (prev: string[][]) {
  while (true) {
    yield prev
    const current = tick(prev)
    if (output2dArray(current) === output2dArray(prev)) return
    prev = current
  }
}

export const Part1 = () => {
  const [seats, setSeats] = useState<string[][] | null>(null)
  const [running, setRunning] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!running) return

    setDone(false)
    const gen = tickUntilUnchanged(parse2dArray(input))

    const interval = setInterval(() => {
      if (!running) clearInterval(interval)
      const { value, done } = gen.next()
      if (done) {
        setRunning(false)
        setDone(true)
        clearInterval(interval)
      }
      if (value) setSeats(value)
    }, 40)

    return () => clearInterval(interval)
  }, [running])

  return m('div', [
    done &&
      m(
        'div.mb-2',
        'After the chaos has settled there are ',
        m('strong', output2dArray(seats!).match(/#/gu)!.length),
        ' occupied seats.'
      ),
    m(
      'button.btn',
      { onClick: () => setRunning(!running) },
      running ? 'Cancel' : 'Run Again'
    ),
    seats && m('pre', output2dArray(seats))
  ])
}
