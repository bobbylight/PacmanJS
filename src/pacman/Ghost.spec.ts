import { Ghost } from './Ghost';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';
import { describe, expect, test } from 'vitest';

const game: any = {};

export class ConcreteGhost extends Ghost {

    constructor() {
        super(game as PacmanGame, 0, 0);
    }

    protected updatePositionChasingPacman(maze: Maze): void {
    }
}

describe('Ghost', () => {

    test('can be subclassed', () => {
        const ghost: ConcreteGhost = new ConcreteGhost();
        expect(ghost).toBeDefined();
    });
});
