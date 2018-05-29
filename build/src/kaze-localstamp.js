"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const utils_1 = require("./utils");
const workspace_1 = require("workspace");
var pkg = require('../../package.json');
program
    .version(pkg.version);
program
    .command('start')
    .description('Starts Local Stamp')
    .action(() => {
    workspace_1.workspace.localStamp.start();
});
program
    .command('stop')
    .description('Stops Local Stamp')
    .action(() => {
    workspace_1.workspace.localStamp.stop();
});
program
    .command('restart')
    .description('Restarts Local Stamp')
    .action(() => {
    workspace_1.workspace.localStamp.restart();
});
program
    .command('ssh')
    .description('Opens an ssh session in Local Stamp')
    .action(() => {
    workspace_1.workspace.localStamp.ssh();
});
program
    .command('status')
    .description('Shows detalied information about Local Stamp status')
    .action(() => {
    workspace_1.workspace.localStamp.status();
});
// Checks if the stamp subcommand is valid or not.
utils_1.executeProgram(program);
//# sourceMappingURL=kaze-localstamp.js.map