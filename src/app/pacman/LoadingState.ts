module pacman {
    'use strict';

    export class LoadingState extends _BaseState {

        private _assetsLoaded: boolean;
        private _loadingImage: any;

        /**
         * State that renders while resources are loading.
         * @constructor
         */
        constructor(args?: gtp.Game | gtp.BaseStateArgs) {
            super(args);
            this._assetsLoaded = false;
        }

        private static hexStrToInt(str: string): number {
            return parseInt(str, 16);
        }

        update(delta: number) {

            this.handleDefaultKeys();

            if (!this._assetsLoaded) {

                this._assetsLoaded = true;
                const game: gtp.Game = this.game;
                const self: LoadingState = this;

                // Load assets used by this state first
                game.assets.addImage('loading', 'res/loadingMessage.png');
                game.assets.onLoad(() => {

                    self._loadingImage = game.assets.get('loading');

                    game.assets.addImage('title', 'res/title.png');
                    game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
                    game.assets.addImage('sprites', 'res/sprite_tiles.png', true);
                    game.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8, 8, 0, 0);
                    game.assets.addSpriteSheet('points', 'res/points.png', 18, 9, 0, 0);
                    game.assets.addJson('levels', 'res/levelData.json');
                    game.assets.addSound(Sounds.CHASING_GHOSTS, 'res/sounds/chasing_ghosts.wav');
                    game.assets.addSound(Sounds.CHOMP_1, 'res/sounds/chomp_1.wav');
                    game.assets.addSound(Sounds.CHOMP_2, 'res/sounds/chomp_2.wav');
                    game.assets.addSound(Sounds.DIES, 'res/sounds/dies.wav');
                    game.assets.addSound(Sounds.EATING_FRUIT, 'res/sounds/eating_fruit.wav');
                    game.assets.addSound(Sounds.EATING_GHOST, 'res/sounds/eating_ghost.wav');
                    game.assets.addSound(Sounds.EXTRA_LIFE, 'res/sounds/extra_life.wav');
                    game.assets.addSound(Sounds.EYES_RUNNING, 'res/sounds/eyes_running.wav');
                    game.assets.addSound(Sounds.INTERMISSION, 'res/sounds/intermission.wav');
                    game.assets.addSound(Sounds.OPENING, 'res/sounds/opening.wav');
                    game.assets.addSound(Sounds.SIREN, 'res/sounds/siren.wav');
                    game.assets.addSound(Sounds.TOKEN, 'res/sounds/token.wav');
                    game.assets.onLoad(() => {

                        // Convert level data from hex strings to numbers
                        const levelData: any[][] = game.assets.get('levels');
                        for (let i: number = 0; i < levelData.length; i++) {
                            for (let row: number = 0; row < levelData[i].length; row++) {
                                levelData[i][row] = levelData[i][row].map(LoadingState.hexStrToInt);
                            }
                        }

                        const skipTitle: string = gtp.Utils.getRequestParam('skipTitle');
                        if (skipTitle !== null) { // Allow empty strings
                            const pacmanGame: PacmanGame = <PacmanGame>self.game;
                            pacmanGame.startGame(0);
                        }
                        else {
                            game.setState(new gtp.FadeOutInState(self, new TitleState()));
                        }
                    });

                });

            }

        }

    }
}
