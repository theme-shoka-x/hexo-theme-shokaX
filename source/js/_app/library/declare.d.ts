/*
对注释的说明: 部分注释为openai-chatgpt生成的注释,可能存在描述或语义的问题
 */

declare interface EventTarget {
  createChild(tag: string, obj: Object, positon?: string): HTMLElement;
  wrapObject(obj: Object): void;
  changeOrGetHeight(h?: number | string): number;
  changeOrGetWidth(w?: number | string): number;
  getTop(): number;
  left(): number;
  attr(type: string, value: string): EventTarget;
  attr(type: string):string
  attr(type:string, value:null):void
  insertAfter(element: HTMLElement): void;
  display(d?: string): string | EventTarget;
  child(selector: string): HTMLElement;
  find(selector: string): NodeListOf<HTMLElement>;
  _class(type: string, className: string, display?: boolean): void;
  addClass(className: string): any;
  removeClass(className: string): any;
  toggleClass(className: string, display?: boolean): any;
  hasClass(className: string): boolean;
}

declare const LOCAL: {
  path: string;
  ignores: any;
  audio: any;
  search: any;
  quiz: any;
  nocopy: boolean;
  copyright: string;
  outime: any
  template: string
  favicon: {
    hide: string
    show: string
  }
}
declare const CONFIG: {
  hostname: string;
  fireworks: any;
  audio: any;
  version: number
  root: string
  statics: string
  outime: {
    enable: boolean
    days: number
  }
  favicon: {
    normal: string,
    hidden: string
  }
  darkmode: boolean
  auto_dark: {
    enable: boolean
    start: number
    end: number
  }
  auto_scroll: boolean
  loader: {
    start: boolean
    switch: boolean
  }
  js: {
    chart: string
    copy_tex: string
    fancybox: string
    echarts: string
  }
  css: {
    valine: string
    katex: string
    mermaid: string
    fancybox: string
  }
  search: any,
  valine: string
  quicklink: {
    ignores: any
    timeout: number
    priority: string
  }
  playerAPI: string
  disableVL: boolean
}

declare const algoliasearch: any, quicklink: any, instantsearch: any
