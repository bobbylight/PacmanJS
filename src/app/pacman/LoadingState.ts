import { _BaseState } from './_BaseState';
import SOUNDS from './Sounds';
import { PacmanGame } from './PacmanGame';
import { TitleState } from './TitleState';
import { BaseStateArgs, FadeOutInState, Game, Utils } from 'gtp';

/**
 * Converts a hex string to an integer.  Not a member of <code>LoadingState</code> to appease tslint.
 *
 * @param str The hex number, as a string.
 * @returns The number version of <code>str</code>.
 */
const hexStrToInt: (str: string) => number = (str: string): number => {
    return parseInt(str, 16);
};

export class LoadingState extends _BaseState {

    private _assetsLoaded: boolean;

    /**
     * State that renders while resources are loading.
     */
    constructor(args?: PacmanGame | BaseStateArgs<PacmanGame>) {
        super(args);
        this._assetsLoaded = false;
    }

    update(delta: number) {

        this.handleDefaultKeys();

        if (!this._assetsLoaded) {

            this._assetsLoaded = true;
            const game: Game = this.game;

            // Load assets used by this state first
            game.assets.addImage('loading', 'res/loadingMessage.png');
            game.assets.onLoad(() => {

                game.assets.addImage('title', 'res/title.png');
                game.assets.addSpriteSheet('font', 'res/font.png', 9, 7, 0, 0);
                game.assets.addImage('sprites', 'res/sprite_tiles.png', true);
                game.assets.addSpriteSheet('mapTiles', 'res/map_tiles.png', 8, 8, 0, 0);
                game.assets.addSpriteSheet('points', 'res/points.png', 18, 9, 0, 0);
                game.assets.addJson('levels', 'res/levelData.json');
                game.assets.addSound(SOUNDS.CHASING_GHOSTS, 'res/sounds/chasing_ghosts.wav');
                game.assets.addSound(SOUNDS.CHOMP_1, 'res/sounds/chomp_1.wav');
                game.assets.addSound(SOUNDS.CHOMP_2, 'res/sounds/chomp_2.wav');
                game.assets.addSound(SOUNDS.DIES, 'res/sounds/dies.wav');
                game.assets.addSound(SOUNDS.EATING_FRUIT, 'res/sounds/eating_fruit.wav');
                game.assets.addSound(SOUNDS.EATING_GHOST, 'res/sounds/eating_ghost.wav');
                game.assets.addSound(SOUNDS.EXTRA_LIFE, 'res/sounds/extra_life.wav');
                game.assets.addSound(SOUNDS.EYES_RUNNING, 'res/sounds/eyes_running.wav');
                game.assets.addSound(SOUNDS.INTERMISSION, 'res/sounds/intermission.wav');
                game.assets.addSound(SOUNDS.OPENING, 'res/sounds/opening.wav');
                game.assets.addSound(SOUNDS.SIREN, 'res/sounds/siren.wav');
                game.assets.addSound(SOUNDS.TOKEN, 'res/sounds/token.wav');
                game.assets.onLoad(() => {

                    // Convert level data from hex strings to numbers
                    const levelData: any[][] = game.assets.get('levels');
                    for (let i: number = 0; i < levelData.length; i++) {
                        for (let row: number = 0; row < levelData[i].length; row++) {
                            levelData[i][row] = levelData[i][row].map(hexStrToInt);
                        }
                    }

                    const skipTitle: string | null = Utils.getRequestParam('skipTitle');
                    if (skipTitle !== null) { // Allow empty strings
                        this.game.startGame(0);
                    }
                    else {
                        game.setState(new FadeOutInState(this, new TitleState()));
                    }
                });

            });

        }

    }

}
