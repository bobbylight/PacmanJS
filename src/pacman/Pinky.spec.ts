import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Pinky } from './Pinky';
import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import { Maze } from './Maze';
import { Pacman } from './Pacman';

describe('Pinky', () => {
    const pacman: Pacman = { row: 0, column: 0 } as never as Pacman;
    const mockGame: any /* PacmanGame */ = {
        checkLoopedSound: () => {},
        pacman,
    };

    test('reset() works as expected', () => {
        const ghost: Pinky = new Pinky(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.NORTH);
        expect(ghost.getMotionState()).toEqual(MotionState.IN_BOX);
    });

    describe('updatePosition', () => {
        const ghost: Pinky = new Pinky(mockGame);

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

                describe('and Pacman is not in the same row or column', () => {
                    beforeEach(() => {
                        const rowSpy = vi.spyOn(pacman, 'row', 'get');
                        rowSpy.mockReturnValue(ghost.row + 1);
                        const colSpy = vi.spyOn(pacman, 'column', 'get');
                        colSpy.mockReturnValue(ghost.column + 1);
                    });

                    test('changes direction', () => {
                        ghost.updatePosition({} as Maze, 1000);
                        expect(changeDirectionFallback).toHaveBeenCalled();
                    });
                });

                describe('and Pacman is in the same row to the left', () => {
                    beforeEach(() => {
                        const rowSpy = vi.spyOn(pacman, 'row', 'get');
                        rowSpy.mockReturnValue(ghost.row);
                        const colSpy = vi.spyOn(pacman, 'column', 'get');
                        colSpy.mockReturnValue(ghost.column - 1);
                    });

                    describe('and it is a clear shot', () => {
                        const mockIsClearShotRow = vi.fn();
                        const mockMaze = {
                            isClearShotRow: mockIsClearShotRow,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotRow.mockReturnValue(true);
                        });

                        test('moves west', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.WEST);
                        });
                    });

                    describe('and it is not a clear shot', () => {
                        const mockIsClearShotRow = vi.fn();
                        const mockMaze = {
                            isClearShotRow: mockIsClearShotRow,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotRow.mockReturnValue(false);
                        });

                        test('changes direction', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(changeDirectionFallback).toHaveBeenCalled();
                        });
                    });
                });

                describe('and Pacman is in the same row to the right', () => {
                    beforeEach(() => {
                        const rowSpy = vi.spyOn(pacman, 'row', 'get');
                        rowSpy.mockReturnValue(ghost.row);
                        const colSpy = vi.spyOn(pacman, 'column', 'get');
                        colSpy.mockReturnValue(ghost.column + 1);
                    });

                    describe('and it is a clear shot', () => {
                        const mockIsClearShotRow = vi.fn();
                        const mockMaze = {
                            isClearShotRow: mockIsClearShotRow,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotRow.mockReturnValue(true);
                        });

                        describe('and the ghost can go right', () => {
                            beforeEach(() => {
                                const spy = vi.spyOn(ghost, 'getCanMoveRight');
                                spy.mockReturnValue(true);
                            });

                            test('moves east', () => {
                                ghost.updatePosition(mockMaze, 1000);
                                expect(ghost.direction).toEqual(Direction.EAST);
                            });
                        });

                        describe('and the ghost cannot go right', () => {
                            beforeEach(() => {
                                const spy = vi.spyOn(ghost, 'getCanMoveRight');
                                spy.mockReturnValue(false);
                            });

                            test('changes direction', () => {
                                ghost.updatePosition(mockMaze, 1000);
                                expect(changeDirectionFallback).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('and it is not a clear shot', () => {
                        const mockIsClearShotRow = vi.fn();
                        const mockMaze = {
                            isClearShotRow: mockIsClearShotRow,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotRow.mockReturnValue(false);
                        });

                        test('changes direction', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(changeDirectionFallback).toHaveBeenCalled();
                        });
                    });
                });

                describe('and Pacman is in the same column above', () => {
                    beforeEach(() => {
                        const rowSpy = vi.spyOn(pacman, 'row', 'get');
                        rowSpy.mockReturnValue(ghost.row - 1);
                        const colSpy = vi.spyOn(pacman, 'column', 'get');
                        colSpy.mockReturnValue(ghost.column);
                    });

                    describe('and it is a clear shot', () => {
                        const mockIsClearShotColumn = vi.fn();
                        const mockMaze = {
                            isClearShotColumn: mockIsClearShotColumn,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotColumn.mockReturnValue(true);
                        });

                        test('moves north', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(ghost.direction).toEqual(Direction.NORTH);
                        });
                    });

                    describe('and it is not a clear shot', () => {
                        const mockIsClearShotColumn = vi.fn();
                        const mockMaze = {
                            isClearShotColumn: mockIsClearShotColumn,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotColumn.mockReturnValue(false);
                        });

                        test('changes direction', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(changeDirectionFallback).toHaveBeenCalled();
                        });
                    });
                });

                describe('and Pacman is in the same column below', () => {
                    beforeEach(() => {
                        const rowSpy = vi.spyOn(pacman, 'row', 'get');
                        rowSpy.mockReturnValue(ghost.row + 1);
                        const colSpy = vi.spyOn(pacman, 'column', 'get');
                        colSpy.mockReturnValue(ghost.column);
                    });

                    describe('and it is a clear shot', () => {
                        const mockIsClearShotColumn = vi.fn();
                        const mockMaze = {
                            isClearShotColumn: mockIsClearShotColumn,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotColumn.mockReturnValue(true);
                        });

                        describe('and the ghost can go down', () => {
                            beforeEach(() => {
                                const spy = vi.spyOn(ghost, 'getCanMoveDown');
                                spy.mockReturnValue(true);
                            });

                            test('moves south', () => {
                                ghost.updatePosition(mockMaze, 1000);
                                expect(ghost.direction).toEqual(Direction.SOUTH);
                            });
                        });

                        describe('and the ghost cannot go down', () => {
                            beforeEach(() => {
                                const spy = vi.spyOn(ghost, 'getCanMoveDown');
                                spy.mockReturnValue(false);
                            });

                            test('changes direction', () => {
                                ghost.updatePosition(mockMaze, 1000);
                                expect(changeDirectionFallback).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('and it is not a clear shot', () => {
                        const mockIsClearShotColumn = vi.fn();
                        const mockMaze = {
                            isClearShotColumn: mockIsClearShotColumn,
                        } as never as Maze;
                        beforeEach(() => {
                            mockIsClearShotColumn.mockReturnValue(false);
                        });

                        test('changes direction', () => {
                            ghost.updatePosition(mockMaze, 1000);
                            expect(changeDirectionFallback).toHaveBeenCalled();
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
