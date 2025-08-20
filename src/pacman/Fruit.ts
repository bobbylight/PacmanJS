import { BaseSprite } from './BaseSprite';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';
import { SPRITE_SIZE } from './Constants';

export class Fruit extends BaseSprite {
    private readonly game: PacmanGame;
    private readonly spriteSheetRow: number;
    private readonly spriteSheetCol: number;
    private readonly pointsIndex: number;

    // 0=Cherry, 1=Strawberry, 2=Peach, 3=Yellow bell, 4=Apple,
    // 5=Green thing (grapes?), 6=Space Invaders ship, 7=Key
    private static readonly COLS: number[] = [12, 13, 12, 13, 13, 12, 13, 13];
    private static readonly ROWS: number[] = [4, 4, 5, 5, 2, 6, 6, 3];
    private static readonly PTS_INDEX: number[] = [0, 2, 4, 5, 10, 7, 9, 11];

    constructor(game: PacmanGame) {
        super(1);

        this.game = game;
        this.setLocation(game.PENALTY_BOX_EXIT_X, 140);
        let level: number = game.getLevel();
        if (level > 7) { // Level 8+ => any fruit is possible
            level = game.randomInt(8);
        }

        this.spriteSheetCol = Fruit.COLS[level];
        this.spriteSheetRow = Fruit.ROWS[level];
        this.pointsIndex = Fruit.PTS_INDEX[level];
    }

    /**
     * Returns the index into the "points" array that contains this
     * fruit's point value.
     *
     * @return The index into the "points" array that contains this
     *         fruit's point value.
     */
    getPointsIndex(): number {
        return this.pointsIndex;
    }

    /**
     * Returns the number of milliseconds that should pass between the times
     * this fruit moves.
     *
     * @return The update delay, in milliseconds.
     */
    getUpdateDelayMillis(): number {
        return 100000000000; // Make large, as fruit doesn't move.
    }

    /**
     * Paints this sprite at its current location.
     *
     * @param ctx The rendering context.
     */
    paint(ctx: CanvasRenderingContext2D) {
        const srcX: number = this.spriteSheetCol * SPRITE_SIZE;
        const srcY: number = this.spriteSheetRow * SPRITE_SIZE;
        this.game.drawSprite(this.x, this.y, srcX, srcY);
    }

    protected updatePositionImpl(maze: Maze) {
        // Do nothing; fruit doesn't move.
    }
}
