import { Blinky } from './Blinky';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Maze } from './Maze';

describe('Blinky', () => {
    const mockGame: any /* PacmanGame */ = {
        PENALTY_BOX_EXIT_X: 20,
        PENALTY_BOX_EXIT_Y: 20,
        checkLoopedSound: () => {},
        pacman: {
            row: 5,
            col: 5,
        },
    };

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
        ghost.reset();
    });

    const ghost: Blinky = new Blinky(mockGame);

    test('reset() works as expected', () => {
        ghost.reset();
        expect(ghost.direction).toEqual(Direction.WEST);
        expect(ghost.getMotionState()).toEqual(MotionState.SCATTERING);
    });

    describe('updatePosition', () => {
        describe('when chasing Pacman', () => {
            beforeEach(() => {
                ghost.setMotionState(MotionState.CHASING_PACMAN);
            });

            describe('when not at an intersection', () => {
                let continueInCurrentDirection: ReturnType<typeof vi.spyOn>;
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

            describe('when at an intersection', () => {
                const mockGetPathBreadthFirst = vi.fn();
                const maze = {
                    getPathBreadthFirst: mockGetPathBreadthFirst,
                } as unknown as Maze;

                beforeEach(() => {
                    const spy = vi.spyOn(ghost, 'atIntersection');
                    spy.mockReturnValue(true);
                    vi.spyOn(ghost, 'incX');
                    vi.spyOn(ghost, 'incY');
                });

                test('when a null node is returned, calls changeDirectionFallback', () => {
                    mockGetPathBreadthFirst.mockReturnValue(null);
                    const changeDirectionFallbackSpy = vi.spyOn(ghost, 'changeDirectionFallback').mockImplementation(() => {});

                    ghost.updatePosition(maze, 1000);
                    expect(changeDirectionFallbackSpy).toHaveBeenCalled();
                });

                test('moves west when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column - 1 });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.WEST);
                    expect(ghost.incX).toHaveBeenCalledWith(-ghost.moveAmount);
                });

                test('moves east when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column + 1 });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.EAST);
                    expect(ghost.incX).toHaveBeenCalledWith(ghost.moveAmount);
                });

                test('moves north when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row - 1, col: ghost.column });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.NORTH);
                    expect(ghost.incY).toHaveBeenCalledWith(-ghost.moveAmount);
                });

                test('moves south when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row + 1, col: ghost.column });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.SOUTH);
                    expect(ghost.incY).toHaveBeenCalledWith(ghost.moveAmount);
                });
            });
        });
    });
});
