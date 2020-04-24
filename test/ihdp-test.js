/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const fakeData = fs.readFileSync(path.join(__dirname, './fakeData.txt'), 'utf8');
const fakeJSONData = require('./fakeData.json');
const { tokenizer, parser, buildTree } = require('../src/ihdp.js');

describe('ihdp', function () {
  describe('tokenizer()', function () {
    it('should return a array of token from a indented hierarchical data', function () {
      const tokens = tokenizer(fakeData);
      expect(tokens).to.be.an('array');
      tokens.map(token => {
        expect(token).to.be.an('object');
        expect(token).to.have.property('type');
        expect(token.type).to.be.a('string');
        expect(token).to.have.property('value');
        expect(token.value).to.be.a('string');
        expect(token).to.have.property('startPosition');
        expect(token.startPosition).to.be.a('number');
      });
    });
  });

  describe('parser()', function () {
    it('should return a object improved by parsing', function () {
      const result = parser(tokenizer(fakeData));
      expect(result).to.be.an('array');
      result.map(token => {
        expect(token).to.be.an('object');
        expect(token).to.have.property('level');
        expect(token.level).to.be.a('number');
        expect(token).to.have.property('data');
        expect(token.data).to.be.a('string');
      });
    });
  });

  describe('buildTree()', function () {
    it('should return a nested object tree', function () {
      const result = buildTree(parser(tokenizer(fakeData)));
      expect(result).to.deep.equal(fakeJSONData);
    });
  });
});
