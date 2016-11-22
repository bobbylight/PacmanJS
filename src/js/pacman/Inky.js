var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    /**
     * Inky, the blue ghost.  Inky is "bashful" and only changes after Pacman if
     * Blinky (the reg ghost) is close by.
     */
    var Inky = (function (_super) {
        __extends(Inky, _super);
        /**
         * Constructor.
         */
        function Inky(game) {
            _super.call(this, game, 1 * pacman.PacmanGame.SPRITE_SIZE, 8);
        }
        Inky.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.direction = pacman.Direction.SOUTH;
            this.setLocation(12 * pacman.PacmanGame.TILE_SIZE - pacman.PacmanGame.TILE_SIZE / 2 - 4, 15 * pacman.PacmanGame.TILE_SIZE - pacman.PacmanGame.TILE_SIZE / 2);
            this.motionState = pacman.MotionState.IN_BOX;
        };
        Inky.prototype.updatePositionChasingPacman = function (maze) {
            var moveAmount = this.moveAmount;
            if (this.atIntersection(maze)) {
                // Get Blinky's proximity
                var row = this.row;
                var col = this.column;
                var blinky = game.getGhost(0);
                var blinkyRow = blinky.row;
                var blinkyCol = blinky.column;
                var distSq = (blinkyCol - col) * (blinkyCol - col) +
                    (blinkyRow - row) * (blinkyRow - row);
                //console.log(distSq);
                // If we're close enough to Blinky, chase Pacman.
                if (distSq <= 35) {
                    var toRow = game.pacman.row;
                    var toCol = game.pacman.column;
                    var node = maze.getPathBreadthFirst(row, col, toRow, toCol);
                    //console.log("... " + node + " (" + row + "," + col + ")");
                    if (node == null) {
                        this.changeDirectionFallback(maze);
                    }
                    else if (node.col < col) {
                        this.direction = pacman.Direction.WEST;
                        this.incX(-moveAmount);
                    }
                    else if (node.col > col) {
                        this.direction = pacman.Direction.EAST;
                        this.incX(moveAmount);
                    }
                    else if (node.row < row) {
                        this.direction = pacman.Direction.NORTH;
                        this.incY(-moveAmount);
                    }
                    else if (node.row > row) {
                        this.direction = pacman.Direction.SOUTH;
                        this.incY(moveAmount);
                    }
                }
                else {
                    this.changeDirectionFallback(maze);
                }
            }
            else {
                this.continueInCurrentDirection(moveAmount);
            }
            // Switch over to scatter mode if it's time to do so.
            if (game.playTime >= this.startScatteringTime) {
                this.motionState = pacman.MotionState.SCATTERING;
            }
        };
        return Inky;
    }(pacman.Ghost));
    pacman.Inky = Inky;
})(pacman || (pacman = {}));

//# sourceMappingURL=Inky.js.map
