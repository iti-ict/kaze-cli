import * as program from 'commander';
import { executeProgram } from './utils';
import { spawn } from 'child_process';
import { workspace } from 'workspace';

var pkg = require('../../package.json');

program
  .version(pkg.version)
  
program
  .command('start')
  .description('Starts Local Stamp')
  .action(() => {
    workspace.localStamp.start();
  });

program
  .command('stop')
  .description('Stops Local Stamp')
  .action(() => {
    workspace.localStamp.stop();
  });

program
  .command('restart')
  .description('Restarts Local Stamp')
  .action(() => {
    workspace.localStamp.restart();
  });

program
  .command('ssh')
  .description('Opens an ssh session in Local Stamp')
  .action(() => {
    workspace.localStamp.ssh();
  });

program
  .command('status')
  .description('Shows detalied information about Local Stamp status')
  .action(() => {
    workspace.localStamp.status();
  });

// Checks if the stamp subcommand is valid or not.
executeProgram(program);