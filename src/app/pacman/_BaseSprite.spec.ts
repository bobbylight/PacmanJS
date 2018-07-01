import { _BaseSprite } from './_BaseSprite';
import { Maze } from './Maze';
import * as chai from 'chai';

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
        chai.assert.isDefined(sprite);
    });
});
