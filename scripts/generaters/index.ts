// @ts-nocheck
/* global hexo */
'use strict'

import { readFile } from 'node:fs/promises'
import pagination from 'hexo-pagination'

function getFileExtension(path) {
  const filename = path.split(/[\\/]/).pop() || ''; // 处理路径分隔符并获取文件名
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.slice(lastDotIndex + 1) : '';
}

hexo.config.index_generator = Object.assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  order_by: '-date'
}, hexo.config.index_generator)

hexo.extend.helper.register('getCoverExt', function (path:string) {
  const theme = hexo.theme.config
  if (theme.homeConfig.cateCards.length > 0) {
    const cardMap = new Map<string, string>()
    theme.homeConfig.cateCards.forEach((card) => {
      cardMap.set(card.slug, card.cover)
    })

    if (cardMap.has(path)) {
      const cover = cardMap.get(path)
      return getFileExtension(cover)
    }
  }
})


hexo.extend.generator.register('index',async function (locals) {
  const covers = []
  const catlist = []
  let pages
  const config = hexo.config
  const sticky = locals.posts.find({ sticky: true }).sort(config.index_generator.order_by)
  const posts = locals.posts.find({ sticky: {$in: [false, undefined]} }).sort(config.index_generator.order_by)
  const paginationDir = config.pagination_dir || 'page'
  const path = config.index_generator.path || ''
  const categories = locals.categories
  const theme = hexo.theme.config

  const getTopcat = function (cat) {
    if (cat.parent) {
      const pCat = categories.findOne({ _id: cat.parent })
      return getTopcat(pCat)
    } else {
      return cat
    }
  }

  if (categories && categories.length) {
    await Promise.all(
      categories.map(async (cat) => {
        const cover = `source/_posts/${cat.slug}`
        if (theme.homeConfig.cateCards.length > 0) {
          const cardMap = new Map<string, string>()
          theme.homeConfig.cateCards.forEach((card) => {
            cardMap.set(card.slug, card.cover)
          })

          if (cardMap.has(cat.slug)) {
            const cover = cardMap.get(cat.slug)
            const coverData = await readFile(`source/_posts/${cover}`)
            covers.push({
              path: `${cat.slug}/cover.${getFileExtension(cover)}`,
              data: coverData
            })

            const topcat = getTopcat(cat)

            if (topcat._id !== cat._id) {
              cat.top = topcat
            }

            const child = categories.find({ parent: cat._id })
            let pl = 6

            if (child.length !== 0) {
              cat.child = child.length
              cat.subs = child.sort({ name: 1 }).limit(6).toArray()
              pl = Math.max(0, pl - child.length)
              if (pl > 0) {
                cat.subs.push(...cat.posts.sort({ title: 1 })
                  .filter(function (item, i) { return item.categories.last()._id === cat._id })
                  .limit(pl).toArray())
              }
            } else {
              cat.subs = cat.posts.sort({ title: 1 }).limit(6).toArray()
            }

            catlist.push(cat)
          }
        }
      })
    )
  }

  if (posts.length > 0) {
    pages = pagination(path, posts, {
      perPage: config.index_generator.per_page,
      layout: ['index', 'archive'],
      format: paginationDir + '/%d/',
      data: {
        __index: true,
        catlist,
        sticky
      }
    })
  } else {
    pages = [{
      path,
      layout: ['index', 'archive'],
      data: {
        __index: true,
        catlist,
        sticky,
        current: 1,
      }
    }]
  }

  return [...covers, ...pages]
})
