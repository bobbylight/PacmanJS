declare module pacman {
    enum Direction {
        NORTH = 0,
        EAST = 1,
        SOUTH = 2,
        WEST = 3,
    }
    class DirectionUtil {
        static fromString(str?: string): Direction;
    }
}
