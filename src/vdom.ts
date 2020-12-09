import zaf from 'zaftig'
import { h } from 'preact'
import microh from 'microh'

const isDev = process.env.NODE_ENV === 'development'
zaf.setDebug(isDev)
export const z = zaf
export const m = microh(h)
export const href = (url: string) => (isDev ? url : 'advent-of-code-2020' + url)
