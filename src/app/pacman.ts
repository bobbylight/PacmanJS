import { LoadingState } from './pacman/LoadingState';
import { PacmanGame } from './pacman/PacmanGame';

import 'all.css';
import 'index.html';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './pacman/constants/canvasSize';

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */



(window as any).init = function (parent: HTMLElement, assetRoot?: string) {
    const gameWindow: any = window as any;
    gameWindow.game = new PacmanGame({
        parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        assetRoot: assetRoot, keyRefreshMillis: 300, targetFps: 60
    });
    gameWindow.game.setState(new LoadingState());
    gameWindow.game.start();
};
