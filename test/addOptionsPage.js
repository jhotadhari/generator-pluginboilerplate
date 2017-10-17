'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-pluginboilerplate:addOptionsPage', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/addOptionsPage'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
