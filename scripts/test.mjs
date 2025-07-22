import { spawn } from 'child_process';

const testProcess = spawn('node', [
  '--no-warnings',
  '--experimental-vm-modules',
  'scripts/runTests.mjs',
], {
  stdio: 'inherit',
  shell: true,
});