declare module pacman {
    abstract class _BaseSprite {
        bounds: gtp.Rectangle;
        _intersectBounds: gtp.Rectangle;
        direction: Direction;
        _frame: number;
        _frameCount: number;
        _lastUpdateTime: number;
        constructor(frameCount: number);
        atIntersection(maze: Maze): boolean;
        getCanMoveDown(maze: Maze): boolean;
        getCanMoveLeft(maze: Maze): boolean;
        getCanMoveRight(maze: Maze): boolean;
        getCanMoveUp(maze: Maze): boolean;
        centerX: number;
        centerY: number;
        column: number;
        getFrame(): number;
        getFrameCount(): number;
        private intersectBounds;
        moveAmount: number;
        TILE_SIZE: number;
        width: number;
        row: number;
        /**
         * Returns the number of milliseconds that should pass between the times
         * this sprite moves.
         * @return {number} The number of milliseconds.
         */
        abstract getUpdateDelayMillis(): number;
        x: number;
        y: number;
        goDownIfPossible(maze: Maze, moveAmount: number): boolean;
        goLeftIfPossible(maze: Maze, moveAmount: number): boolean;
        goRightIfPossible(maze: Maze, moveAmount: number): boolean;
        goUpIfPossible(maze: Maze, moveAmount: number): boolean;
        incX(amount: number): void;
        incY(amount: number): void;
        /**
         * Returns whether this sprite intersects another.
         *
         * @param sprite2 The other sprite.
         * @return Whether these two sprites intersect.
         */
        intersects(sprite2: _BaseSprite): boolean;
        reset(): void;
        SCREEN_WIDTH: number;
        setLocation(x: number, y: number): void;
        updateFrame(): void;
        updatePosition(maze: Maze, time: number): void;
        abstract updatePositionImpl(maze: Maze): void;
    }
}
