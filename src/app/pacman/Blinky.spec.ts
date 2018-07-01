import { Blinky } from './Blinky';

describe('Blinky', () => {

    it('reset() works as expected', () => {

        console.log('>>> a');
        const mockGame: any = {};

        console.log('>>> b');
        const ghost: Blinky = new Blinky(mockGame);
        console.log('>>> c');
        ghost.reset();
    });
});
