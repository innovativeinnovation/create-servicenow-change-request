/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

const yaml = require('js-yaml');
const fs = require('fs');

const getConfig = (file) => {
  try {
    var data = yaml.safeLoad(
      fs.readFileSync(file, 'utf8')
    );
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getChangelogInfo = (file) => {
  try {
    const changelog = fs.readFileSync(file, 'utf8');
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

exports.getConfig = getConfig;
exports.getChangelogInfo = getChangelogInfo;
