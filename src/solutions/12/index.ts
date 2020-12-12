import input from './input'
import { manhattanDistance, mod, Point, rotate } from '/utilities'
import { m } from '/vdom'

interface Instruction {
  command: string
  n: number
}

const parseInput = (): Instruction[] =>
  input
    .split('\n')
    .map((line) => line.match(/(?<command>[A-Z])(?<n>\d+)/u)!.groups!)
    .map(({ command, n }) => ({ command, n: Number(n) }))

const DIRS = ['N', 'E', 'S', 'W']
const DELTAS: Record<string, Point> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 }
}

const directShip = (instructions: Instruction[]) => {
  const pos = { x: 0, y: 0 }
  let dir = 'E'

  for (const { command, n } of instructions) {
    if (command === 'L' || command === 'R') {
      dir =
        DIRS[
          mod(DIRS.indexOf(dir) + (command === 'L' ? -n : n) / 90, DIRS.length)
        ]
    } else {
      const move = command === 'F' ? dir : command
      const { x, y } = DELTAS[move]
      pos.x += x * n
      pos.y += y * n
    }
  }

  return manhattanDistance(pos)
}

const directShipWithWaypoint = (instructions: Instruction[]) => {
  const ship = { x: 0, y: 0 }
  const waypoint = { x: 10, y: -1 }

  for (const { command, n } of instructions) {
    if (command === 'L' || command === 'R') {
      const { x, y } = rotate(waypoint, command === 'L' ? n : -n)
      waypoint.x = Math.round(x)
      waypoint.y = Math.round(y)
    } else if (command === 'F') {
      ship.x += waypoint.x * n
      ship.y += waypoint.y * n
    } else {
      const { x, y } = DELTAS[command]
      waypoint.x += x * n
      waypoint.y += y * n
    }
  }

  return Math.abs(ship.x) + Math.abs(ship.y)
}

export const Part1 = () =>
  m(
    'div',
    'After directing the ship, the Manhattan distance to where it started is ',
    m('strong', directShip(parseInput())),
    '.'
  )

export const Part2 = () =>
  m(
    'div',
    'After directing the ship using a waypoint, the Manhattan distance to where it started is ',
    m('strong', directShipWithWaypoint(parseInput())),
    '.'
  )
