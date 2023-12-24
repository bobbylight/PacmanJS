import { MazeNode } from './MazeNode';
import { describe, expect, test } from 'vitest';

describe('MazeNode', () => {

    test('constructor, 0-arg', () => {
        const node: MazeNode = new MazeNode();
        expect(node.row).toEqual(0);
        expect(node.col).toEqual(0);
    });
});
