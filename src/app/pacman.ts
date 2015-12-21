/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
//var TILE_SIZE = 8;//16;
var CANVAS_WIDTH: number = 224;//448;
var CANVAS_HEIGHT: number = 288;//576;
var game: pacman.PacmanGame;

function init(parent: HTMLElement, assetRoot?: string) {
   'use strict';
   game = new pacman.PacmanGame({ parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
         assetRoot: assetRoot, keyRefreshMillis: 300, targetFps: 60 });
   game.setState(new pacman.LoadingState());
   game.start();
}