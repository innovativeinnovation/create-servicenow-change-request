#!/usr/bin/env node

/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

'use strict';

const utils = require('../lib/index.js');
const yargs = require('yargs')

  // User config
  .option('u', {
    alias: 'user-config',
    describe: 'User configuration file',
    requiresArg: true,
    type: 'string',
    demand: true
  })

  // Version
  .alias('v', 'version')

  // Help
  .help('h')
  .alias('h', 'help');

const argv = yargs.argv;

if (argv.u) {
  try {
    console.log(utils.getConfig(argv.u));
  } catch (e) {
    console.log(e.message);
  }
} else {
  yargs.showHelp();
  process.exit(0);
}
