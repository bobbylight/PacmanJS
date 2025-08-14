import { BaseSprite } from './BaseSprite';
import { Maze } from './Maze';
import { describe, expect, test } from 'vitest';

class ConcreteSprite extends BaseSprite {

    constructor() {
        super(2);
    }

    getUpdateDelayMillis(): number {
        return 100;
    }

    protected updatePositionImpl(maze: Maze): void {
    }

}

describe('BaseSprite', () => {

    test('can be subclassed', () => {
        const sprite: ConcreteSprite = new ConcreteSprite();
        expect(sprite).toBeDefined();
    });
});
