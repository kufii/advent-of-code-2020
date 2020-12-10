import input from './input'
import { parse2dArray } from '/utilities'
import { m } from '/vdom'

interface Slope {
  x: number
  y: number
}

const getNumTrees = (grid: string[][], slopes: Slope[]) =>
  slopes
    .map(({ x: dx, y: dy }) => {
      let numTrees = 0
      let x = 0
      let y = 0
      while (y < grid.length) {
        if (grid[y][x % grid[0].length] === '#') numTrees++
        x += dx
        y += dy
      }
      return numTrees
    })
    .reduce((a, b) => a * b)

export const Part1 = () =>
  m(
    'div',
    'Following a slope of right 3 and down 1, you will encounter ',
    m('strong', getNumTrees(parse2dArray(input), [{ x: 3, y: 1 }])),
    ' trees.'
  )

export const Part2 = () =>
  m(
    'div',
    'Multiplying the number of trees in all slopes, the result is ',
    m(
      'strong',
      getNumTrees(parse2dArray(input), [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 1 },
        { x: 7, y: 1 },
        { x: 1, y: 2 }
      ])
    ),
    '.'
  )
