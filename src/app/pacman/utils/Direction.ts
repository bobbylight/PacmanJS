import { Direction } from "../constants/direction";


export const DirectionUtil = {

    fromString(str: string = 'SOUTH'): Direction {
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
};


