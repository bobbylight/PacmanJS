module pacman {
  'use strict';

    /**
     * Blinky, the red ghost.  Blinky always takes the shortest route to Pacman
     * when chasing him.
     */
     export class Blinky extends Ghost {

    	/**
    	 * Constructor.
    	 */
    	constructor(game: PacmanGame) {
    		super(game, 0 * game.SPRITE_SIZE, 0); // Not initially in the penalty box
    	}

    	/**
    	 * Resets the ghost's internal state so that:
    	 *
    	 * <ol>
    	 *    <li>It is in the penalty box (except for Blinky).
    	 *    <li>It's no longer blinking.
    	 *    <li>Its direction is set appropriately.
    	 * </ol>
    	 *
    	 * This method should be called on loading a new level, PacMan dying, etc.
    	 */
    	reset() {
    		super.reset();
    		this.direction = Direction.WEST;
    		this.setLocation(this.game.PENALTY_BOX_EXIT_X, this.game.PENALTY_BOX_EXIT_Y);
    		this.motionState = MotionState.SCATTERING;
    	}

  	/**
  	 * Updates an actor's position.
  	 *
  	 * @param maze The maze in which the actor is moving.
  	 */
  	updatePositionChasingPacman(maze: Maze) {

  		// Logic:
  		// If at an intersection, do a breadth-first search for the shortest
  		// route to PacMan, and go in that direction.

  		let moveAmount: number = this.moveAmount;

  		if (this.atIntersection(maze)) { // If the ghost can turn...

  			let fromRow: number = this.row;
  			let fromCol: number = this.column;
  			let toRow: number = game.pacman.row;
  			let toCol: number = game.pacman.column;
  			let node: MazeNode = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);

  			if (node==null) { // Happens only with "God Mode" enabled.
  				this.changeDirectionFallback(maze);
  			}
  			else if (node.col<fromCol) {
  				this.direction = Direction.WEST;
  				this.incX(-moveAmount);
  			}
  			else if (node.col>fromCol) {
  				this.direction = Direction.EAST;
  				this.incX(moveAmount);
  			}
  			else if (node.row<fromRow) {
  				this.direction = Direction.NORTH;
  				this.incY(-moveAmount);
  			}
  			else if (node.row>fromRow) {
  				this.direction = Direction.SOUTH;
  				this.incY(moveAmount);
  			}

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
}
