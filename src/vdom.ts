import zaf from 'zaftig'
import { h } from 'preact'
import microh from 'microh'

const isDev = process.env.NODE_ENV === 'development'
zaf.setDebug(isDev)
export const z = zaf
export const m = microh(h)
export const newTab = { target: '_blank', rel: 'noopener noreferrer' }
