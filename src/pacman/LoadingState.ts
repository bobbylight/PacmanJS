import { BaseState } from './BaseState';
import Sounds from './Sounds';
import { PacmanGame } from './PacmanGame';
import { TitleState } from './TitleState';
import { BaseStateArgs, FadeOutInState, Utils } from 'gtp';
import { fixLevelDatas } from './Util';

export class LoadingState extends BaseState {

    private assetsLoaded: boolean;

    /**
     * State that renders while resources are loading.
     */
    constructor(args?: PacmanGame | BaseStateArgs<PacmanGame>) {
        super(args);
        this.assetsLoaded = false;
    }

    override update(delta: number) {

        this.handleDefaultKeys();

        if (!this.assetsLoaded) {

            this.assetsLoaded = true;
            const game = this.game;

            // Load assets used by this state first
            game.assets.addImage('loading', 'res/loadingMessage.png');
            game.assets.onLoad(() => {

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

                    fixLevelDatas(game.assets.get('levels'));

                    const skipTitle: string | null = Utils.getRequestParam('skipTitle');
                    if (skipTitle !== null) { // Allow empty strings
                        this.game.startGame(0);
                    }
                    else {
                        game.setState(new FadeOutInState(this, new TitleState(game)));
                    }
                });

            });

        }

    }

}
