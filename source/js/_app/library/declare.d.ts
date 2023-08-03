/*
对注释的说明: 部分注释为openai-chatgpt生成的注释,可能存在描述或语义的问题
 */
interface AudioItem {
  title: string;
  list: string[];
}

declare interface EventTarget {
  createChild(tag: string, obj: Object, positon?: string): HTMLElement;
  wrapObject(obj: Object): void;
  changeOrGetHeight(h: number | string): void;
  changeOrGetHeight(): number;
  changeOrGetWidth(w: number | string): void;
  changeOrGetWidth(): number;
  getTop(): number;
  left(): number;
  attr(type: string, value: string): EventTarget;
  attr(type: string):string
  attr(type:string, value:null):void
  insertAfter(element: HTMLElement): void;
  display(d: string): EventTarget;
  display():string
  child(selector: string): HTMLElement;
  find(selector: string): NodeListOf<HTMLElement>;
  _class(type: string, className: string, display?: boolean): void;
  addClass(className: string): EventTarget;
  removeClass(className: string): EventTarget;
  toggleClass(className: string, display?: boolean): EventTarget;
  hasClass(className: string): boolean;
}

declare const LOCAL: {
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
declare const CONFIG: {
  hostname: string;
  fireworks: string[];
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
  noPlayer: boolean // TODO 添加
}
declare const instantsearch: any

declare function algoliasearch(appID: string, apiKey: string): any;

declare const quicklink: any
