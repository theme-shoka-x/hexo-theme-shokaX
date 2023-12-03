// eslint-disable-next-line import/no-duplicates
import type TemplateLocals from 'hexo'
import type { Theme } from 'hexo'
// eslint-disable-next-line import/no-duplicates
import type Hexo from 'hexo'

export {}
declare global {
  interface themePlus extends Theme {
    [index: string]: any
  }

  interface localsPlus extends TemplateLocals {
    theme: themePlus
    [index: string]: any
  }
}

declare const hexo: Hexo
