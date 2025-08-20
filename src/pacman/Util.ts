
/**
 * Converts a hex string to an integer.
 *
 * @param str The hex number, as a string.
 * @returns The number version of <code>str</code>.
 */
const hexStrToInt: (str: string) => number = (str: string): number => {
    return parseInt(str, 16);
};

export const fixLevelDatas: (levelDatas: string[][][]) => number[][][] = (levelDatas: string[][][]) => {
    return levelDatas.map(levelData => levelData.map(row => row.map(hexStrToInt)));
}
