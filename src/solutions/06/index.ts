import input from './input'
import { Answer } from '/components'
import { sum } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('\n\n').map((block) => block.split('\n'))

const getUniqueQuestions = (group: string[]) => new Set([...group.join('')])

export const Part1 = () =>
  m(
    'div',
    'The sum of unique questions the groups answered yes to is ',
    m(
      Answer,
      parseInput()
        .map((group) => getUniqueQuestions(group).size)
        .reduce(sum)
    ),
    '.'
  )

export const Part2 = () =>
  m(
    'div',
    'The sum of unique questions where the entire group answered yes is ',
    m(
      Answer,
      parseInput()
        .map(
          (group) =>
            [...getUniqueQuestions(group).values()].filter((question) =>
              group.every((person) => person.includes(question))
            ).length
        )
        .reduce(sum)
    ),
    '.'
  )
