import { FunctionComponent } from 'preact'
import * as Day1 from './01'
import * as Day2 from './02'
import * as Day3 from './03'

interface Solution {
  Part1?: FunctionComponent
  Part2?: FunctionComponent
}

const solutions: Solution[] = [Day1, Day2, Day3]
export default solutions
