var pacman;
(function (pacman) {
    'use strict';
    /**
     * A "node" used in the breadth-first path searches supported by a
     * <code>Maze</code>.  It represents a location in the maze.
     */
    var MazeNode = (function () {
        function MazeNode(row, col) {
            if (row === void 0) { row = 0; }
            if (col === void 0) { col = 0; }
            this.row = row;
            this.col = col;
        }
        MazeNode.prototype.equals = function (node2) {
            return this.row === node2.row && this.col === node2.col;
        };
        MazeNode.prototype.set = function (row, col, parent) {
            this.row = row;
            this.col = col;
            this.parent = parent;
        };
        MazeNode.prototype.toString = function () {
            return '[MazeNode: (' + this.row + ',' + this.col + ')]';
        };
        return MazeNode;
    })();
    pacman.MazeNode = MazeNode;
})(pacman || (pacman = {}));

//# sourceMappingURL=MazeNode.js.map
