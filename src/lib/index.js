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

exports.getConfig = getConfig;
