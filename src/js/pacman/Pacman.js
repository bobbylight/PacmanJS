var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var Pacman = (function (_super) {
        __extends(Pacman, _super);
        function Pacman() {
            _super.call(this, 3);
            this._dyingFrame = 0;
        }
        Pacman.prototype.getUpdateDelayMillis = function () {
            return 10;
        };
        Pacman.prototype.handleInput = function (maze) {
            var input = game.inputManager;
            if (input.left()) {
                if (this.getCanMoveLeft(maze)) {
                    this.direction = pacman.Direction.WEST;
                }
            }
            else if (input.right()) {
                if (this.getCanMoveRight(maze)) {
                    this.direction = pacman.Direction.EAST;
                }
            }
            if (input.up()) {
                if (this.getCanMoveUp(maze)) {
                    this.direction = pacman.Direction.NORTH;
                }
            }
            else if (input.down()) {
                if (this.getCanMoveDown(maze)) {
                    this.direction = pacman.Direction.SOUTH;
                }
            }
        };
        /**
         * Returns whether Pacman ins completely dead, or still doing his dying
         * animation.
         * @return {boolean} Whether Pacman is completely dead.
         */
        Pacman.prototype.incDying = function () {
            this._dyingFrame = (this._dyingFrame + 1) % 12;
            return this._dyingFrame !== 0;
        };
        Pacman.prototype.render = function (ctx) {
            var SPRITE_SIZE = game.SPRITE_SIZE;
            var x = this.bounds.x;
            var y = this.bounds.y;
            var srcX, srcY;
            if (this._dyingFrame > 0) {
                srcX = SPRITE_SIZE * this._dyingFrame;
                srcY = 96;
            }
            else {
                srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
                    this.getFrame() * SPRITE_SIZE;
                srcY = 80;
            }
            game.drawSprite(x, y, srcX, srcY);
        };
        Pacman.prototype.reset = function () {
            var TILE_SIZE = 8;
            _super.prototype.reset.call(this);
            this.direction = pacman.Direction.WEST;
            this.setLocation(13 * TILE_SIZE, 24 * TILE_SIZE - TILE_SIZE / 2);
            this._frame = 0;
        };
        Pacman.prototype.setLocation = function (x, y) {
            _super.prototype.setLocation.call(this, x, y);
        };
        Pacman.prototype.startDying = function () {
            this._dyingFrame = 1;
        };
        Pacman.prototype.updatePositionImpl = function (maze) {
            var moveAmount = this.moveAmount;
            switch (this.direction) {
                case pacman.Direction.WEST:
                    this.goLeftIfPossible(maze, moveAmount);
                    break;
                case pacman.Direction.EAST:
                    this.goRightIfPossible(maze, moveAmount);
                    break;
                case pacman.Direction.NORTH:
                    this.goUpIfPossible(maze, moveAmount);
                    break;
                case pacman.Direction.SOUTH:
                    this.goDownIfPossible(maze, moveAmount);
                    break;
            }
            game.increaseScore(maze.checkForDot(this.row, this.column));
        };
        return Pacman;
    })(pacman._BaseSprite);
    pacman.Pacman = Pacman;
})(pacman || (pacman = {}));

//# sourceMappingURL=Pacman.js.map
