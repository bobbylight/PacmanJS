declare module pacman {
    class Pacman extends _BaseSprite {
        _dyingFrame: number;
        constructor();
        getUpdateDelayMillis(): number;
        handleInput(maze: Maze): void;
        /**
         * Returns whether Pacman ins completely dead, or still doing his dying
         * animation.
         * @return {boolean} Whether Pacman is still in his dying animation.
         */
        incDying(): boolean;
        render(ctx: CanvasRenderingContext2D): void;
        reset(): void;
        setLocation(x: number, y: number): void;
        startDying(): void;
        updatePositionImpl(maze: Maze): void;
    }
}
