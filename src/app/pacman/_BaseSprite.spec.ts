import { _BaseSprite } from './_BaseSprite';
import { Maze } from './Maze';

class ConcreteSprite extends _BaseSprite {

    constructor() {
        super(2);
    }

    getUpdateDelayMillis(): number {
        return 100;
    }

    updatePositionImpl(maze: Maze): void {
    }

}

describe('_BaseSprite', () => {

    it('can be subclassed', () => {
        const sprite: ConcreteSprite = new ConcreteSprite();
        expect(sprite).toBeDefined();
    });
});
