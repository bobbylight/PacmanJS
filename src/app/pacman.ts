import { PacmanGame } from './pacman/PacmanGame';
import { LoadingState } from './pacman/LoadingState';

// Webpack makes you import your HTML and CSS.  WTF?
// tslint:disable:no-implicit-dependencies
import 'index.html';
import 'all.css';
// tslint:enable:no-implicit-dependencies

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
//var TILE_SIZE = 8;//16;
const CANVAS_WIDTH: number = 224; //448;
const CANVAS_HEIGHT: number = 288; //576;

(window as any).init = function (parent: HTMLElement, assetRoot?: string) { // tslint:disable-line
    const gameWindow: any = window as any;
    gameWindow.game = new PacmanGame({
        parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        assetRoot: assetRoot, keyRefreshMillis: 300, targetFps: 60
    });
    gameWindow.game.setState(new LoadingState());
    gameWindow.game.start();
};
