import { runCLI } from 'jest';
import chalk from 'chalk';

console.log('🔍 Running Tests...\n');

const args = process.argv.slice(2);

const { results } = await runCLI(
  {
    config: './jest.config.mjs',
    runInBand: true,
    silent: false,
    detectOpenHandles: true,
    _: args,
  },
  [process.cwd()]
);

let passed = 0;
let failed = 0;
let skipped = 0;

results.testResults.forEach((suite) => {
  suite.testResults.forEach((test) => {
    const testGroup = test.ancestorTitles[0] || 'Unnamed';

    if (test.status === 'passed') {
      passed++;
      console.log(`\n${chalk.green('✅')} '${testGroup}' → ${test.title}`);
    } else if (test.status === 'failed') {
      failed++;
      console.log(`\n${chalk.red('❌')} '${testGroup}' → ${test.title}`);
    } else if (test.status === 'skipped' || test.status === 'pending') {
      skipped++;
      //console.log(`\n${chalk.yellow('⚠ Skipped')} '${testGroup}' → ${test.title}`);
    }
  });
});

console.log('\nSummary:');
console.log(`${chalk.green('✔ Passed')}: ${chalk.green(passed)}`);
console.log(`${chalk.red('✘ Failed')}: ${chalk.red(failed)}`);
console.log(`${chalk.yellow('⚠ Skipped')}: ${chalk.yellow(skipped)}`);
console.log(`⏱ Total Time: ${results.startTime ? ((Date.now() - results.startTime) / 1000).toFixed(1) : '-'}s\n`);
console.log();

if (failed > 0) {
  process.exit(1); 
}