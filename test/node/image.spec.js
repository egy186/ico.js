import { expect, use } from 'chai';
import FileType from 'file-type';
import Image from '../../src/node/image.js';
import chaiAsPromised from 'chai-as-promised';
import { isSame } from '../fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

use(chaiAsPromised);

describe('Image', () => {
  describe('.decode', () => {
    it('is expected to throw error when mime is not supported', () => {
      const arrayBuffer = new ArrayBuffer(100);
      expect(Image.decode(arrayBuffer)).to.be.rejectedWith(TypeError);
    });
    it('is expected to create ImageData from PNG', async () => {
      const buffer = await readFile(new URL('../fixtures/images/1x1/1x1-1bit.png', import.meta.url));
      const imageData = await Image.decode(buffer);
      expect(imageData.data).to.deep.equal(new Uint8ClampedArray([0, 0, 0, 0]));
      expect(imageData.height).to.deep.equal(1);
      expect(imageData.width).to.deep.equal(1);
    });
  });
  describe('.encode', () => {
    it('is expected to create 1x1 PNG from ImageData', async () => {
      const imageArrayBuffer = await Image.encode({
        data: new Uint8ClampedArray([0, 0, 0, 0]),
        height: 1,
        width: 1
      });
      expect(imageArrayBuffer).to.be.an.instanceof(ArrayBuffer);
      expect((await FileType.fromBuffer(Buffer.from(imageArrayBuffer))).mime).to.deep.equal('image/png');
      expect(await isSame(imageArrayBuffer, '1x1/1x1-1bit.png')).to.be.true;
    });
    const mimeTypes = [
      'image/bmp',
      'image/jpeg',
      'image/png'
    ];
    mimeTypes.forEach(mime => {
      it(`is expected to create ${mime} from ImageData`, async () => {
        const imageArrayBuffer = await Image.encode({
          data: new Uint8ClampedArray([0, 0, 0, 0]),
          height: 1,
          width: 1
        }, mime);
        expect((await FileType.fromBuffer(Buffer.from(imageArrayBuffer))).mime).to.deep.equal(mime);
      });
    });
  });
});
