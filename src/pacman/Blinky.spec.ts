import { Blinky } from './Blinky';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { describe, expect, test } from 'vitest';

describe('Blinky', () => {

    test('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Blinky = new Blinky(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.WEST);
        expect(ghost.motionState).toEqual(MotionState.SCATTERING);
    });
});
