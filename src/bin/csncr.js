#!/usr/bin/env node

/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

'use strict';

const puppeteer = require('puppeteer');
const moment = require('moment');
const logSymbols = require('log-symbols');
const colors = require('colors');
const Cryptr = require('cryptr');

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
const startDate = moment().format('YYYY-MM-DD HH:mm:ss');
const endDate = moment(startDate).add(5, 'minutes').format(
  'YYYY-MM-DD HH:mm:ss'
);

if (argv.u && argv.a && argv.l) {
  try {
    userConfig = utils.getConfig(argv.u);
  } catch (e) {
    console.log(e.message);
  }
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

  const cptr = new Cryptr(userConfig.key);
  userConfig.password = cptr.decrypt(userConfig.token);

  createChangeRequest(userConfig, appConfig, startDate, endDate, changelogInfo);
} else {
  yargs.showHelp();
  process.exit(0);
}

async function connectToTequila (page, userConfig) {
  await page.goto('https://tequila.epfl.ch/cgi-bin/tequila/loginform');

  await page.waitForSelector('#username');
  await page.evaluate(
    (userConfig) => {
      document.querySelector('#username').value = userConfig.username;
      document.querySelector('#password').value = userConfig.password;
    },
    userConfig
  );

  await page.click('#loginbutton');
};

async function createChange (
  page, userConfig, appConfig, startDate, endDate, changelogInfo
) {
  await page.goto(userConfig.host + '/change_request.do?' +
    'sys_id=-1&sysparm_stack=change_request_list.do&' +
    'sysparm_query=type=Standard^EQ&active=true');
  await page.waitFor(5000);
  await page.goto(userConfig.host + '/change_request.do?' +
    'sys_id=-1&sysparm_stack=change_request_list.do&' +
    'sysparm_query=type=Standard^EQ&active=true');

  await page.evaluate(
    (userConfig, appConfig, startDate, endDate, changelogInfo) => {
      document.getElementById('change_request.reason').value =
        appConfig.prefix + ' - ' + changelogInfo[0];
      document.getElementById(
        'change_request.u_identity_of_item_s__to_be_ch'
      ).value = 'Software';
      document.getElementById(
        'sys_display.change_request.u_business_service'
      ).value = appConfig.name;
      document.getElementById(
        'change_request.u_business_service'
      ).value = appConfig.id;

      document.getElementById(
        'sys_display.change_request.assignment_group'
      ).value = appConfig.group_name;
      document.getElementById(
        'change_request.assignment_group'
      ).value = appConfig.group_id;
      document.getElementById(
        'sys_display.change_request.assigned_to'
      ).value = userConfig.name;
      document.getElementById(
        'change_request.assigned_to'
      ).value = userConfig.id;

      document.getElementById(
        'change_request.short_description'
      ).value = appConfig.prefix + ' - ' + changelogInfo[0];

      document.getElementById(
        'change_request.impact'
      ).value = changelogInfo[2];

      document.getElementById(
        'change_request.description'
      ).value = changelogInfo[1];

      document.getElementById(
        'change_request.start_date'
      ).value = startDate;
      document.getElementById(
        'change_request.end_date'
      ).value = endDate;
    },
    userConfig,
    appConfig,
    startDate,
    endDate,
    changelogInfo
  );

  const changeNum = await page.evaluate(() => {
    return document.getElementById('change_request.number').value;
  });
  console.log(
    '\n',
    logSymbols.success,
    colors.green('Change Request created')
  );
  console.log(
    userConfig.host +
    '/nav_to.do?uri=change_request.do?sysparm_query=number=' + changeNum,
    '\n'
  );
  await page.click('#sysverb_insert');
  return changeNum;
};

async function closeTask (
  page, userConfig, appConfig, startDate, endDate, changelogInfo
) {
  const idSelectorTask = 'change_request.change_task.change_request_table';
  const tasks = await page.$x(
    '(//table[@id="' + idSelectorTask + '"]/tbody/tr/td)[3]/a'
  );
  if (tasks.length > 0) {
    await tasks[0].click();
  } else {
    throw new Error('Link not found');
  }
  await page.waitFor(3000);
  await page.evaluate(
    (startDate, endDate) => {
      document.getElementById('change_task.change_request.work_start').value =
        startDate;
      document.getElementById('change_task.change_request.work_end').value =
        endDate;

      document.getElementById(
        'change_task.change_request.u_change_implementation_detail'
      ).value = 'Success';
    },
    startDate,
    endDate
  );
  await page.click('#close_complete');
};

async function createChangeRequest (
  userConfig, appConfig, startDate, endDate, changelogInfo
) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await connectToTequila(page, userConfig);
  const changeNum = await createChange(
    page, userConfig, appConfig, startDate, endDate, changelogInfo
  );

  await page.waitFor(2000);
  const linkHandlers = await page.$x(
    '//a[contains(text(), \'' + changeNum + '\')]'
  );
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error('Link not found');
  }

  await page.waitFor(3000);
  await closeTask(
    page, userConfig, appConfig, startDate, endDate, changelogInfo
  );

  browser.close();
};
