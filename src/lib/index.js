/*
 * (c) William Belle, 2019-2025.
 * See the LICENSE file for more details.
 */

import yaml from 'js-yaml';
import { stringify } from 'querystring';
import { readFileSync } from 'fs';

const getConfig = (file) => {
  try {
    var data = yaml.load(readFileSync(file, 'utf8'));
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getChangelogInfo = (file) => {
  try {
    const changelog = readFileSync(file, 'utf8');
    const lines = changelog.split(/\r?\n/);
    let versionFound = false;
    let description = '';
    let infoVersion;
    let infoPreviousVersion = ['0', '0', '0'];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('###') > -1) {
        if (versionFound) {
          infoPreviousVersion = lines[i].match(/([0-9]+)/g);
          break;
        }
        infoVersion = lines[i].match(/([0-9]+)/g);
        versionFound = true;
      } else if (versionFound) {
        description = description + lines[i].trim() + '\n';
      }
    }
    let impactCategory = 3;
    if (infoVersion[0] !== infoPreviousVersion[0]) {
      impactCategory = 1;
    } else if (infoVersion[1] !== infoPreviousVersion[1]) {
      impactCategory = 2;
    }
    const version = 'v' + infoVersion[0] + '.' + infoVersion[1] + '.' +
      infoVersion[2];
    return [version, description.trim(), impactCategory];
  } catch (e) {
    throw new Error(e.message);
  }
};

const createChangeRequest = (appConfig, startDate, endDate, changelogInfo) => {
  const base = '/change_request.do';
  const params = {
    sys_id: -1,
    sysparm_stack: 'change_request_list.do'
  };
  const change = {
    u_identity_of_item_s__to_be_ch: 'Software',
    reason: appConfig.prefix + ' - ' + changelogInfo[0],
    assignment_group: 'javascript:var ag=new GlideRecord("sys_user_group");' +
      'ag.addQuery("name", "' + appConfig.group_name + '");ag.query();' +
      'if(ag.next()){ag.sys_id}',
    business_service: 'javascript:var bs=new GlideRecord("cmdb_ci_service");' +
      'bs.addQuery("name", "' + appConfig.name + '");bs.query();if(bs.next())' +
      '{bs.getValue("sys_id")}',
    impact: changelogInfo[2],
    short_description: appConfig.prefix + ' - ' + changelogInfo[0],
    description: changelogInfo[1],
    assigned_to: 'javascript:gs.getUserID()',
    start_date: startDate,
    end_date: endDate
  };
  let changeParams = stringify(change);
  changeParams = changeParams.replaceAll('&', '%5E');
  return base + '?' + stringify(params) + '&sysparm_query=' +
    changeParams;
};

export {
  getConfig,
  getChangelogInfo,
  createChangeRequest
};
