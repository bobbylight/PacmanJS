import {Maze} from './Maze';
import {Direction} from './Direction';
import {_BaseSprite} from './_BaseSprite';
import {InputManager} from 'gtp/dist/gtp/InputManager';
import {PacmanGame} from './PacmanGame';
declare var game: PacmanGame;

export class Pacman extends _BaseSprite {

    _dyingFrame: number;

    constructor() {
        super(3);
        this._dyingFrame = 0;
    }

    getUpdateDelayMillis(): number {
        return 10;
    }

    handleInput(maze: Maze) {

        const input: InputManager = game.inputManager;

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
     * @return {boolean} Whether Pacman is still in his dying animation.
     */
    incDying(): boolean {
        this._dyingFrame = (this._dyingFrame + 1) % 12;
        return this._dyingFrame !== 0;
    }

    render(ctx: CanvasRenderingContext2D) {

        const SPRITE_SIZE: number = PacmanGame.SPRITE_SIZE;

        const x: number = this.bounds.x;
        const y: number = this.bounds.y;

        let srcX: number,
            srcY: number;
        if (this._dyingFrame > 0) {
            srcX = SPRITE_SIZE * this._dyingFrame;
            srcY = 96;
        }
        else {
            srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
                this.getFrame() * SPRITE_SIZE;
            srcY = 80;
        }

        game.drawSprite(x, y, srcX, srcY);
    }

    reset() {

        const TILE_SIZE: number = 8;

        super.reset();
        this.direction = Direction.WEST;
        this.setLocation(13 * TILE_SIZE, 24 * TILE_SIZE - TILE_SIZE / 2);
        this._frame = 0;
    }

    setLocation(x: number, y: number) {
        super.setLocation(x, y);
    }

    startDying() {
        this._dyingFrame = 1;
    }

    updatePositionImpl(maze: Maze) {

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

        game.increaseScore(maze.checkForDot(this.row, this.column));
    }
}
