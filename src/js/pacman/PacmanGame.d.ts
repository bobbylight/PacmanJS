declare module pacman {
    enum GhostUpdateStrategy {
        UPDATE_ALL = 0,
        UPDATE_NONE = 1,
        UPDATE_ONE = 2,
    }
    class PacmanGame extends gtp.Game {
        private _highScore;
        private _lives;
        private _score;
        private _level;
        private _ghostUpdateStrategy;
        private _chompSound;
        pacman: Pacman;
        private _ghosts;
        private _extraPointsArray;
        /**
         * Whether the player has earned an extra life (from achieving a
         * certain score).
         */
        private _earnedExtraLife;
        /**
         * The sound effect currently looping (the background siren, the ghosts
         * running away, the ghost eyes running away, etc.).
         */
        private _loopedSoundId;
        private _loopedSoundName;
        /**
         * A flag used internally to decide when a ghost changing state should
         * also change the background noise (siren, eyes, etc.).
         */
        private _resettingGhostStates;
        /**
         * The index into the "points" image containing the image for an
         * amount of points being earned, e.g. for eating a ghost.
         */
        private _eatenGhostPointsIndex;
        /**
         * The playtime (in nanoseconds) after which an eaten fruit's score
         * should stop displaying.
         */
        private _fruitScoreEndTime;
        /**
         * The index into scores of the current fruit.
         */
        private _fruitScoreIndex;
        private _godMode;
        constructor(args?: any);
        addFruit(): void;
        checkForCollisions(): Ghost;
        /**
         * Ensures the background sound effect being played is appropriate for
         * the ghosts' current states.
         */
        checkLoopedSound(): void;
        /**
         * Creates the array of ghosts the game will use.
         *
         * @return The array of ghosts.
         */
        private _createGhostArray();
        drawBigDot(x: number, y: number): void;
        /**
         * Paints all four ghosts in their present location and state.
         *
         * @param ctx The context with which to paint.
         */
        drawGhosts(ctx: CanvasRenderingContext2D): void;
        drawScores(ctx: CanvasRenderingContext2D): void;
        drawSmallDot(x: number, y: number): void;
        drawSprite(dx: number, dy: number, sx: number, sy: number): void;
        drawString(x: number, y: number, text: string | number, ctx?: CanvasRenderingContext2D): void;
        godMode: boolean;
        static EXTRA_LIFE_SCORE: number;
        level: number;
        lives: number;
        PENALTY_BOX_EXIT_X: number;
        PENALTY_BOX_EXIT_Y: number;
        /**
         * Amount of time, in milliseconds, that points earned by Pacman should
         * be displayed (e.g. from eating a ghost or a fruit).
         */
        static SCORE_DISPLAY_LENGTH: number;
        static SPRITE_SIZE: number;
        static TILE_SIZE: number;
        ghostEaten(ghost: Ghost): number;
        increaseLives(amount: number): number;
        increaseScore(amount: number): void;
        loadNextLevel(): void;
        makeGhostsBlue(): void;
        /**
         * Paints the "points earned," for example, when PacMan eats a ghost or
         * fruit.
         *
         * @param {CanvasContext2D} ctx The graphics context to use.
         * @param {int} ptsIndex The index into the points array.
         * @param {int} dx The x-coordinate at which to draw.
         * @param {int} dy The y-coordinate at which to draw.
         */
        paintPointsEarned(ctx: CanvasRenderingContext2D, ptsIndex: number, dx: number, dy: number): void;
        /**
         * Plays the next appropriate chomp sound.
         */
        playChompSound(): void;
        resetGhosts(): void;
        /**
         * Starts looping a sound effect.
         * @param {string} sound The sound effect to loop.
         */
        setLoopedSound(sound: string): void;
        /**
         * Sets whether to update none, one, or all of the ghosts' positions
         * each frame.  This is used for debugging purposes.
         * @param state How many ghosts to update.
         */
        ghostUpdateStrategy: GhostUpdateStrategy;
        toggleGodMode(): boolean;
        startGame(level: number): void;
        startPacmanDying(): void;
        /**
         * Goes to the next animation frame for pacman, the ghosts and the
         * fruit.
         */
        updateSpriteFrames(): void;
        /**
         * Updates the position of pacman, the ghosts and the fruit, in the
         * specified maze.
         * @param {Maze} maze The maze.
         * @param {number} time
         */
        updateSpritePositions(maze: Maze, time: number): void;
    }
}
