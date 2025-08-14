import { describe, expect, it, vi } from 'vitest';
import { Fruit } from './Fruit';
import { Maze } from './Maze';

describe('Fruit', () => {
    const mockGame: any /* PacmanGame */ = {
        checkLoopedSound: () => {},
        drawSprite: vi.fn(),
        get PENALTY_BOX_EXIT_X() {
            return 100
        },
        getLevel: () => 0,
        randomInt: () => 0,
    };

    it('constructor should pick the right fruit for the level', () => {
        expect(new Fruit({ ...mockGame, getLevel: () => 0 }).getPointsIndex()).toBe(0);
        expect(new Fruit({ ...mockGame, getLevel: () => 1 }).getPointsIndex()).toBe(2);
        expect(new Fruit({ ...mockGame, getLevel: () => 2 }).getPointsIndex()).toBe(4);
        expect(new Fruit({ ...mockGame, getLevel: () => 3 }).getPointsIndex()).toBe(5);
        expect(new Fruit({ ...mockGame, getLevel: () => 4 }).getPointsIndex()).toBe(10);
        expect(new Fruit({ ...mockGame, getLevel: () => 5 }).getPointsIndex()).toBe(7);
        expect(new Fruit({ ...mockGame, getLevel: () => 6 }).getPointsIndex()).toBe(9);
        expect(new Fruit({ ...mockGame, getLevel: () => 7 }).getPointsIndex()).toBe(11);
    });

    it('constructor should pick a random fruit for levels above 7', () => {
        const fruit = new Fruit({ ...mockGame, getLevel: () => 8 });
        expect(fruit.getPointsIndex()).toBeGreaterThanOrEqual(0);
        expect(fruit.getPointsIndex()).toBeLessThanOrEqual(11);
    });

    it('getUpdateDelayMillis should return a large number', () => {
        const fruit = new Fruit(mockGame);
        expect(fruit.getUpdateDelayMillis()).toBe(100000000000);
    });

    it('paint should draw the fruit at the correct location', () => {
        const fruit = new Fruit(mockGame);
        fruit.paint({} as unknown as CanvasRenderingContext2D);
        expect(mockGame.drawSprite).toHaveBeenCalledWith(
            fruit.x, fruit.y,
            expect.any(Number), expect.any(Number),
        );
    });

    it('never moves on update calls', () => {
        const fruit = new Fruit(mockGame);
        const expectedX = fruit.x;
        const expectedY = fruit.y;
        fruit.updatePosition({} as Maze, fruit.getUpdateDelayMillis() + 1);
        expect(fruit.x).toBe(expectedX);
        expect(fruit.y).toBe(expectedY);
    });
});
