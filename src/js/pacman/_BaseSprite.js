var pacman;
(function (pacman) {
    'use strict';
    var _BaseSprite = (function () {
        function _BaseSprite(frameCount) {
            this.bounds = new gtp.Rectangle(0, 0, pacman.PacmanGame.SPRITE_SIZE, pacman.PacmanGame.SPRITE_SIZE);
            this._intersectBounds = new gtp.Rectangle();
            this.direction = pacman.Direction.EAST;
            this._frame = 0;
            this._frameCount = frameCount;
            this._lastUpdateTime = 0;
        }
        _BaseSprite.prototype.atIntersection = function (maze) {
            // TODO: Optimize me
            switch (this.direction) {
                case pacman.Direction.NORTH:
                case pacman.Direction.SOUTH:
                    return this.getCanMoveLeft(maze) || this.getCanMoveRight(maze);
                case pacman.Direction.EAST:
                case pacman.Direction.WEST:
                    return this.getCanMoveUp(maze) || this.getCanMoveDown(maze);
            }
            return false;
        };
        _BaseSprite.prototype.getCanMoveDown = function (maze) {
            var x = this.centerX;
            var y = this.centerY;
            var xRemainder = x % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE; //(y+TILE_SIZE) % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return row < 30 && maze.isWalkable(row + 1, col);
            }
            return this.direction === pacman.Direction.NORTH || this.direction === pacman.Direction.SOUTH;
        };
        _BaseSprite.prototype.getCanMoveLeft = function (maze) {
            var x = this.bounds.x;
            if (x < 0) {
                return true; // Going through tunnel.
            }
            x += this.TILE_SIZE / 2;
            var y = this.centerY;
            var xRemainder = x % this.TILE_SIZE; //(x-TILE_SIZE) % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return col > 0 && maze.isWalkable(row, col - 1);
            }
            return this.direction === pacman.Direction.EAST || this.direction === pacman.Direction.WEST;
        };
        _BaseSprite.prototype.getCanMoveRight = function (maze) {
            var x = this.bounds.x;
            if (x + this.width > this.SCREEN_WIDTH) {
                return true; // Going through tunnel.
            }
            x += this.TILE_SIZE / 2;
            var y = this.centerY;
            var xRemainder = x % this.TILE_SIZE; //(x+TILE_SIZE) % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return col < 27 && maze.isWalkable(row, col + 1);
            }
            return this.direction === pacman.Direction.EAST || this.direction === pacman.Direction.WEST;
        };
        _BaseSprite.prototype.getCanMoveUp = function (maze) {
            var x = this.centerX;
            var y = this.centerY;
            if ((x % 1) !== 0 || (y % 1) !== 0) {
                debugger;
            }
            var xRemainder = x % this.TILE_SIZE;
            var yRemainder = y % this.TILE_SIZE; //(y-TILE_SIZE) % this.TILE_SIZE;
            if (xRemainder === 0 && yRemainder === 0) {
                var row = this.row;
                var col = this.column;
                return row > 0 && maze.isWalkable(row - 1, col);
            }
            return this.direction === pacman.Direction.NORTH || this.direction === pacman.Direction.SOUTH;
        };
        Object.defineProperty(_BaseSprite.prototype, "centerX", {
            get: function () {
                return this.bounds.x + this.TILE_SIZE / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "centerY", {
            get: function () {
                return this.bounds.y + this.TILE_SIZE / 2;
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
        _BaseSprite.prototype.getFrame = function () {
            return this._frame;
        };
        _BaseSprite.prototype.getFrameCount = function () {
            return this._frameCount;
        };
        Object.defineProperty(_BaseSprite.prototype, "intersectBounds", {
            get: function () {
                this._intersectBounds.set(this.bounds.x + 2, this.bounds.y - 2, this.bounds.w - 4, this.bounds.h - 4);
                return this._intersectBounds;
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
        Object.defineProperty(_BaseSprite.prototype, "TILE_SIZE", {
            get: function () {
                return 8; // TODO: Move this somewhere more generic
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "width", {
            get: function () {
                return this.bounds.w;
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
        Object.defineProperty(_BaseSprite.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            set: function (x) {
                this.bounds.x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_BaseSprite.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            set: function (y) {
                this.bounds.y = y;
            },
            enumerable: true,
            configurable: true
        });
        _BaseSprite.prototype.goDownIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveDown(maze)) {
                this.direction = pacman.Direction.SOUTH;
                this.incY(moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goLeftIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveLeft(maze)) {
                this.direction = pacman.Direction.WEST; // May be redundant.
                this.incX(-moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goRightIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveRight(maze)) {
                this.direction = pacman.Direction.EAST; // May be redundant.
                this.incX(moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.goUpIfPossible = function (maze, moveAmount) {
            if (this.getCanMoveUp(maze)) {
                this.direction = pacman.Direction.NORTH;
                this.incY(-moveAmount);
                return true;
            }
            return false;
        };
        _BaseSprite.prototype.incX = function (amount) {
            this.bounds.x += amount;
            if (this.bounds.x + this.width <= 0) {
                this.bounds.x += this.SCREEN_WIDTH;
            }
            else if (this.bounds.x >= this.SCREEN_WIDTH) {
                this.bounds.x -= this.SCREEN_WIDTH;
            }
        };
        _BaseSprite.prototype.incY = function (amount) {
            this.bounds.y += amount;
        };
        /**
         * Returns whether this sprite intersects another.
         *
         * @param sprite2 The other sprite.
         * @return Whether these two sprites intersect.
         */
        _BaseSprite.prototype.intersects = function (sprite2) {
            //return bounds.intersects(sprite2.bounds);
            return this.intersectBounds.intersects(sprite2.intersectBounds);
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
        _BaseSprite.prototype.updateFrame = function () {
            this._frame = (this._frame + 1) % this.getFrameCount();
        };
        _BaseSprite.prototype.updatePosition = function (maze, time) {
            if (time > this._lastUpdateTime + this.getUpdateDelayMillis()) {
                this._lastUpdateTime = time;
                this.updatePositionImpl(maze);
            }
        };
        return _BaseSprite;
    })();
    pacman._BaseSprite = _BaseSprite;
})(pacman || (pacman = {}));

//# sourceMappingURL=_BaseSprite.js.map
