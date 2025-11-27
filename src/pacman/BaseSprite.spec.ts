import { describe, expect, it } from 'vitest';
import { BaseSprite } from './BaseSprite';
import { Maze } from './Maze';

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

    it('can be subclassed', () => {
        const sprite: ConcreteSprite = new ConcreteSprite();
        expect(sprite).toBeDefined();
    });
});
