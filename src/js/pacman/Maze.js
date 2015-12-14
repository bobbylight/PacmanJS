var pacman;
(function (pacman) {
    'use strict';
    var Maze = (function () {
        function Maze(mazeInfo) {
            this._data = [];
            this.reset(mazeInfo);
        }
        Object.defineProperty(Maze, "TILE_COUNT_HORIZONTAL", {
            get: function () {
                return 28;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Maze, "TILE_COUNT_VERTICAL", {
            get: function () {
                return 32;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Maze, "TILE_DOT_BIG", {
            get: function () {
                return 0xfe;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Maze, "TILE_DOT_SMALL", {
            get: function () {
                return 0xff;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the tile at the specified location.
         *
         * @param {int} row The row to check.
         * @param {int} col The column to check.
         * @return {int} The row data.
         */
        Maze.prototype._getTileAt = function (row, col) {
            // Forgive bounds errors in case the user is going through the tunnel.
            if (col < 0 || col >= Maze.TILE_COUNT_HORIZONTAL) {
                return -1;
            }
            if (row < 0 || row >= Maze.TILE_COUNT_VERTICAL) {
                return -1;
            }
            return this._data[row][col] & 0xff; // Remove internally-used high bits
        };
        Maze.prototype.render = function (ctx) {
            // Draw all static content
            ctx.drawImage(this._mazeCanvas, 0, 0);
            var TILE_SIZE = 8;
            // Draw the dots
            ctx.fillStyle = '#ffffff';
            for (var row = 0; row < Maze.TILE_COUNT_VERTICAL; row++) {
                var y = row * TILE_SIZE + (2 * TILE_SIZE);
                for (var col = 0; col < Maze.TILE_COUNT_HORIZONTAL; col++) {
                    var tile = this._getTileAt(row, col);
                    var x = col * TILE_SIZE;
                    if (tile === Maze.TILE_DOT_SMALL) {
                        game.drawSmallDot(x + 3, y + 2);
                    }
                    else if (tile === Maze.TILE_DOT_BIG) {
                        game.drawBigDot(x, y);
                    }
                }
            }
        };
        /**
         * Note this should really be somewhere else, but since we're painting the
         * maze as one single image, we might as well do this type of static text
         * while we're at it.
         */
        Maze.prototype._renderScoresHeaders = function (ctx) {
            game.drawString(16, 0, '1UP', ctx);
            game.drawString(67, 0, 'HIGH SCORE', ctx);
        };
        Maze.prototype.reset = function (mazeInfo) {
            'use strict';
            var TILE_SIZE = 8;
            // Load map data
            var self = this;
            mazeInfo.forEach(function (rowData) {
                self._data.push(rowData);
            });
            var mapTiles = game.assets.get('mapTiles');
            // Create an image for the maze
            var mazeY = 2 * TILE_SIZE;
            this._mazeCanvas = gtp.ImageUtils.createCanvas(game.getWidth(), game.getHeight());
            var mazeCtx = this._mazeCanvas.getContext('2d');
            var walkableCount = 0;
            this._eatenDotCount = 0;
            this._dotCount = 0;
            mazeCtx.fillStyle = '#000000';
            mazeCtx.fillRect(0, 0, this._mazeCanvas.width, this._mazeCanvas.height);
            this._renderScoresHeaders(mazeCtx);
            // Render each tile from the map data
            for (var row = 0; row < this._data.length; row++) {
                var rowData = this._data[row];
                for (var col = 0; col < rowData.length; col++) {
                    var tile = rowData[col];
                    if (tile === 0 || tile >= 0xf0) {
                        walkableCount++;
                    }
                    switch (tile) {
                        case Maze.TILE_DOT_SMALL:
                        case Maze.TILE_DOT_BIG:
                            this._dotCount++;
                            break;
                        default:
                            tile--;
                            var dx = col * TILE_SIZE;
                            var dy = mazeY + row * TILE_SIZE;
                            mapTiles.drawByIndex(mazeCtx, dx, dy, tile);
                            break;
                    }
                }
            }
            // TODO
            //      if (!this._nodeCache) {
            //         this._nodeCache = new NodeCache(walkableCount);
            //      }
        };
        return Maze;
    })();
    pacman.Maze = Maze;
})(pacman || (pacman = {}));

//# sourceMappingURL=Maze.js.map
