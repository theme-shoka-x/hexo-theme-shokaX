type vendorUrl = {
  url: string
  local: boolean
  sri?: string
}

interface AudioItem {
  title: string;
  list: string[];
}

declare interface EventTarget {
  changeOrGetHeight(h: number | string): void;
  changeOrGetHeight(): number;
  changeOrGetWidth(w: number | string): void;
  changeOrGetWidth(): number;
  getTop(): number;
  left(): number;
  insertAfter(element: HTMLElement): void;
  display(d: string): EventTarget;
  display():string
  find(selector: string): NodeListOf<HTMLElement>;
  _class(type: string, className: string, display?: boolean): void;
  addClass(className: string): EventTarget;
  removeClass(className: string): EventTarget;
  toggleClass(className: string, display?: boolean): EventTarget;
  hasClass(className: string): boolean;
}

type walineMeta = 'nick'|'mail'|'link'

declare const LOCAL: {
  ispost: boolean;
  path: string;
  ignores: Array<(uri:string)=>boolean>;
  audio: string[];
  search: {
    placeholder: string,
    empty: string,
    stats: string
  };
  quiz: {
    choice: string,
    multiple: string,
    true_false: string,
    essay: string,
    gap_fill: string,
    mistake: string
  };
  nocopy: boolean;
  copyright: string;
  outime: boolean
  template: string
  favicon: {
    hide: string
    show: string
  }
}
interface configType {
  hostname: string;
  fireworks: any;
  audio: AudioItem[];
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
    copy_tex: vendorUrl
    fancybox: vendorUrl
  }
  css: {
    valine: vendorUrl
    katex: vendorUrl
    mermaid: vendorUrl
    fancybox: vendorUrl
  }
  search: any,
  waline: {
    serverURL: string
    lang: string
    locale: object
    emoji: boolean
    meta: walineMeta[]
    requiredMeta: walineMeta[]
    wordLimit: number
    pageSize: number
    pageview: boolean
  }
  twikoo: {
    envId: string
    region: string
  }
  walinePageView: boolean
  quicklink: {
    ignores: any
    timeout: number
    priority: boolean
  }
  playerAPI: string
}
// esbuild 静态常量
declare const __shokax_player__:boolean
declare const __shokax_fireworks__:boolean
declare const __shokax_search__:boolean
declare const __shokax_VL__:boolean
declare const __shokax_outime__:boolean
declare const __shokax_tabs__: boolean
declare const __shokax_quiz__: boolean
declare const __shokax_fancybox__: boolean
declare const __shokax_waline__:boolean
declare const __shokax_twikoo__:boolean
declare const shokax_CONFIG:configType
declare const shokax_siteURL:string
