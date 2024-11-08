/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.5.x-dev
 */
import fs from 'fs/promises'
import { buildSync } from 'esbuild'
import { glob } from 'glob'

const CONFIG = {

}

console.log('ShokaX ToolBox - Compiler')
console.log('Start compiling...')

const entryPoints = await glob('./scripts/**/*.ts');
const jsons = await glob('./scripts/**/*.json');

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

console.log('Done.')




