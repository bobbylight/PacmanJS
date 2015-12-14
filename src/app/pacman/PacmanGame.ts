module pacman {
  'use strict';

  export class PacmanGame extends gtp.Game {

    private _highScore: number;
    private _lives: number;
    private _score: number;
    private _level: number;
    pacman: pacman.Pacman;

    constructor(args?: any) {
      super(args);
      this._highScore = 0;
      this.pacman = new pacman.Pacman();
    }

    drawBigDot(x: number, y: number) {
      var ms = this.getGameTime();
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

    get level(): number {
      return this._level;
    }

    get lives() : number {
      return this._lives;
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

    startGame(level: number) {

        this._lives = 3;
        this._score = 0;
        this._level = 0;

        var levelData = game.assets.get('levels')[level];
        var mazeState = new pacman.MazeState(levelData);
        //this.setState(new gtp.FadeOutInState(this.state, mazeState));
        this.setState(mazeState); // The original did not fade in/out
    }
  }
}
