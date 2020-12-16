import zaf from 'zaftig'
import { h } from 'preact'
import microh from 'microh'

const isDev = process.env.NODE_ENV === 'development'
zaf.setDebug(isDev)
export const z = zaf
z.global`
  @font-face {
    font-family 'Source Code Pro'
    font-style normal
    font-weight 400
    src url('https://adobe-fonts.github.io/source-code-pro/WOFF2/TTF/SourceCodePro-Regular.ttf.woff2') format('woff2')
  }
`
export const m = microh(h)
export const newTab = { target: '_blank', rel: 'noopener noreferrer' }
