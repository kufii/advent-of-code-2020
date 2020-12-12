import Router, { Route } from 'preact-router'
import { CmpChild } from '/types'
import { Header } from '/components'
import { ViewDay } from '/pages'
import { m } from '/vdom'
import { createHashHistory } from 'history'
import { useEffect } from 'preact/hooks'
import { resetStore } from './store'

const RouteComponent = ({
  day,
  children
}: {
  day: string
  children: CmpChild
}) =>
  m('div', [
    m(Header, { day: day || '1' }),
    m('div.container.mt-2', m('div.container', children))
  ])

export const Routes = () => {
  const history = createHashHistory()
  useEffect(() => {
    const unlisten = history.listen(() => resetStore())
    return () => unlisten()
  }, [])
  return m(
    Router,
    { history },
    m(Route, {
      path: '/:day?',
      component: ({ day }: { day: string }) =>
        m(RouteComponent, { day }, m(ViewDay, { day: Number(day || 1) }))
    })
  )
}
