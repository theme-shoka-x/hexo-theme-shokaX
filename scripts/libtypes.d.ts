import type Hexo from 'hexo'

export {}
declare global {
  interface themePlus {
    [index: string]: any
  }

  interface localsPlus {
    theme: themePlus
    [index: string]: any
  }
}

declare const hexo: Hexo
