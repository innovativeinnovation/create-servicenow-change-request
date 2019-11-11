/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

const should = require('chai').should();

const utils = require('../src/lib/index.js');

describe('getChangelogInfo', function () {
  it('should throw an exception with a nonexistent changelog', () => {
    should.throw(
      () => utils.getChangelogInfo('foobar.yml'),
      'ENOENT: no such file or directory, open \'foobar.yml\''
    );
  });

  it('should get changelog informations (major)', () => {
    const infos = utils.getChangelogInfo('test/resources/change-maj.md');
    infos[0].should.equal('v2.0.0');
    infos[1].should.equal(
      '- My changes made additional changes\n' +
      '- Completely unrelated to the above'
    );
    infos[2].should.equal(1);
  });

  it('should get changelog informations (minor)', () => {
    const infos = utils.getChangelogInfo('test/resources/change-min.md');
    infos[0].should.equal('v0.1.1');
    infos[1].should.equal('- More changes');
    infos[2].should.equal(3);
  });

  it('should get changelog informations (significant)', () => {
    const infos = utils.getChangelogInfo('test/resources/change-sig.md');
    infos[0].should.equal('v0.3.0');
    infos[1].should.equal('- Good examples and basic guidelines');
    infos[2].should.equal(2);
  });
});
