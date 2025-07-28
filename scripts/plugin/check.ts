/* global hexo */

import * as fs from 'node:fs/promises'

let findSevereProblem = false
let findProblem = false

async function isPackageDeclared(packageName: string): Promise<boolean> {
  const pkg = JSON.parse(await fs.readFile('./package.json', 'utf-8'))
  return (
    (pkg.dependencies && pkg.dependencies[packageName]) ||
    (pkg.devDependencies && pkg.devDependencies[packageName])
  )
}

hexo.on('generateBefore', async function () {
  const theme = hexo.theme.config
  if (hexo.config.syntax_highlighter) {
    findSevereProblem = true
    findProblem = true
    hexo.log.error(`[SXEC 101] Highlight.js or Prismjs enabled. The code block will render incomplete.`)
  }
  if (!(await isPackageDeclared('shokax-uikit') && await isPackageDeclared('hexo-renderer-aether') && await isPackageDeclared('nyx-player'))) {
    findSevereProblem = true
    findProblem = true
    hexo.log.error(`[SXEC 102] Critical rendering plugins are missing or incorrectly configured. 
Some features will be disabled or render incorrectly.
You can install shokax-uikit, hexo-renderer-aether, and nyx-player to fix this issue.`)
  }
  if (parseInt(process.version.match(/\d{2,3}/)[0]) < 20) {
    findProblem = true
    hexo.log.error('[SXEC 103] Too old Node.js version, install the latest LTS version.')
  }
  if (await isPackageDeclared('hexo-renderer-multi-next-markdown-it')) {
    findSevereProblem = true
    findProblem = true
    hexo.log.error(`[SXEC 104] hexo-renderer-multi-next-markdown-it is not supported in ShokaX 0.5.2 and above, please use hexo-renderer-aether instead.`)
  }
  
  
  if (!hexo.config.title || !hexo.config.description || !hexo.config.language || !hexo.config.timezone || !hexo.config.url) {
    findProblem = true
    hexo.log.warn(`[SXEC 201] Essential information(title, desc, lang, etc.) config incorrectly, Page will render incorrectly.
Please check your _config.yml file.`)
  }
  if (!theme.modules.tabs && theme.modules.summary.enable) {
    findProblem = true
    hexo.log.warn(`[SXEC 202] Tabs module is disabled, but summary module is enabled. Summary will unable to be rendered correctly.
Please enable tabs module in theme config.`)
  }
})

hexo.on('generateAfter', function () {
  if (findSevereProblem) {
    hexo.log.error(`The environment check found some severe problems that absolutely will cause errors and crashes`)
    hexo.log.error(`ShokaX has stopped generating, please fix the problems above`)
    throw new Error('ShokaX Environment Check Failed, found severe problems. You can search error code in docs(For example, SXEC 101)')
  }

  if (findProblem) {
    hexo.log.warn(`The environment check found some problems that can lead to rendering errors, effect errors, 
performance degradation, not working correctly, etc`)
    hexo.log.warn('ShokaX has output them into console, read them to get more information. You can search error code in docs(For example, SXEC 101)')
  }
})
