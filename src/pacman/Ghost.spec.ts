import { Ghost, MotionState } from './Ghost';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';
import { describe, expect, it } from 'vitest';

const game: any = {
    checkLoopedSound: () => {},
    level: 0,
    playTime: 5000,
};

export class ConcreteGhost extends Ghost {

    constructor() {
        super(game as PacmanGame, 0, 0);
        this.motionState = MotionState.CHASING_PACMAN;
    }

    protected updatePositionChasingPacman(maze: Maze): void {
    }
}

describe('Ghost', () => {

    it('can be subclassed', () => {
        const ghost: ConcreteGhost = new ConcreteGhost();
        expect(ghost).toBeDefined();
    });

    describe('possiblyTurnBlue', () => {
        [ MotionState.EYES, MotionState.EYES_ENTERING_BOX, MotionState.IN_BOX, MotionState.LEAVING_BOX ].forEach(state => {
            it(`does nothing if they are ${state}`, () => {
                const ghost: ConcreteGhost = new ConcreteGhost();
                ghost.motionState = state;
                ghost.possiblyTurnBlue();
                expect(ghost.isBlue()).toBe(false);
            });
        });

        [ MotionState.SCATTERING, MotionState.CHASING_PACMAN, MotionState.BLUE ].forEach(state => {
            it(`turns blue if they are ${state}`, () => {
                const ghost: ConcreteGhost = new ConcreteGhost();
                ghost.motionState = state;
                ghost.possiblyTurnBlue();
                expect(ghost.isBlue()).toBe(true);
                expect(ghost.exitBlueTime).toBeGreaterThan(0); // Fix #16
            });
        });
    });
});
