"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read = require("read");
const denodeify = require("denodeify");
const workspace_1 = require("workspace");
exports.question = denodeify(read);
// Checks if the stamp subcommand is valid or not.
function executeProgram(program) {
    if (process.argv.length <= 2) {
        console.log(`\n  Error: subcommand expected`);
        program.help();
    }
    else {
        let found = false;
        for (let cmnd of program.commands) {
            if ((process.argv[2] == '-V') || (process.argv[2] == '--version') || (cmnd.name().localeCompare(process.argv[2]) == 0)) {
                found = true;
                if ((process.argv[2] != 'init') && (process.argv[2] != '-V') && (process.argv[2] != '--version')) {
                    workspace_1.workspace.startupCheck();
                }
                program.parse(process.argv);
                break;
            }
        }
        if (!found) {
            program.help();
        }
    }
}
exports.executeProgram = executeProgram;
function checkNotUndefinedOrEmpty(value, errorMessage) {
    if (!value || (value.length == 0)) {
        console.log(errorMessage);
        process.exit(1);
    }
}
exports.checkNotUndefinedOrEmpty = checkNotUndefinedOrEmpty;
//# sourceMappingURL=utils.js.map