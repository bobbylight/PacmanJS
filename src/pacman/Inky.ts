import { Ghost, MotionState } from './Ghost';
import { PacmanGame } from './PacmanGame';
import { Direction } from './Direction';
import { Maze } from './Maze';
import { MazeNode } from './MazeNode';
import Constants from './Constants';

/**
 * Inky, the blue ghost.  Inky is "bashful" and only chases after Pacman if
 * Blinky (the red ghost) is close by.
 */
export class Inky extends Ghost {

    /**
     * Constructor.
     */
    constructor(game: PacmanGame) {
        super(game, 1 * Constants.SPRITE_SIZE, 8);
    }

    override reset() {
        super.reset();
        this.direction = Direction.SOUTH;
        this.setLocation(12 * Constants.TILE_SIZE - Constants.TILE_SIZE / 2 - 4,
            15 * Constants.TILE_SIZE - Constants.TILE_SIZE / 2);
        this.setMotionState(MotionState.IN_BOX);
    }

    protected updatePositionChasingPacman(maze: Maze) {

        const moveAmount: number = this.moveAmount;

        if (this.atIntersection(maze)) { // If the ghost can turn...

            // Get Blinky's proximity
            const row: number = this.row;
            const col: number = this.column;
            const blinky: Ghost = this.game.getGhost(0);
            const blinkyRow: number = blinky.row;
            const blinkyCol: number = blinky.column;
            const distSq: number = (blinkyCol - col) * (blinkyCol - col) +
                (blinkyRow - row) * (blinkyRow - row);
            //console.log(distSq);

            // If we're close enough to Blinky, chase Pacman.
            if (distSq <= 35) {
                const toRow: number = this.game.pacman.row;
                const toCol: number = this.game.pacman.column;
                const node: MazeNode | null = maze.getPathBreadthFirst(row, col, toRow, toCol);
                //console.log("... " + node + " (" + row + "," + col + ")");
                if (node == null) { // Happens only with "God Mode" enabled.
                    this.changeDirectionFallback(maze);
                }
                else if (node.col < col) {
                    this.direction = Direction.WEST;
                    this.incX(-moveAmount);
                }
                else if (node.col > col) {
                    this.direction = Direction.EAST;
                    this.incX(moveAmount);
                }
                else if (node.row < row) {
                    this.direction = Direction.NORTH;
                    this.incY(-moveAmount);
                }
                else if (node.row > row) {
                    this.direction = Direction.SOUTH;
                    this.incY(moveAmount);
                }
            }

            // If Blinky is too far away, just pick a random direction.
            else {
                this.changeDirectionFallback(maze);
            }

        }

        // Not at an intersection, so we should be able to keep going
        // in our current direction.
        else {
            this.continueInCurrentDirection(moveAmount);
        }

        // Switch over to scatter mode if it's time to do so.
        if (this.game.playTime >= this.startScatteringTime) {
            this.setMotionState(MotionState.SCATTERING);
        }

    }

}
