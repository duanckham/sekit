#!/usr/bin/env node

const passwordFeature = require('./features/password');

function main() {
  if (process.argv.length >=3) {
    switch (process.argv[2]) {
      case 'password':
      case 'p':
        return passwordFeature.do(process.argv[3]);
      default:
        break;
    }
  }

  help();
}

function help() {
  console.log('This toolkit contains the following commands: (npx sekit [command])');
  console.log('');
  console.log('  - p/password [output_file]');
}

main();