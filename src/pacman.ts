import { PacmanGame } from './pacman/PacmanGame';
import { LoadingState } from './pacman/LoadingState';

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
//var TILE_SIZE = 8;//16;
const CANVAS_WIDTH: number = 224; //448;
const CANVAS_HEIGHT: number = 288; //576;

declare global {
    interface Window {
        game?: PacmanGame;
        init: (parent: HTMLElement | string, assetRoot?: string) => void;
    }
}

window.init = function(parent: HTMLElement | string, assetRoot?: string) {
    window.game = new PacmanGame({
        parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        assetRoot: assetRoot, keyRefreshMillis: 300, targetFps: 60
    });
    window.game.setState(new LoadingState());
    window.game.start();
};
window.init('parent');

