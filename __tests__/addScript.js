'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-pluginboilerplate:addScript', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/addScript'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
