import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Inky } from './Inky';
import { Maze } from './Maze';
import { Blinky } from './Blinky';
import { MazeNode } from './MazeNode';
import { PacmanGame } from './PacmanGame';

describe('Inky', () => {
    const blinky: Blinky = { row: 0, column: 0 } as never as Blinky;
    let game: PacmanGame;

    beforeEach(() => {
        game = new PacmanGame();
    });

    test('reset() works as expected', () => {
        const ghost: Inky = new Inky(game);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.SOUTH);
        expect(ghost.getMotionState()).toEqual(MotionState.IN_BOX);
    });

    describe('updatePosition', () => {
        let ghost: Inky;

        beforeEach(() => {
            ghost = new Inky(game);
        });

        afterEach(() => {
            vi.restoreAllMocks();
            ghost.reset();
        });

        describe('when chasing Pacman', () => {
            beforeEach(() => {
                ghost.setMotionState(MotionState.CHASING_PACMAN);
            });

            describe('when at an intersection', () => {
                let changeDirectionFallback: MockInstance<(maze: Maze) => void>;

                beforeEach(() => {
                    const spy = vi.spyOn(ghost, 'atIntersection');
                    spy.mockReturnValue(true);
                    changeDirectionFallback = vi.spyOn(ghost, 'changeDirectionFallback');
                });

                describe('and Blinky is too far away', () => {
                    const mockMaze: Maze = {
                        getPathBreadthFirst: vi.fn(),
                    } as never as Maze;

                    beforeEach(() => {
                        const spy = vi.spyOn(blinky, 'row', 'get');
                        spy.mockReturnValue(100); // Simulate Blinky being far away
                    });

                    test('changes direction', () => {
                        ghost.updatePosition(mockMaze, 1000);
                        expect(changeDirectionFallback).toHaveBeenCalled();
                    });
                });

                describe('and Blinky is not too far away', () => {
                    const getPathBreadFirstMock = vi.fn();
                    const mockMaze: Maze = {
                        getPathBreadthFirst: getPathBreadFirstMock,
                    } as never as Maze;
                    beforeEach(() => {
                        const spy = vi.spyOn(blinky, 'row', 'get');
                        spy.mockReturnValue(ghost.row + 1);
                        const spy2 = vi.spyOn(blinky, 'column', 'get');
                        spy2.mockReturnValue(ghost.column + 1);
                    });

                    describe('and no path is found (e.g. God Mode)', () => {
                        beforeEach(() => {
                            getPathBreadFirstMock.mockReturnValue(null);
                        });

                        test('changes direction', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(changeDirectionFallback).toHaveBeenCalled();
                        });
                    });

                    describe('and the ghost should move west', () => {
                        beforeEach(() => {
                            getPathBreadFirstMock.mockReturnValue({ row: ghost.row, col: ghost.column - 1 } as MazeNode);
                        });

                        test('moves west', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.WEST);
                        });
                    });

                    describe('and the ghost should move east', () => {
                        beforeEach(() => {
                            getPathBreadFirstMock.mockReturnValue({ row: ghost.row, col: ghost.column + 1 } as MazeNode);
                        });

                        test('moves west', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.EAST);
                        });
                    });

                    describe('and the ghost should move north', () => {
                        beforeEach(() => {
                            getPathBreadFirstMock.mockReturnValue({ row: ghost.row - 1, col: ghost.column } as MazeNode);
                        });

                        test('moves west', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.NORTH);
                        });
                    });

                    describe('and the ghost should move south', () => {
                        beforeEach(() => {
                            getPathBreadFirstMock.mockReturnValue({ row: ghost.row + 1, col: ghost.column } as MazeNode);
                        });

                        test('moves west', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.SOUTH);
                        });
                    });
                });
            });

            describe('when not at an intersection', () => {
                let continueInCurrentDirection: MockInstance<(moveAmount: number) => void>;

                beforeEach(() => {
                    const spy = vi.spyOn(ghost, 'atIntersection');
                    spy.mockReturnValue(false);
                    continueInCurrentDirection = vi.spyOn(ghost, 'continueInCurrentDirection');
                });

                test('continues in the current direction', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(continueInCurrentDirection).toHaveBeenCalled();
                });
            });
        });
    });
});
