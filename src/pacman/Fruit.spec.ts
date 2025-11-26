import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { Fruit } from './Fruit';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';

const mockSpriteSheet = {
    drawByIndex: () => {},
    drawScaled2: vi.fn(),
} as unknown as SpriteSheet;

describe('Fruit', () => {
    let game: PacmanGame;

    beforeEach(() => {
        game = new PacmanGame();
        game.assets.set('sprites', mockSpriteSheet);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('constructor should pick the right fruit for the level', () => {
        const getLevelSpy = vi.spyOn(game, 'getLevel');
        getLevelSpy.mockReturnValue(0);
        expect(new Fruit(game).getPointsIndex()).toBe(0);

        getLevelSpy.mockReturnValue(1);
        expect(new Fruit(game).getPointsIndex()).toBe(2);

        getLevelSpy.mockReturnValue(2);
        expect(new Fruit(game).getPointsIndex()).toBe(4);

        getLevelSpy.mockReturnValue(3);
        expect(new Fruit(game).getPointsIndex()).toBe(5);

        getLevelSpy.mockReturnValue(4);
        expect(new Fruit(game).getPointsIndex()).toBe(10);

        getLevelSpy.mockReturnValue(5);
        expect(new Fruit(game).getPointsIndex()).toBe(7);

        getLevelSpy.mockReturnValue(6);
        expect(new Fruit(game).getPointsIndex()).toBe(9);

        getLevelSpy.mockReturnValue(7);
        expect(new Fruit(game).getPointsIndex()).toBe(11);
    });

    it('constructor should pick a random fruit for levels above 7', () => {
        vi.spyOn(game, 'getLevel').mockReturnValue(8);
        const fruit = new Fruit(game);
        expect(fruit.getPointsIndex()).toBeGreaterThanOrEqual(0);
        expect(fruit.getPointsIndex()).toBeLessThanOrEqual(11);
    });

    it('getUpdateDelayMillis should return a large number', () => {
        const fruit = new Fruit(game);
        expect(fruit.getUpdateDelayMillis()).toBe(100000000000);
    });

    it('paint should draw the fruit at the correct location', () => {
        const drawSpriteSpy = vi.spyOn(game, 'drawSprite');
        const fruit = new Fruit(game);
        fruit.paint(game.getRenderingContext());
        expect(drawSpriteSpy).toHaveBeenCalledWith(
            fruit.x, fruit.y,
            expect.any(Number), expect.any(Number),
        );
    });

    it('never moves on update calls', () => {
        const fruit = new Fruit(game);
        const expectedX = fruit.x;
        const expectedY = fruit.y;
        fruit.updatePosition({} as Maze, fruit.getUpdateDelayMillis() + 1);
        expect(fruit.x).toBe(expectedX);
        expect(fruit.y).toBe(expectedY);
    });
});
