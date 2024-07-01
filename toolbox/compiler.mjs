/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.4.x
 */
import path from "node:path";
import { promisify } from "node:util";
import fs from 'fs/promises'
import child_process from 'child_process'

const CONFIG = {
  depsHoist: !(process.env.NO_DEPS_HOIST === 'true'),
  minify: false,
  legacyScript: true,
  pm: 'pnpm add' // or yarn add / npm install
}

async function deleteFileRecursive(dir) {
  const files = await fs.readdir(dir)
  for (const f of files) {
      const fullPath = path.join(dir, f)
      const stat = await fs.lstat(fullPath)
      if (stat.isDirectory()) {
        await deleteFileRecursive(fullPath)
      } else {
        const fileExt = path.extname(f)
        if (fileExt === '.ts' || fileExt === '.json' || fileExt === '.tsbuildinfo') {
          await fs.unlink(fullPath)
        }
      }
  }
}

const execShell = promisify(child_process.exec)

console.log('ShokaX ToolBox - Compiler')
console.log('Installing compiler dependencies...')

await execShell(`${CONFIG.pm} typescript esbuild -g`)

console.log('Start compiling...')

let hexoRoot = path.join(import.meta.url, './../../')
if (hexoRoot.startsWith('file://')) {
    hexoRoot = hexoRoot.slice(9); // 去除 'file://'
} else if (hexoRoot.startsWith('file:\\')) {
    hexoRoot = hexoRoot.slice(8); // 去除 'file:\'
}
if (CONFIG.legacyScript) {
    console.log('Simulating legacy script compiler...')
    const sPath = path.join(hexoRoot, 'scripts/')
    await execShell(`cd ${sPath} && tsc --build`)
    console.log('Deleting typescript files...')
    await deleteFileRecursive(sPath)
    console.log('Finished compiling.')
} else {
    throw Error('Not implemented yet.')
}

if (CONFIG.depsHoist) {
    const deps = JSON.parse(await fs.readFile(path.join(hexoRoot,'package.json'), 'utf-8')).dependencies
    const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
    console.log('Hoisting dependencies...')
    await execShell(`${CONFIG.pm} ${depsList.join(' ')}`)
    console.log('Finished hoisting dependencies.')
}

console.log('Done.')




