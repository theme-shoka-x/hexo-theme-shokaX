import type TemplateLocals from 'hexo'
import type { Theme } from 'hexo'

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
