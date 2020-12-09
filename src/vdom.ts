import zaf from 'zaftig'
import { h } from 'preact'
import microh from 'microh'

zaf.setDebug(process.env.NODE_ENV === 'development')
export const z = zaf
export const m = microh(h)
