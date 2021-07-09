import { MazeNode } from './MazeNode';

describe('MazeNode', () => {

    it('constructor, 0-arg', () => {
        const node: MazeNode = new MazeNode();
        expect(node.row).toEqual(0);
        expect(node.col).toEqual(0);
    });
});
