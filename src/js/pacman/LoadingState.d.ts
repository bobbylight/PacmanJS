declare module pacman {
    class LoadingState extends _BaseState {
        assetsLoaded: boolean;
        _loadingImage: any;
        /**
             * State that renders while resources are loading.
             * @constructor
             */
        constructor(args?: gtp.Game | gtp.BaseStateArgs);
        update(delta: number): void;
    }
}
