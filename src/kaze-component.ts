import * as program from 'commander';
import { executeProgram, question, checkNotUndefinedOrEmpty } from './utils';
import { spawn } from 'child_process';
import * as read from 'read';
import * as chalk from 'chalk';
import { workspace, ComponentConfig } from 'workspace';

var kazeConfig = workspace.readConfigFile();
var pkg = require('../../package.json');

function printError(errorMessage: string) {
  console.error(chalk.red('\n * ERROR: '), chalk.yellow(errorMessage));
}

program
  .version(pkg.version)
 
program
  .command('add')
  .description('Adds a new component')
  .action(() => {
    let config:ComponentConfig;

    // Get default values for the component parameters. Default values are stored in kazeConfig.json
    let defaultTemplate = (kazeConfig.component && kazeConfig.component.template) ? kazeConfig.component.template : 'typescript';
    
    getComponentConfig()
    .then((cfg:ComponentConfig) => {
      config = cfg;
      return question({ prompt: 'Template?', default: defaultTemplate })
    })
    .then((value:string) => {
      return workspace.component.add(value, config);
    })
    .then((value) => {
      console.log(`New component added to ${value}`);
    })
    .catch((error) => {
      console.log(error);
    });
  });

program
  .command('install')
  .description('Installs a component dependencies and compiles (if needed)')
  .action(() => {

    getComponentConfig()
    .then((config:ComponentConfig) => {
      return workspace.component.install(config);
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
  .description('Builds a distributable version of the component')
  .action(() => {

    getComponentConfig()
    .then((config:ComponentConfig) => {
      return workspace.component.build(config);
    })
    .then((value) => {
      console.log(`Distributable file created in ${value}`);
    })
    .catch((error) => {
      console.log(error);
    });
  });

function getComponentConfig(): Promise<ComponentConfig> {
  let config:ComponentConfig = {
    name: null,
    domain: null
  };

  // Get default values for the component parameters. Default values are stored in kazeConfig.json
  let defaultDomain = kazeConfig.domain ? kazeConfig.domain : 'default.com';
  
  // For each parameter, ask the user for its value providing the default
  // value. The only parameter without default value is the name. Recall that
  // the real name for the component will be:
  // 
  //    eslap://<DOMAIN>/component/<NAME>/0_0_1
  //
  // TODO: allow assigning values to parameters using command line options.
  return question({ prompt: 'Component domain?', default: defaultDomain })
  .then((value:string) => {
    checkNotUndefinedOrEmpty(value, 'Domain not defined');
    config.domain = value;
    return question({ prompt: 'Component name?' })
  })
  .then((value:string) => {
    checkNotUndefinedOrEmpty(value, 'Name not defined');
    config.name = value;
    return Promise.resolve(config);
  })

}

executeProgram(program);
  
