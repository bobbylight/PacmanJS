declare module pacman {
    /**
       * A "node" used in the breadth-first path searches supported by a
     * <code>Maze</code>.  It represents a location in the maze.
       */
    class MazeNode {
        row: number;
        col: number;
        parent: MazeNode;
        constructor(row?: number, col?: number);
        equals(node2: MazeNode): boolean;
        set(row: number, col: number, parent: MazeNode): void;
        toString(): string;
    }
}
