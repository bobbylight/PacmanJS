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
        pacman: pacman.Pacman;
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
        constructor(args?: any);
        addFruit(): void;
        drawBigDot(x: number, y: number): void;
        drawScores(ctx: CanvasRenderingContext2D): void;
        drawSmallDot(x: number, y: number): void;
        drawSprite(dx: number, dy: number, sx: number, sy: number): void;
        drawString(x: number, y: number, text: string | number, ctx?: CanvasRenderingContext2D): void;
        static EXTRA_LIFE_SCORE: number;
        increaseLives(amount: number): number;
        increaseScore(amount: number): void;
        level: number;
        lives: number;
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
        startGame(level: number): void;
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
