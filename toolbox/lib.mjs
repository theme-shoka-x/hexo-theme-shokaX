import fs from "fs/promises";
import path from "node:path";
import child_process from "child_process";

let hexoRoot = path.join(import.meta.url, './../../../../').trim()
if (hexoRoot.startsWith('file:/')) {
  hexoRoot = hexoRoot.slice(5); // 去除 'file://'
} else if (hexoRoot.startsWith('file:\\')) {
  hexoRoot = hexoRoot.slice(8); // 去除 'file:\'
}

async function checkFileAccessible(file) {
  try {
    await fs.access(file)
  } catch {
    return false
  }
  return true
}

export async function hoistDeps() {
  let pm
  if (await checkFileAccessible('pnpm-lock.yml') || await checkFileAccessible('pnpm-lock.yaml') || await checkFileAccessible('enable_pnpm')) {
    pm = "pnpm add"
  } else if (await checkFileAccessible('yarn.lock') || await checkFileAccessible('.yarnrc.yml')) {
    pm = "yarn add"
  } else {
    pm = "npm install"
  }
  try {
    // TODO 使用本地 package.json 解析
    const res = await (await fetch('https://registry.npmmirror.com/hexo-theme-shokax')).json()
    const latestV = res['dist-tags'].latest
    const deps = res.versions[latestV].dependencies
    const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
    child_process.exec(`${pm} ${depsList.join(' ')}`.trim(), {
      cwd: hexoRoot
    }, (code, stdout, stderr) => {

    })
  } catch (e) {
    throw e
    // console.log('Skipping hoisting dependencies.')
  }
}