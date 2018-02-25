import { Ghost, MotionState } from './Ghost';
import { PacmanGame } from './PacmanGame';
import { Direction } from './Direction';
import { Maze } from './Maze';

declare var game: PacmanGame;

/**
 * Clyde, the orange ghost.
 */
export class Clyde extends Ghost {

    /**
     * Constructor.
     */
    constructor(game: PacmanGame) {
        super(game, 3 * PacmanGame.SPRITE_SIZE, 14);
    }

    reset() {
        super.reset();
        this.direction = Direction.SOUTH;
        this.setLocation(16 * PacmanGame.TILE_SIZE - PacmanGame.TILE_SIZE / 2 - 4,
            15 * PacmanGame.TILE_SIZE - PacmanGame.TILE_SIZE / 2);
        this.motionState = MotionState.IN_BOX;
    }

    /**
     * Updates an actor's position.
     *
     * @param maze The maze in which the actor is moving.
     */
    updatePositionChasingPacman(maze: Maze) {

        const moveAmount: number = this.moveAmount;

        // Pick a new random direction at intersections.
        if (this.atIntersection(maze)) {
            this.changeDirectionFallback(maze);
        }

        // Not at an intersection, so we should be able to keep going
        // in our current direction.
        else {
            this.continueInCurrentDirection(moveAmount);
        }

        // Switch over to scatter mode if it's time to do so.
        if (game.playTime >= this.startScatteringTime) {
            this.motionState = MotionState.SCATTERING;
        }

    }

}
