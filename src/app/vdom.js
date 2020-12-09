import zaf from 'zaftig'
import { h } from 'preact'
import microh from 'microh'
/** @type {<T extends function>(tag: T, props: Parameters<T>['0']) => ReturnType<typeof h>} */
export const m = microh(h)
zaf.setDebug(process.env.NODE_ENV === 'development')
export const z = zaf
