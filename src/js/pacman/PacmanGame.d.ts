declare module pacman {
    class PacmanGame extends gtp.Game {
        private _highScore;
        private _lives;
        private _score;
        private _level;
        pacman: pacman.Pacman;
        constructor(args?: any);
        drawBigDot(x: number, y: number): void;
        drawScores(ctx: CanvasRenderingContext2D): void;
        drawSmallDot(x: number, y: number): void;
        drawSprite(dx: number, dy: number, sx: number, sy: number): void;
        drawString(x: number, y: number, text: string | number, ctx?: CanvasRenderingContext2D): void;
        level: number;
        lives: number;
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
        startGame(level: number): void;
    }
}
