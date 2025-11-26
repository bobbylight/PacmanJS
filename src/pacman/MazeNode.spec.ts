import { describe, expect, test } from 'vitest';
import { MazeNode } from './MazeNode';

describe('MazeNode', () => {

    test('constructor, 0-arg', () => {
        const node: MazeNode = new MazeNode();
        expect(node.row).toEqual(0);
        expect(node.col).toEqual(0);
    });

    describe('equals', () => {
        test('equal nodes', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(1, 2);
            expect(node1.equals(node2)).toBeTruthy();
        });

        test('unequal row', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(2, 2);
            expect(node1.equals(node2)).toBeFalsy();
        });

        test('unequal column', () => {
            const node1: MazeNode = new MazeNode(1, 2);
            const node2: MazeNode = new MazeNode(1, 3);
            expect(node1.equals(node2)).toBeFalsy();
        });
    });

    describe('set', () => {
        test('set values', () => {
            const node: MazeNode = new MazeNode();
            node.set(3, 4, null);
            expect(node.row).toEqual(3);
            expect(node.col).toEqual(4);
            expect(node.parent).toBeNull();
        });

        test('set with parent', () => {
            const parent: MazeNode = new MazeNode(1, 1);
            const node: MazeNode = new MazeNode();
            node.set(2, 3, parent);
            expect(node.row).toEqual(2);
            expect(node.col).toEqual(3);
            expect(node.parent).toEqual(parent);
        });
    });

    test('toString', () => {
        const node: MazeNode = new MazeNode(5, 6);
        expect(node.toString()).toEqual('[MazeNode: (5,6)]');
    });
});
