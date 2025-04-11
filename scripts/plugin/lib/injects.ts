/*!
  inject.js in next-theme/hexo-theme-next by next-theme
  under GNU AFFERO GENERAL PUBLIC LICENSE v3.0 OR LATER
  https://github.com/next-theme/hexo-theme-next/blob/master/LICENSE.md
 */
  import fs from 'node:fs'
  import path from 'node:path'
  import points from './injects-point'
  import type Hexo from "hexo";
  const defaultExtname = '.pug'
  
  interface viewConfig {
    layout: string,
    locals: object,
    options: object,
    order: number
  }
  class StylusInject {
    files: Array<string>
    base_dir: string
    constructor (base_dir:string) {
      this.base_dir = base_dir
      this.files = []
    }
  
    push (file:string) {
      this.files.push(path.resolve(this.base_dir, file))
    }
  }
  
  class ViewInject {
    base_dir:string
    raws: Array<object>
    constructor (base_dir:string) {
      this.base_dir = base_dir
      this.raws = []
    }
  
    raw (name:string, raw:string, ...args) {
      if (path.extname(name) === '') {
        name += defaultExtname
      }
      this.raws.push({ name, raw, args })
    }
  
    file (name:string, file:string, ...args) {
      if (path.extname(name) === '') {
        name += path.extname(file)
      }
      this.raw(name, fs.readFileSync(path.resolve(this.base_dir, file), 'utf8'), ...args)
    }
  }
  
  function initInject (base_dir:string) {
    const injects = {}
    points.styles.forEach(item => {
      injects[item] = new StylusInject(base_dir)
    })
    points.views.forEach(item => {
      injects[item] = new ViewInject(base_dir)
    })
    return injects
  }
  
  export default (hexo:Hexo) => {
    const injects = initInject(hexo.base_dir)
    hexo.execFilterSync('theme_inject', injects)
    hexo.theme.config.injects = {}
  
    points.styles.forEach(type => {
      hexo.theme.config.injects[type] = injects[type].files
    })
  
    points.views.forEach(type => {
      const configs = Object.create(null)
      hexo.theme.config.injects[type] = []
      injects[type].raws.forEach((injectObj, index) => {
        const name = `inject/${type}/${injectObj.name}`
        hexo.theme.setView(name, injectObj.raw)
        configs[name] = {
          layout: name,
          locals: injectObj.args[0],
          options: injectObj.args[1],
          order: injectObj.args[2] || index
        }
      })
      hexo.theme.config.injects[type] = Object.values(configs)
        .sort((x:viewConfig, y:viewConfig) => x.order - y.order)
    })
  }