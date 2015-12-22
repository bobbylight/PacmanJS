module pacman {
  'use strict';

  export enum MotionState {
    IN_BOX = 0,
    LEAVING_BOX = 1,
    CHASING_PACMAN = 2,
    SCATTERING = 3,
    BLUE = 4,
    EYES = 5,
    EYES_ENTERING_BOX = 6
  }

  export abstract class Ghost extends _BaseSprite {

    /**
     * TODO: Remove the need for this variable!  Yucky!
     */
    game: PacmanGame;

    /**
  	 * The ghost's current motion state.
  	 */
  	private _motionState: number;

  	/**
  	 * The "corner" this ghost will retreat to when in "scatter" mode.
  	 */
  	private _corner: gtp.Point;

  	/**
  	 * The number of times this ghost has been in "scatter" mode for this
  	 * level and PacMan life.
  	 */
  	private _scatterCount: number;

  	/**
  	 * If in scatter mode, this is the time at which the mode should switch
  	 * to "chasing PacMan" mode.  If not in scatter mode, this value is
  	 * invalid.
  	 */
  	private _exitScatteringTime: number;

  	/**
  	 * The time at which this ghost should switch from "chasing PacMan" mode
  	 * to scatter mode.  If not in the "chasing PacMan" motion state,
  	 * this value is invalid.
  	 */
  	startScatteringTime: number;

  	/**
  	 * The time at which a ghost should switch from "blue mode" to their
  	 * previous state (chasing PacMan or scattering).  If not in the "blue"
  	 * motion state, this value is invalid.
  	 */
  	exitBlueTime: number;

  	/**
  	 * The motion state to revert back to when a ghost leaves "blue mode."
  	 * If a ghost is not in "blue mode," this value is invalid.
  	 */
  	private _previousState: number;

  	/**
  	 * The y-coordinate of the sprites in the sprite sheet to use.
  	 */
  	private _spriteSheetY: number;

  	/**
  	 * The number of seconds this ghost will wait before leaving the penalty
  	 * box for the first time.
  	 */
  	private _exitDelaySeconds: number;

    constructor(game: PacmanGame, spriteSheetY: number, exitDelaySeconds: number) {
      super(2);
      this.game = game;
      this._corner = new gtp.Point();
      this._spriteSheetY = spriteSheetY;
      this._exitDelaySeconds = exitDelaySeconds;
      this.reset();
    }

    changeDirectionFallback(maze: Maze) {

      let moveAmount: number = this.moveAmount;
      var temp: number = gtp.Utils.randomInt(4);

      switch (temp) {

        case 0:
          if (!this.goUpIfPossible(maze, moveAmount)) {
            if (!this.goLeftIfPossible(maze, moveAmount)) {
              if (!this.goRightIfPossible(maze, moveAmount)) {
                this.goDownIfPossible(maze, moveAmount);
              }
            }
          }
          break;

        case 1:
          if (!this.goLeftIfPossible(maze, moveAmount)) {
            if (!this.goUpIfPossible(maze, moveAmount)) {
              if (!this.goDownIfPossible(maze, moveAmount)) {
                this.goRightIfPossible(maze, moveAmount);
              }
            }
          }
          break;

        case 2:
          if (!this.goDownIfPossible(maze, moveAmount)) {
            if (!this.goLeftIfPossible(maze, moveAmount)) {
              if (!this.goRightIfPossible(maze, moveAmount)) {
                this.goUpIfPossible(maze, moveAmount);
              }
            }
          }
          break;

        case 3:
          if (!this.goRightIfPossible(maze, moveAmount)) {
            if (!this.goUpIfPossible(maze, moveAmount)) {
              if (!this.goDownIfPossible(maze, moveAmount)) {
                this.goLeftIfPossible(maze, moveAmount);
              }
            }
          }
          break;
      }

    }

    /**
  	 * Moves this ghost in its current direction by the specified amount.
  	 *
  	 * @param {number} moveAmount The amount to move.
  	 */
  	continueInCurrentDirection(moveAmount: number) {
  		switch (this.direction) {
  			case Direction.NORTH:
  				this.incY(-moveAmount);
  				break;
  			case Direction.WEST:
  				this.incX(-moveAmount);
  				break;
  			case Direction.SOUTH:
  				this.incY(moveAmount);
  				break;
  			case Direction.EAST:
  				this.incX(moveAmount);
  				break;
  		}
  	}

    /**
  	 * Returns the length of play time a ghost should stay blue, in
  	 * milliseconds.
  	 *
  	 * @param {number} level The current game level.
  	 * @return {numbe} The length of time a ghost should stay blue.
  	 */
  	private _getBlueTimeForLevel(level: number): number {
  		switch (level) {
  			case 0:
  			case 1:
  				return 8000;
  			case 2:
  			case 3:
  				return 6000;
  			case 4:
  			case 5:
  				return 4000;
  			case 6:
  			case 7:
  				return 2000;
  			default:
  				return 0;
  		}
  	}

    /**
  	 * Returns the amount of time, in milliseconds, that this ghost will wait
  	 * for before leaving the penalty box for the first time.
  	 *
  	 * @return {number} The delay, in milliseconds.
  	 */
  	getFirstExitDelayNanos(): number {
  		return this._exitDelaySeconds * 1000;
  	}

  	getFrameCount(): number {
  		return 2;
  	}

  	get motionState(): MotionState {
  		return this._motionState;
  	}

    /**
  	 * Returns the number of milliseconds that should pass between the times
  	 * this ghost moves.  This value is dependant on the ghost's current
  	 * state.
  	 *
  	 * @return The update delay, in milliseconds.
  	 */
  	getUpdateDelayMillis(): number {
  		switch (this._motionState) {
  			case MotionState.BLUE:
  				return 25;
  			case MotionState.EYES:
  			case MotionState.EYES_ENTERING_BOX:
  				return 10;
  			default: // Chasing PacMan, in penalty box, etc.
  				return 10;
  		}
  	}

  	/**
  	 * Returns whether this ghost is in a "blue" motion state.
  	 *
  	 * @return {boolean} Whether this ghost is blue.
  	 * @see #isEyes()
  	 */
  	isBlue(): boolean {
      return this._motionState === MotionState.BLUE;
  	}

    /**
  	 * Returns whether this ghost is in a "eyes" motion state.
  	 *
  	 * @return Whether this ghost is in an "eyes" state.
  	 * @see #isBlue()
  	 */
  	isEyes(): boolean {
  		return this._motionState === MotionState.EYES ||
  				this._motionState === MotionState.EYES_ENTERING_BOX;
  	}

  	/**
  	 * Paints this sprite at its current location.
  	 *
  	 * @param {CanvasRenderingContext2D} ctx The rendering context to use.
  	 */
  	paint(ctx: CanvasRenderingContext2D) {

  		let destX: number = this.bounds.x;
  		let destY: number = this.bounds.y;
      let SPRITE_SIZE = 16;

  		switch (this._motionState) {

  			case MotionState.BLUE:
          let srcX: number = (10 + this.getFrame()) * SPRITE_SIZE;
          let srcY: number = 3 * SPRITE_SIZE;
          let playTime: number = game.playTime;
  				if ((this.exitBlueTime - playTime) <= 1000) { // 1 sec. remaining
  					if (((playTime / 250) & 1) !== 0) {
  						srcY += SPRITE_SIZE; // Flash 4 times in last second
  					}
  				}
          game.drawSprite(destX, destY, srcX, srcY);
  				break;

  			case MotionState.EYES:
  			case MotionState.EYES_ENTERING_BOX:
  				srcX = this.direction * SPRITE_SIZE;
  				srcY = 4*SPRITE_SIZE;
          game.drawSprite(destX, destY, srcX, srcY);
  				break;

  			default:
  				srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
  						this.getFrame() * SPRITE_SIZE;
  				srcY = this._spriteSheetY;
          game.drawSprite(destX, destY, srcX, srcY);
  				break;

  		}
    }

    /**
  	 * Turns this ghost "blue," if it is not in the penalty box and is not
  	 * currently floating eyes.
  	 */
  	possiblyTurnBlue(): boolean {
  		switch (this._motionState) {
  			case MotionState.CHASING_PACMAN:
  			case MotionState.SCATTERING:
  			case MotionState.BLUE:
  				this.motionState = MotionState.BLUE;
  				return true;
  			default:
  				// Do nothing; in other states, we don't turn blue.
  				return false;
  		}
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
  	 * Subclasses should be sure to call the super's implementation when
  	 * overriding.
  	 */
  	reset() {
  		super.reset();
  		this._scatterCount = 0;
  	}

    /**
  	 * Sets the coordinates of the "corner" this ghost goes to when in scatter
  	 * mode.
  	 *
  	 * @param {gtp.Point} corner The corner to go to.
  	 */
  	setCorner(corner: gtp.Point) {
  		this._corner.x = corner.x;
      this._corner.y = corner.y;
  	}

    set motionState(motionState: MotionState) {

  		// Ghosts stay in "scatter mode" for varying lengths of time:
  		// The first (just out of the penalty box) and second times, it lasts
  		// for 7 seconds.  The third and fourth times, it lasts for 5 seconds.
  		// Ghosts don't enter scatter mode a 5th time; they just relentlessly
  		// attack PacMan.
  		if (this._motionState === MotionState.SCATTERING) {
  			switch (this._scatterCount++) {
  				case 0:
  				case 1:
  					this._exitScatteringTime = game.playTime + 7000;
  					this._motionState = motionState;
  					break;
  				case 2:
  				case 3:
  					this._exitScatteringTime = game.playTime + 5000;
  					this._motionState = motionState;
  					break;
  				default:
  					this._motionState = MotionState.CHASING_PACMAN;
  					break;
  			}
  		}

  		else if (this._motionState === MotionState.BLUE) {
  			let blueTime: number  = this._getBlueTimeForLevel(game.level);
  			let playTime: number = game.playTime;
  			this.exitBlueTime = playTime + blueTime;
  			// Remember previous state and modify its "end time" to
  			// include the blue time.
  			switch (this._motionState) {
  				case MotionState.CHASING_PACMAN:
  					this._previousState = this._motionState;
  					this.startScatteringTime += blueTime;
  					break;
  				case MotionState.SCATTERING:
  					this._previousState = this._motionState;
  					this._exitScatteringTime += blueTime;
  					break;
  				case MotionState.BLUE:
  					// Keep previous "previousState".
  					let prevBlueTimeRemaining: number = this.exitBlueTime - playTime;
  					switch (this._previousState) {
  						case MotionState.CHASING_PACMAN:
  							this.startScatteringTime += prevBlueTimeRemaining + blueTime;
  							break;
  						case MotionState.SCATTERING:
  							this._exitScatteringTime += prevBlueTimeRemaining + blueTime;
  							break;
  					}
  					break;
  				default:
  					throw 'Unexpected state: ' + this._motionState;
  			}
  			this._motionState = motionState;
  		}

  		// Any states other than "scatter mode" and "blue" aren't special.
  		else {
  			if (this._motionState === MotionState.CHASING_PACMAN) {
  				this.startScatteringTime = game.playTime + 20000;
  			}
  			this._motionState = motionState;
  		}

      this.game.checkLoopedSound();
  	}

    /**
  	 * Updates this ghost's position when they are "blue."
  	 *
  	 * @param {Maze} maze The maze in which the ghost is moving.
  	 */
  	_updatePositionBlue(maze: Maze) {

  		// Logic:
  		// If PacMan has a clear shot to us, try to go in a direction other
  		// than PacMan before resorting to going straight for him.  If
  		// PacMan does NOT have a clear shot, just pick a random direction.

  		let moveAmount: number = this.moveAmount;

  		// If we're at an intersection and can change direction...
  		if (this.atIntersection(maze)) {

  			let pacman: Pacman = game.pacman;
  			let pacRow: number = pacman.row;
  			let pacCol: number = pacman.column;
  			let row: number = this.row;
  			let col: number = this.column;
  			let moved: boolean = false;

  			// If PacMan has a straight shot to us in our row, try to go
  			// in a direction other than towards PacMan.
  			if (row === pacRow && maze.isClearShotRow(row, col, pacCol)) {
  				if (!this.goUpIfPossible(maze, moveAmount)) {
  					if (!this.goDownIfPossible(maze, moveAmount)) {
  						if (pacCol < col) { // PacMan is to our left.
  							if (!this.goRightIfPossible(maze, moveAmount)) {
  								this.direction = Direction.WEST;
  								this.incX(-moveAmount); // Must go towards PacMan.
  							}
  						}
  						else { // PacMan is to our right.
  							if (!this.goLeftIfPossible(maze, moveAmount)) {
  								this.direction = Direction.EAST;
  								this.incX(moveAmount); // Must go towards PacMan.
  							}
  						}
  					}
  				}
  				moved = true;
  			}

  			// If PacMan has a clear shot to us in our column, try to go
  			// in a direction other than towards PacMan.
  			else if (col === pacCol && maze.isClearShotColumn(col, row, pacRow)) {
  				if (!this.goLeftIfPossible(maze, moveAmount)) {
  					if (!this.goRightIfPossible(maze, moveAmount)) {
  						if (pacRow<row) { // PacMan is above us.
  							if (!this.goDownIfPossible(maze, moveAmount)) {
  								this.direction = Direction.NORTH;
  								this.incY(-moveAmount); // Must go towards PacMan.
  							}
  						}
  						else { // PacMan is below us.
  							if (!this.goUpIfPossible(maze, moveAmount)) {
  								this.direction = Direction.SOUTH;
  								this.incY(moveAmount); // Must go towards PacMan.
  							}
  						}
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

  		// Use game.playTime to ensure proper exit delay, even if game is
  		// paused, etc.
  		if (game.playTime >= this.exitBlueTime) {
  			this.motionState = this._previousState;
  		}

  	}


  	/**
  	 * Updates this ghost's position when they are chasing PacMan.
  	 *
  	 * @param maze The maze in which the actor is moving.
  	 */
  	abstract updatePositionChasingPacman(maze: Maze): void;


  	/**
  	 * Updates this ghost's position when it is a set of "eyes" heading back
  	 * to the penalty box.
  	 *
  	 * @param maze The maze in which the ghost is moving.
  	 */
  	private _updatePositionEyes(maze: Maze) {

  		// Logic:
  		// At intersections, do a breadth-first search to find the shortest
  		// path to the penalty box, and head in that direction.

  		// let moveAmount: number = getMoveAmount();
      //
  		// if (this.atIntersection(maze)) {
      //
  		// 	// NOTE: game.PENALTY_BOX_X is actually in-between two columns, so we
  		// 	// pick the "farther" one to travel to, so we can be sure that
  		// 	// the ghost will always enter the box correctly.
      //
  		// 	let fromRow: number = this.getRow();
  		// 	let fromCol: number = this.getColumn();
  		// 	let toRow: number = (game.PENALTY_BOX_EXIT_Y+16)/TILE_SIZE; // yToRow(game.PENALTY_BOX_EXIT_Y);
  		// 	let toCol: number = (game.PENALTY_BOX_EXIT_X)/TILE_SIZE; //xToColumn(game.PENALTY_BOX_EXIT_X);
  		// 	if (fromCol <= toCol) {
  		// 		toCol++; // Approaching from the left.
  		// 	}
      //
  		// 	let node: MazeNode = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);
  		// 	if (node==null) { // i.e. ghost is actually at the penalty box.
  		// 		// Should never happen; we should always catch the ghost
  		// 		// before getting to its destination in the "else" below.
  		// 		setMotionState(MotionState.EYES_ENTERING_BOX);
  		// 	}
  		// 	else {
  		// 		if (node.col<fromCol) {
  		// 			setDirection(DIR_LEFT);
  		// 			incX(-moveAmount);
  		// 		}
  		// 		else if (node.col>fromCol) {
  		// 			setDirection(DIR_RIGHT);
  		// 			incX(moveAmount);
  		// 		}
  		// 		else if (node.row<fromRow) {
  		// 			setDirection(DIR_UP);
  		// 			incY(-moveAmount);
  		// 		}
  		// 		else if (node.row>fromRow) {
  		// 			setDirection(DIR_DOWN);
  		// 			incY(moveAmount);
  		// 		}
  		// 	}
      //
  		// }
      //
  		// // Not at an intersection, so we should be able to keep going
  		// // in our current direction.
  		// else {
      //
  		// 	let fromRow: number = getRow();
  		// 	let toRow: number = (game.PENALTY_BOX_EXIT_Y+16)/TILE_SIZE; // yToRow(game.PENALTY_BOX_EXIT_Y);
      //
  		// 	if (fromRow==toRow && this.x==game.PENALTY_BOX_EXIT_X) {
  		// 		setMotionState(MotionState.EYES_ENTERING_BOX);
  		// 	}
  		// 	else {
  		// 		continueInCurrentDirection(moveAmount);
  		// 	}
      //
  		// }

  	}


  	/**
  	 * Updates this ghost's position when it is a set of "eyes" re-entering
  	 * the penalty box.
  	 *
  	 * @param maze The maze in which the ghost is moving.
  	 */
  	private _updatePositionEyesEnteringBox(maze: Maze) {

  		let moveAmount: number = 1;//getMoveAmount();

  		let y: number = this.y;
  		if (y < game.PENALTY_BOX_EXIT_Y + 3 * game.SPRITE_SIZE / 2) {
  			this.direction = Direction.SOUTH; // May be redundant.
  			this.incY(moveAmount);
  		}
  		else {
  			this.motionState = MotionState.LEAVING_BOX;;
  		}

  	}


  	/**
  	 * Updates a ghost's position according to its AI.
  	 *
  	 * @param maze The maze in which the ghost is floating.
  	 */
  	updatePositionImpl(maze: Maze) {

  		switch (this._motionState) {
  			case MotionState.IN_BOX:
  				this.updatePositionInBox(maze);
  				break;
  			case MotionState.LEAVING_BOX:
  				this.updatePositionLeavingBox(maze);
  				break;
  			case MotionState.SCATTERING:
  				this.updatePositionScattering(maze);
  				break;
  			case MotionState.CHASING_PACMAN:
  				this.updatePositionChasingPacman(maze);
  				break;
  			case MotionState.BLUE:
  				this._updatePositionBlue(maze);
  				break;
  			case MotionState.EYES:
  				this._updatePositionEyes(maze);
  				break;
  			case MotionState.EYES_ENTERING_BOX:
  				this._updatePositionEyesEnteringBox(maze);
  				break;
  		}

  	}


  	/**
  	 * Updates an actor's position.
  	 *
  	 * @param maze The maze in which the actor is moving.
  	 */
  	updatePositionInBox(maze: Maze) {

  		let moveAmount: number = 1;//ghost.getMoveAmount();

  		switch (this.direction) {
  			case Direction.WEST: // Never happens
  			case Direction.NORTH:
  				if (this.y > 224) {
  					this.incY(-moveAmount);
  				}
  				else {
  					this.direction = Direction.SOUTH;
  				}
  				break;
  			case Direction.EAST: // Never happens
  			case Direction.SOUTH:
  				if (this.y < 240) {
  					this.incY(moveAmount);
  				}
  				else {
  					this.direction = Direction.NORTH;
  				}
  				break;
  		}

  		// Use game.playTime to ensure proper exit delay, even if game is
  		// paused, etc.
  		if (game.playTime >= this.getFirstExitDelayNanos()) {
  			this.motionState = MotionState.LEAVING_BOX;;
  		}

  	}


  	/**
  	 * Updates an actor's position.
  	 *
  	 * @param maze The maze in which the actor is moving.
  	 */
  	updatePositionLeavingBox(maze: Maze) {

  		let moveAmount: number = 1;//getMoveAmount();

  		let x: number = this.x;
  		if (x < game.PENALTY_BOX_EXIT_X) {
  			this.direction = Direction.EAST; // May be redundant
  			this.incX(moveAmount);
  		}
  		else if (x > game.PENALTY_BOX_EXIT_X) {
  			this.direction = Direction.WEST; // May be redundant
  			this.incX(-moveAmount);
  		}
  		else {
  			let y: number = this.y - moveAmount;
  			this.y = y;
  			if (y === game.PENALTY_BOX_EXIT_Y) {
  				this.motionState = MotionState.SCATTERING;;
  				this.direction = Direction.WEST;
  			}
  			else {
  				this.direction = Direction.NORTH; // May be redundant
  			}
  		}

  	}


  	/**
  	 * Updates an actor's position.
  	 *
  	 * @param maze The maze in which the actor is moving.
  	 */
  	updatePositionScattering(maze: Maze) {

  		// Logic:
  		// At intersections, do a breadth-first search to find the shortest
  		// path to our corner, and head in that direction.

  		// let moveAmount: number = this.moveAmount;
      //
  		// if (this.atIntersection(maze)) {
      //
  		// 	let fromRow: number = this.row;
  		// 	let fromCol: number = this.column;
  		// 	let toRow: number = this.corner.x;
  		// 	let toCol: number = this.corner.y;
  		// 	let node: MazeNode = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);
  		// 	if (!node) { // i.e. ghost is actually in the corner.
  		// 		this.changeDirectionFallback(maze);
  		// 	}
  		// 	else {
  		// 		if (node.col < fromCol) {
  		// 			this.direction = Direction.WEST;
  		// 			this.incX(-moveAmount);
  		// 		}
  		// 		else if (node.col>fromCol) {
  		// 			this.direction = Direction.EAST;
  		// 			this.incX(moveAmount);
  		// 		}
  		// 		else if (node.row<fromRow) {
  		// 			this.direction = Direction.NORTH;
  		// 			this.incY(-moveAmount);
  		// 		}
  		// 		else if (node.row>fromRow) {
  		// 			this.direction = Direction.SOUTH;
  		// 			this.incY(moveAmount);
  		// 		}
  		// 	}
      //
  		// }
      //
  		// // Not at an intersection, so we should be able to keep going
  		// // in our current direction.
  		// else {
  		// 	this.continueInCurrentDirection(moveAmount);
  		// }
      //
  		// if (game.playTime >= this._exitScatteringTime) {
  		// 	this.motionState = MotionState.CHASING_PACMAN;
  		// }

  	}


  }
}