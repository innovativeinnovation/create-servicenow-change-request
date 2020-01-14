/*
 * (c) William Belle, 2019-2020.
 * See the LICENSE file for more details.
 */

const should = require('chai').should();

const utils = require('../src/lib/index.js');

describe('getConfig', function () {
  it('should throw an exception with a nonexistent file', () => {
    should.throw(
      () => utils.getConfig('foobar.yml'),
      'ENOENT: no such file or directory, open \'foobar.yml\''
    );
  });

  it('should get user config', () => {
    const config = utils.getConfig('test/resources/test.yml');
    config.id.should.equal('fdosandisabfibdsaibf');
    config.name.should.equal('William Belle');
  });
});
