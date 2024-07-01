/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.4.x
NEED PNPM INSTALLED
 */
import path from "node:path";
import { promisify } from "node:util";
import fs from 'fs/promises'
import child_process from 'child_process'

const CONFIG = {
  depsHoist: !(process.env.NO_DEPS_HOIST === 'true'),
  minify: false,
  legacyScript: true,
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
console.log('ShokaX ToolBox - Compiler')

const execShell = promisify(child_process.exec)

console.log('Start compiling...')

let hexoRoot = path.join(import.meta.url, './../../../../').trim()
if (hexoRoot.startsWith('file:/')) {
    hexoRoot = hexoRoot.slice(5); // 去除 'file://'
} else if (hexoRoot.startsWith('file:\\')) {
    hexoRoot = hexoRoot.slice(8); // 去除 'file:\'
}
if (CONFIG.legacyScript) {
    console.log('Simulating legacy script compiler...')
    let sPath = path.join(import.meta.url, './../../scripts/').trim()
    if (sPath.startsWith('file:/')) {
        sPath = sPath.slice(5); // 去除 'file://'
    } else if (sPath.startsWith('file:\\')) {
        sPath = sPath.slice(8); // 去除 'file:\'
    }
    child_process.exec('pnpm --package=typescript dlx tsc --build'.trim(), {
        cwd: sPath
    }, async (code, stdout, stderr) => {
        console.log('Deleting typescript files...')
        await deleteFileRecursive(sPath)
        console.log('Finished compiling.')
    })
} else {
    throw Error('Not implemented yet.')
}

if (CONFIG.depsHoist) {
    const deps = JSON.parse(await fs.readFile(path.join(hexoRoot,'package.json').trim(), 'utf-8')).dependencies
    const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
    console.log('Hoisting dependencies...')
    await execShell(`pnpm add ${depsList.join(' ')}`.trim())
    console.log('Finished hoisting dependencies.')
}

console.log('Done.')




