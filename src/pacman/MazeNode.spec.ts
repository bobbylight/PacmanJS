import { describe, expect, it } from 'vitest';
import { MazeNode } from './MazeNode';

describe('MazeNode', () => {

    it('constructor, 0-arg', () => {
        const node: MazeNode = new MazeNode();
        expect(node.row).toEqual(0);
        expect(node.col).toEqual(0);
    });

    describe('equals', () => {
        it('equal nodes', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(1, 2);
            expect(node1.equals(node2)).toEqual(true);
        });

        it('unequal row', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(2, 2);
            expect(node1.equals(node2)).toEqual(false);
        });

        it('unequal column', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(1, 3);
            expect(node1.equals(node2)).toEqual(false);
        });
    });

    describe('set', () => {
        it('set values', () => {
            const node: MazeNode = new MazeNode();
            node.set(3, 4, null);
            expect(node.row).toEqual(3);
            expect(node.col).toEqual(4);
            expect(node.parent).toBeNull();
        });

        it('set with parent', () => {
            const parent: MazeNode = new MazeNode(1, 1);
            const node: MazeNode = new MazeNode();
            node.set(2, 3, parent);
            expect(node.row).toEqual(2);
            expect(node.col).toEqual(3);
            expect(node.parent).toEqual(parent);
        });
    });

    it('toString', () => {
        const node: MazeNode = new MazeNode(5, 6);
        expect(node.toString()).toEqual('[MazeNode: (5,6)]');
    });
});
