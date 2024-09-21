/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.4.x
 */
import path from "node:path";
import fs from 'fs/promises'
import child_process from 'child_process'
import { buildSync } from 'esbuild'
import { glob } from 'glob'

const CONFIG = {
  legacyScript: false,
}

console.log('ShokaX ToolBox - Compiler')
console.log('Start compiling...')

const entryPoints = await glob('./scripts/**/*.ts');
const jsons = await glob('./scripts/**/*.json');

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
            for (const entry of entryPoints) {
                await fs.unlink(entry)
            }
            for (const entry of jsons) {
                await fs.unlink(entry)
            }
            console.log('Finished compiling.')
        })
    })
} else {
    console.log('RUN THIS SCRIPT IN YOUR SHOKAX THEME ROOT DIRECTORY!')
    console.log('Using esbuild compiler...')
    buildSync({
        entryPoints: entryPoints,
        outdir: 'scripts',
        bundle: false,
        format: 'cjs',
        target: ['esnext'],
        platform: 'node',
        loader: { '.ts': 'ts' },
    })
    entryPoints.forEach(async (entry) => {
        await fs.unlink(entry)
    })
    jsons.forEach(async (entry)=>{
        await fs.unlink(entry)
    })
    console.log('Finished compiling.')
}

console.log('Done.')




