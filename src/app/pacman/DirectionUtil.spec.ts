import { Direction } from './constants/direction';
import { DirectionUtil } from './utils/Direction';

describe('DirectionUtil', () => {

    it('Test test :)', () => {

        expect(DirectionUtil.fromString('SOUTH')).toEqual(Direction.SOUTH);
    });
});
