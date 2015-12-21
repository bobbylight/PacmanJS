declare module pacman {
    class Pacman extends _BaseSprite {
        _dyingFrame: number;
        constructor();
        getUpdateDelayMillis(): number;
        /**
         * Returns whether Pacman ins completely dead, or still doing his dying
         * animation.
         * @return {boolean} Whether Pacman is completely dead.
         */
        incDying(): boolean;
        render(ctx: CanvasRenderingContext2D): void;
        reset(): void;
        setLocation(x: number, y: number): void;
        updatePositionImpl(maze: Maze): void;
    }
}
