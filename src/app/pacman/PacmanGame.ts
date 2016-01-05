module pacman {
  'use strict';

  /**
	 * The default high score displayed in the game.
	 */
	let DEFAULT_HIGH_SCORE: number = 50000;

  export enum GhostUpdateStrategy {
    UPDATE_ALL, UPDATE_NONE, UPDATE_ONE
  }

  export class PacmanGame extends gtp.Game {

    private _highScore: number;
    private _lives: number;
    private _score: number;
    private _level: number;
    private _ghostUpdateStrategy: GhostUpdateStrategy;
    private _chompSound: number;
    pacman: Pacman;
    private _fruit: Fruit;
    private _ghosts: Ghost[];
    private _extraPointsArray: number[];

    /**
  	 * Whether the player has earned an extra life (from achieving a
  	 * certain score).
  	 */
  	private _earnedExtraLife: boolean;

    /**
  	 * The sound effect currently looping (the background siren, the ghosts
  	 * running away, the ghost eyes running away, etc.).
  	 */
  	private _loopedSoundId: number;

    private _loopedSoundName: string;

    /**
  	 * A flag used internally to decide when a ghost changing state should
  	 * also change the background noise (siren, eyes, etc.).
  	 */
  	private _resettingGhostStates: boolean;

    /**
  	 * The index into the "points" image containing the image for an
  	 * amount of points being earned, e.g. for eating a ghost.
  	 */
  	private _eatenGhostPointsIndex: number;

    /**
  	 * The playtime (in nanoseconds) after which an eaten fruit's score
  	 * should stop displaying.
  	 */
  	private _fruitScoreEndTime: number;

  	/**
  	 * The index into scores of the current fruit.
  	 */
  	private _fruitScoreIndex: number;

    private _godMode: boolean;

    constructor(args?: any) {
      super(args);
      this._highScore = DEFAULT_HIGH_SCORE;
      this.pacman = new Pacman();
      this._ghosts = this._createGhostArray();
      this._chompSound = 0;
      this._ghostUpdateStrategy = GhostUpdateStrategy.UPDATE_ALL;
      this._score = 0; // For title screen

      this._extraPointsArray = [ 100, 200, 300, 400, 500, 700, 800,
                                1000, 1600, 2000, 3000, 5000 ];
    }

    addFruit() {
      if (!this._fruit) { // Should always be true.
  			this._fruit = new Fruit(); // Made appropriate for current level.
  			this._fruitScoreIndex = -1;
  			this._fruitScoreEndTime = -1;
  		}
    }

    checkForCollisions(): Ghost {

  		for (let i: number = 0; i < this._ghosts.length; i++) {
  			if (this.pacman.intersects(this._ghosts[i])) {
  				return this._ghosts[i];
  			}
  		}

  		if (this._fruit && this._fruitScoreIndex === -1 &&
          this.pacman.intersects(this._fruit)) {
  			this.increaseScore(this._extraPointsArray[this._fruit.pointsIndex]);
  			this.audio.playSound(Sounds.EATING_FRUIT, false);
  			this._fruitScoreIndex = this._fruit.pointsIndex;
  			this._fruitScoreEndTime = game.playTime + PacmanGame.SCORE_DISPLAY_LENGTH;
  		}

  		return null;
  	}

    /**
  	 * Ensures the background sound effect being played is appropriate for
  	 * the ghosts' current states.
  	 */
  	checkLoopedSound() {

  		if (this._resettingGhostStates) {
  			return;
  		}

  		let blue: boolean = false;

  		for (let i: number = 0; i < this._ghosts.length; i++) {
  			if (this._ghosts[i].isEyes()) {
  				this.setLoopedSound(Sounds.EYES_RUNNING);
  				return; // "eye" noise trumps blue noise.
  			}
  			else if (this._ghosts[i].isBlue()) {
  				blue = true;
  			}
  		}

  		this.setLoopedSound(blue ? Sounds.CHASING_GHOSTS : Sounds.SIREN);

  	}

    /**
  	 * Creates the array of ghosts the game will use.
  	 *
  	 * @return The array of ghosts.
  	 */
  	private _createGhostArray(): Ghost[] {
  		let ghosts: Ghost[] = [];
  		this._resettingGhostStates = true;
  		ghosts.push(new Blinky(this));
      ghosts.push(new Pinky(this));
      ghosts.push(new Inky(this));
      ghosts.push(new Clyde(this));
  		this._resettingGhostStates = false;
  		return ghosts;
  	}

    drawBigDot(x: number, y: number) {
      const ms: number = this.playTime;
      if (ms < 0 || (ms % 500) > 250) {
         const ctx = this.canvas.getContext('2d');
         const sx = 135,
             sy = 38;
         game.assets.get('sprites').drawScaled2(ctx, sx,sy,8,8, x,y,8,8);
      }
    }

    drawFruit(ctx: CanvasRenderingContext2D) {
      if (this._fruitScoreIndex > -1) {
  			this.paintPointsEarned(ctx, this._fruitScoreIndex,
            this._fruit.x, this._fruit.y);
  			let time: number = game.playTime;
  			if (time >= this._fruitScoreEndTime) {
  				this._fruit = null;
  				this._fruitScoreIndex = -1;
  				this._fruitScoreEndTime = -1;
  			}
  		}
  		else if (this._fruit) {
  			this._fruit.paint(ctx);
  		}
    }

    /**
  	 * Paints all four ghosts in their present location and state.
  	 *
  	 * @param ctx The context with which to paint.
  	 */
  	drawGhosts(ctx: CanvasRenderingContext2D) {
  		this._ghosts.forEach(function(ghost) {
        ghost.paint(ctx);
      });
  	}

    drawScores(ctx: CanvasRenderingContext2D) {

      let scoreStr: string = this._score.toString();
      let x: number = 55 - scoreStr.length * 8;
      let y: number = 10;
      this.drawString(x,y, scoreStr, ctx);

      scoreStr = this._highScore.toString();
      x = 132 - scoreStr.length * 8;
      this.drawString(x,y, scoreStr, ctx);
    }

    drawScoresHeaders(ctx: CanvasRenderingContext2D) {
       this.drawString(16, 0, '1UP', ctx);
       this.drawString(67, 0, 'HIGH SCORE', ctx);
    }

    drawSmallDot(x: number, y: number) {
      let ctx = this.canvas.getContext('2d');
      ctx.fillRect(x, y, 2, 2);
    }

    drawSprite(dx: number, dy: number, sx: number, sy: number) {
      let image = game.assets.get('sprites');
      let ctx = this.canvas.getContext('2d');
      image.drawScaled2(ctx, sx,sy,16,16, dx,dy,16,16);
    }

    drawString(x: number, y: number, text: string|number,
        ctx: CanvasRenderingContext2D = game.canvas.getContext('2d')) {

      let str = text.toString(); // Allow us to pass in stuff like numerics

      // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
      // calculation of what sub-image to draw is a little convoluted
      let fontImage = this.assets.get('font');
      let alphaOffs = 'A'.charCodeAt(0);
      let numericOffs = '0'.charCodeAt(0);
      let index: number;

      for (let i = 0; i < str.length; i++) {

         let ch = str[i];
         let chCharCode = str.charCodeAt(i);
         if (ch >= 'A' && ch <= 'Z') {
            index = fontImage.colCount + (chCharCode - alphaOffs);
         }
         else if (ch >= '0' && ch <= '9') {
            index = chCharCode - numericOffs;
         }
         else {
            switch (ch) {
               case '-':
                  index = 10;
                  break;
               case '.':
                  index = 11;
                  break;
               case '>':
                  index = 12;
                  break;
               case '@':
                  index = 13;
                  break;
               case '!':
                  index = 14;
                  break;
               default:
                  index = 15; // whitespace
                  break;
            }
         }
         fontImage.drawByIndex(ctx, x, y, index);
         x += 9;//CHAR_WIDTH
      }
    }

    getGhost(index: number): Ghost {
      return this._ghosts[index];
    }

    get godMode(): boolean {
      return this._godMode;
    }

    static get EXTRA_LIFE_SCORE(): number {
      return 10000;
    }

    get level(): number {
      return this._level;
    }

    get lives() : number {
      return this._lives;
    }

    get PENALTY_BOX_EXIT_X(): number {
      return (this.getWidth() - PacmanGame.SPRITE_SIZE) / 2;
    }

  	get PENALTY_BOX_EXIT_Y(): number {
      return 12 * PacmanGame.TILE_SIZE - PacmanGame.TILE_SIZE / 2;
    }

    /**
  	 * Amount of time, in milliseconds, that points earned by Pacman should
  	 * be displayed (e.g. from eating a ghost or a fruit).
  	 */
    static get SCORE_DISPLAY_LENGTH(): number {
      return 750;
    }

    static get SPRITE_SIZE(): number {
      return 16;
    }

    static get TILE_SIZE(): number {
      return 8;
    }

    ghostEaten(ghost: Ghost): number {

  		switch (this._eatenGhostPointsIndex) {
  			case 0: // 1st ghost eaten
  				this._eatenGhostPointsIndex = 1;
  				break;
  			case 1: // 2nd ghost
  				this._eatenGhostPointsIndex = 3;
  				break;
  			case 3: // 3rd ghost
  				this._eatenGhostPointsIndex = 6;
  				break;
  			default: // Should never happen.
  			case 6: // 4th ghost
  				this._eatenGhostPointsIndex = 8;
  				break;
  		}
  		this.increaseScore(this._extraPointsArray[this._eatenGhostPointsIndex]);

  		this.audio.playSound(Sounds.EATING_GHOST);
  		return this._eatenGhostPointsIndex;
  	}

    increaseLives(amount: number): number {
      return this._lives += amount;
    }

    increaseScore(amount: number) {

      this._score += amount;
      if (this._score > this._highScore) {
        this._highScore = this._score;
      }

      if (!this._earnedExtraLife && this._score >= PacmanGame.EXTRA_LIFE_SCORE) {
        this.audio.playSound(Sounds.EXTRA_LIFE);
        this.increaseLives(1);
        this._earnedExtraLife = true;
      }
    }

    loadNextLevel() {
      this.setLoopedSound(null);
  		this._level++;
  		this._fruit = null;
  		this._fruitScoreIndex = -1;
  		this._fruitScoreEndTime = -1;
      let state: MazeState = <MazeState>this.state;
      state.reset();
    }

    makeGhostsBlue() {
      this._eatenGhostPointsIndex = 0;
      this._ghosts.forEach(function(ghost) {
        ghost.possiblyTurnBlue();
      });
      // Don't just change to "blue" sound as "eyes" sound trumps "blue".
  		this.checkLoopedSound();
    }

    /**
     * Paints the "points earned," for example, when PacMan eats a ghost or
     * fruit.
     *
     * @param {CanvasContext2D} ctx The graphics context to use.
     * @param {int} ptsIndex The index into the points array.
     * @param {int} dx The x-coordinate at which to draw.
     * @param {int} dy The y-coordinate at which to draw.
     */
    paintPointsEarned(ctx: CanvasRenderingContext2D, ptsIndex: number, dx: number, dy: number) {
      let points: gtp.SpriteSheet = game.assets.get('points');
      points.drawByIndex(ctx, dx, dy, ptsIndex);
    }

    /**
     * Plays the next appropriate chomp sound.
     */
    playChompSound() {
      this.audio.playSound(this._chompSound === 0 ?
          Sounds.CHOMP_1 : Sounds.CHOMP_2);
      this._chompSound = (this._chompSound + 1) % 2;
    }

    resetGhosts() {

      this._resettingGhostStates = true;

      // Have each ghost go to one of four random corners while in scatter
      // mode, but ensure each ghost goes to a different corner.
      let corners: gtp.Point[] = [
        new gtp.Point(2, 1),
        new gtp.Point(2, Maze.TILE_COUNT_HORIZONTAL - 2),
        new gtp.Point(Maze.TILE_COUNT_VERTICAL - 2, 1),
        new gtp.Point(Maze.TILE_COUNT_VERTICAL - 2, Maze.TILE_COUNT_HORIZONTAL - 2)
      ];
      let cornerSeed: number = gtp.Utils.randomInt(4);

      for (let i: number = 0; i < this._ghosts.length; i++) {
        this._ghosts[i].reset();
        this._ghosts[i].setCorner(corners[(cornerSeed + i) % 4]);
      }

      this._resettingGhostStates = false;
    }

    /**
     * Starts looping a sound effect.
     * @param {string} sound The sound effect to loop.
     */
    setLoopedSound(sound: string) {
      if (sound !== this._loopedSoundName) {
        if (this._loopedSoundId != null) {
          this.audio.stopSound(this._loopedSoundId);
        }
        this._loopedSoundName = sound;
        if (sound != null) {
          this._loopedSoundId = game.audio.playSound(sound, true);
        }
        else {
          this._loopedSoundId = null;
        }
      }
    }

    /**
  	 * Sets whether to update none, one, or all of the ghosts' positions
  	 * each frame.  This is used for debugging purposes.
  	 * @param state How many ghosts to update.
  	 */
  	set ghostUpdateStrategy(strategy: GhostUpdateStrategy) {
  		this._ghostUpdateStrategy = strategy;
  	}

    toggleGodMode(): boolean {
      this._godMode = !this._godMode;
      this.setStatusMessage('God mode ' + (this._godMode ? 'enabled' : 'disabled'));
      return this._godMode;
    }

    startGame(level: number) {

        this._lives = 3;
        this._score = 0;
        this._level = 0;

        let levelData = game.assets.get('levels')[level];
        let mazeState = new pacman.MazeState(levelData);
        //this.setState(new gtp.FadeOutInState(this.state, mazeState));
        this.setState(mazeState); // The original did not fade in/out
    }

    startPacmanDying() {
      this.setLoopedSound(null);
      this.audio.playSound(pacman.Sounds.DIES);
      this.pacman.startDying();
      this._fruit = null;
      this._fruitScoreIndex = -1;
      this._fruitScoreEndTime = -1;
    }

    /**
  	 * Goes to the next animation frame for pacman, the ghosts and the
  	 * fruit.
  	 */
  	updateSpriteFrames() {
  		this.pacman.updateFrame();
      this._ghosts.forEach(function(ghost: Ghost) {
        ghost.updateFrame();
      });
  	}

  	/**
  	 * Updates the position of pacman, the ghosts and the fruit, in the
  	 * specified maze.
  	 * @param {Maze} maze The maze.
     * @param {number} time
  	 */
  	updateSpritePositions(maze: Maze, time: number) {

  		// NOTE: We MUST update ghost positions before PacMan position.  This
  		// is because pacman.upatePosition() can cause the engine's "playtime"
  		// to reset to 0, which in turn will mess up the ghosts'
  		// updatePosition() calls (since we're using a "cached" time to pass
  		// to them).  This is seen when PacMan eats the last dot in a level
  		// and the next level is loaded.

  		switch (this._ghostUpdateStrategy) {
  			case GhostUpdateStrategy.UPDATE_ALL:
          this._ghosts.forEach(function(ghost: Ghost) {
            ghost.updatePosition(maze, time);
          });
  				break;
  			case GhostUpdateStrategy.UPDATE_NONE:
  				break;
  			case GhostUpdateStrategy.UPDATE_ONE:
  				this._ghosts[0].updatePosition(maze, time);
  				break;
  		}

  		this.pacman.updatePosition(maze, time);

  	}
  }
}
