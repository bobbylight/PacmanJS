declare module pacman {
    enum Direction {
        EAST = 0,
        SOUTH = 1,
        WEST = 2,
        NORTH = 3,
    }
    class DirectionUtil {
        static fromString(str?: string): Direction;
    }
}
