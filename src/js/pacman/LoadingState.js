pacman.LoadingState = function(args) {
   'use strict';
   pacman._BaseState.apply(this, args);
   this.assetsLoaded = false;
};

pacman.LoadingState.prototype = Object.create(pacman._BaseState.prototype, {
   
   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (!this.assetsLoaded) {
            
            this.assetsLoaded = true;
            var game = this.game;
            var self = this;
            
            // Load assets used by this state first
            game.assets.addImage('loading', 'res/loadingMessage.png');
            game.assets.onLoad(function() {
               
               self._loadingImage = game.assets.get('loading');
            
               game.assets.addImage('title', 'res/title.png');
               game.assets.addSpriteSheet('font', 'res/font.png', 9,7, 0,0);
               game.assets.addImage('sprites', 'res/sprite_tiles.png');
               game.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8,8, 0,0);
               game.assets.addJson('levels', 'res/levelData.json');
               game.assets.addSound(pacman.Sounds.CHASING_GHOSTS, 'res/sounds/chasing_ghosts.wav');
               game.assets.addSound(pacman.Sounds.CHOMP_1, 'res/sounds/chomp_1.wav');
               game.assets.addSound(pacman.Sounds.CHOMP_2, 'res/sounds/chomp_2.wav');
               game.assets.addSound(pacman.Sounds.DIES, 'res/sounds/dies.wav');
               game.assets.addSound(pacman.Sounds.EATING_FRUIT, 'res/sounds/eating_fruit.wav');
               game.assets.addSound(pacman.Sounds.EATING_GHOST, 'res/sounds/eating_ghost.wav');
               game.assets.addSound(pacman.Sounds.EXTRA_LIFE, 'res/sounds/extra_life.wav');
               game.assets.addSound(pacman.Sounds.EYES_RUNNING, 'res/sounds/eyes_running.wav');
               game.assets.addSound(pacman.Sounds.INTERMISSION, 'res/sounds/intermission.wav');
               game.assets.addSound(pacman.Sounds.OPENING, 'res/sounds/opening.wav');
               game.assets.addSound(pacman.Sounds.SIREN, 'res/sounds/siren.wav');
               game.assets.addSound(pacman.Sounds.TOKEN, 'res/sounds/token.wav');
               game.assets.onLoad(function() {
                  
                  // Convert level data from hex strings to numbers
                  function hexStrToInt(str) { return parseInt(str, 16); }
                  var levelData = game.assets.get('levels');
                  for (var i = 0; i < levelData.length; i++) {
                     for (var row = 0; row < levelData[i].length; row++) {
                        levelData[i][row] = levelData[i][row].map(hexStrToInt);
                     }
                  }
                  
                  var skipTitle = gtp.Utils.getRequestParam('skipTitle');
                  if (skipTitle !== null) { // Allow empty strings
                     game.startNewGame();
                  }
                  else {
                     game.setState(new gtp.FadeOutInState(self, new pacman.TitleState()));
                  }
               });
         
            });
            
         }
      
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var game = this.game;
         game.clearScreen('rgb(0,0,0)');
         
         if (this._loadingImage) {
            var x = (game.getWidth() - this._loadingImage.width) / 2;
            var y = (game.getHeight() - this._loadingImage.height) / 2;
            this._loadingImage.draw(ctx, x, y);
         }
      }
   }
   
});

pacman.LoadingState.prototype.constructor = pacman.LoadingState;
