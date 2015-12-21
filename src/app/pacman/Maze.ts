module pacman {
  'use strict';

  var DOT_POINTS: number[] = [ 50, 10 ];

  export class Maze {

    private _data: number[][];
    private _mazeCanvas: HTMLCanvasElement;
    private _eatenDotCount: number;
    private _dotCount: number;

    constructor(mazeInfo: any) {
      this._data = [];
      this.reset(mazeInfo);
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
  			score = DOT_POINTS[tile-0xfe];
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
     * Returns the number of dots Pacman must eat before a fruit appears.
     *
     * @return {number} The number of dots Pacman must eat.
     */
    static get FRUIT_DOT_COUNT(): number {
      return 64;
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

    /**
  	 * Returns whether a sprite can move onto the specified tile.
  	 * @param {number} row The row to check.
  	 * @param {number} col The column to check.
  	 * @return {boolean} Whether a sprite can walk ono the specified tile.
  	 */
    isWalkable(row: number, col: number): boolean {
      var tile: number = this._getTileAt(row, col);
      return tile === 0 || tile >= 0xf0;
    }

    render(ctx: CanvasRenderingContext2D) {

      // Draw all static content
      ctx.drawImage(this._mazeCanvas, 0, 0);

      var TILE_SIZE = 8;

      // Draw the dots
      ctx.fillStyle = '#ffffff';
      for (var row = 0; row < Maze.TILE_COUNT_VERTICAL; row++) {

         var y = row * TILE_SIZE + (2 * TILE_SIZE);

         for (var col = 0; col < Maze.TILE_COUNT_HORIZONTAL; col++) {

            var tile = this._getTileAt(row, col);
            var x = col * TILE_SIZE;

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
     * Note this should really be somewhere else, but since we're painting the
     * maze as one single image, we might as well do this type of static text
     * while we're at it.
     */
    private _renderScoresHeaders(ctx: CanvasRenderingContext2D) {
       game.drawString(16, 0, '1UP', ctx);
       game.drawString(67, 0, 'HIGH SCORE', ctx);
    }

    reset(mazeInfo: any) {
       'use strict';

       var TILE_SIZE = 8;

       // Load map data
       var self = this;
       mazeInfo.forEach(function(rowData: number[]) {
          self._data.push(rowData);
       });

       var mapTiles = game.assets.get('mapTiles');

       // Create an image for the maze
       var mazeY = 2 * TILE_SIZE;
       this._mazeCanvas = gtp.ImageUtils.createCanvas(game.getWidth(), game.getHeight());
       var mazeCtx = this._mazeCanvas.getContext('2d');
       var walkableCount = 0;
       this._eatenDotCount = 0;
       this._dotCount = 0;

       mazeCtx.fillStyle = '#000000';
       mazeCtx.fillRect(0, 0, this._mazeCanvas.width, this._mazeCanvas.height);

       this._renderScoresHeaders(mazeCtx);

       // Render each tile from the map data
       for (var row = 0; row < this._data.length; row++) {

          var rowData = this._data[row];

          for (var col = 0; col < rowData.length; col++) {

             var tile = rowData[col];
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
                   var dx = col * TILE_SIZE;
                   var dy = mazeY + row * TILE_SIZE;
                   mapTiles.drawByIndex(mazeCtx, dx, dy, tile);
                   break;
             }
          }
       }

       // TODO
 //      if (!this._nodeCache) {
 //         this._nodeCache = new NodeCache(walkableCount);
 //      }
    }
  }
}
