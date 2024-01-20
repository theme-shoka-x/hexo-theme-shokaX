import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

/*
{% links %}
- site: #main title
  owner: #alternate title for image tooltip (nullable)
  url: #link of site
  desc: #description (nullable)
  image: #icon image (nullable)
  color: #block color (nullable)
{% endlinks %}

{% linksfile [path] %}
*/

interface siteLink {
  site: string
  owner?: string
  url: string
  desc?: string
  image?: string
  color?: string
}

function linkGrid (args:string[], content:string) {
  const theme = hexo.theme.config as any

  if (!args[0] && !content) {
    return
  }

  if (args[0]) {
    const filepath = path.join(hexo.source_dir, args[0])
    if (fs.existsSync(filepath)) {
      content = fs.readFileSync(filepath, { encoding: 'utf-8' })
    }
  }

  if (!content) {
    return
  }

  const list = yaml.load(content) as Array<siteLink>

  let result = ''

  list.forEach((item) => {
    if (!item.url || !item.site) {
      return
    }

    let item_image = item.image || theme.assets + '/404.png'

    if (!item_image.startsWith('//') && !item_image.startsWith('http')) {
      item_image = theme.statics + item_image
    }

    item.color = item.color ? ` style="--block-color:${item.color};"` : ''

    result += `<div class="item" title="${item.owner || item.site}"${item.color}>`

    result += `<a href="${item.url}" class="image" data-background-image="${item_image}"></a>
        <div class="info">
        <a href="${item.url}" class="title">${item.site}</a>
        <p class="desc">${item.desc || item.url}</p>
        </div></div>`
  })

  return `<div class="links">${result}</div>`
}

hexo.extend.tag.register('links', linkGrid, { ends: true })
hexo.extend.tag.register('linksfile', linkGrid, { ends: false, async: true })
