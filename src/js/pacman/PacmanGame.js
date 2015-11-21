pacman.PacmanGame = function() {
   'use strict';
   gtp.Game.apply(this, arguments);
};

pacman.PacmanGame.prototype = Object.create(gtp.Game.prototype, {
   
   drawString: {
      value: function(x, y, text) {
         'use strict';
         if (!text.charAt) { // Allow us to pass in stuff like numerics
            text = text.toString();
         }
         
         // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
         // calculation of what sub-image to draw is a little convoluted
         var fontImage = this.assets.get('font');
         var ctx = game.canvas.getContext('2d');
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
   }
   
});

pacman.PacmanGame.prototype.constructor = pacman.PacmanGame;
