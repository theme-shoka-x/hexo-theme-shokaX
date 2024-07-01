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
    const deps = JSON.parse(await fs.readFile(path.join(hexoRoot, 'package.json').trim(), 'utf-8')).dependencies
    const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
    await execShell(`${pm} ${depsList.join(' ')}`.trim())
  } catch (e) {
    console.log('Skipping hoisting dependencies.')
  }
}