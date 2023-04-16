/* global hexo */
'use strict'

// @ts-ignore
import fs = require('hexo-fs')

hexo.extend.generator.register('images', function (locals) {
  const theme = hexo.theme.config
  const dir = 'source/_data/' + theme.assets + '/'

  if (!fs.existsSync(dir)) { return }

  const result = []
  const files = fs.listDirSync(dir) as string[]

  files.forEach((file) => {
    result.push({
      path: theme.assets + '/' + file,
      data: function () {
        return fs.createReadStream(dir + file)
      }
    })
  })

  return result
})
