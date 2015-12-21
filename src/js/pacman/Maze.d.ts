declare module pacman {
    class Maze {
        private _data;
        private _mazeCanvas;
        private _eatenDotCount;
        private _dotCount;
        constructor(mazeInfo: any);
        /**
         * Checks whether a dot is in the maze at the specified location.  If
         * it is, it is removed.  If a dot is removed, the points the player should
         * receive is returned.
         *
         * @param {number} row The row to check.
         * @param {number} col The column to check.
         * @return {number} The amount to add to the player's score, if any.
         */
        checkForDot(row: number, col: number): number;
        /**
         * Returns the number of dots Pacman must eat before a fruit appears.
         *
         * @return {number} The number of dots Pacman must eat.
         */
        static FRUIT_DOT_COUNT: number;
        static TILE_COUNT_HORIZONTAL: number;
        static TILE_COUNT_VERTICAL: number;
        static TILE_DOT_BIG: number;
        static TILE_DOT_SMALL: number;
        /**
         * Returns the tile at the specified location.
         *
         * @param {int} row The row to check.
         * @param {int} col The column to check.
         * @return {int} The row data.
         */
        private _getTileAt(row, col);
        /**
         * Returns whether a sprite can move onto the specified tile.
         * @param {number} row The row to check.
         * @param {number} col The column to check.
         * @return {boolean} Whether a sprite can walk ono the specified tile.
         */
        isWalkable(row: number, col: number): boolean;
        render(ctx: CanvasRenderingContext2D): void;
        /**
         * Note this should really be somewhere else, but since we're painting the
         * maze as one single image, we might as well do this type of static text
         * while we're at it.
         */
        private _renderScoresHeaders(ctx);
        reset(mazeInfo: any): void;
    }
}
