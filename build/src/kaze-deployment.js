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
var DEPLOY_NAME = null;
program
    .version(pkg.version);
program
    .command('add')
    .description('Adds a new deployment')
    .action(() => {
    let config;
    // Get default values for the component parameters. Default values are stored in kazeConfig.json
    let defaultTemplate = (kazeConfig.deployment && kazeConfig.deployment.template) ? kazeConfig.deployment.template : 'basic';
    getDeploymentConfig()
        .then((cfg) => {
        config = cfg;
        return utils_1.question({ prompt: 'Template?', default: defaultTemplate });
    })
        .then((value) => {
        return workspace_1.workspace.deployment.add(value, config);
    })
        .then((value) => {
        console.log(value);
    })
        .catch((error) => {
        console.log(error);
    });
});
program
    .command('deploy')
    .description('Deploys a service application instance in a stamp')
    .option('--stamp <stamp>', 'target stamp', '')
    .action(({ stamp }) => {
    utils_1.question({ prompt: 'Deployment name?' })
        .then((value) => {
        if (!value || (value.length == 0)) {
            return Promise.reject("Error: deployment name empty");
        }
        DEPLOY_NAME = value;
        return utils_1.question({ prompt: 'Do yo want to add generic Inbounds? (y/n)' });
    })
        .then((value) => {
        if (value == 'y' || value == 'Y') {
            console.log('Generic Inbounds will be added.');
            let defaultDomain = kazeConfig["inbounds-domain"] ? kazeConfig["inbounds-domain"] : 'default.com';
            return utils_1.question({ prompt: "Type the inbound's domain: ", default: defaultDomain })
                .then((inboundsDomain) => {
                if (!inboundsDomain || (inboundsDomain.length == 0)) {
                    return Promise.reject("Error: deployment name empty");
                }
                return workspace_1.workspace.deployWithDependencies(DEPLOY_NAME, stamp, inboundsDomain);
            });
        }
        else {
            console.log("Generic Inbounds won't be added.");
            console.log('Creating the bundle and deploying the service. Please wait...');
            return workspace_1.workspace.deployWithDependencies(DEPLOY_NAME, stamp);
        }
    })
        .then((value) => {
        console.log(JSON.stringify(value, null, 2));
        let errors = (value.errors ? value.errors : []);
        if (value.deployments && value.deployments.errors && (value.deployments.errors.length > 0)) {
            errors = errors.push.apply(errors, value.deployments.errors);
        }
        if (errors.length > 0) {
            console.log(`\nThe deployment process found some errors`);
            for (let error of errors) {
                console.log(` * ${error}`);
            }
        }
        let successful = (value.successful ? value.successful : []);
        if (value.deployments && value.deployments.successful && (value.deployments.successful.length > 0)) {
            for (let success of value.deployments.successful) {
                if (success.urn) {
                    successful.push(`Registered new instance of service "${success.service}":`);
                    successful.push(` * Deployment id: ${success.urn}`);
                    if (success.roles) {
                        for (let name in success.roles) {
                            let role = success.roles[name];
                            for (let section of ['entrypoint', 'configuration']) {
                                if (role[section] && role[section].domain) {
                                    if (role[section].sslonly) {
                                        successful.push(` * Deployment entrypoint for role "${name}": https://${role[section].domain}`);
                                    }
                                    else {
                                        successful.push(` * Deployment entrypoint for role "${name}": http://${role[section].domain}`);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (successful.length > 0) {
            console.log(`\n`);
            for (let success of successful) {
                console.log(success);
            }
        }
        console.log(`\n`);
    })
        .catch((error) => {
        let message = ((error && error.message) ? error.message : error);
        console.log(message);
    });
});
program
    .command('scale')
    .description('Scales the number of instances for a given role in a deployment')
    .option('--stamp <stamp>', 'target stamp', '')
    .action(({ stamp }) => {
    let name = '';
    let role = '';
    let numInstances = -1;
    utils_1.question({ prompt: 'Deployment URN?' })
        .then((value) => {
        if (!value || (value.length == 0)) {
            return Promise.reject("Error: deployment URN empty");
        }
        name = value;
        return utils_1.question({ prompt: 'Role to scale?' });
    })
        .then((value) => {
        if (!value || (value.length == 0)) {
            return Promise.reject("Error: role is empty");
        }
        role = value;
        return utils_1.question({ prompt: 'Number of instances?' });
    })
        .then((value) => {
        if (!value || (value.length == 0)) {
            return Promise.reject("Error: number of instances is empty");
        }
        let numInstances = Number(value);
        if (numInstances == NaN) {
            return Promise.reject(`Error: ${value} is not a number`);
        }
        console.log(`Scaling ${name} to ${numInstances}. Please wait...`);
        return workspace_1.workspace.deployment.scaleRole(name, role, numInstances, stamp);
    })
        .then((value) => {
        console.log("Done!");
        // console.log(value);
    })
        .catch((error) => {
        console.log(error);
    });
});
function getDeploymentConfig() {
    let config = {
        name: null,
        service: {
            domain: null,
            name: null
        }
    };
    // Get default values for the component parameters. Default values are stored in kazeConfig.json
    let defaultDomain = kazeConfig.domain ? kazeConfig.domain : 'default.com';
    // For each parameter, ask the user for its value providing the default
    // value. The only parameter without default value is the name. Recall that
    // the real name for the component will be:
    // 
    //    eslap://<DOMAIN>/component/<NAME>/<VERSION>
    //
    // TODO: allow assigning values to parameters using command line options.
    return utils_1.question({ prompt: 'Service domain?', default: defaultDomain })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Service domain not defined');
        config.service.domain = value;
        return utils_1.question({ prompt: 'Service name?' });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Service name not defined');
        config.service.name = value;
        return workspace_1.workspace.service.getCurrentVersion(config.service);
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Service version not found');
        return utils_1.question({ prompt: 'Service version?', default: value });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Service version not defined');
        config.service.version = value;
        return utils_1.question({ prompt: 'Deployment name?' });
    })
        .then((value) => {
        utils_1.checkNotUndefinedOrEmpty(value, 'Deployment name not defined');
        config.name = value;
        return Promise.resolve(config);
    });
}
utils_1.executeProgram(program);
//# sourceMappingURL=kaze-deployment.js.map