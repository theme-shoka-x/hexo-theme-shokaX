import fs from 'node:fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const currentVersion = packageJson.version;

const shortHash = execSync('git rev-parse --short HEAD').toString().trim();

const newVersion = `${currentVersion}-dev-${shortHash}`;

packageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 4));

console.log(`Updated package version to ${newVersion}`);
