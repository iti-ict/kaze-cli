import * as utils from './utils';
import * as fs from 'fs';

function printLine(prefix: string, line: string) {
  console.log(`${prefix}: ${line}`);
}

export function info(line: string) {
  printLine('INFO', line);
}

export function warn(line: string) {
  printLine('WARNING', line);
}

export function error(line: string) {
  printLine('ERROR', line);
}

export function dumpErrorLog(info: any) {
    let errorLog = `kaze-error-${Date.now()}.log`;
    console.log(`Dumping detailed error information to ${errorLog}...`)
    let cmd = process.argv[2];
    let argv = process.argv.slice(3);
    fs.appendFileSync(errorLog, `Execution of command ${cmd} with argv: ${argv} failed\n`);
    fs.appendFileSync(errorLog, `Error detail:\n`);
    fs.appendFileSync(errorLog, JSON.stringify(info, null, 4));
}
