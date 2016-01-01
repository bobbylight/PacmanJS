declare module pacman {
    /**
     * Blinky, the red ghost.  Blinky always takes the shortest route to Pacman
     * when chasing him.
     */
    class Blinky extends Ghost {
        /**
         * Constructor.
         */
        constructor(game: PacmanGame);
        reset(): void;
        /**
         * Updates an actor's position.
         *
         * @param maze The maze in which the actor is moving.
         */
        updatePositionChasingPacman(maze: Maze): void;
    }
}
