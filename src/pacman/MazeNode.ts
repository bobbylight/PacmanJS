/**
 * A "node" used in the breadth-first path searches supported by a
 * <code>Maze</code>.  It represents a location in the maze.
 */
export class MazeNode {

    row: number;
    col: number;
    parent: MazeNode | null;

    constructor(row = 0, col = 0) {
        this.row = row;
        this.col = col;
    }

    equals(node2: MazeNode) {
        return this.row === node2.row && this.col === node2.col;
    }

    set(row: number, col: number, parent: MazeNode | null) {
        this.row = row;
        this.col = col;
        this.parent = parent;
    }

    toString() {
        return `[MazeNode: (${this.row},${this.col})]`;
    }

}
