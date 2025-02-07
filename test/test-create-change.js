/*
 * (c) William Belle, 2019-2025.
 * See the LICENSE file for more details.
 */

require('chai').should();
const moment = require('moment');

const utils = require('../src/lib/index.js');

describe('createChangeRequest', function () {
  it('should get a change request', () => {
    const infos = utils.getChangelogInfo('test/resources/change-maj.md');

    const config = {
      name: 'Search',
      group_name: 'SI_SEARCH',
      prefix: 'API - '
    };
    const startDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(startDate).add(5, 'minutes').format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const link = utils.createChangeRequest(config, startDate, endDate, infos);
    link.should.match(/SI_SEARCH/);
    link.should.match(/u_identity_of_item_s__to_be_ch=Software/);
  });
});
