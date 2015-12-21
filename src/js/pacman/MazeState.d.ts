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
        constructor(mazeFile: string);
        private DYING_FRAME_DELAY_MILLIS;
        private _readyDelayMillis;
        init(): void;
        _paintExtraLives(ctx: CanvasRenderingContext2D): void;
        _paintPossibleFruits(ctx: CanvasRenderingContext2D): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(delta: number): void;
        private _updateInGameImpl(time);
    }
}