declare module pacman {
    class Fruit extends _BaseSprite {
        private _row;
        private _col;
        private _pointsIndex;
        private static COLS;
        private static ROWS;
        private static PTS_INDEX;
        constructor();
        /**
         * Returns the index into the "points" array that contains this
         * fruit's point value.
         *
         * @return {number} The index into the "points" array that contains this
         *         fruit's point value.
         */
        pointsIndex: number;
        /**
         * Returns the number of milliseconds that should pass between the times
         * this fruit moves.
         *
         * @return The update delay, in milliseconds.
         */
        getUpdateDelayMillis(): number;
        /**
         * Paints this sprite at its current location.
         *
         * @param {CanvasRenderingContext2D} ctx The rendering context.
         */
        paint(ctx: CanvasRenderingContext2D): void;
        updatePositionImpl(maze: Maze): void;
    }
}
