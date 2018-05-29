import * as utils from './utils';
import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as logger from './logger';
import { IError, workspace } from 'workspace';

var pkg = require('../../package.json');

let config;

function exec(cmd: Promise<any>): void {
  cmd.catch(err => {
    fatal(err);
  });
}

function fatal(error: IError) {
  if (error.additionalInfo && (error.additionalInfo == 'ECONNREFUSED')) {
    console.log("Stamp not available");
    return;
  }    
  console.error(`  ${error.err}`);
  // if (error.additionalInfo) {
  //     console.error(`  ${error.additionalInfo}`);
  // }
  if (error && error.showHelp) {
    for (let cmd of program.commands) {
      if (cmd._name.startsWith(error.showHelp)) {
        cmd.help()
      }
      // console.log("CMD:", cmd);
    }
    program.help()
  } else {
    logger.dumpErrorLog(error.additionalInfo);
  }
}

module.exports = function (argv: string[]): void {
  program
    .version(pkg.version);

  program
    .command('init')
    .description('Initializes workspace')
    .action(() => { exec(workspace.init()) });

  program
    .command('bundle <path...>')
    .description('Creates a zip bundle including all elements pointed by <path...>')
    .action(paths => {
      exec(workspace.bundle(paths));
    });

  program
    .command('register <path...>')
    .description('Registers all elements pointed by <path...>. Paths must be pointing to a directory or bundle zip')
    .option('--stamp <stamp>', 'target stamp')
    .action((paths, { stamp }) => {
      // config = utils.startupCheck();
      let stampUrl = workspace.getStampUrl(stamp);
      workspace.checkStamp(stampUrl)
      .then( value => {
        exec(workspace.register(paths, stampUrl));
      });
    });

  program
    .command('info')
    .description('Gets information of requested operations e.g. -r deployments')
    .option('--stamp <stamp>', 'target stamp')
    .option('-r, --request <type>', 'type of requested information (right now only "deployments" is supported)')
    .action(({ stamp, request }) => {
      // config = utils.startupCheck();
      let stampUrl = workspace.getStampUrl(stamp);
      workspace.checkStamp(stampUrl)
      .then( value => {
        exec(workspace.info(request, stampUrl));
      });
    });

  program
    .command('deploy <path...>')
    .description('Deploys a registered element through deployement manifest. Path must be pointing to either json, deployment manifest directory or zip containing deployment manifest')
    .option('--stamp <stamp>', 'target stamp')
    .action((paths, { stamp }) => {
      // config = utils.startupCheck();
      let stampUrl = workspace.getStampUrl(stamp);     
      workspace.checkStamp(stampUrl)
      .then( value => {
        exec(workspace.deploy(paths, stampUrl));
      });
    });

  program
    .command('undeploy <uri...>')
    .description('Undeploys a deployed service')
    .option('--stamp <stamp>', 'target stamp')
    .action((uris, { stamp }) => {
      // config = utils.startupCheck();
      let stampUrl = workspace.getStampUrl(stamp);     
      workspace.checkStamp(stampUrl)
      .then( value => {
        exec(workspace.undeploy(uris, stampUrl));
      });
    });

  program
    .command('stamp', 'Manages the stamps registered in kaze. Subcommands: add, remove, switch');

  program
    .command('localstamp', 'Manages the computer Local Stamp. Subcommands: start, stop, restart, ssh');

  program
    .command('runtime', 'Manages the runtimes in the workspace. Subcommands: add, build');

  program
    .command('component', 'Manages the components in the workspace. Subcommands: add, install, build');

  program
    .command('service', 'Manages the services in the workspace. Subcommands: add');

  program
    .command('deployment', 'Manages the deployments in the workspace. Subcommands: add, deploy, scale');

  // program.parse(process.argv);

  // Checks if the stamp subcommand is valid or not.
  utils.executeProgram(program);

  // if (process.argv.length <= 2) {
  //   program.help()
  // }
}
