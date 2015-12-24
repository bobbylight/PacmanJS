var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var Fruit = (function (_super) {
        __extends(Fruit, _super);
        function Fruit() {
            _super.call(this, 1);
            this.setLocation(game.PENALTY_BOX_EXIT_X, 140);
            var level = game.level;
            if (level > 7) {
                level = game.randomInt(8);
            }
            this._col = Fruit.COLS[level];
            this._row = Fruit.ROWS[level];
            this._pointsIndex = Fruit.PTS_INDEX[level];
        }
        Object.defineProperty(Fruit.prototype, "pointsIndex", {
            /**
             * Returns the index into the "points" array that contains this
             * fruit's point value.
             *
             * @return {number} The index into the "points" array that contains this
             *         fruit's point value.
             */
            get: function () {
                return this._pointsIndex;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the number of milliseconds that should pass between the times
         * this fruit moves.
         *
         * @return The update delay, in milliseconds.
         */
        Fruit.prototype.getUpdateDelayMillis = function () {
            return 100000000000; // Make large, as fruit doesn't move.
        };
        /**
         * Paints this sprite at its current location.
         *
         * @param {CanvasRenderingContext2D} ctx The rendering context.
         */
        Fruit.prototype.paint = function (ctx) {
            var SPRITE_SIZE = pacman.PacmanGame.SPRITE_SIZE;
            var srcX = this._col * SPRITE_SIZE;
            var srcY = this._row * SPRITE_SIZE;
            game.drawSprite(this.x, this.y, srcX, srcY);
        };
        Fruit.prototype.updatePositionImpl = function (maze) {
            // Do nothing; fruit doesn't move.
        };
        // 0=Cherry, 1=Strawberry, 2=Peach, 3=Yellow bell, 4=Apple,
        // 5=Green thing (grapes?), 6=Space Invaders ship, 7=Key
        Fruit.COLS = [12, 13, 12, 13, 13, 12, 13, 13];
        Fruit.ROWS = [4, 4, 5, 5, 2, 6, 6, 3];
        Fruit.PTS_INDEX = [0, 2, 4, 5, 10, 7, 9, 11];
        return Fruit;
    })(pacman._BaseSprite);
    pacman.Fruit = Fruit;
})(pacman || (pacman = {}));

//# sourceMappingURL=Fruit.js.map
