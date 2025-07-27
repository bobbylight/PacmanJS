import { Blinky } from './Blinky';
import { Direction } from './Direction';
import { MotionState } from './Ghost';
import { describe, expect, test, vi } from 'vitest';
import { Maze } from './Maze';

describe('Blinky', () => {
    const mockGame: any /* PacmanGame */ = {
        checkLoopedSound: () => {}
    };

    test('reset() works as expected', () => {
        const ghost: Blinky = new Blinky(mockGame);
        ghost.reset();

        expect(ghost.direction).toEqual(Direction.WEST);
        expect(ghost.motionState).toEqual(MotionState.SCATTERING);
    });

    describe('updatePosition', () => {
        const ghost: Blinky = new Blinky(mockGame);

        describe('when chasing Pacman', () => {
            ghost.motionState = MotionState.CHASING_PACMAN;

            describe('when not at an intersection', () => {
                const spy = vi.spyOn(ghost, 'atIntersection');
                spy.mockReturnValue(false);
                const continueInCurrentDirection = vi.spyOn(ghost, 'continueInCurrentDirection');

                test('continues in the current direction', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(continueInCurrentDirection).toHaveBeenCalled();
                });
            });

            // TODO: 'when at an intersection' test cases
        });
    });
});
