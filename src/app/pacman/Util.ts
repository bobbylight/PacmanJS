
/**
 * Converts a hex string to an integer.
 *
 * @param str The hex number, as a string.
 * @returns The number version of <code>str</code>.
 */
const hexStrToInt: (str: string) => number = (str: string): number => {
    return parseInt(str, 16);
};

export const fixLevelDatas: (levelDatas: any[][][]) => void = (levelDatas: any[][][]) => {
    levelDatas.forEach((levelData: any[][]) => {
        for (let row = 0; row < levelData.length; row++) {
            levelData[row] = levelData[row].map(hexStrToInt);
        }
    });
}
