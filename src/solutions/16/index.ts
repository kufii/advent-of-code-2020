import input from './input'
import { product, sum } from '/utilities'
import { m } from '/vdom'

interface Range {
  from: number
  to: number
}

interface Field {
  field: string
  ranges: Range[]
}

type Ticket = number[]

const parseInput = () => {
  const [fields, myTicket, tickets] = input.split('\n\n')
  return {
    fields: fields
      .split('\n')
      .map(
        (line) =>
          line.match(
            /(?<field>.+): (?<from1>\d+)-(?<to1>\d+) or (?<from2>\d+)-(?<to2>\d+)/u
          )!.groups!
      )
      .map(({ field, from1, to1, from2, to2 }) => ({
        field,
        ranges: [
          { from: Number(from1), to: Number(to1) },
          { from: Number(from2), to: Number(to2) }
        ]
      })),
    tickets: tickets
      .split('\n')
      .slice(1)
      .map((line) => line.split(',').map(Number)),
    myTicket: myTicket.split('\n')[1].split(',').map(Number)
  }
}

const isInRanges = (ranges: Range[], n: number) =>
  ranges.some(({ from, to }) => n >= from && n <= to)

const getInvalidValues = (fields: Field[], ticket: Ticket) =>
  ticket.filter(
    (n) =>
      !isInRanges(
        fields.flatMap(({ ranges }) => ranges),
        n
      )
  )

const isValidTicket = (fields: Field[], ticket: Ticket) =>
  getInvalidValues(fields, ticket).length === 0

const getFieldMap = (fields: Field[], tickets: Ticket[]) => {
  const map = new Map<number, string>()
  while (map.size < fields.length) {
    tickets
      .map((_, i) => i)
      .filter((i) => !map.has(i))
      .forEach((i) => {
        const eligibleFields = fields.filter(
          ({ field, ranges }) =>
            ![...map.values()].includes(field) &&
            tickets.every((ticket) => isInRanges(ranges, ticket[i]))
        )
        if (eligibleFields.length === 1) map.set(i, eligibleFields[0].field)
      })
  }
  return map
}

export const Part1 = () => {
  const { fields, tickets } = parseInput()
  const errorRate = tickets
    .flatMap((ticket) => getInvalidValues(fields, ticket))
    .reduce(sum)
  return m(
    'div',
    'The ticket scanning error rate is ',
    m('strong', errorRate),
    '.'
  )
}

export const Part2 = () => {
  const { fields, tickets, myTicket } = parseInput()
  const validTickets = [
    ...tickets.filter((ticket) => isValidTicket(fields, ticket)),
    myTicket
  ]
  const fieldMap = getFieldMap(fields, validTickets)
  const result = myTicket
    .filter((_, i) => fieldMap.get(i)!.startsWith('departure'))
    .reduce(product)
  return m(
    'div',
    "The product of my ticket's departure values is ",
    m('strong', result),
    '.'
  )
}
