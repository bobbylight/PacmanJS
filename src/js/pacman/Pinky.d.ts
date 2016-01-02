declare module pacman {
    /**
    * Pinky, the pink ghost.  If PacMan is "visible" to Pinky (i.e., in the
    * same row or column), he'll chase him
     */
    class Pinky extends Ghost {
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
