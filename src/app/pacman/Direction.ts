export enum Direction {
    EAST = 0,
    SOUTH = 1,
    WEST = 2,
    NORTH = 3
}

export class DirectionUtil {

    static fromString(str: string = 'SOUTH'): Direction {
        switch (str.toUpperCase()) {
            case 'NORTH':
                return Direction.NORTH;
            case 'EAST':
                return Direction.EAST;
            case 'WEST':
                return Direction.WEST;
            case 'SOUTH':
            default:
                return Direction.SOUTH;
        }
    }
}
