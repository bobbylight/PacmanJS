declare module pacman {
    abstract class _BaseSprite {
        bounds: gtp.Rectangle;
        _intersectBounds: gtp.Rectangle;
        direction: Direction;
        _frame: number;
        _frameCount: number;
        _lastUpdateTime: number;
        constructor(frameCount: number);
        getCanMoveDown(maze: Maze): boolean;
        getCanMoveLeft(maze: Maze): boolean;
        getCanMoveRight(maze: Maze): boolean;
        getCanMoveUp(maze: Maze): boolean;
        getFrame(): number;
        getFrameCount(): number;
        centerX: number;
        centerY: number;
        column: number;
        moveAmount: number;
        row: number;
        /**
         * Returns the number of milliseconds that should pass between the times
         * this sprite moves.
         * @return {number} The number of milliseconds.
         */
        abstract getUpdateDelayMillis(): number;
        goDownIfPossible(maze: Maze, moveAmount: number): boolean;
        goLeftIfPossible(maze: Maze, moveAmount: number): boolean;
        goRightIfPossible(maze: Maze, moveAmount: number): boolean;
        goUpIfPossible(maze: Maze, moveAmount: number): boolean;
        private _incX(amount);
        private _incY(amount);
        reset(): void;
        SCREEN_WIDTH: number;
        setLocation(x: number, y: number): void;
        TILE_SIZE: number;
        updateFrame(): void;
        updatePosition(maze: Maze, time: number): void;
        width: number;
        abstract updatePositionImpl(maze: Maze): void;
    }
}
