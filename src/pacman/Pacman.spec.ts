import { afterEach, beforeEach, describe, expect, MockInstance, vi, it } from 'vitest';
import { InputManager } from 'gtp';
import { Direction } from './Direction';
import { Maze } from './Maze';
import { Pacman } from './Pacman';
import { PacmanGame } from './PacmanGame';

const mockImage = {
    draw: vi.fn(),
    drawScaled2: vi.fn(),
};

describe('Pacman', () => {
    let game: PacmanGame;

    beforeEach(() => {
        game = new PacmanGame();
        game.assets.set('sprites', mockImage);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetAllMocks();
    });

    it('getUpdateDelayMillis() works as expected', () => {
        const pacman = new Pacman(game);
        expect(pacman.getUpdateDelayMillis()).toEqual(10);
    });

    describe('handleDirection()', () => {
        let pacman: Pacman;
        let leftMock: MockInstance<InputManager['left']>;
        let rightMock: MockInstance<InputManager['right']>;
        let upMock: MockInstance<InputManager['up']>;
        let downMock: MockInstance<InputManager['down']>;

        beforeEach(() => {
            pacman = new Pacman(game);
            leftMock = vi.spyOn(game.inputManager, 'left');
            rightMock = vi.spyOn(game.inputManager, 'right');
            upMock = vi.spyOn(game.inputManager, 'up');
            downMock = vi.spyOn(game.inputManager, 'down');
        });

        afterEach(() => {
            pacman.reset();
        });

        describe('when moving left', () => {
            beforeEach(() => {
                leftMock.mockReturnValue(true);
            });

            it('changes direction to west if possible', () => {
                vi.spyOn(pacman, 'getCanMoveLeft').mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.WEST);
            });

            it('does not change direction to west if not possible', () => {
                pacman.direction = Direction.EAST;
                vi.spyOn(pacman, 'getCanMoveLeft').mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.EAST);
            });
        });

        describe('when moving right', () => {
            beforeEach(() => {
                rightMock.mockReturnValue(true);
            });

            it('changes direction to east if possible', () => {
                vi.spyOn(pacman, 'getCanMoveRight').mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.EAST);
            });

            it('does not change direction to east if not possible', () => {
                pacman.direction = Direction.WEST;
                vi.spyOn(pacman, 'getCanMoveRight').mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.WEST);
            });
        });

        describe('when moving up', () => {
            beforeEach(() => {
                upMock.mockReturnValue(true);
            });

            it('changes direction to north if possible', () => {
                vi.spyOn(pacman, 'getCanMoveUp').mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.NORTH);
            });

            it('does not change direction to north if not possible', () => {
                pacman.direction = Direction.SOUTH;
                vi.spyOn(pacman, 'getCanMoveUp').mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.SOUTH);
            });
        });

        describe('when moving down', () => {
            beforeEach(() => {
                downMock.mockReturnValue(true);
            });

            it('changes direction to south if possible', () => {
                vi.spyOn(pacman, 'getCanMoveDown').mockReturnValue(true);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.SOUTH);
            });

            it('does not change direction to south if not possible', () => {
                pacman.direction = Direction.NORTH;
                vi.spyOn(pacman, 'getCanMoveDown').mockReturnValue(false);
                pacman.handleInput({} as Maze);
                expect(pacman.direction).toEqual(Direction.NORTH);
            });
        });
    });

    it('incDying() works as expected', () => {
        const pacman = new Pacman(game);

        for (let i = 0; i < 11; i++) {
            expect(pacman.incDying()).toBe(true);
        }

        expect(pacman.incDying()).toBe(false);
    });

    describe('render()', () => {
        let drawSpriteSpy: MockInstance<PacmanGame['drawSprite']>;

        beforeEach(() => {
            drawSpriteSpy = vi.spyOn(game, 'drawSprite');
        });

        describe('when Pacman is not dying', () => {
            it('renders Pacman properly', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.EAST;
                pacman.render({} as CanvasRenderingContext2D);
                expect(drawSpriteSpy).toHaveBeenCalledWith(pacman.bounds.x, pacman.bounds.y,
                    expect.any(Number), expect.any(Number));
            });
        });

        describe('when Pacman is dying', () => {
            it('renders Pacman properly', () => {
                const pacman = new Pacman(game);
                pacman.incDying(); // Set dying state
                pacman.direction = Direction.EAST;
                pacman.render({} as CanvasRenderingContext2D);
                expect(drawSpriteSpy).toHaveBeenCalledWith(pacman.bounds.x, pacman.bounds.y,
                    expect.any(Number), expect.any(Number));
            });
        });
    });

    describe('setLocation()', () => {
        it('sets the location of Pacman correctly', () => {
            const pacman = new Pacman(game);
            const x = 100;
            const y = 200;
            pacman.setLocation(x, y);
            expect(pacman.x).toEqual(x);
            expect(pacman.y).toEqual(y);
        });
    });

    describe('startDying()', () => {
        it('sets dying frame to 1', () => {
            const pacman = new Pacman(game);
            pacman.startDying();
            expect(pacman.dyingFrame).toEqual(1);
        });
    });

    describe('updatePositionImpl()', () => {
        let increaseScoreSpy: MockInstance<PacmanGame['increaseScore']>;

        beforeEach(() => {
            increaseScoreSpy = vi.spyOn(game, 'increaseScore');
        });

        const maze = {
            checkForDot: vi.fn(),
        };

        describe('moving left', () => {
            it('moves left if direction is west and movement is possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.WEST;
                vi.spyOn(pacman, 'getCanMoveLeft').mockReturnValue(true);
                const orig = pacman.x;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.x).toBeLessThan(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            it('does not move left if direction is west and movement is not possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.WEST;
                vi.spyOn(pacman, 'getCanMoveLeft').mockReturnValue(false);
                const orig = pacman.x;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.x).toEqual(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving right', () => {
            it('moves right if direction is east and movement is possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.EAST;
                vi.spyOn(pacman, 'getCanMoveRight').mockReturnValue(true);
                const orig = pacman.x;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.x).toBeGreaterThan(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            it('does not move right if direction is east and movement is not possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.EAST;
                vi.spyOn(pacman, 'getCanMoveRight').mockReturnValue(false);
                const orig = pacman.x;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.x).toEqual(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving up', () => {
            it('moves up if direction is north and movement is possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.NORTH;
                vi.spyOn(pacman, 'getCanMoveUp').mockReturnValue(true);
                const orig = pacman.y;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.y).toBeLessThan(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            it('does not move up if direction is north and movement is not possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.NORTH;
                vi.spyOn(pacman, 'getCanMoveUp').mockReturnValue(false);
                const orig = pacman.y;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.y).toEqual(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });

        describe('moving down', () => {
            it('moves down if direction is south and movement is possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.SOUTH;
                vi.spyOn(pacman, 'getCanMoveDown').mockReturnValue(true);
                const orig = pacman.y;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.y).toBeGreaterThan(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });

            it('does not move down if direction is south and movement is not possible', () => {
                const pacman = new Pacman(game);
                pacman.direction = Direction.SOUTH;
                vi.spyOn(pacman, 'getCanMoveDown').mockReturnValue(false);
                const orig = pacman.y;
                pacman.updatePosition(maze as unknown as Maze, 1000000);
                expect(pacman.y).toEqual(orig);
                expect(increaseScoreSpy).toHaveBeenCalled();
                expect(maze.checkForDot).toHaveBeenCalledWith(pacman.row, pacman.column);
            });
        });
    });
});
