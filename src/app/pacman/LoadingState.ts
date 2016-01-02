module pacman {
  'use strict';

  export class LoadingState extends _BaseState {

    assetsLoaded: boolean;
    _loadingImage: any;

    /**
		 * State that renders while resources are loading.
		 * @constructor
		 */
      constructor(args?: gtp.Game | gtp.BaseStateArgs) {
        super(args);
      }

      update(delta: number) {

        this.handleDefaultKeys();

        if (!this.assetsLoaded) {

           this.assetsLoaded = true;
           let game = this.game;
           let self = this;

           // Load assets used by this state first
           game.assets.addImage('loading', 'res/loadingMessage.png');
           game.assets.onLoad(function() {

              self._loadingImage = game.assets.get('loading');

              game.assets.addImage('title', 'res/title.png');
              game.assets.addSpriteSheet('font', 'res/font.png', 9,7, 0,0);
              game.assets.addImage('sprites', 'res/sprite_tiles.png', true);
              game.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8,8, 0,0);
              game.assets.addSpriteSheet('points', 'res/points.png', 18,9, 0,0);
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
                 function hexStrToInt(str: string) : number { return parseInt(str, 16); }
                 let levelData = game.assets.get('levels');
                 for (let i: number = 0; i < levelData.length; i++) {
                    for (let row: number = 0; row < levelData[i].length; row++) {
                       levelData[i][row] = levelData[i][row].map(hexStrToInt);
                    }
                 }

                 let skipTitle = gtp.Utils.getRequestParam('skipTitle');
                 if (skipTitle !== null) { // Allow empty strings
                    this.getGame().startNewGame();
                 }
                 else {
                    game.setState(new gtp.FadeOutInState(self, new pacman.TitleState()));
                 }
              });

           });

        }

     }

   }
}
