declare module pacman {
    class _BaseState extends gtp.State {
        /**
         * Functionality common amongst all states in this game.
         * @constructor
         */
        constructor(args?: gtp.Game | gtp.BaseStateArgs);
        createScreenshot(): HTMLCanvasElement;
        inputRepeatMillis: number;
        static INPUT_REPEAT_MILLIS: number;
        handleDefaultKeys(): void;
    }
}
