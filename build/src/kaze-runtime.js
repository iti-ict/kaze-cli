"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const utils_1 = require("./utils");
const chalk = require("chalk");
const workspace_1 = require("workspace");
var kazeConfig = workspace_1.workspace.readConfigFile();
var pkg = require('../../package.json');
function printError(errorMessage) {
    console.error(chalk.red('\n * ERROR: '), chalk.yellow(errorMessage));
}
program
    .version(pkg.version);
program
    .command('add')
    .description('Starts Local Stamp')
    .action(() => {
    let config = {
        name: null,
        domain: null
    };
    let template = null;
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
    utils_1.question({ prompt: 'Runtime domain?', default: defaultDomain })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Domain not defined');
        config.domain = value;
        return utils_1.question({ prompt: 'Runtime name?' });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Name not defined');
        config.name = value;
        return utils_1.question({ prompt: 'Parent runtime?', default: defaultParent });
    })
        .then((value) => {
        if (value && (value.length > 0)) {
            template = 'extended';
            config.parent = value;
        }
        else {
            template = 'basic';
        }
        return utils_1.question({ prompt: 'Component folder?', default: defaultFolder });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Component not defined');
        config.componentFolder = value;
        return utils_1.question({ prompt: 'Component entrypoint?', default: defaultEntrypoint });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Entrypoint not defined');
        config.entrypoint = value;
        return workspace_1.workspace.runtime.add(template, config);
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
    .action(() => {
    let defaultDomain = kazeConfig.domain ? kazeConfig.domain : 'default.com';
    let config = {
        name: null,
        domain: null
    };
    utils_1.question({ prompt: 'Runtime domain?', default: defaultDomain })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Domain not defined');
        config.domain = value;
        return utils_1.question({ prompt: 'Runtime name?' });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Name not defined');
        config.name = value;
        return workspace_1.workspace.runtime.build(config);
    })
        .catch((error) => {
        printError(`kaze failed creating the runtime: ${error}`);
        program.help();
        process.exit(1);
    });
});
utils_1.executeProgram(program);
//# sourceMappingURL=kaze-runtime.js.map