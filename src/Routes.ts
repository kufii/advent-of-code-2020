import Router, { Route } from 'preact-router'
import { CmpChild } from '/types'
import { Header } from '/components'
import { ViewDay } from '/pages'
import { m } from '/vdom'
import { createHashHistory } from 'history'

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

export const Routes = () =>
  m(
    Router,
    {
      history: createHashHistory()
    },
    m(Route, {
      path: '/:day?',
      component: ({ day }: { day: string }) =>
        m(RouteComponent, { day }, m(ViewDay, { day: Number(day || 1) }))
    })
  )
