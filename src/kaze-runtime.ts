import * as program from 'commander';
import { executeProgram, question, checkNotUndefinedOrEmpty } from './utils';
import { spawn } from 'child_process';
import * as read from 'read';
import * as chalk from 'chalk';
import { workspace, RuntimeConfig } from 'workspace';

var kazeConfig = workspace.readConfigFile();
var pkg = require('../../package.json');

function printError(errorMessage: string) {
  console.error(chalk.red('\n * ERROR: '), chalk.yellow(errorMessage));
}

program
  .version(pkg.version)
 
program
  .command('add')
  .description('Starts Local Stamp')
  // .option('-d, --domain <domain>', 'Domain of the new runtime')
  // .option('-n, --name <name>', 'Name of the new runtime')
  // .option('-p, --parent <parent>', 'Parent of the new runtime') 
  // .option('-f, --folder <folder>', 'Folder were the component will be deployed for this runtime')
  // .option('-e, --entrypoint <entrypoint>', 'Entrypoint for this runtime')
  // .action((domain, name, parent, folder, entrypoint) => {
  .action(() => {
    let config:RuntimeConfig = {
      name: null,
      domain: null
    };

    let template:string = null;

    // Get default values for the runtime parameters. Default values are stored in kazeConfig.json
    let defaultDomain = kazeConfig.domain ? kazeConfig.domain : 'default.com';
    let defaultParent = (kazeConfig.runtime && kazeConfig.runtime.parent) ? kazeConfig.runtime.parent : 'eslap://eslap.cloud/runtime/native/1_1_1';
    let defaultFolder = (kazeConfig.runtime && kazeConfig.runtime.folder) ? kazeConfig.runtime.folder : '/eslap/component';
    let defaultEntrypoint = (kazeConfig.runtime && kazeConfig.runtime.entrypoint) ? kazeConfig.runtime.entrypoint : '/eslap/runtime-agent/scripts/start-runtime-agent.sh';
    
    // For each parameter, ask the user for its value providing the default
    // value. The only parameter without default value is the name. Recall that
    // the real name for the runtime will be:
    // 
    //    eslap://<DOMAIN>/runtime/<NAME>/1_0_0_0
    //
    // TODO: allow assigning values to parameters using command line options.
    question({ prompt: 'Runtime domain?', default: defaultDomain })
    .then((value:string) => {
      checkNotUndefinedOrEmpty(value, 'Domain not defined');
      config.domain = value;
      return question({ prompt: 'Runtime name?' })
    })
    .then((value:string) => {
      checkNotUndefinedOrEmpty(value, 'Name not defined');
      config.name = value;
      return question({ prompt: 'Parent runtime?', default: defaultParent })
    })
    .then((value:string) => {
      if (value && (value.length > 0)) {
        template = 'extended';
        config.parent = value;
      } else {
        template = 'basic';        
      }
      return question({ prompt: 'Component folder?', default: defaultFolder })
    })
    .then((value:string) => {
      checkNotUndefinedOrEmpty(value, 'Component not defined');
      config.componentFolder = value;
      return question({ prompt: 'Component entrypoint?', default: defaultEntrypoint })
    })
    .then((value) => {
      checkNotUndefinedOrEmpty(value, 'Entrypoint not defined');
      config.entrypoint = value;
      return workspace.runtime.add(template, config);
    })
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    });
  });

program
  .command('build')
  .description('Generates a ready-to-register runtime bundle. The bundle will be stored in dist/bundle.zip in the runtime folder')
  // .option('-n, --name <runtime-name>', 'The name of the runtime to be bundled')
  // .action(({name}) => {
  .action(() => {
    let defaultDomain = kazeConfig.domain ? kazeConfig.domain : 'default.com';
    let config:RuntimeConfig = {
      name: null,
      domain: null
    };

    question({ prompt: 'Runtime domain?', default: defaultDomain })
    .then((value:string) => {
      checkNotUndefinedOrEmpty(value, 'Domain not defined');
      config.domain = value;
      return question({ prompt: 'Runtime name?' })
    })
    .then((value:string) => {
      checkNotUndefinedOrEmpty(value, 'Name not defined');
      config.name = value;
      return workspace.runtime.build(config);
    })
    .catch((error) => {
      printError(`kaze failed creating the runtime: ${error}`);
      program.help()
      process.exit(1);
    });
  });

executeProgram(program);
  
