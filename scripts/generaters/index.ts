// @ts-nocheck
/* global hexo */
'use strict'

import fs = require('hexo-fs')
import pagination from 'hexo-pagination'

hexo.config.index_generator = Object.assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  order_by: '-date'
}, hexo.config.index_generator)

hexo.extend.generator.register('index', function (locals) {
  const covers = []
  const catlist = []
  let pages
  const config = hexo.config
  const sticky = locals.posts.find({ sticky: true }).sort(config.index_generator.order_by)
  const posts = locals.posts.find({ sticky: {$in: [false, undefined]} }).sort(config.index_generator.order_by)
  const paginationDir = config.pagination_dir || 'page'
  const path = config.index_generator.path || ''
  const categories = locals.categories

  const getTopcat = function (cat) {
    if (cat.parent) {
      const pCat = categories.findOne({ _id: cat.parent })
      return getTopcat(pCat)
    } else {
      return cat
    }
  }

  if (categories && categories.length) {
    categories.forEach((cat) => {
      const cover = `source/_posts/${cat.slug}`
      if (fs.existsSync(cover + '/cover.avif')) {
        covers.push({
          path: cat.slug + '/cover.avif',
          data: function () {
            return fs.createReadStream(cover + '/cover.avif')
          }
        })
      } else if (fs.existsSync(cover + '/cover.webp')) {
        covers.push({
          path: cat.slug + '/cover.webp',
          data: function () {
            return fs.createReadStream(cover + '/cover.webp')
          }
        })
      } else if (fs.existsSync(cover + '/cover.jpg')) {
        covers.push({
          path: cat.slug + '/cover.jpg',
          data: function () {
            return fs.createReadStream(cover + '/cover.jpg')
          }
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
    })
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
