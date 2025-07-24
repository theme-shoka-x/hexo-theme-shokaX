/*
ShokaX ToolBox - Compiler
compatibility: ShokaX v0.5.x-dev
 */
import fs from 'fs/promises'
import { glob } from 'glob'
import { build } from 'esbuild'


console.log('ShokaX ToolBox - Compiler')
console.log('Start compiling...')

const entryPoints = await glob('./scripts/**/*.ts');
const jsons = await glob('./scripts/**/*.json');

console.log('RUN THIS SCRIPT IN YOUR SHOKAX THEME ROOT DIRECTORY!')
console.log('Using esbuild compiler...')

await build({
    entryPoints: entryPoints,
    bundle: false,
    format: 'cjs',
    target: ['esnext'],
    platform: 'node',
    loader: { '.ts': 'ts' },
    outdir: 'scripts'
})

console.log('deleting ts and json files...')

await Promise.all(
    entryPoints.map(async (entry) => {
        await fs.unlink(entry)
    })
)

await Promise.all(
    jsons.map(async (entry)=>{
        await fs.unlink(entry)
    })
)

console.log('Finished compiling.')

console.log('Done.')




