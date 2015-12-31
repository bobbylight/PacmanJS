var pacman;
(function (pacman) {
    'use strict';
    var DOT_POINTS = [50, 10];
    var Maze = (function () {
        function Maze(mazeInfo) {
            this.closed = [];
            this.open = [];
            this.goalNode = new pacman.MazeNode();
            this._data = [];
            this.reset(mazeInfo);
        }
        Maze._cloneObjectOfPrimitives = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        /**
         * Checks whether a dot is in the maze at the specified location.  If
         * it is, it is removed.  If a dot is removed, the points the player should
         * receive is returned.
         *
         * @param {number} row The row to check.
         * @param {number} col The column to check.
         * @return {number} The amount to add to the player's score, if any.
         */
        Maze.prototype.checkForDot = function (row, col) {
            var score = 0;
            var tile = this._getTileAt(row, col);
            if (tile >= 0xfe) {
                game.playChompSound();
                if (tile === 0xfe) {
                    game.makeGhostsBlue();
                }
                this._eatenDotCount++;
                this._data[row][col] = 0;
                score = DOT_POINTS[tile - 0xfe];
                if (this._eatenDotCount === Maze.FRUIT_DOT_COUNT) {
                    game.addFruit();
                }
                if (this._eatenDotCount === this._dotCount) {
                    game.loadNextLevel();
                }
            }
            return score;
        };
        /**
         * Returns the next node an object should move to if they want to take
         * the shortest route possible to the destination.
         *
         * @param node The linked list of nodes in the path to the destination,
         *        in reverse order.  This list should have been obtained from a
         *        breadth-first search.
         * @return The first node to move to.
         */
        Maze._constructPath = function (node) {
            /*
            LinkedList<Node> path = new LinkedList<Node>();
            while (node.parent!=null) {
                path.addFirst(node);
                node = node.parent;
            }
            return path;
            */
            var prev = null;
            while (node.parent) {
                prev = node;
                node = node.parent;
            }
            return prev;
        };
        Object.defineProperty(Maze, "FRUIT_DOT_COUNT", {
            /**
             * Returns the number of dots Pacman must eat before a fruit appears.
             *
             * @return {number} The number of dots Pacman must eat.
             */
            get: function () {
                return 64;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the "next" column, taking wrapping (from the tunnels) into
         * account.
         *
         * @param {number} col The current column.
         * @return {number} The column to the "right" of <code>col</code>.
         * @see getPreviousColumn
         */
        Maze._getNextColumn = function (col) {
            if (++col === Maze.TILE_COUNT_HORIZONTAL) {
                col = 0;
            }
            return col;
        };
        Maze.prototype.getPathBreadthFirst = function (fromRow, fromCol, toRow, toCol) {
            var self = this;
            this.open.forEach(function (node) {
                self._data[node.row][node.col] &= 0xff;
            });
            this.closed.forEach(function (node) {
                self._data[node.row][node.col] &= 0xff;
            });
            this.open.length = 0;
            this.closed.length = 0;
            this.goalNode.set(toRow, toCol, null);
            var temp = this._nodeCache.borrowObj();
            //path.add(computeInt(fromRow, fromCol));
            this.open.push(new pacman.MazeNode(fromRow, fromCol));
            this._data[fromRow][fromCol] |= 0x100;
            while (this.open.length > 0) {
                var node = this.open.splice(0, 1)[0];
                if (node.equals(this.goalNode)) {
                    this._data[node.row][node.col] &= 0xff; // Won't be in open or closed lists
                    return Maze._constructPath(node);
                }
                else {
                    this.closed.push(node);
                    // Add neighbors to the open list
                    if (this.isWalkable(node.row - 1, node.col)) {
                        //temp.set(node.row - 1, node.col);
                        //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                        //   temp.parent = node;
                        //}
                        if ((this._data[node.row - 1][node.col] & 0x100) === 0) {
                            this._data[node.row - 1][node.col] |= 0x100;
                            temp.set(node.row - 1, node.col, node);
                            this.open.push(temp);
                            temp = this._nodeCache.borrowObj();
                        }
                    }
                    if (this.isWalkable(node.row + 1, node.col)) {
                        //temp.set(node.row + 1, node.col);
                        //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                        //   temp.parent = node;
                        //}
                        if ((this._data[node.row + 1][node.col] & 0x100) === 0) {
                            this._data[node.row + 1][node.col] |= 0x100;
                            temp.set(node.row + 1, node.col, node);
                            this.open.push(temp);
                            temp = this._nodeCache.borrowObj();
                        }
                    }
                    var col = Maze._getPreviousColumn(node.col);
                    if (this.isWalkable(node.row, col)) {
                        //temp.set(node.row, col);
                        //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                        //   temp.parent = node;
                        //}
                        if ((this._data[node.row][col] & 0x100) === 0) {
                            this._data[node.row][col] |= 0x100;
                            temp.set(node.row, col, node);
                            this.open.push(temp);
                            temp = this._nodeCache.borrowObj();
                        }
                    }
                    col = Maze._getNextColumn(node.col);
                    if (this.isWalkable(node.row, col)) {
                        //temp.set(node.row, col);
                        //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                        //   temp.parent = node;
                        //}
                        if ((this._data[node.row][col] & 0x100) === 0) {
                            this._data[node.row][col] |= 0x100;
                            temp.set(node.row, col, node);
                            this.open.push(temp);
                            temp = this._nodeCache.borrowObj();
                        }
                    }
                }
            }
            // No path found - should never happen
            throw new Error('No path found from (' + fromRow + ', ' + fromCol +
                ') to (' + toRow + ', ' + toCol + ')');
        };
        /**
         * Returns the "previous" column, taking wrapping (from the tunnels) into
         * account.
         *
         * @param {number} col The current column.
         * @return {number} The column to the "left" of <code>col</code>.
         * @see getNextColumn
         */
        Maze._getPreviousColumn = function (col) {
            if (col === 0) {
                col = Maze.TILE_COUNT_HORIZONTAL;
            }
            return col - 1;
        };
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
        Maze.prototype.isClearShotColumn = function (col, row1, row2) {
            var start = Math.min(row1, row2);
            var end = Math.max(row1, row2);
            for (var i = start + 1; i < end; i++) {
                if (!this.isWalkable(i, col)) {
                    return false;
                }
            }
            return true;
        };
        Maze.prototype.isClearShotRow = function (row, col1, col2) {
            var start = Math.min(col1, col2);
            var end = Math.max(col1, col2);
            for (var i = start + 1; i < end; i++) {
                if (!this.isWalkable(row, i)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Returns whether a sprite can move onto the specified tile.
         * @param {number} row The row to check.
         * @param {number} col The column to check.
         * @return {boolean} Whether a sprite can walk ono the specified tile.
         */
        Maze.prototype.isWalkable = function (row, col) {
            var tile = this._getTileAt(row, col);
            return tile === 0 || tile >= 0xf0;
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
        /**
         * Resets this maze.
         * @param mazeInfo The raw data for this maze.  If this is undefined, it
         *        is assumed that we are simply resetting to load a new level.
         */
        Maze.prototype.reset = function (mazeInfo) {
            'use strict';
            var TILE_SIZE = pacman.PacmanGame.TILE_SIZE;
            var firstTime = mazeInfo != null;
            // Load (or reset) map data
            if (firstTime) {
                // First time through, we cache a pristine view of our maze data
                this._origMazeInfo = Maze._cloneObjectOfPrimitives(mazeInfo);
            }
            // Next, we create a working copy of our maze data, since we mutate it
            this._data = Maze._cloneObjectOfPrimitives(this._origMazeInfo);
            if (firstTime) {
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
                if (!this._nodeCache) {
                    this._nodeCache = new gtp.Pool(pacman.MazeNode, walkableCount);
                }
            }
        };
        return Maze;
    })();
    pacman.Maze = Maze;
})(pacman || (pacman = {}));

//# sourceMappingURL=Maze.js.map
