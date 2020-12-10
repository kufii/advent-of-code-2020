import input from './input'
import { m } from '/vdom'

const parseInput = (): Record<string, string>[] =>
  input.split('\n\n').map((passport) =>
    passport
      .trim()
      .split(/[\n ]/gu)
      .map((str) => str.split(':'))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  )

const hasRequiredFields = (passport: Record<string, string>) =>
  ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every(
    (key) => passport[key]
  )

const isValidYear = (str: string, min: number, max: number) =>
  str.match(/^\d+$/u) && Number(str) >= min && Number(str) <= max

const isValidHeight = (str: string) => {
  const groups = str.match(/^(?<amount>\d+)(?<unit>cm|in)$/u)?.groups
  if (!groups) return false
  const amount = Number(groups.amount)
  const { unit } = groups
  const ranges: Record<string, { min: number; max: number }> = {
    cm: { min: 150, max: 193 },
    in: { min: 59, max: 76 }
  }
  const { min, max } = ranges[unit]

  return amount >= min && amount <= max
}

const isValidHex = (str: string) => str.match(/^#[0-9a-f]{6}$/iu)

const isValidId = (str: string) => str.match(/^\d{9}$/u)

const isValidEyeColor = (str: string) =>
  ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(str)

const isValidPassport = (passport: Record<string, string>) =>
  hasRequiredFields(passport) &&
  isValidYear(passport.byr, 1920, 2002) &&
  isValidYear(passport.iyr, 2010, 2020) &&
  isValidYear(passport.eyr, 2020, 2030) &&
  isValidHeight(passport.hgt) &&
  isValidHex(passport.hcl) &&
  isValidEyeColor(passport.ecl) &&
  isValidId(passport.pid)

export const Part1 = () =>
  m(
    'div',
    'There are ',
    m('strong', parseInput().filter(hasRequiredFields).length),
    ' passports with all required fields.'
  )

export const Part2 = () =>
  m(
    'div',
    'There are ',
    m('strong', parseInput().filter(isValidPassport).length),
    ' valid passports.'
  )
