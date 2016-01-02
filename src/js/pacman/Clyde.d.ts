declare module pacman {
    /**
    * Clyde, the orange ghost.
     */
    class Clyde extends Ghost {
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
