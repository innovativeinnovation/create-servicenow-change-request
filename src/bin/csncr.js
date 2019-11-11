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

  // Application config
  .option('a', {
    alias: 'app-config',
    describe: 'Application configuration file',
    requiresArg: true,
    type: 'string',
    demand: true
  })

  // Changelog file
  .option('l', {
    alias: 'changelog',
    describe: 'CHANGELOG file',
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
let userConfig;
let appConfig;
let changelogInfo;

if (argv.u && argv.a && argv.l) {
  try {
    userConfig = utils.getConfig(argv.u);
    console.log(userConfig);
  } catch (e) {
    console.log(e.message);
  }
  try {
    appConfig = utils.getConfig(argv.a);
    console.log(appConfig);
  } catch (e) {
    console.log(e.message);
  }
  try {
    changelogInfo = utils.getChangelogInfo(argv.l);
    console.log(changelogInfo);
  } catch (e) {
    console.log(e.message);
  }
} else {
  yargs.showHelp();
  process.exit(0);
}
