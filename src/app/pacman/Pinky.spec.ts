import { Direction } from './constants/direction';
import { MotionState } from './constants/motionState';
import { Pinky } from './Pinky';

describe('Pinky', () => {

    it('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Pinky = new Pinky(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.NORTH);
        expect(ghost.motionState).toEqual(MotionState.IN_BOX);
    });
});
