import DirectionUtil, { Direction } from './Direction';
import * as chai from 'chai';

describe('DirectionUtil', () => {

    it('Test test :)', () => {

        chai.assert.equal(DirectionUtil.fromString('SOUTH'), Direction.SOUTH);
    });
});
