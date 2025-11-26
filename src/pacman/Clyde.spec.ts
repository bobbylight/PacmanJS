import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { Clyde } from './Clyde';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';

describe('Clyde', () => {
    const game = new PacmanGame();

    test('reset() works as expected', () => {
        const ghost: Clyde = new Clyde(game);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.SOUTH);
        expect(ghost.getMotionState()).toEqual(MotionState.IN_BOX);
    });

    describe('updatePosition', () => {
        const ghost: Clyde = new Clyde(game);

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

                test('changes direction', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(changeDirectionFallback).toHaveBeenCalled();
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
