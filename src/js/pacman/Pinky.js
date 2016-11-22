var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
    /**
     * Pinky, the pink ghost.  If PacMan is "visible" to Pinky (i.e., in the
     * same row or column), he'll chase him
     */
    var Pinky = (function (_super) {
        __extends(Pinky, _super);
        /**
         * Constructor.
         */
        function Pinky(game) {
            _super.call(this, game, 2 * pacman_1.PacmanGame.SPRITE_SIZE, 2);
        }
        Pinky.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.direction = pacman_1.Direction.NORTH;
            this.setLocation(14 * pacman_1.PacmanGame.TILE_SIZE - pacman_1.PacmanGame.TILE_SIZE / 2 - 4, 15 * pacman_1.PacmanGame.TILE_SIZE - pacman_1.PacmanGame.TILE_SIZE / 2);
            this.motionState = pacman_1.MotionState.IN_BOX;
        };
        /**
         * Updates an actor's position.
         *
         * @param maze The maze in which the actor is moving.
         */
        Pinky.prototype.updatePositionChasingPacman = function (maze) {
            var moveAmount = this.moveAmount;
            var pacman = game.pacman;
            var pacRow = pacman.row;
            var pacCol = pacman.column;
            var row = this.row;
            var col = this.column;
            var moved = false;
            if (this.atIntersection(maze)) {
                if (row === pacRow && maze.isClearShotRow(row, col, pacCol)) {
                    if (pacCol < col) {
                        this.direction = pacman_1.Direction.WEST;
                        this.incX(-moveAmount);
                    }
                    else {
                        // We need to check whether Pinky can go right here or not.
                        // In the case where pacCol==col, if God Mode is enabled,
                        // PacMan won't die just because Pinky is on him.  And so,
                        // in this case, if PacMan is in a "corner," Pinky  may not
                        // be able to keep traveling to the right.  In normal play
                        // though, this check wouldn't be necessary.
                        if (!this.goRightIfPossible(maze, moveAmount)) {
                            this.changeDirectionFallback(maze);
                        }
                    }
                    moved = true;
                }
                else if (col === pacCol && maze.isClearShotColumn(col, row, pacRow)) {
                    if (pacRow < row) {
                        this.direction = pacman_1.Direction.NORTH;
                        this.incY(-moveAmount);
                    }
                    else {
                        // We need to check whether Pinky can go down here or not.
                        // In the case where pacRow==row, if God Mode is enabled,
                        // PacMan won't die just because Pinky is on him.  And so,
                        // in this case, if PacMan is in a "corner," Pinky  may not
                        // be able to keep traveling down.  In normal play though,
                        // this check wouldn't be necessary.
                        if (!this.goDownIfPossible(maze, moveAmount)) {
                            this.changeDirectionFallback(maze);
                        }
                    }
                    moved = true;
                }
                if (!moved) {
                    this.changeDirectionFallback(maze);
                }
            }
            else {
                this.continueInCurrentDirection(moveAmount);
            }
            // Switch over to scatter mode if it's time to do so.
            if (game.playTime >= this.startScatteringTime) {
                this.motionState = pacman_1.MotionState.SCATTERING;
            }
        };
        return Pinky;
    }(pacman_1.Ghost));
    pacman_1.Pinky = Pinky;
})(pacman || (pacman = {}));

//# sourceMappingURL=Pinky.js.map
