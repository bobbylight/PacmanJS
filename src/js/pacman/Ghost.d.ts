declare module pacman {
    enum MotionState {
        IN_BOX = 0,
        LEAVING_BOX = 1,
        CHASING_PACMAN = 2,
        SCATTERING = 3,
        BLUE = 4,
        EYES = 5,
        EYES_ENTERING_BOX = 6,
    }
    abstract class Ghost extends _BaseSprite {
        /**
        * TODO: Remove the need for this variable!  Yucky!
        */
        game: PacmanGame;
        /**
        * The ghost's current motion state.
        */
        private _motionState;
        /**
        * The "corner" this ghost will retreat to when in "scatter" mode.
        */
        private _corner;
        /**
        * The number of times this ghost has been in "scatter" mode for this
        * level and PacMan life.
        */
        private _scatterCount;
        /**
        * If in scatter mode, this is the time at which the mode should switch
        * to "chasing PacMan" mode.  If not in scatter mode, this value is
        * invalid.
        */
        private _exitScatteringTime;
        /**
        * The time at which this ghost should switch from "chasing PacMan" mode
        * to scatter mode.  If not in the "chasing PacMan" motion state,
        * this value is invalid.
        */
        startScatteringTime: number;
        /**
        * The time at which a ghost should switch from "blue mode" to their
        * previous state (chasing PacMan or scattering).  If not in the "blue"
        * motion state, this value is invalid.
        */
        exitBlueTime: number;
        /**
        * The motion state to revert back to when a ghost leaves "blue mode."
        * If a ghost is not in "blue mode," this value is invalid.
        */
        private _previousState;
        /**
        * The y-coordinate of the sprites in the sprite sheet to use.
        */
        private _spriteSheetY;
        /**
        * The number of seconds this ghost will wait before leaving the penalty
        * box for the first time.
        */
        private _exitDelaySeconds;
        constructor(game: PacmanGame, spriteSheetY: number, exitDelaySeconds: number);
        changeDirectionFallback(maze: Maze): void;
        /**
        * Moves this ghost in its current direction by the specified amount.
        *
        * @param {number} moveAmount The amount to move.
        */
        continueInCurrentDirection(moveAmount: number): void;
        /**
        * Returns the length of play time a ghost should stay blue, in
        * milliseconds.
        *
        * @param {number} level The current game level.
        * @return {numbe} The length of time a ghost should stay blue.
        */
        private _getBlueTimeForLevel(level);
        /**
        * Returns the amount of time, in milliseconds, that this ghost will wait
        * for before leaving the penalty box for the first time.
        *
        * @return {number} The delay, in milliseconds.
        */
        getFirstExitDelayNanos(): number;
        getFrameCount(): number;
        motionState: MotionState;
        /**
        * Returns the number of milliseconds that should pass between the times
        * this ghost moves.  This value is dependant on the ghost's current
        * state.
        *
        * @return The update delay, in milliseconds.
        */
        getUpdateDelayMillis(): number;
        /**
        * Returns whether this ghost is in a "blue" motion state.
        *
        * @return {boolean} Whether this ghost is blue.
        * @see #isEyes()
        */
        isBlue(): boolean;
        /**
        * Returns whether this ghost is in a "eyes" motion state.
        *
        * @return Whether this ghost is in an "eyes" state.
        * @see #isBlue()
        */
        isEyes(): boolean;
        /**
        * Paints this sprite at its current location.
        *
        * @param {CanvasRenderingContext2D} ctx The rendering context to use.
        */
        paint(ctx: CanvasRenderingContext2D): void;
        /**
        * Turns this ghost "blue," if it is not in the penalty box and is not
        * currently floating eyes.
        */
        possiblyTurnBlue(): boolean;
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
        reset(): void;
        /**
        * Sets the coordinates of the "corner" this ghost goes to when in scatter
        * mode.
        *
        * @param {gtp.Point} corner The corner to go to.
        */
        setCorner(corner: gtp.Point): void;
        /**
        * Updates this ghost's position when they are "blue."
        *
        * @param {Maze} maze The maze in which the ghost is moving.
        */
        _updatePositionBlue(maze: Maze): void;
        /**
        * Updates this ghost's position when they are chasing PacMan.
        *
        * @param maze The maze in which the actor is moving.
        */
        abstract updatePositionChasingPacman(maze: Maze): void;
        /**
        * Updates this ghost's position when it is a set of "eyes" heading back
        * to the penalty box.
        *
        * @param maze The maze in which the ghost is moving.
        */
        private _updatePositionEyes(maze);
        /**
        * Updates this ghost's position when it is a set of "eyes" re-entering
        * the penalty box.
        *
        * @param maze The maze in which the ghost is moving.
        */
        private _updatePositionEyesEnteringBox(maze);
        /**
        * Updates a ghost's position according to its AI.
        *
        * @param maze The maze in which the ghost is floating.
        */
        updatePositionImpl(maze: Maze): void;
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        updatePositionInBox(maze: Maze): void;
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        updatePositionLeavingBox(maze: Maze): void;
        /**
        * Updates an actor's position.
        *
        * @param maze The maze in which the actor is moving.
        */
        updatePositionScattering(maze: Maze): void;
    }
}
