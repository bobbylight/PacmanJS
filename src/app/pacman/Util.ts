
/**
 * Converts a hex string to an integer.
 *
 * @param str The hex number, as a string.
 * @returns The number version of <code>str</code>.
 */
const hexStrToInt: (str: string) => number = (str: string): number => {
    return parseInt(str, 16);
};

export const fixLevelData: (levelData: any[][]) => void = (levelData: any[][]) => {
    levelData.forEach((rowData: any[]) => {
        for (let i = 0; i < rowData.length; i++) {
            rowData[i] = hexStrToInt(rowData[i]);
        }
    });
}
