import { Ghost } from './Ghost';
import { Maze } from './Maze';
import * as chai from 'chai';

class ConcreteGhost extends Ghost {

    constructor() {
        super(null, 0, 0);
    }

    updatePositionChasingPacman(maze: Maze): void {
    }
}

describe('Ghost', () => {

    it('can be subclassed', () => {
        const ghost: ConcreteGhost = new ConcreteGhost();
        chai.assert.isDefined(ghost);
    });
});
