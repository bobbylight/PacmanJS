module pacman {
  'use strict';

  enum Substate {
    READY,
    IN_GAME,
    DYING,
    GAME_OVER
  }

  export class MazeState extends _BaseState {

    private _mazeFile: string;
    private _maze: Maze;
    private _firstTimeThrough: boolean;
    private _updateScoreIndex: number;
    private _substate: Substate;
    private _substateStartTime: number;
    private _lastMazeScreenKeypressTime: number;

    constructor(mazeFile: string) {
      super();
      this._mazeFile = mazeFile;
    }

    init() {

      game.pacman.reset();
      //game.resetGhosts();

      this._maze = new Maze(this._mazeFile);
      this._firstTimeThrough = true;
      this._updateScoreIndex = -1;

      // Prevents the user's "Enter" press to start the game from being
  		// picked up by our handleInput().
  		this._lastMazeScreenKeypressTime = gtp.Utils.timestamp() + this.inputRepeatMillis;

  		this._substate = Substate.READY;
  		this._firstTimeThrough = true;
  		this._substateStartTime = 0;
    }

    _paintExtraLives(ctx: CanvasRenderingContext2D) {

      // The indentation on either side of the status stuff at the bottom
      // (extra life count, possible fruits, etc.).
      var BOTTOM_INDENT = 24;
      var TILE_SIZE = 8;

      var lives = game.lives;
      if (lives > 0) {
         var x = BOTTOM_INDENT;
         var y = game.getHeight() - 2 * TILE_SIZE;
         var w = 2 * TILE_SIZE;
         for (var i = 0; i < lives; i++) {
            game.drawSprite(x, y, 12*16, 3*16);
            x += w;
         }
      }
  }

    _paintPossibleFruits(ctx: CanvasRenderingContext2D) {

      // The indentation on either side of the status stuff at the bottom
      // (extra life count, possible fruits, etc.).
      var BOTTOM_INDENT = 24;
      var TILE_SIZE = 8;

      var x = game.getWidth() - BOTTOM_INDENT - 2 * TILE_SIZE;
      var y = game.getHeight() - 2 * TILE_SIZE;

      switch (game.level) {
         default:
         case 7: // Key
            game.drawSprite(x-112,y, 13*16,3*16);
            // Fall through
         case 6: // Space Invaders ship
            game.drawSprite(x-96,y, 13*16,6*16);
            // Fall through
         case 5: // Green thing (grapes?)
            game.drawSprite(x-160,y, 12*16,6*16);
            // Fall through.
         case 4: // Apple
            game.drawSprite(x-128,y, 13*16,2*16);
            // Fall through.
         case 3: // Yellow bell
            game.drawSprite(x-96,y, 13*16,5*16);
            // Fall through.
         case 2: // Peach
            game.drawSprite(x-64,y, 12*16,5*16);
            // Fall through.
         case 1: // Strawberry
            game.drawSprite(x-32,y, 13*16,4*16);
            // Fall through.
         case 0: // Cherry
            game.drawSprite(x,y, 12*16,4*16);
            break;
      }
    }

    render(ctx: CanvasRenderingContext2D) {

      super.render(ctx);
      this._maze.render(ctx);

      // "window.pacman" because of hoisting of pacman var below
      var TILE_SIZE = 8;
      var mazeY = game.getHeight() - 2*TILE_SIZE -
            Maze.TILE_COUNT_VERTICAL * TILE_SIZE;
      ctx.translate(0, mazeY);

      //game.paintFruit(ctx);

      var pacman = game.pacman;
      if (this._updateScoreIndex === -1) {
         if (this._substate !== Substate.GAME_OVER) {
            pacman.render(ctx);
         }
      }
      else {
         var x = pacman.bounds.x;
         var y = pacman.bounds.y;
         game.paintPointsEarned(ctx, this._updateScoreIndex, x, y);
      }

      //game.paintGhosts(ctx);

      ctx.translate(0, -mazeY);

      game.drawScores(ctx);
      this._paintExtraLives(ctx);
      this._paintPossibleFruits(ctx);

      if (this._substate === Substate.READY) {
        // These calculations should be fast enough, especially considering
  			// that "READY!" is only displayed for about 4 seconds.
  			var ready: string = 'READY!';
  			var x: number = (game.getWidth() - ready.length * 9) / 2;
  			// Give "Ready!" a little nudge to the right.  This is because the
  			// ending '!' doesn't fill up the standard 8 pixels for a character,
  			// so "READY!" looks slightly too far to the left without it.
  			x += 3;
        game.drawString(x, 160, ready);
      }
      else if (this._substate === Substate.GAME_OVER) {
        var gameOver: string = 'GAME OVER';
  			var x: number = (game.getWidth() - gameOver.length * 9) / 2;
  			game.drawString(x, 160, gameOver);
      }

      if (game.paused) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
        ctx.globalAlpha = 1;
        ctx.fillRect(50, 100, game.getWidth() - 100, game.getHeight() - 200);
        var paused: string = 'PAUSED';
        var x: number = (game.getWidth() - paused.length * 9) / 2;
        game.drawString(x, (game.getHeight() - 18) / 2, paused);
      }
    }

    update(delta: number) {
      super.update(delta);
    }
  }
}
