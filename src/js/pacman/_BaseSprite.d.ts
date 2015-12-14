declare module pacman {
    class _BaseSprite {
        bounds: gtp.Rectangle;
        _intersectBounds: gtp.Rectangle;
        direction: Direction;
        _frame: number;
        _frameCount: number;
        _lastUpdateTime: number;
        constructor(frameCount: number);
        getFrame(): number;
        getFrameCount(): number;
        reset(): void;
        setLocation(x: number, y: number): void;
    }
}
