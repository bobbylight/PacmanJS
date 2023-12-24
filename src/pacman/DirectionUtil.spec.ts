import DirectionUtil, { Direction } from './Direction';
import { describe, expect, test } from 'vitest';

describe('DirectionUtil', () => {

    test('Test test :)', () => {

        expect(DirectionUtil.fromString('SOUTH')).toEqual(Direction.SOUTH);
    });
});
