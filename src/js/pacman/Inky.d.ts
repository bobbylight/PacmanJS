declare module pacman {
    /**
     * Inky, the blue ghost.  Inky is "bashful" and only changes after Pacman if
     * Blinky (the reg ghost) is close by.
     */
    class Inky extends Ghost {
        /**
         * Constructor.
         */
        constructor(game: PacmanGame);
        reset(): void;
        updatePositionChasingPacman(maze: Maze): void;
    }
}
