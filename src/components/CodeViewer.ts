import { useEffect, useState } from 'preact/hooks'
import { Fragment } from 'preact'
import { m, z } from '/vdom'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-typescript'

interface Props {
  day: number
}

export const CodeViewer = ({ day }: Props) => {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setShowCode(false)
    setCode('')
  }, [day])

  useEffect(() => {
    if (!showCode || code) return
    const loadCode = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://cdn.jsdelivr.net/gh/kufii/advent-of-code-2020@main/src/solutions/${day
            .toString()
            .padStart(2, '0')}/index.ts`
        )
        const text = await response.text()
        setCode(text)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        setCode('Not Found')
      } finally {
        setLoading(false)
      }
    }
    loadCode()
  }, [showCode, code, day])

  return m(
    Fragment,
    m(
      'button.btn.btn-link',
      { onClick: () => setShowCode(!showCode) },
      showCode ? 'Hide Code' : 'Show Code'
    ),
    showCode &&
      (loading
        ? m('div.loading.loading-lg')
        : m(
            'pre.code',
            { 'data-lang': 'TypeScript' },
            m(
              'code' +
                z`ff 'Operator Mono Ssm Lig', 'Operator Mono Lig', 'Operator Mono Ssm', 'Operator Mono', 'SF Mono', Menlo, source-code-pro, monospace`,
              {
                dangerouslySetInnerHTML: {
                  __html: highlight(code, languages.typescript, 'typescript')
                }
              }
            )
          ))
  )
}
