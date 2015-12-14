declare module pacman {
    class Pacman extends _BaseSprite {
        _dyingFrame: number;
        constructor();
        render(ctx: CanvasRenderingContext2D): void;
        reset(): void;
        setLocation(x: number, y: number): void;
    }
}
