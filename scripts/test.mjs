import { spawn } from 'child_process';

const args = process.argv.slice(2);

const testProcess = spawn('node', [
  '--no-warnings',
  '--experimental-vm-modules',
  'scripts/runTests.mjs',
  ...args
], {
  stdio: 'inherit',
  shell: true,
});