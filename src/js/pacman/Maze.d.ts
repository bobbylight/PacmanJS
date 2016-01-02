declare module pacman {
    class Maze {
        private _data;
        private _mazeCanvas;
        private _eatenDotCount;
        private _dotCount;
        private _origMazeInfo;
        closed: MazeNode[];
        open: MazeNode[];
        goalNode: MazeNode;
        /**
         * A cache of nodes to speed up search operations.
         */
        private _nodeCache;
        constructor(mazeInfo: number[][]);
        private static _cloneObjectOfPrimitives(obj);
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
         * Returns the next node an object should move to if they want to take
         * the shortest route possible to the destination.
         *
         * @param node The linked list of nodes in the path to the destination,
         *        in reverse order.  This list should have been obtained from a
         *        breadth-first search.
         * @return The first node to move to.
         */
        private static _constructPath(node);
        /**
         * Returns the number of dots Pacman must eat before a fruit appears.
         *
         * @return {number} The number of dots Pacman must eat.
         */
        static FRUIT_DOT_COUNT: number;
        /**
         * Returns the "next" column, taking wrapping (from the tunnels) into
         * account.
         *
         * @param {number} col The current column.
         * @return {number} The column to the "right" of <code>col</code>.
         * @see getPreviousColumn
         */
        private static _getNextColumn(col);
        getPathBreadthFirst(fromRow: number, fromCol: number, toRow: number, toCol: number): MazeNode;
        /**
         * Returns the "previous" column, taking wrapping (from the tunnels) into
         * account.
         *
         * @param {number} col The current column.
         * @return {number} The column to the "left" of <code>col</code>.
         * @see getNextColumn
         */
        private static _getPreviousColumn(col);
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
        isClearShotColumn(col: number, row1: number, row2: number): boolean;
        isClearShotRow(row: number, col1: number, col2: number): boolean;
        /**
         * Returns whether a sprite can move onto the specified tile.
         * @param {number} row The row to check.
         * @param {number} col The column to check.
         * @return {boolean} Whether a sprite can walk ono the specified tile.
         */
        isWalkable(row: number, col: number): boolean;
        render(ctx: CanvasRenderingContext2D): void;
        /**
         * Resets this maze.
         * @param mazeInfo The raw data for this maze.  If this is undefined, it
         *        is assumed that we are simply resetting to load a new level.
         */
        reset(mazeInfo?: number[][]): void;
    }
}
