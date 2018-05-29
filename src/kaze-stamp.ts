import * as program from 'commander';
import { executeProgram } from './utils';
import { workspace } from 'workspace';

let config = workspace.startupCheck();
var pkg = require('../../package.json');

program
  .version(pkg.version)

program
  .command('add <id> <url>')
  .description('Add stamp with <id> and <url> to kazeConfig.json')
  .option('-d, --default')
  .option('-f, --force')
  .action((id, url, opts) => {
    workspace.stamp.add(id, url, opts.default, opts.force, config);
  });

program
  .command('rm <id>')
  .description('Remove stamp with <id> from kazeConfig.json')
  .action(id => {
    workspace.stamp.remove(id, config);
  });

program
  .command('switch <id>')
  .description('Switch working stamp to stamp with <id>')
  .action(id => {
    workspace.stamp.switch(id, config);
  });

// program
//   .command('*')
//   .action(() => {
//     program.help();
//   });

// Checks if the stamp subcommand is valid or not.
executeProgram(program);

// program.parse(process.argv);