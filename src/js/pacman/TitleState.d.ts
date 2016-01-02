declare module pacman {
    class TitleState extends _BaseState {
        private _choice;
        private _lastKeypressTime;
        /**
             * State that renders the title screen.
             * @constructor
             */
        constructor(args?: pacman.PacmanGame | gtp.BaseStateArgs);
        enter(): void;
        private _initSprites();
        leaving(game: gtp.Game): void;
        private getGame();
        handleStart(): void;
        render(ctx: CanvasRenderingContext2D): void;
        _stringWidth(str: string): number;
        _renderNoSoundMessage(): void;
        _renderStaticStuff(ctx: CanvasRenderingContext2D): void;
        _startGame(): void;
        update(delta: number): void;
    }
}
