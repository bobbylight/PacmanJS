var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
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
                if (this._substate !== 0 /*SUBSTATE_GAME_OVER*/) {
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
            // TODO: Subtate messages - "READY", "GAME OVER", "PAUSED", etc.
        };
        MazeState.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
        };
        return MazeState;
    })(pacman_1._BaseState);
    pacman_1.MazeState = MazeState;
})(pacman || (pacman = {}));

//# sourceMappingURL=MazeState.js.map
