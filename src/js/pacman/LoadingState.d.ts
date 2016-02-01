declare module pacman {
    class LoadingState extends _BaseState {
        private _assetsLoaded;
        private _loadingImage;
        /**
             * State that renders while resources are loading.
             * @constructor
             */
        constructor(args?: gtp.Game | gtp.BaseStateArgs);
        update(delta: number): void;
    }
}
