import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Pinky } from './Pinky';
import * as chai from 'chai';

describe('Pinky', () => {

    it('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Pinky = new Pinky(mockGame);
        ghost.reset();

        chai.assert.equal(ghost.direction, Direction.NORTH);
        chai.assert.equal(ghost.motionState, MotionState.IN_BOX);
    });
});
