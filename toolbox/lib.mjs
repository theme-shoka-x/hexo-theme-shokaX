import fs from "fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import child_process from "child_process";

const execShell = promisify(child_process.exec)

let hexoRoot = path.join(import.meta.url, './../../../../').trim()
if (hexoRoot.startsWith('file:/')) {
  hexoRoot = hexoRoot.slice(5); // 去除 'file://'
} else if (hexoRoot.startsWith('file:\\')) {
  hexoRoot = hexoRoot.slice(8); // 去除 'file:\'
}

export async function hoistDeps() {
  const deps = JSON.parse(await fs.readFile(path.join(hexoRoot, 'package.json').trim(), 'utf-8')).dependencies
  const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
  console.log('Hoisting dependencies...')
  await execShell(`pnpm add ${depsList.join(' ')}`.trim())
}