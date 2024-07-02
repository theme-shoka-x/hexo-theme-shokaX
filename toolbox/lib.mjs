import fs from "fs/promises";
import child_process from "child_process";
import { dirname, resolve, join } from 'path';

async function findScaffoldsDir(startPath) {
  let currentPath = resolve(startPath);

  while (currentPath !== dirname(currentPath)) {
    const scaffoldsPath = resolve(currentPath, 'scaffolds');

    try {
      const stat = await fs.stat(scaffoldsPath);
      if (stat.isDirectory()) {
        return currentPath;
      }
    } catch (err) {
      // If the error is because the file/directory does not exist, continue to the parent directory
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    currentPath = dirname(currentPath);
  }

  return null;
}

const hexoRoot = await findScaffoldsDir(process.cwd())

async function checkFileAccessible(file) {
  try {
    await fs.access(join((hexoRoot || ''),file))
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
  console.log(`Using ${pm} to hoist dependencies.`)
  // TODO 使用本地 package.json 解析
  const res = await (await fetch('https://registry.npmmirror.com/hexo-theme-shokax')).json()
  const latestV = res['dist-tags'].latest
  const deps = res.versions[latestV].dependencies
  const depsList = Object.keys(deps).map(d => `${d}@${deps[d]}`)
  child_process.exec(`${pm} ${depsList.join(' ')}`.trim(), {
    cwd: hexoRoot
  }, (code, stdout, stderr) => {
    if (stderr) {
      console.error(stderr)
    } else {
      console.log(stdout)
    }
  })
}