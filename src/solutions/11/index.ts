import { useEffect, useState } from 'preact/hooks'
import input from './input'
import { nestedLoop, output2dArray, parse2dArray } from '/utilities'
import { m, z } from '/vdom'

interface Coord {
  x: number
  y: number
}

type CoordFn = (seats: string[][], pos: Coord) => IterableIterator<Coord>

const getAdjacentCoords = function* (seats: string[][], pos: Coord) {
  for (const [dx, dy] of nestedLoop(2, -1, 1)) {
    if (dx === 0 && dy === 0) continue
    const x = pos.x + dx
    const y = pos.y + dy
    if (!(x < 0 || y < 0 || x >= seats[0].length || y >= seats.length))
      yield { x, y }
  }
}

const getVisibleCoords = function* (
  seats: string[][],
  pos: Coord
): Generator<Coord, any, any> {
  for (const [dx, dy] of nestedLoop(2, -1, 1)) {
    if (dx === 0 && dy === 0) continue
    let { x, y } = pos
    x += dx
    y += dy
    while (y >= 0 && y < seats.length && x >= 0 && x < seats[0].length) {
      if (seats[y][x] !== '.') {
        yield { x, y }
        break
      }
      x += dx
      y += dy
    }
  }
}

const tick = (
  seats: string[][],
  coordFn: CoordFn,
  numOccupiedSeatsToEmpty: number
) =>
  seats.map((row, y) =>
    row.map((seat, x) => {
      const adjacent = [...coordFn(seats, { x, y })]
      if (seat === 'L' && adjacent.every(({ x, y }) => seats[y][x] !== '#'))
        return '#'
      if (
        seat === '#' &&
        adjacent.filter(({ x, y }) => seats[y][x] === '#').length >=
          numOccupiedSeatsToEmpty
      )
        return 'L'
      return seat
    })
  )

const tickUntilUnchanged = function* (
  prev: string[][],
  coordFn: CoordFn,
  numOccupiedSeatsToEmpty: number
) {
  while (true) {
    yield prev
    const current = tick(prev, coordFn, numOccupiedSeatsToEmpty)
    if (output2dArray(current) === output2dArray(prev)) return
    prev = current
  }
}

const Solution = ({
  coordFn,
  numOccupiedSeatsToEmpty
}: {
  coordFn: CoordFn
  numOccupiedSeatsToEmpty: number
}) => {
  const [seats, setSeats] = useState<string[][] | null>(null)
  const [running, setRunning] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!running) return

    setDone(false)
    const gen = tickUntilUnchanged(
      parse2dArray(input),
      coordFn,
      numOccupiedSeatsToEmpty
    )

    const interval = setInterval(() => {
      if (!running) clearInterval(interval)
      const { value, done } = gen.next()
      if (done) {
        setRunning(false)
        setDone(true)
        clearInterval(interval)
      }
      if (value) setSeats(value)
    }, 50)

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
    seats && m('pre' + z`overflow-x scroll`, output2dArray(seats))
  ])
}

export const Part1 = () =>
  m(Solution, { coordFn: getAdjacentCoords, numOccupiedSeatsToEmpty: 4 })

export const Part2 = () =>
  m(Solution, { coordFn: getVisibleCoords, numOccupiedSeatsToEmpty: 5 })
