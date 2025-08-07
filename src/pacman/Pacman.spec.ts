import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Direction } from './Direction';
import { Maze } from './Maze';
import { Pacman } from './Pacman';

describe('Pacman', () => {
    const mockGame: any /* PacmanGame */ = {
        checkLoopedSound: () => {},
        drawSprite: vi.fn(),
        increaseScore: vi.fn(),
        inputManager: {
            left: vi.fn(),
            right: vi.fn(),
            up: vi.fn(),
            down: vi.fn(),
        },
    };

    test('getUpdateDelayMillis() works as expected', () => {
        const pacman = new Pacman(mockGame)
        expect(pacman.getUpdateDelayMillis()).toEqual(10);
    });

    describe('handleDirection()', () => {
        const pacman = new Pacman(mockGame);

        afterEach(() => {
            vi.restoreAllMocks();
            pacman.reset();
        });

        describe('when moving left', () => {
            beforeEach(() => {
                mockGame.inputManager.left.mockReturnValue(true);
            });

            test('changes direction to west if possible', () => {
                pacman.getCanMoveLeft = vi.fn().mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.WEST);
            });

            test('does not change direction to west if not possible', () => {
                pacman.direction = Direction.EAST;
                pacman.getCanMoveLeft = vi.fn().mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.EAST);
            });
        });

        describe('when moving right', () => {
            beforeEach(() => {
                mockGame.inputManager.right.mockReturnValue(true);
            });

            test('changes direction to east if possible', () => {
                pacman.getCanMoveRight = vi.fn().mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.EAST);
            });

            test('does not change direction to east if not possible', () => {
                pacman.direction = Direction.WEST;
                pacman.getCanMoveRight = vi.fn().mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.WEST);
            });
        });

        describe('when moving up', () => {
            beforeEach(() => {
                mockGame.inputManager.up.mockReturnValue(true);
            });

            test('changes direction to north if possible', () => {
                pacman.getCanMoveUp = vi.fn().mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.NORTH);
            });

            test('does not change direction to north if not possible', () => {
                pacman.direction = Direction.SOUTH;
                pacman.getCanMoveUp = vi.fn().mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.SOUTH);
            });
        });

        describe('when moving down', () => {
            beforeEach(() => {
                mockGame.inputManager.down.mockReturnValue(true);
            });

            test('changes direction to south if possible', () => {
                pacman.getCanMoveDown = vi.fn().mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.SOUTH);
            });

            test('does not change direction to south if not possible', () => {
                pacman.direction = Direction.NORTH;
                pacman.getCanMoveDown = vi.fn().mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.NORTH);
            });
        });
    });

    test('incDying() works as expected', () => {
        const pacman = new Pacman(mockGame);

        for (let i = 0; i < 11; i++) {
            expect(pacman.incDying()).toBe(true);
        }

        expect(pacman.incDying()).toBe(false);
    });

    describe('render()', () => {
        describe('when Pacman is not dying', () => {
            test('renders Pacman properly', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.EAST;
                pacman.render({} as CanvasRenderingContext2D);
                expect(mockGame.drawSprite).toHaveBeenCalledWith(pacman.bounds.x, pacman.bounds.y,
                    expect.any(Number), expect.any(Number));
            });
        });

        describe('when Pacman is dying', () => {
            test('renders Pacman properly', () => {
                const pacman = new Pacman(mockGame);
                pacman.incDying(); // Set dying state
                pacman.direction = Direction.EAST;
                pacman.render({} as CanvasRenderingContext2D);
                expect(mockGame.drawSprite).toHaveBeenCalledWith(pacman.bounds.x, pacman.bounds.y,
                    expect.any(Number), expect.any(Number));
            });
        });
    });

    describe('setLocation()', () => {
        test('sets the location of Pacman correctly', () => {
            const pacman = new Pacman(mockGame);
            const x = 100;
            const y = 200;
            pacman.setLocation(x, y);
            expect(pacman.x).toEqual(x);
            expect(pacman.y).toEqual(y);
        });
    });

    describe('startDying()', () => {
        test('sets dying frame to 1', () => {
            const pacman = new Pacman(mockGame);
            pacman.startDying();
            expect(pacman._dyingFrame).toEqual(1);
        });
    });

    describe('updatePositionImpl()', () => {
        const maze = {
            checkForDot: vi.fn(),
        } as unknown as Maze;

        describe('moving left', () => {
            test('moves left if direction is west and movement is possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.WEST;
                pacman.getCanMoveLeft = vi.fn().mockReturnValue(true);
                const orig = pacman.x;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.x).toBeLessThan(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            test('does not move left if direction is west and movement is not possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.WEST;
                pacman.getCanMoveLeft = vi.fn().mockReturnValue(false);
                const orig = pacman.x;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.x).toEqual(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving right', () => {
            test('moves right if direction is east and movement is possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.EAST;
                pacman.getCanMoveRight = vi.fn().mockReturnValue(true);
                const orig = pacman.x;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.x).toBeGreaterThan(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            test('does not move right if direction is east and movement is not possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.EAST;
                pacman.getCanMoveRight = vi.fn().mockReturnValue(false);
                const orig = pacman.x;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.x).toEqual(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving up', () => {
            test('moves up if direction is north and movement is possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.NORTH;
                pacman.getCanMoveUp = vi.fn().mockReturnValue(true);
                const orig = pacman.y;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.y).toBeLessThan(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            test('does not move up if direction is north and movement is not possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.NORTH;
                pacman.getCanMoveUp = vi.fn().mockReturnValue(false);
                const orig = pacman.y;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.y).toEqual(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving down', () => {
            test('moves down if direction is south and movement is possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.SOUTH;
                pacman.getCanMoveDown = vi.fn().mockReturnValue(true);
                const orig = pacman.y;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.y).toBeGreaterThan(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            test('does not move down if direction is south and movement is not possible', () => {
                const pacman = new Pacman(mockGame);
                pacman.direction = Direction.SOUTH;
                pacman.getCanMoveDown = vi.fn().mockReturnValue(false);
                const orig = pacman.y;
                pacman.updatePosition(maze, 1000000);
                expect(pacman.y).toEqual(orig);
                expect(mockGame.increaseScore).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });
    });
});
