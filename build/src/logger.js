"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function printLine(prefix, line) {
    console.log(`${prefix}: ${line}`);
}
function info(line) {
    printLine('INFO', line);
}
exports.info = info;
function warn(line) {
    printLine('WARNING', line);
}
exports.warn = warn;
function error(line) {
    printLine('ERROR', line);
}
exports.error = error;
function dumpErrorLog(info) {
    let errorLog = `kaze-error-${Date.now()}.log`;
    console.log(`Dumping detailed error information to ${errorLog}...`);
    let cmd = process.argv[2];
    let argv = process.argv.slice(3);
    fs.appendFileSync(errorLog, `Execution of command ${cmd} with argv: ${argv} failed\n`);
    fs.appendFileSync(errorLog, `Error detail:\n`);
    fs.appendFileSync(errorLog, JSON.stringify(info, null, 4));
}
exports.dumpErrorLog = dumpErrorLog;
//# sourceMappingURL=logger.js.map