pacman._BaseSprite = function(frameCount) {
   'use strict';
   
   this.bounds = new gtp.Rectangle();
   this._intersectBounds = new gtp.Rectangle();
   this.direction = pacman.Direction.EAST;
   
   this._frame = 0; // The current "frame" to use when painting the sprite
   this._frameCount = frameCount;
   
    // The last time this sprite updated itself, in ms
   this._lastUpdateTime = 0;
};

pacman._BaseSprite.prototype = {
   
   getFrame: function() {
      'use strict';
      return this._frame;
   },
   
   getFrameCount: function() {
      'use strict';
      return this._frameCount;
   },
   
   reset: function() {
      'use strict';
      this._lastUpdateTime = 0;
   },
   
   setLocation: function(x,  y) {
      'use strict';
      this.bounds.x = x;
      this.bounds.y = y;
   }
};
