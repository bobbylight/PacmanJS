import { Blinky } from './Blinky';

describe('Blinky', () => {

    it('reset() works as expected', () => {

        const mockGame: any /* PacmanGame */ = {
            checkLoopedSound: () => {}
        };

        const ghost: Blinky = new Blinky(mockGame);
        ghost.reset();
    });
});
