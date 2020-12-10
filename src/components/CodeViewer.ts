import { useEffect, useState } from 'preact/hooks'
import { m } from '/vdom'

interface Props {
  day: number
}

export const CodeViewer = ({ day }: Props) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCode = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://gitcdn.xyz/repo/kufii/advent-of-code-2020/main/src/solutions/${day
            .toString()
            .padStart(2, '0')}/index.ts`
        )
        const text = await response.text()
        setCode(text)
      } catch (err) {
        setCode('Failed to find code.')
      } finally {
        setLoading(false)
      }
    }
    loadCode()
  }, [day])

  return loading
    ? m('div.loading.loading-lg')
    : m('pre.code', { 'data-lang': 'TypeScript' }, m('code', code))
}
