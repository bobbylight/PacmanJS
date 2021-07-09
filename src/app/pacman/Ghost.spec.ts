import { Ghost } from './Ghost';
import { Maze } from './Maze';
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
        expect(ghost).toBeDefined();
    });
});
