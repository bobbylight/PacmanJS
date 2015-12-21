var pacman;
(function (pacman) {
    'use strict';
    var _BaseSprite = (function () {
        function _BaseSprite(frameCount) {
            this.bounds = new gtp.Rectangle();
            this._intersectBounds = new gtp.Rectangle();
            this.direction = pacman.Direction.EAST;
            this._frame = 0;
            this._frameCount = frameCount;
            this._lastUpdateTime = 0;
        }
        _BaseSprite.prototype.getCanMoveDown = function (maze) {
            var x = this.bounds.x + 8;
            var y = this.bounds.y + 8;
            var xRemainder = x % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE; //(y+TILE_SIZE) % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return row < 30 && maze.isWalkable(row + 1, col);
            }
            return this.direction == pacman.Direction.NORTH || this.direction == pacman.Direction.SOUTH;
        };
        _BaseSprite.prototype.getCanMoveLeft = function (maze) {
            var x = this.bounds.x;
            if (x < 0) {
                return true; // Going through tunnel.
            }
            x += 8;
            var y = this.bounds.y + 8;
            var xRemainder = x % this.TILE_SIZE; //(x-TILE_SIZE) % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return col > 0 && maze.isWalkable(row, col - 1);
            }
            return this.direction == pacman.Direction.EAST || this.direction == pacman.Direction.WEST;
        };
        _BaseSprite.prototype.getCanMoveRight = function (maze) {
            var x = this.bounds.x;
            if (x + this.width > this.SCREEN_WIDTH) {
                return true; // Going through tunnel.
            }
            x += 8;
            var y = this.bounds.y + 8;
            var xRemainder = x % this.TILE_SIZE; //(x+TILE_SIZE) % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return col < 27 && maze.isWalkable(row, col + 1);
            }
            return this.direction == pacman.Direction.EAST || this.direction == pacman.Direction.WEST;
        };
        _BaseSprite.prototype.getCanMoveUp = function (maze) {
            var x = this.bounds.x + 8;
            var y = this.bounds.y + 8;
            var xRemainder = x % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE; //(y-TILE_SIZE) % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return row > 0 && maze.isWalkable(row - 1, col);
            }
            return this.direction == pacman.Direction.NORTH || this.direction == pacman.Direction.SOUTH;
        };
        _BaseSprite.prototype.getFrame = function () {
            return this._frame;
        };
        _BaseSprite.prototype.getFrameCount = function () {
            return this._frameCount;
        };
        Object.defineProperty(_BaseSprite.prototype, "centerX", {
            get: function () {
                return this.bounds.x + 8;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "centerY", {
            get: function () {
                return this.bounds.y + 8;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "column", {
            get: function () {
                var col = Math.floor(this.centerX / this.TILE_SIZE);
                // Do "bounds checking" to correct for when sprites are going through
                // tunnels
                if (col < 0) {
                    col += pacman.Maze.TILE_COUNT_HORIZONTAL;
                }
                else if (col >= pacman.Maze.TILE_COUNT_HORIZONTAL) {
                    col -= pacman.Maze.TILE_COUNT_HORIZONTAL;
                }
                return col;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "moveAmount", {
            get: function () {
                return 1; // TODO: Perhaps this is no longer needed?
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "row", {
            get: function () {
                return Math.floor(this.centerY / this.TILE_SIZE);
            },
            enumerable: true,
            configurable: true
        });
        _BaseSprite.prototype.goDownIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveDown(maze)) {
                this.direction = pacman.Direction.SOUTH;
                this._incY(moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goLeftIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveLeft(maze)) {
                this.direction = pacman.Direction.WEST; // May be redundant.
                this._incX(-moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goRightIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveRight(maze)) {
                this.direction = pacman.Direction.EAST; // May be redundant.
                this._incX(moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goUpIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveUp(maze)) {
                this.direction = pacman.Direction.NORTH;
                this._incY(-moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype._incX = function (amount) {
            this.bounds.x += amount;
            if (this.bounds.x + this.width <= 0) {
                this.bounds.x += this.SCREEN_WIDTH;
            }
            else if (this.bounds.x >= this.SCREEN_WIDTH) {
                this.bounds.x -= this.SCREEN_WIDTH;
            }
        };
        _BaseSprite.prototype._incY = function (amount) {
            this.bounds.y += amount;
        };
        _BaseSprite.prototype.reset = function () {
            this._lastUpdateTime = 0;
        };
        Object.defineProperty(_BaseSprite.prototype, "SCREEN_WIDTH", {
            get: function () {
                return 224;
            },
            enumerable: true,
            configurable: true
        });
        _BaseSprite.prototype.setLocation = function (x, y) {
            this.bounds.x = x;
            this.bounds.y = y;
        };
        Object.defineProperty(_BaseSprite.prototype, "TILE_SIZE", {
            get: function () {
                return 8; // TODO: Move this somewhere more generic
            },
            enumerable: true,
            configurable: true
        });
        _BaseSprite.prototype.updateFrame = function () {
            this._frame = (this._frame + 1) % this.getFrameCount();
        };
        _BaseSprite.prototype.updatePosition = function (maze, time) {
            if (time > this._lastUpdateTime + this.getUpdateDelayMillis()) {
                this._lastUpdateTime = time;
                this.updatePositionImpl(maze);
            }
        };
        Object.defineProperty(_BaseSprite.prototype, "width", {
            get: function () {
                return this.bounds.w;
            },
            enumerable: true,
            configurable: true
        });
        return _BaseSprite;
    })();
    pacman._BaseSprite = _BaseSprite;
})(pacman || (pacman = {}));
//# sourceMappingURL=_BaseSprite.js.map