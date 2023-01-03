/* global hexo */
'use strict'

/** @type {Map<string, string[]>} */
const insertions = new Map()
class TemplateBlock {
  constructor (text, type = 'raw') {
    this.text = text
    this.type = type
    this.result = ''
  }

  render () {
    if (this.type === 'raw' || this.type === 'html') {
      this.result = this.text
    }
    this.result = hexo.render.renderSync({ text: this.text, engine: this.type })
  }

  repalceTag (...tag) {
    tag.forEach((item) => {
      this.text = this.text.replace(item.tag, item.value)
    })
  }

  insert (location) {
    if (insertions.get(location)) {
      insertions.get(location).push(this.result)
    } else {
      insertions.set(location, [])
    }
  }
}

const toolpack = {
  TemplateBlock
}

hexo.extend.helper.register('insert_footer', () => {
  if (hexo.theme.config?.plugin?.enable && insertions.get('footer')) {
    let res = ''
    insertions.get('footer').forEach((item) => {
      res += item
    })
    return res
  }
})

if (hexo.theme.config?.plugin?.enable) {
  hexo.theme.config.plugin.load.forEach((item) => {
    const p = require(item)
    console.log(item)
    console.log(p)
    if (p.prepare) {
      p.prepare(hexo, this)
    }
    p.main(hexo, this, toolpack)
  })
}
