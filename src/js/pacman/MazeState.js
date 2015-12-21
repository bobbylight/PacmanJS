var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
    var Substate;
    (function (Substate) {
        Substate[Substate["READY"] = 0] = "READY";
        Substate[Substate["IN_GAME"] = 1] = "IN_GAME";
        Substate[Substate["DYING"] = 2] = "DYING";
        Substate[Substate["GAME_OVER"] = 3] = "GAME_OVER";
    })(Substate || (Substate = {}));
    var MazeState = (function (_super) {
        __extends(MazeState, _super);
        function MazeState(mazeFile) {
            _super.call(this);
            this._mazeFile = mazeFile;
        }
        MazeState.prototype.init = function () {
            game.pacman.reset();
            //game.resetGhosts();
            this._maze = new pacman_1.Maze(this._mazeFile);
            this._firstTimeThrough = true;
            this._updateScoreIndex = -1;
            // Prevents the user's "Enter" press to start the game from being
            // picked up by our handleInput().
            this._lastMazeScreenKeypressTime = gtp.Utils.timestamp() + this.inputRepeatMillis;
            this._substate = Substate.READY;
            this._firstTimeThrough = true;
            this._substateStartTime = 0;
        };
        MazeState.prototype._paintExtraLives = function (ctx) {
            // The indentation on either side of the status stuff at the bottom
            // (extra life count, possible fruits, etc.).
            var BOTTOM_INDENT = 24;
            var TILE_SIZE = 8;
            var lives = game.lives;
            if (lives > 0) {
                var x = BOTTOM_INDENT;
                var y = game.getHeight() - 2 * TILE_SIZE;
                var w = 2 * TILE_SIZE;
                for (var i = 0; i < lives; i++) {
                    game.drawSprite(x, y, 12 * 16, 3 * 16);
                    x += w;
                }
            }
        };
        MazeState.prototype._paintPossibleFruits = function (ctx) {
            // The indentation on either side of the status stuff at the bottom
            // (extra life count, possible fruits, etc.).
            var BOTTOM_INDENT = 24;
            var TILE_SIZE = 8;
            var x = game.getWidth() - BOTTOM_INDENT - 2 * TILE_SIZE;
            var y = game.getHeight() - 2 * TILE_SIZE;
            switch (game.level) {
                default:
                case 7:
                    game.drawSprite(x - 112, y, 13 * 16, 3 * 16);
                // Fall through
                case 6:
                    game.drawSprite(x - 96, y, 13 * 16, 6 * 16);
                // Fall through
                case 5:
                    game.drawSprite(x - 160, y, 12 * 16, 6 * 16);
                // Fall through.
                case 4:
                    game.drawSprite(x - 128, y, 13 * 16, 2 * 16);
                // Fall through.
                case 3:
                    game.drawSprite(x - 96, y, 13 * 16, 5 * 16);
                // Fall through.
                case 2:
                    game.drawSprite(x - 64, y, 12 * 16, 5 * 16);
                // Fall through.
                case 1:
                    game.drawSprite(x - 32, y, 13 * 16, 4 * 16);
                // Fall through.
                case 0:
                    game.drawSprite(x, y, 12 * 16, 4 * 16);
                    break;
            }
        };
        MazeState.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
            this._maze.render(ctx);
            // "window.pacman" because of hoisting of pacman var below
            var TILE_SIZE = 8;
            var mazeY = game.getHeight() - 2 * TILE_SIZE -
                pacman_1.Maze.TILE_COUNT_VERTICAL * TILE_SIZE;
            ctx.translate(0, mazeY);
            //game.paintFruit(ctx);
            var pacman = game.pacman;
            if (this._updateScoreIndex === -1) {
                if (this._substate !== Substate.GAME_OVER) {
                    pacman.render(ctx);
                }
            }
            else {
                var x = pacman.bounds.x;
                var y = pacman.bounds.y;
                game.paintPointsEarned(ctx, this._updateScoreIndex, x, y);
            }
            //game.paintGhosts(ctx);
            ctx.translate(0, -mazeY);
            game.drawScores(ctx);
            this._paintExtraLives(ctx);
            this._paintPossibleFruits(ctx);
            if (this._substate === Substate.READY) {
                // These calculations should be fast enough, especially considering
                // that "READY!" is only displayed for about 4 seconds.
                var ready = 'READY!';
                var x = (game.getWidth() - ready.length * 9) / 2;
                // Give "Ready!" a little nudge to the right.  This is because the
                // ending '!' doesn't fill up the standard 8 pixels for a character,
                // so "READY!" looks slightly too far to the left without it.
                x += 3;
                game.drawString(x, 160, ready);
            }
            else if (this._substate === Substate.GAME_OVER) {
                var gameOver = 'GAME OVER';
                var x = (game.getWidth() - gameOver.length * 9) / 2;
                game.drawString(x, 160, gameOver);
            }
            if (game.paused) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
                ctx.globalAlpha = 1;
                ctx.fillRect(50, 100, game.getWidth() - 100, game.getHeight() - 200);
                var paused = 'PAUSED';
                var x = (game.getWidth() - paused.length * 9) / 2;
                game.drawString(x, (game.getHeight() - 18) / 2, paused);
            }
        };
        MazeState.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
        };
        return MazeState;
    })(pacman_1._BaseState);
    pacman_1.MazeState = MazeState;
})(pacman || (pacman = {}));

//# sourceMappingURL=MazeState.js.map
