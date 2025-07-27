import { Ghost, MotionState } from './Ghost';
import { PacmanGame } from './PacmanGame';
import { Direction } from './Direction';
import { Maze } from './Maze';
import Constants from './Constants';

/**
 * Clyde, the orange ghost.
 */
export class Clyde extends Ghost {

    /**
     * Constructor.
     */
    constructor(game: PacmanGame) {
        super(game, 3 * Constants.SPRITE_SIZE, 14);
    }

    override reset() {
        super.reset();
        this.direction = Direction.SOUTH;
        this.setLocation(16 * Constants.TILE_SIZE - Constants.TILE_SIZE / 2 - 4,
            15 * Constants.TILE_SIZE - Constants.TILE_SIZE / 2);
        this.motionState = MotionState.IN_BOX;
    }

    /**
     * Updates an actor's position.
     *
     * @param maze The maze in which the actor is moving.
     */
    protected updatePositionChasingPacman(maze: Maze) {

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
        if (this.game.playTime >= this.startScatteringTime) {
            this.motionState = MotionState.SCATTERING;
        }

    }

}
