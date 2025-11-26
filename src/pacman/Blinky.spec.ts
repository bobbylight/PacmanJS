import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import { Blinky } from './Blinky';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';

describe('Blinky', () => {
    let game: PacmanGame;
    let ghost: Blinky;

    beforeEach(() => {
        game = new PacmanGame();
        ghost = new Blinky(game);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
        ghost.reset();
    });

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
                let incXSpy: MockInstance<Blinky['incX']>;
                let incYSpy: MockInstance<Blinky['incY']>;

                const maze = {
                    getPathBreadthFirst: mockGetPathBreadthFirst,
                } as unknown as Maze;

                beforeEach(() => {
                    const spy = vi.spyOn(ghost, 'atIntersection');
                    spy.mockReturnValue(true);
                    incXSpy = vi.spyOn(ghost, 'incX');
                    incYSpy = vi.spyOn(ghost, 'incY');
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
                    expect(incXSpy).toHaveBeenCalledWith(-ghost.moveAmount);
                });

                test('moves east when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column + 1 });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.EAST);
                    expect(incXSpy).toHaveBeenCalledWith(ghost.moveAmount);
                });

                test('moves north when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row - 1, col: ghost.column });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.NORTH);
                    expect(incYSpy).toHaveBeenCalledWith(-ghost.moveAmount);
                });

                test('moves south when necessary', () => {
                    mockGetPathBreadthFirst.mockReturnValue({ row: ghost.row + 1, col: ghost.column });
                    ghost.updatePosition(maze, 1000);
                    expect(ghost.direction).toEqual(Direction.SOUTH);
                    expect(incYSpy).toHaveBeenCalledWith(ghost.moveAmount);
                });
            });
        });
    });
});
