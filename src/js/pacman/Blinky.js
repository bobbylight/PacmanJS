var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    /**
     * Blinky, the red ghost.  Blinky always takes the shortest route to Pacman
     * when chasing him.
     */
    var Blinky = (function (_super) {
        __extends(Blinky, _super);
        /**
         * Constructor.
         */
        function Blinky(game) {
            _super.call(this, game, 0 * game.SPRITE_SIZE, 0); // Not initially in the penalty box
        }
        /**
         * Resets the ghost's internal state so that:
         *
         * <ol>
         *    <li>It is in the penalty box (except for Blinky).
         *    <li>It's no longer blinking.
         *    <li>Its direction is set appropriately.
         * </ol>
         *
         * This method should be called on loading a new level, PacMan dying, etc.
         */
        Blinky.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.direction = pacman.Direction.WEST;
            this.setLocation(this.game.PENALTY_BOX_EXIT_X, this.game.PENALTY_BOX_EXIT_Y);
            this.motionState = pacman.MotionState.SCATTERING;
        };
        /**
         * Updates an actor's position.
         *
         * @param maze The maze in which the actor is moving.
         */
        Blinky.prototype.updatePositionChasingPacman = function (maze) {
            // Logic:
            // If at an intersection, do a breadth-first search for the shortest
            // route to PacMan, and go in that direction.
            var moveAmount = this.moveAmount;
            if (this.atIntersection(maze)) {
                var fromRow = this.row;
                var fromCol = this.column;
                var toRow = game.pacman.row;
                var toCol = game.pacman.column;
                var node = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);
                if (node == null) {
                    this.changeDirectionFallback(maze);
                }
                else if (node.col < fromCol) {
                    this.direction = pacman.Direction.WEST;
                    this.incX(-moveAmount);
                }
                else if (node.col > fromCol) {
                    this.direction = pacman.Direction.EAST;
                    this.incX(moveAmount);
                }
                else if (node.row < fromRow) {
                    this.direction = pacman.Direction.NORTH;
                    this.incY(-moveAmount);
                }
                else if (node.row > fromRow) {
                    this.direction = pacman.Direction.SOUTH;
                    this.incY(moveAmount);
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
        return Blinky;
    })(pacman.Ghost);
    pacman.Blinky = Blinky;
})(pacman || (pacman = {}));

//# sourceMappingURL=Blinky.js.map
