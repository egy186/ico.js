'use strict';

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const expect = chai.expect;

const bitDepthOfPNG = require('../src/bit-depth-of-png');
const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

describe('bitDepthOfPNG', () => {
  const files = [
    '1x1-1bit.png',
    '1x1-16bit.png',
    '1x1-24bit.png'
  ];
  files.forEach(file => {
    const filePath = path.join(__dirname, './fixtures/images/1x1', file);
    const arrayBuffer = bufferToArrayBuffer(fs.readFileSync(filePath));
    const bit = Number.parseInt(file.slice(file.indexOf('-') + 1, file.lastIndexOf('b')), 10);
    it(`is expected to return ${bit}`, () => {
      expect(bitDepthOfPNG(arrayBuffer)).to.deep.equal(bit);
    });
  });
  it('is expected to return 32', () => {
    const filePath = path.join(__dirname, './fixtures/images/png/256x256-32bit.png');
    const arrayBuffer = bufferToArrayBuffer(fs.readFileSync(filePath));
    expect(bitDepthOfPNG(arrayBuffer)).to.deep.equal(32);
  });
});
