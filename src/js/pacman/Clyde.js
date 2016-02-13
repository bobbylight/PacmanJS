var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    /**
     * Clyde, the orange ghost.
     */
    var Clyde = (function (_super) {
        __extends(Clyde, _super);
        /**
         * Constructor.
         */
        function Clyde(game) {
            _super.call(this, game, 3 * pacman.PacmanGame.SPRITE_SIZE, 14);
        }
        Clyde.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.direction = pacman.Direction.SOUTH;
            this.setLocation(16 * pacman.PacmanGame.TILE_SIZE - pacman.PacmanGame.TILE_SIZE / 2 - 4, 15 * pacman.PacmanGame.TILE_SIZE - pacman.PacmanGame.TILE_SIZE / 2);
            this.motionState = pacman.MotionState.IN_BOX;
        };
        /**
         * Updates an actor's position.
         *
         * @param maze The maze in which the actor is moving.
         */
        Clyde.prototype.updatePositionChasingPacman = function (maze) {
            var moveAmount = this.moveAmount;
            // Pick a new random direction at intersections.
            if (this.atIntersection(maze)) {
                this.changeDirectionFallback(maze);
            }
            else {
                this.continueInCurrentDirection(moveAmount);
            }
            // Switch over to scatter mode if it's time to do so.
            if (game.playTime >= this.startScatteringTime) {
                this.motionState = pacman.MotionState.SCATTERING;
            }
        };
        return Clyde;
    })(pacman.Ghost);
    pacman.Clyde = Clyde;
})(pacman || (pacman = {}));

//# sourceMappingURL=Clyde.js.map
