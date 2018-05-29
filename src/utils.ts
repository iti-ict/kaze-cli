import * as read from 'read';
import * as denodeify from 'denodeify';
import { workspace } from 'workspace';

export let question = denodeify(read);

// Checks if the stamp subcommand is valid or not.
export function executeProgram(program) {
  if (process.argv.length <= 2) {
    console.log(`\n  Error: subcommand expected`)
    program.help()
  } else {
    let found = false;
    for (let cmnd of program.commands) {
      if ((process.argv[2] == '-V') || (process.argv[2] == '--version') || (cmnd.name().localeCompare(process.argv[2]) == 0)) {
        found = true;
        if ((process.argv[2] != 'init') && (process.argv[2] != '-V') && (process.argv[2] != '--version')) {
          workspace.startupCheck();
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

export function checkNotUndefinedOrEmpty(value: string, errorMessage: string) {
  if (!value || (value.length == 0)) {
    console.log(errorMessage);
    process.exit(1);
  }
}
