declare module pacman {
    class _BaseState extends gtp.State {
        private _lastConfigKeypressTime;
        protected _lastSpriteFrameTime: number;
        /**
         * Functionality common amongst all states in this game.
         * @constructor
         */
        constructor(args?: gtp.Game | gtp.BaseStateArgs);
        static INPUT_REPEAT_MILLIS: number;
        protected handleDefaultKeys(): void;
        protected _updateSpriteFrames(): void;
    }
}
