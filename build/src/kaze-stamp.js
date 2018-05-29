"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const utils_1 = require("./utils");
const workspace_1 = require("workspace");
let config = workspace_1.workspace.startupCheck();
var pkg = require('../../package.json');
program
    .version(pkg.version);
program
    .command('add <id> <url>')
    .description('Add stamp with <id> and <url> to kazeConfig.json')
    .option('-d, --default')
    .option('-f, --force')
    .action((id, url, opts) => {
    workspace_1.workspace.stamp.add(id, url, opts.default, opts.force, config);
});
program
    .command('rm <id>')
    .description('Remove stamp with <id> from kazeConfig.json')
    .action(id => {
    workspace_1.workspace.stamp.remove(id, config);
});
program
    .command('switch <id>')
    .description('Switch working stamp to stamp with <id>')
    .action(id => {
    workspace_1.workspace.stamp.switch(id, config);
});
// program
//   .command('*')
//   .action(() => {
//     program.help();
//   });
// Checks if the stamp subcommand is valid or not.
utils_1.executeProgram(program);
// program.parse(process.argv);
//# sourceMappingURL=kaze-stamp.js.map