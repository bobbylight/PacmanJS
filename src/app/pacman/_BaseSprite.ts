module pacman {
  'use strict';

  export abstract class _BaseSprite {

    bounds: gtp.Rectangle;
    _intersectBounds: gtp.Rectangle;
    direction: Direction;
    _frame: number;
    _frameCount: number;
    _lastUpdateTime: number;

    constructor(frameCount: number) {
      this.bounds = new gtp.Rectangle();
      this._intersectBounds = new gtp.Rectangle();
      this.direction = Direction.EAST;
      this._frame = 0;
      this._frameCount = frameCount;
      this._lastUpdateTime = 0;
    }

    getCanMoveDown(maze: Maze) {
  		let x: number = this.bounds.x+8;
  		let y: number = this.bounds.y+8;
  		let xRemainder: number = x % this.TILE_SIZE;
  		let yRemainder: number = y % this.TILE_SIZE;//(y+TILE_SIZE) % this.TILE_SIZE;
  		if (xRemainder === 0 && yRemainder === 0) {
  			let row: number = this.row;
  			let col: number = this.column;
  			return row<30 && maze.isWalkable(row + 1, col);
  		}
  		return this.direction == Direction.NORTH || this.direction == Direction.SOUTH;
  	}


  	getCanMoveLeft(maze: Maze) {
  		let x: number = this.bounds.x;
  		if (x<0) {
  			return true; // Going through tunnel.
  		}
  		x += 8;
  		let y: number = this.bounds.y + 8;
  		let xRemainder: number = x % this.TILE_SIZE;//(x-TILE_SIZE) % this.TILE_SIZE;
  		let yRemainder: number = y % this.TILE_SIZE;
  		if (xRemainder === 0 && yRemainder === 0) {
        let row: number = this.row;
  			let col: number = this.column;
  			return col>0 && maze.isWalkable(row, col - 1);
  		}
      return this.direction == Direction.EAST || this.direction == Direction.WEST;
  	}


  	getCanMoveRight(maze: Maze) {
  		let x: number = this.bounds.x;
  		if (x + this.width > this.SCREEN_WIDTH) {
  			return true; // Going through tunnel.
  		}
  		x += 8;
  		let y: number = this.bounds.y + 8;
  		let xRemainder: number = x % this.TILE_SIZE;//(x+TILE_SIZE) % this.TILE_SIZE;
  		let yRemainder: number = y % this.TILE_SIZE;
  		if (xRemainder === 0 && yRemainder === 0) {
        let row: number = this.row;
  			let col: number = this.column;
  			return col<27 && maze.isWalkable(row, col + 1);
  		}
      return this.direction == Direction.EAST || this.direction == Direction.WEST;
  	}


  	getCanMoveUp(maze: Maze) {
  		let x: number = this.bounds.x + 8;
  		let y: number = this.bounds.y + 8;
  		let xRemainder: number = x % this.TILE_SIZE;
  		let yRemainder: number = y % this.TILE_SIZE;//(y-TILE_SIZE) % this.TILE_SIZE;
  		if (xRemainder === 0 && yRemainder === 0) {
        let row: number = this.row;
  			let col: number = this.column;
  			return row>0 && maze.isWalkable(row - 1, col);
  		}
      return this.direction == Direction.NORTH || this.direction == Direction.SOUTH;
  	}

    getFrame() {
       return this._frame;
    }

    getFrameCount() {
       return this._frameCount;
    }

    get centerX(): number {
      return this.bounds.x + 8;
    }

    get centerY(): number {
      return this.bounds.y + 8;
    }

    get column(): number {

      var col: number = Math.floor(this.centerX / this.TILE_SIZE);

      // Do "bounds checking" to correct for when sprites are going through
      // tunnels
      if (col < 0) {
        col += Maze.TILE_COUNT_HORIZONTAL;
      }
      else if (col >= Maze.TILE_COUNT_HORIZONTAL) {
        col -= Maze.TILE_COUNT_HORIZONTAL;
      }

      return col;
    }

    get moveAmount(): number {
      return 1; // TODO: Perhaps this is no longer needed?
    }

    get row(): number {
      return Math.floor(this.centerY / this.TILE_SIZE);
    }

    /**
     * Returns the number of milliseconds that should pass between the times
     * this sprite moves.
     * @return {number} The number of milliseconds.
     */
    abstract getUpdateDelayMillis(): number;

    goDownIfPossible(maze: Maze, moveAmount: number): boolean {
  		if (this.getCanMoveDown(maze)) {
  			this.direction = Direction.SOUTH;
  			this._incY(moveAmount);
  			return true;
  		}
  		return false;
  	}

  	goLeftIfPossible(maze: Maze, moveAmount: number): boolean {
  		if (this.getCanMoveLeft(maze)) {
  			this.direction = Direction.WEST; // May be redundant.
  			this._incX(-moveAmount);
  			return true;
  		}
  		return false;
  	}

  	goRightIfPossible(maze: Maze, moveAmount: number): boolean {
  		if (this.getCanMoveRight(maze)) {
  			this.direction = Direction.EAST; // May be redundant.
  			this._incX(moveAmount);
  			return true;
  		}
  		return false;
  	}

  	goUpIfPossible(maze: Maze, moveAmount: number): boolean {
  		if (this.getCanMoveUp(maze)) {
  			this.direction = Direction.NORTH;
  			this._incY(-moveAmount);
  			return true;
  		}
  		return false;
  	}

    private _incX(amount: number) {
      this.bounds.x += amount;
      if (this.bounds.x + this.width <= 0) { // Going through tunnel
        this.bounds.x += this.SCREEN_WIDTH;
      }
      else if (this.bounds.x >= this.SCREEN_WIDTH) {
        this.bounds.x -= this.SCREEN_WIDTH;
      }
    }

    private _incY(amount: number) {
      this.bounds.y += amount;
    }

    reset() {
       this._lastUpdateTime = 0;
    }

    get SCREEN_WIDTH(): number { // TODO: Move somewhere more generic
      return 224;
    }

    setLocation(x: number,  y: number) {
       this.bounds.x = x;
       this.bounds.y = y;
    }

    get TILE_SIZE(): number {
      return 8; // TODO: Move this somewhere more generic
    }

    updateFrame() {
      this._frame = (this._frame + 1) % this.getFrameCount();
    }

    updatePosition(maze: Maze, time: number) {
      if (time > this._lastUpdateTime + this.getUpdateDelayMillis()) {
        this._lastUpdateTime = time;
        this.updatePositionImpl(maze);
      }
    }

    get width(): number {
      return this.bounds.w;
    }

    abstract updatePositionImpl(maze: Maze): void;
  }
}
