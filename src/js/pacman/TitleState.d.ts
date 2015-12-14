declare module pacman {
    class TitleState extends _BaseState {
        private _delay;
        private _blink;
        private _choice;
        /**
             * State that renders the title screen.
             * @constructor
             */
        constructor(args?: pacman.PacmanGame | gtp.BaseStateArgs);
        init(): void;
        leaving(game: gtp.Game): void;
        handleStart(): void;
        update(delta: number): void;
        render(ctx: CanvasRenderingContext2D): void;
        _stringWidth(str: string): number;
        _renderNoSoundMessage(): void;
        _renderStaticStuff(ctx: CanvasRenderingContext2D): void;
        _startGame(): void;
        private getGame();
    }
}
