pacman.PacmanGame = function() {
   'use strict';
   gtp.Game.apply(this, arguments);
   this._highScore = 0;
};

pacman.PacmanGame.prototype = Object.create(gtp.Game.prototype, {
   
   drawBigDot: {
      value: function(x, y) {
         'use strict';
         var ms = this.getGameTime();
         if (ms < 0 || (ms % 500) > 250) {
            var ctx = this.canvas.getContext('2d');
            var sx = 135,
                sy = 38;
            game.assets.get('sprites').drawScaled2(ctx, sx,sy,8,8, x,y,8,8);
         }
      }
   },
   
   drawScores: {
      value: function(ctx) {
         'use strict';
         
         var scoreStr = this._score.toString();
         var x = 55 - scoreStr.length * 8;
         var y = 10;
         this.drawString(ctx, x,y, scoreStr);
         
         scoreStr = this._highScore.toString();
         x = 132 - scoreStr.length * 8;
         this.drawString(ctx, x,y, scoreStr);
      }
   },
   
   drawSmallDot: {
      value: function(x, y) {
         'use strict';
         var ctx = this.canvas.getContext('2d');
         ctx.fillRect(x, y, 2, 2);
      }
   },
   
   drawSprite: {
      value: function(dx, dy, sx, sy) {
         'use strict';
         var image = game.assets.get('sprites');
         var ctx = this.canvas.getContext('2d');
         image.drawScaled2(ctx, sx,sy,16,16, dx,dy,16,16);
      }
   },
   
   /**
    * Renders a string with this game's bitmap font.
    * 
    * @param {CanvasContext2D} [ctx] The context to render to.  Defaults to the
    *        game's screen context.
    * @param {int} x The x-coordinate at which to write the text.
    * @param {int} y The y-coordinate at which to write the text (top left,
    *        not baseline).
    * @param {string} text The text to write.
    */
   drawString: {
      value: function(ctx, x, y, text) {
         'use strict';
         
         if (arguments.length === 3) { // ctx is optional
            text = y;
            y = x;
            x = ctx;
            ctx = game.canvas.getContext('2d');
         }
         
         if (!text.charAt) { // Allow us to pass in stuff like numerics
            text = text.toString();
         }
         
         // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
         // calculation of what sub-image to draw is a little convoluted
         var fontImage = this.assets.get('font');
         var alphaOffs = 'A'.charCodeAt(0);
         var numericOffs = '0'.charCodeAt(0);
         var index;
         
         for (var i = 0; i < text.length; i++) {
            
            var ch = text[i];
            var chCharCode = text.charCodeAt(i);
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
   },
   
   getLevel: {
      value: function() {
         'use strict';
         return this._level;
      }
   },
   
   getLives: {
      value: function() {
         'use strict';
         return this._lives;
      }
   },
   
   startGame: {
      value: function(level) {
         'use strict';
         
         this._lives = 3;
         this._score = 0;
         this._level = 0;
         
         var levelData = game.assets.get('levels')[level];
         var mazeState = new pacman.MazeState(levelData);
         //this.setState(new gtp.FadeOutInState(this.state, mazeState));
         this.setState(mazeState); // The original did not fade in/out
      }
   },
   
});

pacman.PacmanGame.prototype.constructor = pacman.PacmanGame;
