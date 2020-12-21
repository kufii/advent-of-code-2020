import input from './input'
import { Answer } from '/components'
import { m } from '/vdom'

type Bag = Record<string, number>
type Bags = Record<string, Bag>

const parseInput = () =>
  input
    .split('\n')
    .map(
      (line) =>
        line.match(/^(?<bag>[a-z ]+) bags contain (?<contains>[a-z\d, ]+).$/u)!
          .groups!
    )
    .reduce(
      (acc, { bag, contains }) => ({
        ...acc,
        [bag]:
          contains === 'no other bags'
            ? {}
            : contains
                .split(', ')
                .map(
                  (part) =>
                    part.match(/^(?<num>\d+) (?<bag>.+) bags?$/u)!.groups!
                )
                .reduce(
                  (acc, { num, bag }) => ({ ...acc, [bag]: Number(num) }),
                  {} as Bag
                )
      }),
      {} as Bags
    )

const bagContains = (bags: Bags, bag: string, contains: string): boolean =>
  Boolean(bags[bag][contains]) ||
  Object.keys(bags[bag]).some((bag) => bagContains(bags, bag, contains))

const countBags = (bags: Bags, bag: string): number =>
  Object.entries(bags[bag]).reduce(
    (sum, [bag, count]) => sum + count + countBags(bags, bag) * count,
    0
  )

export const Part1 = () => {
  const bags = parseInput()
  const count = Object.keys(bags).filter((bag) =>
    bagContains(bags, bag, 'shiny gold')
  ).length
  return m(
    'div',
    m(Answer, count),
    ' bags can eventually contain shiny gold bags.'
  )
}

export const Part2 = () =>
  m(
    'div',
    'Shiny gold bags contain ',
    m(Answer, countBags(parseInput(), 'shiny gold')),
    ' other bags.'
  )
