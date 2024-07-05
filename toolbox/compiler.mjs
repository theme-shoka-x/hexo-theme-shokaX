/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.4.x
 */
import path from "node:path";
import fs from 'fs/promises'
import child_process from 'child_process'

const CONFIG = {
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
    child_process.exec('npm install',{
        cwd: path.join(sPath,'./../')
    }, (code, stdout, stderr) => {
        child_process.exec('"yes" | npx -p typescript tsc --build'.trim(), {
            cwd: sPath
        }, async (code, stdout, stderr) => {
            console.log('Deleting typescript files...')
            await deleteFileRecursive(sPath)
            console.log('Finished compiling.')
        })
    })
} else {
    throw Error('Not implemented yet.')
}

console.log('Done.')




