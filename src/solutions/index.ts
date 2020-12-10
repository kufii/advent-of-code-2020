import { FunctionComponent } from 'preact'
import * as Day1 from './01'
import * as Day2 from './02'

interface Solution {
  Part1?: FunctionComponent
  Part2?: FunctionComponent
}

const solutions: Solution[] = [Day1, Day2]
export default solutions
