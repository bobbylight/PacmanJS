var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var LoadingState = (function (_super) {
        __extends(LoadingState, _super);
        /**
         * State that renders while resources are loading.
         * @constructor
         */
        function LoadingState(args) {
            _super.call(this, args);
            this._assetsLoaded = false;
        }
        LoadingState.prototype.update = function (delta) {
            this.handleDefaultKeys();
            if (!this._assetsLoaded) {
                this._assetsLoaded = true;
                var game_1 = this.game;
                var self_1 = this;
                // Load assets used by this state first
                game_1.assets.addImage('loading', 'res/loadingMessage.png');
                game_1.assets.onLoad(function () {
                    self_1._loadingImage = game_1.assets.get('loading');
                    game_1.assets.addImage('title', 'res/title.png');
                    game_1.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
                    game_1.assets.addImage('sprites', 'res/sprite_tiles.png', true);
                    game_1.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8, 8, 0, 0);
                    game_1.assets.addSpriteSheet('points', 'res/points.png', 18, 9, 0, 0);
                    game_1.assets.addJson('levels', 'res/levelData.json');
                    game_1.assets.addSound(pacman.Sounds.CHASING_GHOSTS, 'res/sounds/chasing_ghosts.wav');
                    game_1.assets.addSound(pacman.Sounds.CHOMP_1, 'res/sounds/chomp_1.wav');
                    game_1.assets.addSound(pacman.Sounds.CHOMP_2, 'res/sounds/chomp_2.wav');
                    game_1.assets.addSound(pacman.Sounds.DIES, 'res/sounds/dies.wav');
                    game_1.assets.addSound(pacman.Sounds.EATING_FRUIT, 'res/sounds/eating_fruit.wav');
                    game_1.assets.addSound(pacman.Sounds.EATING_GHOST, 'res/sounds/eating_ghost.wav');
                    game_1.assets.addSound(pacman.Sounds.EXTRA_LIFE, 'res/sounds/extra_life.wav');
                    game_1.assets.addSound(pacman.Sounds.EYES_RUNNING, 'res/sounds/eyes_running.wav');
                    game_1.assets.addSound(pacman.Sounds.INTERMISSION, 'res/sounds/intermission.wav');
                    game_1.assets.addSound(pacman.Sounds.OPENING, 'res/sounds/opening.wav');
                    game_1.assets.addSound(pacman.Sounds.SIREN, 'res/sounds/siren.wav');
                    game_1.assets.addSound(pacman.Sounds.TOKEN, 'res/sounds/token.wav');
                    game_1.assets.onLoad(function () {
                        // Convert level data from hex strings to numbers
                        function hexStrToInt(str) { return parseInt(str, 16); }
                        var levelData = game_1.assets.get('levels');
                        for (var i = 0; i < levelData.length; i++) {
                            for (var row = 0; row < levelData[i].length; row++) {
                                levelData[i][row] = levelData[i][row].map(hexStrToInt);
                            }
                        }
                        var skipTitle = gtp.Utils.getRequestParam('skipTitle');
                        if (skipTitle !== null) {
                            var pacmanGame = self_1.game;
                            pacmanGame.startGame(0);
                        }
                        else {
                            game_1.setState(new gtp.FadeOutInState(self_1, new pacman.TitleState()));
                        }
                    });
                });
            }
        };
        return LoadingState;
    })(pacman._BaseState);
    pacman.LoadingState = LoadingState;
})(pacman || (pacman = {}));

//# sourceMappingURL=LoadingState.js.map
