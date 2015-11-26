pacman.Pacman = function() {
   'use strict';
   
   var frameCount = 3;
   
   pacman._BaseSprite.apply(this, [ frameCount ]);
   
   this._dyingFrame = 0;
};

pacman.Pacman.prototype = Object.create(pacman._BaseSprite.prototype, {
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var SPRITE_SIZE = 16;
         
         var x = this.bounds.x;
         var y = this.bounds.y;
         
         var srcX, srcY;
         if (this._dyingFrame > 0) {
            srcX = SPRITE_SIZE * this._dyingFrame;
            srcY = 96;
         }
         else {
            srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
                  this.getFrame() * SPRITE_SIZE;
            srcY = 80;
         }
         
         game.drawSprite(x,y, srcX,srcY);
      }
   },
   
   reset: {
      value: function() {
         'use strict';
         
         var TILE_SIZE = 8;
         
         pacman._BaseSprite.prototype.reset.apply(this, arguments);
         this.direction = pacman.Direction.WEST;
         this.setLocation(13 * TILE_SIZE, 24 * TILE_SIZE - TILE_SIZE / 2);
         this._frame = 0;
      }
   },
   
   setLocation: {
      value: function() {
         'use strict';
         pacman._BaseSprite.prototype.setLocation.apply(this, arguments);
      }
   }
   
});

pacman.Pacman.prototype.constructor = pacman.Pacman;
