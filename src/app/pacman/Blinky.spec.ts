import { Blinky } from './Blinky';
import { Direction } from './Direction';
import { MotionState } from './Ghost';

describe('Blinky', () => {

    it('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Blinky = new Blinky(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.WEST);
        expect(ghost.motionState).toEqual(MotionState.SCATTERING);
    });
});
