import { ImageUtils, Pool, SpriteSheet } from 'gtp';
import { MazeNode } from './MazeNode';
import { PacmanGame } from './PacmanGame';
import Constants from './Constants';

declare let game: PacmanGame;

const DOT_POINTS: number[] = [50, 10];

export class Maze {

    private data: number[][];
    private mazeCanvas: HTMLCanvasElement;
    private eatenDotCount: number;
    private dotCount: number;
    private origMazeInfo: number[][];

    closed: MazeNode[] = [];
    open: MazeNode[] = [];
    goalNode: MazeNode = new MazeNode();

    /**
     * A cache of nodes to speed up search operations.
     */
    private nodeCache: Pool<MazeNode>;

    constructor(mazeInfo: number[][]) {
        this.data = [];
        this.reset(mazeInfo);
    }

    private static _cloneObjectOfPrimitives(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Checks whether a dot is in the maze at the specified location.  If
     * it is, it is removed.  If a dot is removed, the points the player should
     * receive is returned.
     *
     * @param row The row to check.
     * @param col The column to check.
     * @return The amount to add to the player's score, if any.
     */
    checkForDot(row: number, col: number): number {

        let score: number = 0;
        const tile: number = this.getTileAt(row, col);

        if (tile >= 0xfe) { // Small dot or big dot.
            game.playChompSound();
            if (tile === 0xfe) {
                game.makeGhostsBlue();
            }
            this.eatenDotCount++;
            this.data[row][col] = 0;
            score = DOT_POINTS[tile - 0xfe];
            if (this.eatenDotCount === Maze.FRUIT_DOT_COUNT) {
                game.addFruit();
            }
            if (this.eatenDotCount === this.dotCount) {
                game.loadNextLevel();
            }
        }

        return score;
    }

    /**
     * Returns the next node an object should move to if they want to take
     * the shortest route possible to the destination.
     *
     * @param node The linked list of nodes in the path to the destination,
     *        in reverse order.  This list should have been obtained from a
     *        breadth-first search.
     * @return The first node to move to.
     */
    private static _constructPath(node: MazeNode): MazeNode/*MazeNode[]*/ | null {
        /*
         LinkedList<Node> path = new LinkedList<Node>();
         while (node.parent!=null) {
         path.addFirst(node);
         node = node.parent;
         }
         return path;
         */
        let prev: MazeNode | null = null;
        while (node.parent) {
            prev = node;
            node = node.parent;
        }
        return prev;
    }

    /**
     * Returns the number of dots Pacman must eat before a fruit appears.
     *
     * @return The number of dots Pacman must eat.
     */
    static get FRUIT_DOT_COUNT(): number {
        return 64;
    }

    /**
     * Returns the "next" column, taking wrapping (from the tunnels) into
     * account.
     *
     * @param col The current column.
     * @return The column to the "right" of <code>col</code>.
     * @see getPreviousColumn
     */
    private static _getNextColumn(col: number): number {
        if (++col === Maze.TILE_COUNT_HORIZONTAL) {
            col = 0;
        }
        return col;
    }

    getPathBreadthFirst(fromRow: number, fromCol: number, toRow: number,
        toCol: number): MazeNode | null {

        this.open.forEach((node: MazeNode) => {
            this.data[node.row][node.col] &= 0xff;
        });
        this.closed.forEach((node: MazeNode) => {
            this.data[node.row][node.col] &= 0xff;
        });

        this.open.length = 0;
        this.closed.length = 0;
        this.goalNode.set(toRow, toCol, null);
        let temp: MazeNode = this.nodeCache.borrowObj();

        //path.add(computeInt(fromRow, fromCol));
        this.open.push(new MazeNode(fromRow, fromCol));
        this.data[fromRow][fromCol] |= 0x100;

        while (this.open.length > 0) {

            const node: MazeNode = this.open.splice(0, 1)[0];
            if (node.equals(this.goalNode)) {
                this.data[node.row][node.col] &= 0xff; // Won't be in open or closed lists
                return Maze._constructPath(node);
            }

            else {

                this.closed.push(node);

                // Add neighbors to the open list
                if (this.isWalkable(node.row - 1, node.col)) {
                    //temp.set(node.row - 1, node.col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this.data[node.row - 1][node.col] & 0x100) === 0) {
                        this.data[node.row - 1][node.col] |= 0x100;
                        temp.set(node.row - 1, node.col, node);
                        this.open.push(temp);
                        temp = this.nodeCache.borrowObj();
                    }
                }

                if (this.isWalkable(node.row + 1, node.col)) {
                    //temp.set(node.row + 1, node.col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this.data[node.row + 1][node.col] & 0x100) === 0) {
                        this.data[node.row + 1][node.col] |= 0x100;
                        temp.set(node.row + 1, node.col, node);
                        this.open.push(temp);
                        temp = this.nodeCache.borrowObj();
                    }
                }

                let col: number = Maze._getPreviousColumn(node.col);
                if (this.isWalkable(node.row, col)) {
                    //temp.set(node.row, col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this.data[node.row][col] & 0x100) === 0) {
                        this.data[node.row][col] |= 0x100;
                        temp.set(node.row, col, node);
                        this.open.push(temp);
                        temp = this.nodeCache.borrowObj();
                    }
                }

                col = Maze._getNextColumn(node.col);
                if (this.isWalkable(node.row, col)) {
                    //temp.set(node.row, col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this.data[node.row][col] & 0x100) === 0) {
                        this.data[node.row][col] |= 0x100;
                        temp.set(node.row, col, node);
                        this.open.push(temp);
                        temp = this.nodeCache.borrowObj();
                    }
                }

            }
        }

        // No path found - should never happen
        throw new Error('No path found from (' + fromRow + ', ' + fromCol +
            ') to (' + toRow + ', ' + toCol + ')');
    }

    /**
     * Returns the "previous" column, taking wrapping (from the tunnels) into
     * account.
     *
     * @param col The current column.
     * @return The column to the "left" of <code>col</code>.
     * @see getNextColumn
     */
    private static _getPreviousColumn(col: number): number {
        if (col === 0) {
            col = Maze.TILE_COUNT_HORIZONTAL;
        }
        return col - 1;
    }

    static get TILE_COUNT_HORIZONTAL(): number {
        return 28;
    }

    static get TILE_COUNT_VERTICAL(): number {
        return 32;
    }

    static get TILE_DOT_BIG(): number {
        return 0xfe;
    }

    static get TILE_DOT_SMALL(): number {
        return 0xff;
    }

    /**
     * Returns the tile at the specified location.
     *
     * @param row The row to check.
     * @param col The column to check.
     * @return The row data.
     */
    private getTileAt(row: number, col: number): number {
        // Forgive bounds errors in case the user is going through the tunnel.
        if (col < 0 || col >= Maze.TILE_COUNT_HORIZONTAL) {
            return -1;
        }
        if (row < 0 || row >= Maze.TILE_COUNT_VERTICAL) {
            return -1;
        }
        return this.data[row][col] & 0xff; // Remove internally-used high bits
    }

    isClearShotColumn(col: number, row1: number, row2: number): boolean {
        const start: number = Math.min(row1, row2);
        const end: number = Math.max(row1, row2);
        for (let i: number = start + 1; i < end; i++) {
            if (!this.isWalkable(i, col)) {
                return false;
            }
        }
        return true;
    }

    isClearShotRow(row: number, col1: number, col2: number): boolean {
        const start: number = Math.min(col1, col2);
        const end: number = Math.max(col1, col2);
        for (let i: number = start + 1; i < end; i++) {
            if (!this.isWalkable(row, i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether a sprite can move onto the specified tile.
     * @param row The row to check.
     * @param col The column to check.
     * @return Whether a sprite can walk onto the specified tile.
     */
    isWalkable(row: number, col: number): boolean {
        const tile: number = this.getTileAt(row, col);
        return tile === 0 || tile >= 0xf0;
    }

    render(ctx: CanvasRenderingContext2D) {

        // Draw all static content
        ctx.drawImage(this.mazeCanvas, 0, 0);

        const TILE_SIZE: number = 8;

        // Draw the dots
        ctx.fillStyle = '#ffffff';
        for (let row: number = 0; row < Maze.TILE_COUNT_VERTICAL; row++) {

            const y: number = row * TILE_SIZE + (2 * TILE_SIZE);

            for (let col: number = 0; col < Maze.TILE_COUNT_HORIZONTAL; col++) {

                const tile: number = this.getTileAt(row, col);
                const x: number = col * TILE_SIZE;

                if (tile === Maze.TILE_DOT_SMALL) {
                    game.drawSmallDot(x + 3, y + 2);
                }
                else if (tile === Maze.TILE_DOT_BIG) {
                    game.drawBigDot(x, y);
                }
            }
        }
    }

    /**
     * Resets this maze.
     * @param mazeInfo The raw data for this maze.  If this is undefined, it
     *        is assumed that we are simply resetting to load a new level.
     */
    reset(mazeInfo?: number[][]) {
        'use strict';

        const TILE_SIZE: number = Constants.TILE_SIZE;
        const firstTime: boolean = mazeInfo != null;

        // Load (or reset) map data
        if (firstTime) {
            // First time through, we cache a pristine view of our maze data
            this.origMazeInfo = Maze._cloneObjectOfPrimitives(mazeInfo);
        }
        // Next, we create a working copy of our maze data, since we mutate it
        this.data = Maze._cloneObjectOfPrimitives(this.origMazeInfo);
        this.eatenDotCount = 0;

        if (firstTime) {

            const mapTiles: SpriteSheet = game.assets.get('mapTiles');

            // Create an image for the maze
            const mazeY: number = 2 * TILE_SIZE;
            this.mazeCanvas = ImageUtils.createCanvas(game.getWidth(), game.getHeight());
            const mazeCtx: CanvasRenderingContext2D = this.mazeCanvas.getContext('2d')!;
            let walkableCount: number = 0;
            this.dotCount = 0;

            mazeCtx.fillStyle = '#000000';
            mazeCtx.fillRect(0, 0, this.mazeCanvas.width, this.mazeCanvas.height);

            game.drawScoresHeaders(mazeCtx);

            // Render each tile from the map data
            for (let row: number = 0; row < this.data.length; row++) {

                const rowData: number[] = this.data[row];

                for (let col: number = 0; col < rowData.length; col++) {

                    let tile: number = rowData[col];
                    if (tile === 0 || tile >= 0xf0) {
                        walkableCount++;
                    }

                    switch (tile) {

                        case Maze.TILE_DOT_SMALL:
                        case Maze.TILE_DOT_BIG:
                            this.dotCount++;
                            break;

                        default:
                            tile--;
                            if (tile > -1) {
                                const dx: number = col * TILE_SIZE;
                                const dy: number = mazeY + row * TILE_SIZE;
                                mapTiles.drawByIndex(mazeCtx, dx, dy, tile);
                            }
                            break;
                    }
                }
            }

            if (!this.nodeCache) {
                this.nodeCache = new Pool(MazeNode, walkableCount);
            }
        }
    }
}
