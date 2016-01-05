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
        constructor(mazeFile: number[][]);
        private static DYING_FRAME_DELAY_MILLIS;
        private _readyDelayMillis;
        enter(): void;
        private _paintExtraLives(ctx);
        private _paintPossibleFruits(ctx);
        render(ctx: CanvasRenderingContext2D): void;
        reset(): void;
        private _handleInput(delta, time);
        update(delta: number): void;
        private _updateInGameImpl(time);
    }
}
