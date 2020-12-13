import input from './input'
import { lcm } from '/utilities'
import { m } from '/vdom'

type Bus = number | 'x'

const parseInput = (): { earliest: number; busses: Bus[] } => {
  const [earliest, busses] = input.split('\n')
  return {
    earliest: Number(earliest),
    busses: busses.split(',').map((id) => (id === 'x' ? id : Number(id)))
  }
}

const getIds = (busses: Bus[]) =>
  busses.filter((id): id is number => id !== 'x')

const findFirstBus = (time: number, busses: number[]) => {
  while (true) {
    const bus = busses.find((id) => time % id === 0)
    if (bus) return { time, bus }
    time++
  }
}

const findEarliestTimetableMatch = (busses: Bus[]) => {
  const ids = getIds(busses)
  const timetable = new Map(ids.map((id) => [id, busses.indexOf(id)]))
  let increment = ids[0]
  let t = ids[0]
  let matches = 1
  while (true) {
    const found = ids.filter((id) => (t + timetable.get(id)!) % id === 0)
    if (found.length === ids.length) return t
    else if (found.length > matches) {
      increment = found.reduce(lcm)
      matches = found.length
    }
    t += increment
  }
}

export const Part1 = () => {
  const { earliest, busses } = parseInput()
  const { time, bus } = findFirstBus(earliest, getIds(busses))
  const result = bus * (time - earliest)
  return m(
    'div',
    `Starting at ${earliest}, the first bus you can take is #${bus} at ${time} minutes. Result is `,
    m('strong', result),
    '.'
  )
}

export const Part2 = () =>
  m(
    'div',
    'The earliest time that matches the timetable is ',
    m('strong', findEarliestTimetableMatch(parseInput().busses)),
    ' minutes.'
  )
