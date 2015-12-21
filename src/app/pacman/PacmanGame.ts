module pacman {
  'use strict';

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
    pacman: pacman.Pacman;

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

    constructor(args?: any) {
      super(args);
      this._highScore = 0;
      this.pacman = new pacman.Pacman();
      this._chompSound = 0;
      this._ghostUpdateStrategy = GhostUpdateStrategy.UPDATE_ALL;
    }

    addFruit() {
      // TODO
    }

    drawBigDot(x: number, y: number) {
      var ms = this.playTime;
      if (ms < 0 || (ms % 500) > 250) {
         var ctx = this.canvas.getContext('2d');
         var sx = 135,
             sy = 38;
         game.assets.get('sprites').drawScaled2(ctx, sx,sy,8,8, x,y,8,8);
      }
    }

    drawScores(ctx: CanvasRenderingContext2D) {

      var scoreStr = this._score.toString();
      var x = 55 - scoreStr.length * 8;
      var y = 10;
      this.drawString(x,y, scoreStr, ctx);

      scoreStr = this._highScore.toString();
      x = 132 - scoreStr.length * 8;
      this.drawString(x,y, scoreStr, ctx);
    }

    drawSmallDot(x: number, y: number) {
      var ctx = this.canvas.getContext('2d');
      ctx.fillRect(x, y, 2, 2);
    }

    drawSprite(dx: number, dy: number, sx: number, sy: number) {
      var image = game.assets.get('sprites');
      var ctx = this.canvas.getContext('2d');
      image.drawScaled2(ctx, sx,sy,16,16, dx,dy,16,16);
    }

    drawString(x: number, y: number, text: string|number,
        ctx: CanvasRenderingContext2D = game.canvas.getContext('2d')) {

      var str = text.toString(); // Allow us to pass in stuff like numerics

      // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
      // calculation of what sub-image to draw is a little convoluted
      var fontImage = this.assets.get('font');
      var alphaOffs = 'A'.charCodeAt(0);
      var numericOffs = '0'.charCodeAt(0);
      var index: number;

      for (var i = 0; i < str.length; i++) {

         var ch = str[i];
         var chCharCode = str.charCodeAt(i);
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

    static get EXTRA_LIFE_SCORE(): number {
      return 10000;
    }

    increaseLives(amount: number): number {
      return this._lives += amount;
    }

    increaseScore(amount: number) {
      this._score += amount;
      if (!this._earnedExtraLife && this._score >= PacmanGame.EXTRA_LIFE_SCORE) {
        this.audio.playSound(Sounds.EXTRA_LIFE);
        this.increaseLives(1);
        this._earnedExtraLife = true;
      }
    }

    get level(): number {
      return this._level;
    }

    get lives() : number {
      return this._lives;
    }

    loadNextLevel() {
      // TODO
    }

    makeGhostsBlue() {
      // TODO
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
          'use strict';
 //         var y = 9 * ptsIndex;
 //         this._ptsImage.drawScaled2(ctx, 0,y, 17,9, dx,dy, 17,9);
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
      var corners: gtp.Point[] = [
        new gtp.Point(2, 1),
        new gtp.Point(2, Maze.TILE_COUNT_HORIZONTAL - 2),
        new gtp.Point(Maze.TILE_COUNT_VERTICAL - 2, 1),
        new gtp.Point(Maze.TILE_COUNT_VERTICAL - 2, Maze.TILE_COUNT_HORIZONTAL - 2)
      ];
      var cornerSeed: number = gtp.Utils.randomInt(4);

      // for (var i: number = 0; i < ghosts.length; i++) {
      //   ghosts[i].reset();
      //   ghosts[i].setCorner(corners[(cornerSeed + i) % 4]);
      // }

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


    startGame(level: number) {

        this._lives = 3;
        this._score = 0;
        this._level = 0;

        var levelData = game.assets.get('levels')[level];
        var mazeState = new pacman.MazeState(levelData);
        //this.setState(new gtp.FadeOutInState(this.state, mazeState));
        this.setState(mazeState); // The original did not fade in/out
    }

    /**
  	 * Goes to the next animation frame for pacman, the ghosts and the
  	 * fruit.
  	 */
  	updateSpriteFrames() {
  		this.pacman.updateFrame();
      // TODO
      // ghosts.forEach(function(ghost: Ghost) {
      //   ghost.updateFrame();
      // });
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
          // this._ghosts.forEach(function(ghost: Ghost) {
          //   ghost.updatePosition(maze, time);
          // });
  				break;
  			case GhostUpdateStrategy.UPDATE_NONE:
  				break;
  			case GhostUpdateStrategy.UPDATE_ONE:
  				// this._ghosts[0].updatePosition(maze, time);
  				break;
  		}

  		this.pacman.updatePosition(maze, time);

  	}
  }
}
