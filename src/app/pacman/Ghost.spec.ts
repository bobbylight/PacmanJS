import { Ghost } from './Ghost';
import { Maze } from './Maze';
import * as chai from 'chai';
import { PacmanGame } from './PacmanGame';

const game: any = {};

class ConcreteGhost extends Ghost {

    constructor() {
        super(game as PacmanGame, 0, 0);
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
