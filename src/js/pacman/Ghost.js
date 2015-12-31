var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
    (function (MotionState) {
        MotionState[MotionState["IN_BOX"] = 0] = "IN_BOX";
        MotionState[MotionState["LEAVING_BOX"] = 1] = "LEAVING_BOX";
        MotionState[MotionState["CHASING_PACMAN"] = 2] = "CHASING_PACMAN";
        MotionState[MotionState["SCATTERING"] = 3] = "SCATTERING";
        MotionState[MotionState["BLUE"] = 4] = "BLUE";
        MotionState[MotionState["EYES"] = 5] = "EYES";
        MotionState[MotionState["EYES_ENTERING_BOX"] = 6] = "EYES_ENTERING_BOX";
    })(pacman_1.MotionState || (pacman_1.MotionState = {}));
    var MotionState = pacman_1.MotionState;
    var Ghost = (function (_super) {
        __extends(Ghost, _super);
        function Ghost(game, spriteSheetY, exitDelaySeconds) {
            _super.call(this, 2);
            this.game = game;
            this._corner = new gtp.Point();
            this._spriteSheetY = spriteSheetY;
            this._exitDelaySeconds = exitDelaySeconds;
            this.reset();
        }
        Ghost.prototype.changeDirectionFallback = function (maze) {
            var moveAmount = this.moveAmount;
            var temp = gtp.Utils.randomInt(4);
            switch (temp) {
                case 0:
                    if (!this.goUpIfPossible(maze, moveAmount)) {
                        if (!this.goLeftIfPossible(maze, moveAmount)) {
                            if (!this.goRightIfPossible(maze, moveAmount)) {
                                this.goDownIfPossible(maze, moveAmount);
                            }
                        }
                    }
                    break;
                case 1:
                    if (!this.goLeftIfPossible(maze, moveAmount)) {
                        if (!this.goUpIfPossible(maze, moveAmount)) {
                            if (!this.goDownIfPossible(maze, moveAmount)) {
                                this.goRightIfPossible(maze, moveAmount);
                            }
                        }
                    }
                    break;
                case 2:
                    if (!this.goDownIfPossible(maze, moveAmount)) {
                        if (!this.goLeftIfPossible(maze, moveAmount)) {
                            if (!this.goRightIfPossible(maze, moveAmount)) {
                                this.goUpIfPossible(maze, moveAmount);
                            }
                        }
                    }
                    break;
                case 3:
                    if (!this.goRightIfPossible(maze, moveAmount)) {
                        if (!this.goUpIfPossible(maze, moveAmount)) {
                            if (!this.goDownIfPossible(maze, moveAmount)) {
                                this.goLeftIfPossible(maze, moveAmount);
                            }
                        }
                    }
                    break;
            }
        };
        /**
        * Moves this ghost in its current direction by the specified amount.
        *
        * @param {number} moveAmount The amount to move.
        */
        Ghost.prototype.continueInCurrentDirection = function (moveAmount) {
            switch (this.direction) {
                case pacman_1.Direction.NORTH:
                    this.incY(-moveAmount);
                    break;
                case pacman_1.Direction.WEST:
                    this.incX(-moveAmount);
                    break;
                case pacman_1.Direction.SOUTH:
                    this.incY(moveAmount);
                    break;
                case pacman_1.Direction.EAST:
                    this.incX(moveAmount);
                    break;
            }
        };
        /**
        * Returns the length of play time a ghost should stay blue, in
        * milliseconds.
        *
        * @param {number} level The current game level.
        * @return {numbe} The length of time a ghost should stay blue.
        */
        Ghost.prototype._getBlueTimeForLevel = function (level) {
            switch (level) {
                case 0:
                case 1:
                    return 8000;
                case 2:
                case 3:
                    return 6000;
                case 4:
                case 5:
                    return 4000;
                case 6:
                case 7:
                    return 2000;
                default:
                    return 0;
            }
        };
        /**
        * Returns the amount of time, in milliseconds, that this ghost will wait
        * for before leaving the penalty box for the first time.
        *
        * @return {number} The delay, in milliseconds.
        */
        Ghost.prototype.getFirstExitDelayNanos = function () {
            return this._exitDelaySeconds * 1000;
        };
        Ghost.prototype.getFrameCount = function () {
            return 2;
        };
        Object.defineProperty(Ghost.prototype, "motionState", {
            get: function () {
                return this._motionState;
            },
            set: function (motionState) {
                var game = this.game;
                // Ghosts stay in "scatter mode" for varying lengths of time:
                // The first (just out of the penalty box) and second times, it lasts
                // for 7 seconds.  The third and fourth times, it lasts for 5 seconds.
                // Ghosts don't enter scatter mode a 5th time; they just relentlessly
                // attack PacMan.
                if (motionState === MotionState.SCATTERING) {
                    switch (this._scatterCount++) {
                        case 0:
                        case 1:
                            this._exitScatteringTime = game.playTime + 7000;
                            this._motionState = motionState;
                            break;
                        case 2:
                        case 3:
                            this._exitScatteringTime = game.playTime + 5000;
                            this._motionState = motionState;
                            break;
                        default:
                            this._motionState = MotionState.CHASING_PACMAN;
                            break;
                    }
                }
                else if (motionState === MotionState.BLUE) {
                    var blueTime = this._getBlueTimeForLevel(game.level);
                    var playTime = game.playTime;
                    this.exitBlueTime = playTime + blueTime;
                    // Remember previous state and modify its "end time" to
                    // include the blue time.
                    switch (this._motionState) {
                        case MotionState.CHASING_PACMAN:
                            this._previousState = this._motionState;
                            this.startScatteringTime += blueTime;
                            break;
                        case MotionState.SCATTERING:
                            this._previousState = this._motionState;
                            this._exitScatteringTime += blueTime;
                            break;
                        case MotionState.BLUE:
                            // Keep previous "previousState".
                            var prevBlueTimeRemaining = this.exitBlueTime - playTime;
                            switch (this._previousState) {
                                case MotionState.CHASING_PACMAN:
                                    this.startScatteringTime += prevBlueTimeRemaining + blueTime;
                                    break;
                                case MotionState.SCATTERING:
                                    this._exitScatteringTime += prevBlueTimeRemaining + blueTime;
                                    break;
                            }
                            break;
                        default:
                            throw new Error('Unexpected state: ' + this._motionState);
                    }
                    this._motionState = motionState;
                }
                else {
                    if (this._motionState === MotionState.CHASING_PACMAN) {
                        this.startScatteringTime = game.playTime + 20000;
                    }
                    this._motionState = motionState;
                }
                this.game.checkLoopedSound();
            },
            enumerable: true,
            configurable: true
        });
        /**
        * Returns the number of milliseconds that should pass between the times
        * this ghost moves.  This value is dependant on the ghost's current
        * state.
        *
        * @return The update delay, in milliseconds.
        */
        Ghost.prototype.getUpdateDelayMillis = function () {
            switch (this._motionState) {
                case MotionState.BLUE:
                    return 25;
                case MotionState.EYES:
                case MotionState.EYES_ENTERING_BOX:
                    return 10;
                default:
                    return 10;
            }
        };
        /**
        * Returns whether this ghost is in a "blue" motion state.
        *
        * @return {boolean} Whether this ghost is blue.
        * @see #isEyes()
        */
        Ghost.prototype.isBlue = function () {
            return this._motionState === MotionState.BLUE;
        };
        /**
        * Returns whether this ghost is in a "eyes" motion state.
        *
        * @return Whether this ghost is in an "eyes" state.
        * @see #isBlue()
        */
        Ghost.prototype.isEyes = function () {
            return this._motionState === MotionState.EYES ||
                this._motionState === MotionState.EYES_ENTERING_BOX;
        };
        /**
        * Paints this sprite at its current location.
        *
        * @param {CanvasRenderingContext2D} ctx The rendering context to use.
        */
        Ghost.prototype.paint = function (ctx) {
            var destX = this.bounds.x;
            var destY = this.bounds.y;
            var SPRITE_SIZE = pacman_1.PacmanGame.SPRITE_SIZE;
            switch (this._motionState) {
                case MotionState.BLUE:
                    var srcX = (10 + this.getFrame()) * SPRITE_SIZE;
                    var srcY = 3 * SPRITE_SIZE;
                    var playTime = game.playTime;
                    if ((this.exitBlueTime - playTime) <= 1000) {
                        if (((playTime / 250) & 1) !== 0) {
                            srcY += SPRITE_SIZE; // Flash 4 times in last second
                        }
                    }
                    game.drawSprite(destX, destY, srcX, srcY);
                    break;
                case MotionState.EYES:
                case MotionState.EYES_ENTERING_BOX:
                    srcX = this.direction * SPRITE_SIZE;
                    srcY = 4 * SPRITE_SIZE;
                    game.drawSprite(destX, destY, srcX, srcY);
                    break;
                default:
                    srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
                        this.getFrame() * SPRITE_SIZE;
                    srcY = this._spriteSheetY;
                    game.drawSprite(destX, destY, srcX, srcY);
                    break;
            }
        };
        /**
        * Turns this ghost "blue," if it is not in the penalty box and is not
        * currently floating eyes.
        */
        Ghost.prototype.possiblyTurnBlue = function () {
            switch (this._motionState) {
                case MotionState.CHASING_PACMAN:
                case MotionState.SCATTERING:
                case MotionState.BLUE:
                    this.motionState = MotionState.BLUE;
                    return true;
                default:
                    // Do nothing; in other states, we don't turn blue.
                    return false;
            }
        };
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
        * Subclasses should be sure to call the super's implementation when
        * overriding.
        */
        Ghost.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._scatterCount = 0;
        };
        /**
        * Sets the coordinates of the "corner" this ghost goes to when in scatter
        * mode.
        *
        * @param {gtp.Point} corner The corner to go to.
        */
        Ghost.prototype.setCorner = function (corner) {
            this._corner.x = corner.x;
            this._corner.y = corner.y;
        };
        /**
        * Updates this ghost's position when they are "blue."
        *
        * @param {Maze} maze The maze in which the ghost is moving.
        */
        Ghost.prototype._updatePositionBlue = function (maze) {
            // Logic:
            // If PacMan has a clear shot to us, try to go in a direction other
            // than PacMan before resorting to going straight for him.  If
            // PacMan does NOT have a clear shot, just pick a random direction.
            var moveAmount = this.moveAmount;
            // If we're at an intersection and can change direction...
            if (this.atIntersection(maze)) {
                var pacman_2 = game.pacman;
                var pacRow = pacman_2.row;
                var pacCol = pacman_2.column;
                var row = this.row;
                var col = this.column;
                var moved = false;
                // If PacMan has a straight shot to us in our row, try to go
                // in a direction other than towards PacMan.
                if (row === pacRow && maze.isClearShotRow(row, col, pacCol)) {
                    if (!this.goUpIfPossible(maze, moveAmount)) {
                        if (!this.goDownIfPossible(maze, moveAmount)) {
                            if (pacCol < col) {
                                if (!this.goRightIfPossible(maze, moveAmount)) {
                                    this.direction = pacman_1.Direction.WEST;
                                    this.incX(-moveAmount); // Must go towards PacMan.
                                }
                            }
                            else {
                                if (!this.goLeftIfPossible(maze, moveAmount)) {
                                    this.direction = pacman_1.Direction.EAST;
                                    this.incX(moveAmount); // Must go towards PacMan.
                                }
                            }
                        }
                    }
                    moved = true;
                }
                else if (col === pacCol && maze.isClearShotColumn(col, row, pacRow)) {
                    if (!this.goLeftIfPossible(maze, moveAmount)) {
                        if (!this.goRightIfPossible(maze, moveAmount)) {
                            if (pacRow < row) {
                                if (!this.goDownIfPossible(maze, moveAmount)) {
                                    this.direction = pacman_1.Direction.NORTH;
                                    this.incY(-moveAmount); // Must go towards PacMan.
                                }
                            }
                            else {
                                if (!this.goUpIfPossible(maze, moveAmount)) {
                                    this.direction = pacman_1.Direction.SOUTH;
                                    this.incY(moveAmount); // Must go towards PacMan.
                                }
                            }
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
            // Use game.playTime to ensure proper exit delay, even if game is
            // paused, etc.
            if (game.playTime >= this.exitBlueTime) {
                this.motionState = this._previousState;
            }
        };
        /**
        * Updates this ghost's position when it is a set of "eyes" heading back
        * to the penalty box.
        *
        * @param maze The maze in which the ghost is moving.
        */
        Ghost.prototype._updatePositionEyes = function (maze) {
            // Logic:
            // At intersections, do a breadth-first search to find the shortest
            // path to the penalty box, and head in that direction.
            var moveAmount = this.moveAmount;
            if (this.atIntersection(maze)) {
                // NOTE: game.PENALTY_BOX_X is actually in-between two columns, so we
                // pick the "farther" one to travel to, so we can be sure that
                // the ghost will always enter the box correctly.
                var fromRow = this.row;
                var fromCol = this.column;
                var toRow = Math.floor((game.PENALTY_BOX_EXIT_Y + 8) / pacman_1.PacmanGame.TILE_SIZE); // yToRow(game.PENALTY_BOX_EXIT_Y);
                var toCol = Math.floor((game.PENALTY_BOX_EXIT_X) / pacman_1.PacmanGame.TILE_SIZE); //xToColumn(game.PENALTY_BOX_EXIT_X);
                if (fromCol <= toCol) {
                    toCol++; // Approaching from the left.
                }
                var node = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);
                if (node == null) {
                    // Should never happen; we should always catch the ghost
                    // before getting to its destination in the "else" below.
                    this.motionState = MotionState.EYES_ENTERING_BOX;
                }
                else {
                    if (node.col < fromCol) {
                        this.direction = pacman_1.Direction.WEST;
                        this.incX(-moveAmount);
                    }
                    else if (node.col > fromCol) {
                        this.direction = pacman_1.Direction.EAST;
                        this.incX(moveAmount);
                    }
                    else if (node.row < fromRow) {
                        this.direction = pacman_1.Direction.NORTH;
                        this.incY(-moveAmount);
                    }
                    else if (node.row > fromRow) {
                        this.direction = pacman_1.Direction.SOUTH;
                        this.incY(moveAmount);
                    }
                }
            }
            else {
                var fromRow = this.row;
                var toRow = Math.floor((game.PENALTY_BOX_EXIT_Y + 8) / pacman_1.PacmanGame.TILE_SIZE); // yToRow(game.PENALTY_BOX_EXIT_Y);
                if (fromRow === toRow && this.x === game.PENALTY_BOX_EXIT_X) {
                    this.motionState = MotionState.EYES_ENTERING_BOX;
                }
                else {
                    this.continueInCurrentDirection(moveAmount);
                }
            }
        };
        /**
        * Updates this ghost's position when it is a set of "eyes" re-entering
        * the penalty box.
        *
        * @param maze The maze in which the ghost is moving.
        */
        Ghost.prototype._updatePositionEyesEnteringBox = function (maze) {
            var moveAmount = 1; //getMoveAmount();
            var y = this.y;
            if (y < game.PENALTY_BOX_EXIT_Y + 3 * pacman_1.PacmanGame.SPRITE_SIZE / 2) {
                this.direction = pacman_1.Direction.SOUTH; // May be redundant.
                this.incY(moveAmount);
            }
            else {
                this.motionState = MotionState.LEAVING_BOX;
                ;
            }
        };
        /**
        * Updates a ghost's position according to its AI.
        *
        * @param maze The maze in which the ghost is floating.
        */
        Ghost.prototype.updatePositionImpl = function (maze) {
            switch (this._motionState) {
                case MotionState.IN_BOX:
                    this.updatePositionInBox(maze);
                    break;
                case MotionState.LEAVING_BOX:
                    this.updatePositionLeavingBox(maze);
                    break;
                case MotionState.SCATTERING:
                    this.updatePositionScattering(maze);
                    break;
                case MotionState.CHASING_PACMAN:
                    this.updatePositionChasingPacman(maze);
                    break;
                case MotionState.BLUE:
                    this._updatePositionBlue(maze);
                    break;
                case MotionState.EYES:
                    this._updatePositionEyes(maze);
                    break;
                case MotionState.EYES_ENTERING_BOX:
                    this._updatePositionEyesEnteringBox(maze);
                    break;
            }
        };
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        Ghost.prototype.updatePositionInBox = function (maze) {
            var moveAmount = 1; //ghost.getMoveAmount();
            switch (this.direction) {
                case pacman_1.Direction.WEST: // Never happens
                case pacman_1.Direction.NORTH:
                    if (this.y > 224) {
                        this.incY(-moveAmount);
                    }
                    else {
                        this.direction = pacman_1.Direction.SOUTH;
                    }
                    break;
                case pacman_1.Direction.EAST: // Never happens
                case pacman_1.Direction.SOUTH:
                    if (this.y < 240) {
                        this.incY(moveAmount);
                    }
                    else {
                        this.direction = pacman_1.Direction.NORTH;
                    }
                    break;
            }
            // Use game.playTime to ensure proper exit delay, even if game is
            // paused, etc.
            if (game.playTime >= this.getFirstExitDelayNanos()) {
                this.motionState = MotionState.LEAVING_BOX;
                ;
            }
        };
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        Ghost.prototype.updatePositionLeavingBox = function (maze) {
            var moveAmount = 1; //getMoveAmount();
            var x = this.x;
            if (x < game.PENALTY_BOX_EXIT_X) {
                this.direction = pacman_1.Direction.EAST; // May be redundant
                this.incX(moveAmount);
            }
            else if (x > game.PENALTY_BOX_EXIT_X) {
                this.direction = pacman_1.Direction.WEST; // May be redundant
                this.incX(-moveAmount);
            }
            else {
                var y = this.y - moveAmount;
                this.y = y;
                if (y === game.PENALTY_BOX_EXIT_Y) {
                    this.motionState = MotionState.SCATTERING;
                    ;
                    this.direction = pacman_1.Direction.WEST;
                }
                else {
                    this.direction = pacman_1.Direction.NORTH; // May be redundant
                }
            }
        };
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        Ghost.prototype.updatePositionScattering = function (maze) {
            // Logic:
            // At intersections, do a breadth-first search to find the shortest
            // path to our corner, and head in that direction.
            var moveAmount = this.moveAmount;
            if (this.atIntersection(maze)) {
                var fromRow = this.row;
                var fromCol = this.column;
                var toRow = this._corner.x;
                var toCol = this._corner.y;
                var node = maze.getPathBreadthFirst(fromRow, fromCol, toRow, toCol);
                if (!node) {
                    this.changeDirectionFallback(maze);
                }
                else {
                    if (node.col < fromCol) {
                        this.direction = pacman_1.Direction.WEST;
                        this.incX(-moveAmount);
                    }
                    else if (node.col > fromCol) {
                        this.direction = pacman_1.Direction.EAST;
                        this.incX(moveAmount);
                    }
                    else if (node.row < fromRow) {
                        this.direction = pacman_1.Direction.NORTH;
                        this.incY(-moveAmount);
                    }
                    else if (node.row > fromRow) {
                        this.direction = pacman_1.Direction.SOUTH;
                        this.incY(moveAmount);
                    }
                }
            }
            else {
                this.continueInCurrentDirection(moveAmount);
            }
            if (game.playTime >= this._exitScatteringTime) {
                this.motionState = MotionState.CHASING_PACMAN;
            }
        };
        return Ghost;
    })(pacman_1._BaseSprite);
    pacman_1.Ghost = Ghost;
})(pacman || (pacman = {}));

//# sourceMappingURL=Ghost.js.map
