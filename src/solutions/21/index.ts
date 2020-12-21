import input from './input'
import { m } from '/vdom'

interface Food {
  ingredients: string[]
  allergens: string[]
}
const parseInput = () =>
  input
    .split('\n')
    .map(
      (line) =>
        line.match(/(?<ingredients>.+) \(contains (?<allergens>.+)\)/u)!.groups!
    )
    .map(({ ingredients, allergens }) => ({
      ingredients: ingredients.split(' '),
      allergens: allergens.split(', ')
    }))

const getIngredients = (foods: Food[]) => [
  ...new Set(foods.flatMap((f) => f.ingredients))
]

const getAllergens = (foods: Food[]) => [
  ...new Set(foods.flatMap((f) => f.allergens))
]

const getSafeIngredients = (foods: Food[]) => {
  const ingredients = getIngredients(foods)
  const allergens = getAllergens(foods)
  return ingredients.filter(
    (i) =>
      !allergens.some((a) =>
        foods
          .filter((f) => f.allergens.includes(a))
          .every((f) => f.ingredients.includes(i))
      )
  )
}

const getUnsafeIngredients = (foods: Food[]) => {
  const ingredients = getIngredients(foods)
  const safeIngredients = getSafeIngredients(foods)
  return ingredients.filter((i) => !safeIngredients.includes(i))
}

const getAllergenMap = (foods: Food[]) => {
  const allergens = getAllergens(foods)
  const ingredients = getUnsafeIngredients(foods)

  const buildMap = (map: Map<string, string>): Map<string, string> | null => {
    const nextAllergen = allergens.find((a) => !map.has(a))
    if (!nextAllergen) return map
    const remainingIngredients = ingredients.filter(
      (i) => ![...map.values()].includes(i)
    )
    const potentialIngredients = remainingIngredients.filter((i) =>
      foods
        .filter((f) => f.allergens.includes(nextAllergen))
        .every((f) => f.ingredients.includes(i))
    )
    if (!potentialIngredients.length) return null
    for (const i of potentialIngredients) {
      const newMap = new Map(map)
      newMap.set(nextAllergen, i)
      const result = buildMap(newMap)
      if (result) return result
    }
    return null
  }

  return buildMap(new Map())
}

export const Part1 = () => {
  const foods = parseInput()
  const safeIngredients = getSafeIngredients(foods)
  const result = foods.flatMap((f) =>
    f.ingredients.filter((i) => safeIngredients.includes(i))
  ).length
  return m(
    'div',
    'Definitively safe ingredients appear ',
    m('strong', result),
    ' times.'
  )
}

export const Part2 = () => {
  const foods = parseInput()
  const allergens = getAllergens(foods).sort()
  const allergenMap = getAllergenMap(foods)!
  return m(
    'div',
    allergens.map((a) => `${allergenMap.get(a)} contains ${a}`).join(', '),
    '. The canonical dangerous ingredients list is ',
    m('strong', allergens.map((a) => allergenMap.get(a)).join(',')),
    '.'
  )
}
