import {Pool} from 'gtp';
import {MazeNode} from './MazeNode';
import {PacmanGame} from './PacmanGame';
import {SpriteSheet} from 'gtp';
import {ImageUtils} from 'gtp';
declare var game: PacmanGame;

let DOT_POINTS: number[] = [ 50, 10 ];

export class Maze {

    private _data: number[][];
    private _mazeCanvas: HTMLCanvasElement;
    private _eatenDotCount: number;
    private _dotCount: number;
    private _origMazeInfo: number[][];

    closed: MazeNode[] = [];
    open: MazeNode[] = [];
    goalNode: MazeNode = new MazeNode();

    /**
     * A cache of nodes to speed up search operations.
     */
    private _nodeCache: Pool<MazeNode>;

    constructor(mazeInfo: number[][]) {
        this._data = [];
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
     * @param {number} row The row to check.
     * @param {number} col The column to check.
     * @return {number} The amount to add to the player's score, if any.
     */
    checkForDot(row: number, col: number): number {

        let score: number = 0;
        let tile: number = this._getTileAt(row, col);

        if (tile >= 0xfe) { // Small dot or big dot.
            game.playChompSound();
            if (tile === 0xfe) {
                game.makeGhostsBlue();
            }
            this._eatenDotCount++;
            this._data[row][col] = 0;
            score = DOT_POINTS[tile - 0xfe];
            if (this._eatenDotCount === Maze.FRUIT_DOT_COUNT) {
                game.addFruit();
            }
            if (this._eatenDotCount === this._dotCount) {
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
    private static _constructPath(node: MazeNode): MazeNode/*MazeNode[]*/ {
        /*
         LinkedList<Node> path = new LinkedList<Node>();
         while (node.parent!=null) {
         path.addFirst(node);
         node = node.parent;
         }
         return path;
         */
        let prev: MazeNode = null;
        while (node.parent) {
            prev = node;
            node = node.parent;
        }
        return prev;
    }

    /**
     * Returns the number of dots Pacman must eat before a fruit appears.
     *
     * @return {number} The number of dots Pacman must eat.
     */
    static get FRUIT_DOT_COUNT(): number {
        return 64;
    }

    /**
     * Returns the "next" column, taking wrapping (from the tunnels) into
     * account.
     *
     * @param {number} col The current column.
     * @return {number} The column to the "right" of <code>col</code>.
     * @see getPreviousColumn
     */
    private static _getNextColumn(col: number): number {
        if (++col === Maze.TILE_COUNT_HORIZONTAL) {
            col = 0;
        }
        return col;
    }

    getPathBreadthFirst(fromRow: number, fromCol: number, toRow: number,
                        toCol: number): MazeNode {

        let self: Maze = this;
        this.open.forEach((node: MazeNode) => {
            self._data[node.row][node.col] &= 0xff;
        });
        this.closed.forEach((node: MazeNode) => {
            self._data[node.row][node.col] &= 0xff;
        });

        this.open.length = 0;
        this.closed.length = 0;
        this.goalNode.set(toRow, toCol, null);
        let temp: MazeNode = this._nodeCache.borrowObj();

        //path.add(computeInt(fromRow, fromCol));
        this.open.push(new MazeNode(fromRow, fromCol));
        this._data[fromRow][fromCol] |= 0x100;

        while (this.open.length > 0) {

            let node: MazeNode = this.open.splice(0, 1)[0];
            if (node.equals(this.goalNode)) {
                this._data[node.row][node.col] &= 0xff; // Won't be in open or closed lists
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
                    if ((this._data[node.row - 1][node.col] & 0x100) === 0) {
                        this._data[node.row - 1][node.col] |= 0x100;
                        temp.set(node.row - 1, node.col, node);
                        this.open.push(temp);
                        temp = this._nodeCache.borrowObj();
                    }
                }

                if (this.isWalkable(node.row + 1, node.col)) {
                    //temp.set(node.row + 1, node.col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this._data[node.row + 1][node.col] & 0x100) === 0) {
                        this._data[node.row + 1][node.col] |= 0x100;
                        temp.set(node.row + 1, node.col, node);
                        this.open.push(temp);
                        temp = this._nodeCache.borrowObj();
                    }
                }

                let col: number = Maze._getPreviousColumn(node.col);
                if (this.isWalkable(node.row, col)) {
                    //temp.set(node.row, col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this._data[node.row][col] & 0x100) === 0) {
                        this._data[node.row][col] |= 0x100;
                        temp.set(node.row, col, node);
                        this.open.push(temp);
                        temp = this._nodeCache.borrowObj();
                    }
                }

                col = Maze._getNextColumn(node.col);
                if (this.isWalkable(node.row, col)) {
                    //temp.set(node.row, col);
                    //if (!this.closed.contains(temp) && !this.open.contains(temp)) {
                    //   temp.parent = node;
                    //}
                    if ((this._data[node.row][col] & 0x100) === 0) {
                        this._data[node.row][col] |= 0x100;
                        temp.set(node.row, col, node);
                        this.open.push(temp);
                        temp = this._nodeCache.borrowObj();
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
     * @param {number} col The current column.
     * @return {number} The column to the "left" of <code>col</code>.
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
     * @param {int} row The row to check.
     * @param {int} col The column to check.
     * @return {int} The row data.
     */
    private _getTileAt(row: number, col: number): number {
        // Forgive bounds errors in case the user is going through the tunnel.
        if (col < 0 || col >= Maze.TILE_COUNT_HORIZONTAL) {
            return -1;
        }
        if (row < 0 || row >= Maze.TILE_COUNT_VERTICAL) {
            return -1;
        }
        return this._data[row][col] & 0xff; // Remove internally-used high bits
    }

    isClearShotColumn(col: number, row1: number, row2: number): boolean {
        let start: number = Math.min(row1, row2);
        let end: number = Math.max(row1, row2);
        for (let i: number = start + 1; i < end; i++) {
            if (!this.isWalkable(i, col)) {
                return false;
            }
        }
        return true;
    }

    isClearShotRow(row: number, col1: number, col2: number): boolean {
        let start: number = Math.min(col1, col2);
        let end: number = Math.max(col1, col2);
        for (let i: number = start + 1; i < end; i++) {
            if (!this.isWalkable(row, i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether a sprite can move onto the specified tile.
     * @param {number} row The row to check.
     * @param {number} col The column to check.
     * @return {boolean} Whether a sprite can walk ono the specified tile.
     */
    isWalkable(row: number, col: number): boolean {
        let tile: number = this._getTileAt(row, col);
        return tile === 0 || tile >= 0xf0;
    }

    render(ctx: CanvasRenderingContext2D) {

        // Draw all static content
        ctx.drawImage(this._mazeCanvas, 0, 0);

        let TILE_SIZE: number = 8;

        // Draw the dots
        ctx.fillStyle = '#ffffff';
        for (let row: number = 0; row < Maze.TILE_COUNT_VERTICAL; row++) {

            let y: number = row * TILE_SIZE + (2 * TILE_SIZE);

            for (let col: number = 0; col < Maze.TILE_COUNT_HORIZONTAL; col++) {

                let tile: number = this._getTileAt(row, col);
                let x: number = col * TILE_SIZE;

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

        let TILE_SIZE: number = PacmanGame.TILE_SIZE;
        let firstTime: boolean = mazeInfo != null;

        // Load (or reset) map data
        if (firstTime) {
            // First time through, we cache a pristine view of our maze data
            this._origMazeInfo = Maze._cloneObjectOfPrimitives(mazeInfo);
        }
        // Next, we create a working copy of our maze data, since we mutate it
        this._data = Maze._cloneObjectOfPrimitives(this._origMazeInfo);
        this._eatenDotCount = 0;

        if (firstTime) {

            const mapTiles: SpriteSheet = game.assets.get('mapTiles');

            // Create an image for the maze
            const mazeY: number = 2 * TILE_SIZE;
            this._mazeCanvas = ImageUtils.createCanvas(game.getWidth(), game.getHeight());
            const mazeCtx: CanvasRenderingContext2D = this._mazeCanvas.getContext('2d');
            let walkableCount: number = 0;
            this._dotCount = 0;

            mazeCtx.fillStyle = '#000000';
            mazeCtx.fillRect(0, 0, this._mazeCanvas.width, this._mazeCanvas.height);

            game.drawScoresHeaders(mazeCtx);

            // Render each tile from the map data
            for (let row: number = 0; row < this._data.length; row++) {

                const rowData: number[] = this._data[row];

                for (let col: number = 0; col < rowData.length; col++) {

                    let tile: number = rowData[col];
                    if (tile === 0 || tile >= 0xf0) {
                        walkableCount++;
                    }

                    switch (tile) {

                        case Maze.TILE_DOT_SMALL:
                        case Maze.TILE_DOT_BIG:
                            this._dotCount++;
                            break;

                        default:
                            tile--;
                            if (tile > -1) {
                                let dx: number = col * TILE_SIZE;
                                let dy: number = mazeY + row * TILE_SIZE;
                                mapTiles.drawByIndex(mazeCtx, dx, dy, tile);
                            }
                            break;
                    }
                }
            }

            if (!this._nodeCache) {
                this._nodeCache = new Pool(MazeNode, walkableCount);
            }
        }
    }
}
