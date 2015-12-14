declare module pacman {
    class Maze {
        private _data;
        private _mazeCanvas;
        private _eatenDotCount;
        private _dotCount;
        constructor(mazeInfo: any);
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
