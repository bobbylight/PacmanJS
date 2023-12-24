import { _BaseSprite } from './_BaseSprite';
import { Maze } from './Maze';
import { describe, expect, test } from 'vitest';

class ConcreteSprite extends _BaseSprite {

    constructor() {
        super(2);
    }

    getUpdateDelayMillis(): number {
        return 100;
    }

    protected updatePositionImpl(maze: Maze): void {
    }

}

describe('_BaseSprite', () => {

    test('can be subclassed', () => {
        const sprite: ConcreteSprite = new ConcreteSprite();
        expect(sprite).toBeDefined();
    });
});
