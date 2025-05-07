/* global hexo */
'use strict'

// @ts-ignore
import { readdir, readFile } from 'node:fs/promises'

hexo.extend.generator.register('images', async function (locals) {
  const theme = hexo.theme.config
  const dir = 'source/_data/' + theme.assets + '/'

  try {
    await readdir(dir)
  } catch (e) {
    return
  }

  const result = []
  const files = await readdir(dir)

  files.forEach(async (file) => {
    const fileContent = await readFile(dir + file)
    result.push({
      path: theme.assets + '/' + file,
      data: fileContent
    })
  })

  return result
})
