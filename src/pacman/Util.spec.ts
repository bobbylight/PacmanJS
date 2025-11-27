import { describe, expect, it } from 'vitest';
import { fixLevelDatas } from './Util';

describe('Util', () => {
    describe('fixLevelDatas', () => {
        it('converts all hex strings in levelDatas to integers', () => {
            const levelDatas = [
                [
                    [ '1', 'A', 'f', '00', 'fe' ],
                    [ '10', '0', 'ff' ],
                ],
                [
                    [ '2', 'b' ],
                    [ 'c', 'd' ],
                ],
            ];
            const numericLevelDatas = fixLevelDatas(levelDatas);
            expect(numericLevelDatas).toEqual([
                [
                    [ 1, 10, 15, 0, 254 ],
                    [ 16, 0, 255 ],
                ],
                [
                    [ 2, 11 ],
                    [ 12, 13 ],
                ],
            ]);
        });
    });
});
