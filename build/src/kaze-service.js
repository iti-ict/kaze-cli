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
    .description('Adds a new service')
    .action(() => {
    let config;
    // Get default values for the component parameters. Default values are stored in kazeConfig.json
    let defaultTemplate = (kazeConfig.service && kazeConfig.service.template) ? kazeConfig.service.template : 'basic';
    getServiceConfig()
        .then((cfg) => {
        config = cfg;
        return utils_1.question({ prompt: 'Template?', default: defaultTemplate });
    })
        .then((value) => {
        return workspace_1.workspace.service.add(value, config);
    })
        .then((value) => {
        console.log(value);
    })
        .catch((error) => {
        console.log(error);
    });
});
function getServiceConfig() {
    let config = {
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
    return utils_1.question({ prompt: 'Service domain?', default: defaultDomain })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Domain not defined');
        config.domain = value;
        return utils_1.question({ prompt: 'Service name?' });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Name not defined');
        config.name = value;
        return Promise.resolve(config);
    });
}
utils_1.executeProgram(program);
//# sourceMappingURL=kaze-service.js.map