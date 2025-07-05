import DirectionUtil, { Direction } from './Direction';
import { describe, expect, test } from 'vitest';

describe('DirectionUtil', () => {

    test('fromString()', () => {
        expect(DirectionUtil.fromString('NORTH')).toEqual(Direction.NORTH);
        expect(DirectionUtil.fromString('EAST')).toEqual(Direction.EAST);
        expect(DirectionUtil.fromString('SOUTH')).toEqual(Direction.SOUTH);
        expect(DirectionUtil.fromString('WEST')).toEqual(Direction.WEST);
    });

    test('fromString() edge cases', () => {
        expect(DirectionUtil.fromString()).toEqual(Direction.SOUTH);
        expect(DirectionUtil.fromString('unknown')).toEqual(Direction.SOUTH);
    });
});
