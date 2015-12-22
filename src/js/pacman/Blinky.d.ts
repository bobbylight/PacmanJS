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
        /**
         * Resets the ghost's internal state so that:
         *
         * <ol>
         *    <li>It is in the penalty box (except for Blinky).
         *    <li>It's no longer blinking.
         *    <li>Its direction is set appropriately.
         * </ol>
         *
         * This method should be called on loading a new level, PacMan dying, etc.
         */
        reset(): void;
        /**
         * Updates an actor's position.
         *
         * @param maze The maze in which the actor is moving.
         */
        updatePositionChasingPacman(maze: Maze): void;
    }
}
