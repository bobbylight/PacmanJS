pacman.TitleState = function() {
   'use strict';
   pacman._BaseState.apply(this, arguments);
   this.assetsLoaded = false;
};

pacman.TitleState.prototype = Object.create(pacman._BaseState.prototype, {
   
   init: {
      value: function() {
         'use strict';
         pacman._BaseState.prototype.init.apply(this, arguments);
         game.canvas.addEventListener('touchstart', this.handleStart, false);
         this._delay = new gtp.Delay({ millis: [ 600, 400 ] });
         this._blink = true;
         this._choice = 0;
         game.audio.playMusic(pacman.Sounds.MUSIC_TITLE_SCREEN);
      }
   },
   
   leaving: {
      value: function(game) {
         'use strict';
         game.canvas.removeEventListener('touchstart', this.handleStart, false);
      }
   },
   
handleStart: {
   value: function() {
      'use strict';
      console.log('yee, touch detected!');
      this._startGame();
   }
},

   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (this._delay.update(delta)) {
            this._delay.reset();
            this._blink = !this._blink;
         }
         
         var im = game.inputManager;
         if (im.up(true)) {
            this._choice = Math.abs(this._choice - 1);
            game.audio.playSound(pacman.Sounds.TOKEN);
         }
         else if (im.down(true)) {
            this._choice = (this._choice + 1) % 2;
            game.audio.playSound(pacman.Sounds.TOKEN);
         }
         else if (im.enter(true)) {
            this._startGame();
         }
         
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var charWidth = 9;
         
         this._renderStaticStuff(ctx);
         
         // Draw the menu "choice" arrow
         // " - 5" to account for differently sized choices
         var x = (game.getWidth() - charWidth * 15) / 2 - 5;
         var y = (game.getHeight() - 15 * 2) / 2;
         game.drawString(x, y + this._choice * 15, '>');
         
//         if (!game.audio.isInitialized()) {
//            var text = 'Sound is disabled as your';
//            x = ( w - game.stringWidth(text)) / 2;
//            y = 390;
//            game.drawString(text, x, y);
//            text = 'browser does not support';
//            x = ( w - game.stringWidth(text)) / 2;
//            y += 26;
//            game.drawString(text, x, y);
//            text = 'web audio';
//            x = (w - game.stringWidth(text)) / 2;
//            y += 26;
//            game.drawString(text, x, y);
//         }
//         
//         if (this._blink) {
//            var prompt = 'Press Enter';
//            x = (w - game.stringWidth(prompt)) / 2;
//            y = 240;
//            game.drawString(prompt, x, y);
//         }
      }
   },
   
   // TODO: Move this into an image that gets repainted each frame?
   _renderStaticStuff: {
      
      value: function(ctx) {
         'use strict';
         
         var game = this.game;
         game.clearScreen('rgb(0,0,0)');
         var SCREEN_WIDTH = game.getWidth();
         var charWidth = 9;
         
         // Title image
         var titleImage = game.assets.get('title');
         var x = (SCREEN_WIDTH - titleImage.width) / 2;
         var y = titleImage.height * 1.2;
         titleImage.draw(ctx, x, y);
         
         // Game menu
         var temp = 'STANDARD MAZE';
         var charCount = temp.length - 1; // "-1" for selection arrow
         // " - 5" to account for differently sized choices
         x = (SCREEN_WIDTH - charWidth * charCount) / 2 - 5;
         y = (game.getHeight() - 15 * 2) / 2;
         game.drawString(x, y, temp);
         temp = 'ALTERNATE MAZE';
         y += 15;
         game.drawString(x, y, temp);
         
         // TODO: Render the dot scores.
         
         // Copyright
         temp = '2015 OLD MAN GAMES';
         x = (SCREEN_WIDTH - charWidth * temp.length) / 2;
         y = game.getHeight() - 20;
         game.drawString(x, y, temp);
      }
   },
   
   _adjustGameMap: {
      
      value: function() {
         'use strict';
         
         var map = game.map;
         
         // Hide layers that shouldn't be shown (why aren't they marked as hidden
         // in Tiled?)
         for (var i=0; i<map.getLayerCount(); i++) {
            var layer = map.getLayerByIndex(i);
            if (layer.name !== 'tileLayer') {
               layer.visible = false;
            }
         }
      }
      
   },
   
   _startGame: {
      value: function() {
         'use strict';
         game.startNewGame();
      }
   }
   
});

pacman.TitleState.prototype.constructor = pacman.TitleState;
