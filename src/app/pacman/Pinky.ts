module pacman {
  'use strict';

    /**
    * Pinky, the pink ghost.  If PacMan is "visible" to Pinky (i.e., in the
    * same row or column), he'll chase him
     */
     export class Pinky extends Ghost {

    	/**
    	 * Constructor.
    	 */
    	constructor(game: PacmanGame) {
    		super(game, 2 * PacmanGame.SPRITE_SIZE, 2);
    	}

    	reset() {
    		super.reset();
    		this.direction = Direction.NORTH;
        this.setLocation(14 * PacmanGame.TILE_SIZE - PacmanGame.TILE_SIZE / 2 - 4,
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

      const pacman: Pacman = game.pacman;
      const pacRow: number = pacman.row;
      const pacCol: number = pacman.column;
      const row = this.row;
      const col = this.column;
      let moved: boolean = false;

  		if (this.atIntersection(maze)) {

  			if (row === pacRow && maze.isClearShotRow(row, col, pacCol)) {
  				if (pacCol < col) {
            this.direction = Direction.WEST;
  					this.incX(-moveAmount);
  				}
  				else {
  					// We need to check whether Pinky can go right here or not.
  					// In the case where pacCol==col, if God Mode is enabled,
  					// PacMan won't die just because Pinky is on him.  And so,
  					// in this case, if PacMan is in a "corner," Pinky  may not
  					// be able to keep traveling to the right.  In normal play
  					// though, this check wouldn't be necessary.
  					if (!this.goRightIfPossible(maze, moveAmount)) {
  						this.changeDirectionFallback(maze);
  					}
  				}
  				moved = true;
  			}

  			else if (col === pacCol && maze.isClearShotColumn(col, row, pacRow)) {
  				if (pacRow < row) {
            this.direction = Direction.NORTH;
  					this.incY(-moveAmount);
  				}
  				else {
  					// We need to check whether Pinky can go down here or not.
  					// In the case where pacRow==row, if God Mode is enabled,
  					// PacMan won't die just because Pinky is on him.  And so,
  					// in this case, if PacMan is in a "corner," Pinky  may not
  					// be able to keep traveling down.  In normal play though,
  					// this check wouldn't be necessary.
  					if (!this.goDownIfPossible(maze, moveAmount)) {
  						this.changeDirectionFallback(maze);
  					}
  				}
  				moved = true;
  			}

  			if (!moved) {
  				this.changeDirectionFallback(maze);
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
