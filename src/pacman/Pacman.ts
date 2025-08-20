import { Maze } from './Maze';
import { Direction } from './Direction';
import { BaseSprite } from './BaseSprite';
import { InputManager } from 'gtp';
import { PacmanGame } from './PacmanGame';
import { SPRITE_SIZE } from './Constants';

export class Pacman extends BaseSprite {

    dyingFrame: number;
    private readonly game: PacmanGame;

    constructor(game: PacmanGame) {
        super(3);
        this.game = game;
        this.dyingFrame = 0;
    }

    getUpdateDelayMillis(): number {
        return 10;
    }

    handleInput(maze: Maze) {

        const input: InputManager = this.game.inputManager;

        if (input.left()) {
            if (this.getCanMoveLeft(maze)) {
                this.direction = Direction.WEST;
            }
        }
        else if (input.right()) {
            if (this.getCanMoveRight(maze)) {
                this.direction = Direction.EAST;
            }
        }
        if (input.up()) {
            if (this.getCanMoveUp(maze)) {
                this.direction = Direction.NORTH;
            }
        }
        else if (input.down()) {
            if (this.getCanMoveDown(maze)) {
                this.direction = Direction.SOUTH;
            }
        }
    }

    /**
     * Returns whether Pacman ins completely dead, or still doing his dying
     * animation.
     * @return Whether Pacman is still in his dying animation.
     */
    incDying(): boolean {
        this.dyingFrame = (this.dyingFrame + 1) % 12;
        return this.dyingFrame !== 0;
    }

    render(ctx: CanvasRenderingContext2D) {
        const x: number = this.bounds.x;
        const y: number = this.bounds.y;

        let srcX: number,
            srcY: number;
        if (this.dyingFrame > 0) {
            srcX = SPRITE_SIZE * this.dyingFrame;
            srcY = 96;
        }
        else {
            srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
                this.getFrame() * SPRITE_SIZE;
            srcY = 80;
        }

        this.game.drawSprite(x, y, srcX, srcY);
    }

    override reset() {

        const TILE_SIZE = 8;

        super.reset();
        this.direction = Direction.WEST;
        this.setLocation(13 * TILE_SIZE, 24 * TILE_SIZE - TILE_SIZE / 2);
        this.frame = 0;
    }

    override setLocation(x: number, y: number) {
        super.setLocation(x, y);
    }

    startDying() {
        this.dyingFrame = 1;
    }

    protected updatePositionImpl(maze: Maze) {

        const moveAmount: number = this.moveAmount;

        switch (this.direction) {
            case Direction.WEST:
                this.goLeftIfPossible(maze, moveAmount);
                break;
            case Direction.EAST:
                this.goRightIfPossible(maze, moveAmount);
                break;
            case Direction.NORTH:
                this.goUpIfPossible(maze, moveAmount);
                break;
            case Direction.SOUTH:
                this.goDownIfPossible(maze, moveAmount);
                break;
        }

        this.game.increaseScore(maze.checkForDot(this.row, this.column));
    }
}
