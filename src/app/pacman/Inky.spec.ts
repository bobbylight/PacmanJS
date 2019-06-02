import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Inky } from './Inky';
import * as chai from 'chai';

describe('Inky', () => {

    it('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Inky = new Inky(mockGame);
        ghost.reset();

        chai.assert.equal(ghost.direction, Direction.SOUTH);
        chai.assert.equal(ghost.motionState, MotionState.IN_BOX);
    });
});
