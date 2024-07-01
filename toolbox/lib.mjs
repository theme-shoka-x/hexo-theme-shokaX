import fs from "fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import child_process from "child_process";

const execShell = promisify(child_process.exec)

export async function hoistDeps() {
  const deps = JSON.parse(await fs.readFile(path.join(hexoRoot, 'package.json').trim(), 'utf-8')).dependencies
  const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
  console.log('Hoisting dependencies...')
  await execShell(`pnpm add ${depsList.join(' ')}`.trim())
}