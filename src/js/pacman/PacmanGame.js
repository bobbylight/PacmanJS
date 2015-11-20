pacman.PacmanGame = function() {
   'use strict';
   gtp.Game.apply(this, arguments);
};

pacman.PacmanGame.prototype = Object.create(gtp.Game.prototype, {
   
});

pacman.PacmanGame.prototype.constructor = pacman.PacmanGame;
