#!/usr/bin/env node

/*
 * (c) William Belle, 2019-2025.
 * See the LICENSE file for more details.
 */

'use strict';

const moment = require('moment');
const confirm = require('inquirer-confirm');
const open = require('open');

const utils = require('../lib/index.js');
const yargs = require('yargs')

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
    describe: 'CHANGELOG.md file',
    requiresArg: true,
    type: 'string',
    demand: true
  })

  // Version
  .alias('v', 'version')

  // Help
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 -a app.yml -l CHANGELOG.md')
  .example('$0 -a memento.yml -l CHANGELOG.md')
  .example('$0 -a rdp.yml -l CHANGELOG.md');

const argv = yargs.argv;
let appConfig;
let changelogInfo;
const startDate = moment().format('YYYY-MM-DD HH:mm:ss');
const endDate = moment(startDate).add(5, 'minutes').format(
  'YYYY-MM-DD HH:mm:ss'
);

if (argv.a && argv.l) {
  try {
    appConfig = utils.getConfig(argv.a);
  } catch (e) {
    console.log(e.message);
  }
  try {
    changelogInfo = utils.getChangelogInfo(argv.l);
  } catch (e) {
    console.log(e.message);
  }

  console.log('\nVersion: ' + changelogInfo[0]);
  console.log('List of changes: \n' + changelogInfo[1] + '\n');

  confirm({
    question: 'Is the version and description correct?',
    default: false
  }).then(async function () {
    const path = utils.createChangeRequest(
      appConfig,
      startDate,
      endDate,
      changelogInfo
    );
    await open(appConfig.url + path);
  }, function () {
    process.exit(0);
  });
} else {
  yargs.showHelp();
  process.exit(0);
}
