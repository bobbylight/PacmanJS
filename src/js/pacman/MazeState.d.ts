declare module pacman {
    class MazeState extends _BaseState {
        private _mazeFile;
        private _maze;
        private _firstTimeThrough;
        private _updateScoreIndex;
        private _substate;
        private _substateStartTime;
        private _nextUpdateTime;
        private _nextDyingFrameTime;
        private _lastMazeScreenKeypressTime;
        private _lastSpriteFrameTime;
        constructor(mazeFile: number[][]);
        private static DYING_FRAME_DELAY_MILLIS;
        private _readyDelayMillis;
        enter(): void;
        _paintExtraLives(ctx: CanvasRenderingContext2D): void;
        _paintPossibleFruits(ctx: CanvasRenderingContext2D): void;
        render(ctx: CanvasRenderingContext2D): void;
        reset(): void;
        private _handleInput(delta, time);
        update(delta: number): void;
        private _updateInGameImpl(time);
    }
}
