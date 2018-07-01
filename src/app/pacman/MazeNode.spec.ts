import { MazeNode } from './MazeNode';
import * as chai from 'chai';

describe('MazeNode', () => {

    it('constructor, 0-arg', () => {
        const node: MazeNode = new MazeNode();
        chai.assert.equal(node.row, 0);
        chai.assert.equal(node.col, 0);
    });
});
