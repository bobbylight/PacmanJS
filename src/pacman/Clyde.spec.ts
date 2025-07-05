import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { describe, expect, test } from 'vitest';
import { Clyde } from './Clyde';

describe('Clyde', () => {

    test('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Clyde = new Clyde(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.SOUTH);
        expect(ghost.motionState).toEqual(MotionState.IN_BOX);
    });
});
