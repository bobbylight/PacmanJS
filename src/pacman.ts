import { PacmanGame } from './pacman/PacmanGame';
import { LoadingState } from './pacman/LoadingState';

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
//var TILE_SIZE = 8;//16;
const CANVAS_WIDTH = 224; //448;
const CANVAS_HEIGHT = 288; //576;

const game = new PacmanGame({
    parent: 'parent', width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
    keyRefreshMillis: 300, targetFps: 60,
});
game.setState(new LoadingState(game));
game.start();

