/*
 * (c) William Belle, 2019-2025.
 * See the LICENSE file for more details.
 */

import * as chai from 'chai';
import { getConfig } from '../src/lib/index.js';

const should = chai.should();

describe('getConfig', function () {
  it('should throw an exception with a nonexistent file', () => {
    should.throw(
      () => getConfig('foobar.yml'),
      'ENOENT: no such file or directory, open \'foobar.yml\''
    );
  });

  it('should get user config', () => {
    const config = getConfig('test/resources/test.yml');
    config.id.should.equal('fdosandisabfibdsaibf');
    config.name.should.equal('William Belle');
  });
});
