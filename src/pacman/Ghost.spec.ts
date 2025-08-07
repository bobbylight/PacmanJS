import { Ghost, MotionState } from './Ghost';
import { Maze } from './Maze';
import { PacmanGame } from './PacmanGame';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Direction } from './Direction';
import { Point } from 'gtp';
import { Pacman } from './Pacman';

const mockGame: any = {
    PENALTY_BOX_EXIT_X: 120,
    PENALTY_BOX_EXIT_Y: 120,
    checkLoopedSound: () => {},
    drawSprite: vi.fn(),
    level: 0,
    playTime: 5000,
};
const mockPacman = {
    row: 0,
    column: 0,
} as unknown as Pacman;
mockGame.pacman = mockPacman;

export class ConcreteGhost extends Ghost {

    constructor(game: PacmanGame) {
        super(game, 0, 0);
        this.motionState = MotionState.CHASING_PACMAN;
    }

    protected updatePositionChasingPacman(maze: Maze): void {
    }
}

const mocks = vi.hoisted(() => {
    return {
        randomInt: vi.fn(),
    };
});

describe('Ghost', () => {

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('can be subclassed', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
        expect(ghost).toBeDefined();
    });

    describe('changeDirectionFallback()', () => {
        let ghost: ConcreteGhost;
        const mockGoUpIfPossible = vi.fn();
        const mockGoDownIfPossible = vi.fn();
        const mockGoLeftIfPossible = vi.fn();
        const mockGoRightIfPossible = vi.fn();

        beforeEach(() => {
            ghost = new ConcreteGhost(mockGame);
            ghost.goUpIfPossible = mockGoUpIfPossible;
            ghost.goDownIfPossible = mockGoDownIfPossible;
            ghost.goLeftIfPossible = mockGoLeftIfPossible;
            ghost.goRightIfPossible = mockGoRightIfPossible;

            vi.mock(import('gtp'), async(importOriginal) => {
                const original = await importOriginal();
                return {
                    ...original,
                    Utils: {
                        randomInt: mocks.randomInt,
                    } as any,
                };
            });
        });

        describe('when RNG returns 0', () => {
            beforeEach(() => {
                mocks.randomInt.mockReturnValue(0);
            });

            describe('and they can go up', () => {
                it('goes up', () => {
                    mockGoUpIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go left', () => {
                it('goes left', () => {
                    mockGoLeftIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go right', () => {
                it('goes right', () => {
                    mockGoRightIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });

            describe('and they cannot go any direction except down', () => {
                it('goes down', () => {
                    mockGoDownIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });
        });

        describe('when RNG returns 1', () => {
            beforeEach(() => {
                mocks.randomInt.mockReturnValue(1);
            });

            describe('and they can go left', () => {
                it('goes left', () => {
                    mockGoLeftIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go up', () => {
                it('goes up', () => {
                    mockGoUpIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go down', () => {
                it('goes down', () => {
                    mockGoDownIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they cannot go any direction except right', () => {
                it('goes right', () => {
                    mockGoRightIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });
        });

        describe('when RNG returns 2', () => {
            beforeEach(() => {
                mocks.randomInt.mockReturnValue(2);
            });

            describe('and they can go down', () => {
                it('goes down', () => {
                    mockGoDownIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go left', () => {
                it('goes left', () => {
                    mockGoLeftIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).not.toHaveBeenCalled();
                });
            });

            describe('and they can go right', () => {
                it('goes right', () => {
                    mockGoRightIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });

            describe('and they cannot go any direction except up', () => {
                it('goes up', () => {
                    mockGoUpIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });
        });

        describe('when RNG returns 3', () => {
            beforeEach(() => {
                mocks.randomInt.mockReturnValue(3);
            });

            describe('and they can go right', () => {
                it('goes right', () => {
                    mockGoRightIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });

            describe('and they can go up', () => {
                it('goes up', () => {
                    mockGoUpIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });

            describe('and they can go down', () => {
                it('goes down', () => {
                    mockGoDownIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).not.toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });

            describe('and they cannot go any direction except left', () => {
                it('goes left', () => {
                    mockGoLeftIfPossible.mockReturnValue(true);
                    ghost.changeDirectionFallback({} as Maze);
                    expect(ghost.goUpIfPossible).toHaveBeenCalled();
                    expect(ghost.goDownIfPossible).toHaveBeenCalled();
                    expect(ghost.goLeftIfPossible).toHaveBeenCalled();
                    expect(ghost.goRightIfPossible).toHaveBeenCalled();
                });
            });
        });
    });

    describe('continueInCurrentDirection()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
        const mockIncY = vi.fn();
        const mockIncX = vi.fn();

        beforeEach(() => {
            ghost.incY = mockIncY;
            ghost.incX = mockIncX;
        });

        it('decrements y if they are going up', () => {
            ghost.direction = Direction.NORTH;
            ghost.continueInCurrentDirection(4);
            expect(mockIncY).toHaveBeenCalledWith(-4);
            expect(mockIncX).not.toHaveBeenCalled();
        });

        it('decrements x if they are going left', () => {
            ghost.direction = Direction.WEST;
            ghost.continueInCurrentDirection(4);
            expect(mockIncX).toHaveBeenCalledWith(-4);
            expect(mockIncY).not.toHaveBeenCalled();
        });

        it('increments y if they are going down', () => {
            ghost.direction = Direction.SOUTH;
            ghost.continueInCurrentDirection(4);
            expect(mockIncY).toHaveBeenCalledWith(4);
            expect(mockIncX).not.toHaveBeenCalled();
        });

        it('increments x if they are going right', () => {
            ghost.direction = Direction.EAST;
            ghost.continueInCurrentDirection(4);
            expect(mockIncX).toHaveBeenCalledWith(4);
            expect(mockIncY).not.toHaveBeenCalled();
        });
    });

    describe('getBlueTimeForLevel()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        it('is correct for levels 0 and 1', () => {
            expect(ghost.getBlueTimeForLevel(0)).toBe(8000);
            expect(ghost.getBlueTimeForLevel(1)).toBe(8000);
        });

        it('is correct for levels 2 and 3', () => {
            expect(ghost.getBlueTimeForLevel(2)).toBe(6000);
            expect(ghost.getBlueTimeForLevel(3)).toBe(6000);
        });

        it('is correct for levels 4 and 5', () => {
            expect(ghost.getBlueTimeForLevel(4)).toBe(4000);
            expect(ghost.getBlueTimeForLevel(5)).toBe(4000);
        });

        it('is correct for levels 6 and 7', () => {
            expect(ghost.getBlueTimeForLevel(6)).toBe(2000);
            expect(ghost.getBlueTimeForLevel(7)).toBe(2000);
        });

        it('is correct for levels 8+', () => {
            for (let i: number = 8; i < 20; i++) {
                expect(ghost.getBlueTimeForLevel(i)).toBe(0);
            }
        });
    });

    it('returns the proper value for getFrameCount()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
        expect(ghost.getFrameCount()).toBe(2);
    });

    describe('getUpdateDelayMillis()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        it('returns the proper value for blue ghosts', () => {
            ghost.motionState = MotionState.BLUE;
            expect(ghost.getUpdateDelayMillis()).toBe(25);
        });

        [
            MotionState.SCATTERING,
            MotionState.CHASING_PACMAN,
            MotionState.EYES,
            MotionState.EYES_ENTERING_BOX,
            MotionState.IN_BOX,
            MotionState.LEAVING_BOX
        ].forEach(state => {
            it(`returns the proper value for non-blue ghosts when they are ${state}`, () => {
                ghost.motionState = state;
                expect(ghost.getUpdateDelayMillis()).toBe(10);
            });
        });
    });

    it('returns the proper value for isEyes()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
        ghost.motionState = MotionState.EYES;
        expect(ghost.isEyes()).toBe(true);

        ghost.motionState = MotionState.EYES_ENTERING_BOX;
        expect(ghost.isEyes()).toBe(true);

        [
            MotionState.IN_BOX,
            MotionState.LEAVING_BOX,
            MotionState.SCATTERING,
            MotionState.CHASING_PACMAN,
            MotionState.BLUE
        ].forEach(state => {
            ghost.motionState = state;
            expect(ghost.isEyes()).toBe(false);
        });
    });

    describe('paint()', () => {
        const ghost = new ConcreteGhost(mockGame);

        describe('when they are blue', () => {
            beforeEach(() => {
                ghost.motionState = MotionState.BLUE;
            });

            it('paints the blue ghost', () => {
                ghost.paint({} as CanvasRenderingContext2D);
                expect(mockGame.drawSprite).toHaveBeenCalledOnce();
            });

            describe('and they are about to stop being blue', () => {
                beforeEach(() => {
                    ghost.exitBlueTime = 6000; // 1 second from now
                    mockGame.playTime = 5250; // Current time
                });

                it('paints the blue ghost blinking', () => {
                    ghost.paint({} as CanvasRenderingContext2D);
                    expect(mockGame.drawSprite).toHaveBeenCalledOnce();
                });
            });
        });

        [
            MotionState.EYES, MotionState.EYES_ENTERING_BOX
        ].forEach(state => {
            describe(`when they are ${state}`, () => {
                beforeEach(() => {
                    ghost.motionState = state;
                });

                it('paints the eyes', () => {
                    ghost.paint({} as CanvasRenderingContext2D);
                    expect(mockGame.drawSprite).toHaveBeenCalledOnce();
                });
            });
        });

        describe('when they are not blue or eyes', () => {
            beforeEach(() => {
                ghost.motionState = MotionState.CHASING_PACMAN;
            });

            it('paints the normal ghost', () => {
                ghost.paint({} as CanvasRenderingContext2D);
                expect(mockGame.drawSprite).toHaveBeenCalledOnce();
            });
        });
    });

    describe('possiblyTurnBlue()', () => {
        [ MotionState.EYES, MotionState.EYES_ENTERING_BOX, MotionState.IN_BOX, MotionState.LEAVING_BOX ].forEach(state => {
            it(`does nothing if they are ${state}`, () => {
                const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
                ghost.motionState = state;
                ghost.possiblyTurnBlue();
                expect(ghost.isBlue()).toBe(false);
            });
        });

        [ MotionState.SCATTERING, MotionState.CHASING_PACMAN, MotionState.BLUE ].forEach(state => {
            it(`turns blue if they are ${state}`, () => {
                const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
                ghost.motionState = state;
                ghost.possiblyTurnBlue();
                expect(ghost.isBlue()).toBe(true);
                expect(ghost.exitBlueTime).toBeGreaterThan(0); // Fix #16
            });
        });
    });

    it('setCorner() works', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);
        expect(() => ghost.setCorner(new Point(20, 20))).not.toThrow();
    });

    describe('updatePositionBlue()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.motionState = MotionState.BLUE;
        });

        afterEach(() => {
            ghost.reset();
        });

        describe('when not at an intersection', () => {
            it('continues in current direction', () => {
                const mockContinue = vi.spyOn(ghost, 'continueInCurrentDirection').mockImplementation(() => {});
                vi.spyOn(ghost, 'atIntersection').mockReturnValue(false);
                ghost.updatePosition({} as Maze, 1000);
                expect(mockContinue).toHaveBeenCalledOnce();
            });
        });

        describe('when at an intersection', () => {
            let maze: Maze;
            const isClearShotRow = vi.fn();
            const isClearShotColumn = vi.fn();
            let goUpIfPossible: MockInstance<Ghost['goUpIfPossible']>;
            let goDownIfPossible: MockInstance<Ghost['goDownIfPossible']>;
            let goLeftIfPossible: MockInstance<Ghost['goLeftIfPossible']>;
            let goRightIfPossible: MockInstance<Ghost['goRightIfPossible']>;

            beforeEach(() => {
                const spy = vi.spyOn(ghost, 'atIntersection');
                spy.mockReturnValue(true);

                maze = {
                    isClearShotColumn,
                    isClearShotRow,
                } as unknown as Maze;

                goUpIfPossible = vi.spyOn(ghost, 'goUpIfPossible').mockReturnValue(false);
                goDownIfPossible = vi.spyOn(ghost, 'goDownIfPossible').mockReturnValue(false);
                goLeftIfPossible = vi.spyOn(ghost, 'goLeftIfPossible').mockReturnValue(false);
                goRightIfPossible = vi.spyOn(ghost, 'goRightIfPossible').mockReturnValue(false);
            });

            describe('and the ghost is in the same row as Pacman', () => {
                beforeEach(() => {
                    vi.spyOn(mockPacman , 'row', 'get').mockReturnValue(5);
                    vi.spyOn(mockPacman, 'column', 'get').mockReturnValue(5);
                    vi.spyOn(ghost, 'row', 'get').mockReturnValue(5);
                    vi.spyOn(ghost, 'column', 'get').mockReturnValue(5);
                });

                describe('and there is a clear shot to Pacman', () => {
                    beforeEach(() => {
                        isClearShotRow.mockReturnValue(true);
                        vi.spyOn(ghost, 'incX');
                    });

                    describe('and they can go up', () => {
                        beforeEach(() => {
                            goUpIfPossible.mockReturnValue(true);
                        });

                        it('goes up', () => {
                            ghost.updatePosition(maze, 1000);
                            expect(goUpIfPossible).toHaveBeenCalledOnce();
                            expect(goDownIfPossible).not.toHaveBeenCalled();
                            expect(goLeftIfPossible).not.toHaveBeenCalled();
                            expect(goRightIfPossible).not.toHaveBeenCalled();
                        });
                    });

                    describe('and they cannot go up but can go down', () => {
                        beforeEach(() => {
                            goDownIfPossible.mockReturnValue(true);
                        });

                        it('tries to go down next', () => {
                            ghost.updatePosition(maze, 1000);
                            expect(goUpIfPossible).toHaveBeenCalledOnce();
                            expect(goDownIfPossible).toHaveBeenCalled();
                            expect(goLeftIfPossible).not.toHaveBeenCalled();
                            expect(goRightIfPossible).not.toHaveBeenCalled();
                        });
                    });

                    describe('otherwise if Pacman is to our left', () => {
                        beforeEach(() => {
                            vi.spyOn(mockPacman, 'column', 'get').mockReturnValue(4);
                        });

                        describe('when they can go right', () => {
                            beforeEach(() => {
                                goRightIfPossible.mockReturnValue(true);
                            });

                            it('goes right to avoid Pacman', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goLeftIfPossible).not.toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                            });
                        });

                        describe('when they cannot go right', () => {
                            it('goes left, toward Pacman, as there is no other option', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                                expect(ghost.direction).toEqual(Direction.WEST);
                                expect(ghost.incX).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('otherwise Pacman must be to our right', () => {
                        beforeEach(() => {
                            vi.spyOn(mockPacman, 'column', 'get').mockReturnValue(6);
                        });

                        describe('when they can go left', () => {
                            beforeEach(() => {
                                goLeftIfPossible.mockReturnValue(true);
                            });

                            it('goes left to avoid Pacman', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goLeftIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).not.toHaveBeenCalled();
                            });
                        });

                        describe('when they cannot go left', () => {
                            it('goes right, toward Pacman, as there is no other option', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goLeftIfPossible).toHaveBeenCalled();
                                expect(ghost.direction).toEqual(Direction.EAST);
                                expect(ghost.incX).toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('and there is no clear shot to Pacman', () => {
                    beforeEach(() => {
                        isClearShotRow.mockReturnValue(false);
                    });

                    it('calls changeDirectionFallback()', () => {
                        const mockChange = vi.spyOn(ghost, 'changeDirectionFallback').mockImplementation(() => {});
                        ghost.updatePosition(maze, 1000);
                        expect(mockChange).toHaveBeenCalledOnce();
                    });
                })
            });

            describe('and the ghost is in the same column as Pacman', () => {
                beforeEach(() => {
                    vi.spyOn(mockPacman , 'row', 'get').mockReturnValue(5);
                    vi.spyOn(mockPacman, 'column', 'get').mockReturnValue(5);
                    vi.spyOn(ghost, 'row', 'get').mockReturnValue(5);
                    vi.spyOn(ghost, 'column', 'get').mockReturnValue(5);
                });

                describe('and there is a clear shot to Pacman', () => {
                    beforeEach(() => {
                        isClearShotRow.mockReturnValue(false);
                        isClearShotColumn.mockReturnValue(true);
                        vi.spyOn(ghost, 'incY');
                    });

                    describe('and they can go left', () => {
                        beforeEach(() => {
                            goLeftIfPossible.mockReturnValue(true);
                        });

                        it('goes left', () => {
                            ghost.updatePosition(maze, 1000);
                            expect(goUpIfPossible).not.toHaveBeenCalledOnce();
                            expect(goDownIfPossible).not.toHaveBeenCalled();
                            expect(goLeftIfPossible).toHaveBeenCalled();
                            expect(goRightIfPossible).not.toHaveBeenCalled();
                        });
                    });

                    describe('and they cannot go left but can go right', () => {
                        beforeEach(() => {
                            goRightIfPossible.mockReturnValue(true);
                        });

                        it('tries to go right next', () => {
                            ghost.updatePosition(maze, 1000);
                            expect(goUpIfPossible).not.toHaveBeenCalledOnce();
                            expect(goDownIfPossible).not.toHaveBeenCalled();
                            expect(goLeftIfPossible).toHaveBeenCalled();
                            expect(goRightIfPossible).toHaveBeenCalled();
                        });
                    });

                    describe('otherwise if Pacman is above us', () => {
                        beforeEach(() => {
                            vi.spyOn(mockPacman, 'row', 'get').mockReturnValue(4);
                        });

                        describe('when they can go down', () => {
                            beforeEach(() => {
                                goDownIfPossible.mockReturnValue(true);
                            });

                            it('goes down to avoid Pacman', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).not.toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goLeftIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                            });
                        });

                        describe('when they cannot go down', () => {
                            it('goes up, toward Pacman, as there is no other option', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goLeftIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                                expect(ghost.direction).toEqual(Direction.NORTH);
                                expect(ghost.incY).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('otherwise Pacman must be below us', () => {
                        beforeEach(() => {
                            vi.spyOn(mockPacman, 'row', 'get').mockReturnValue(6);
                        });

                        describe('when they can go up', () => {
                            beforeEach(() => {
                                goUpIfPossible.mockReturnValue(true);
                            });

                            it('goes up to avoid Pacman', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalledOnce();
                                expect(goDownIfPossible).not.toHaveBeenCalled();
                                expect(goLeftIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                            });
                        });

                        describe('when they cannot go up', () => {
                            it('goes down, toward Pacman, as there is no other option', () => {
                                ghost.updatePosition(maze, 1000);
                                expect(goUpIfPossible).toHaveBeenCalled();
                                expect(goLeftIfPossible).toHaveBeenCalled();
                                expect(goRightIfPossible).toHaveBeenCalled();
                                expect(ghost.direction).toEqual(Direction.SOUTH);
                                expect(ghost.incY).toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('and there is no clear shot to Pacman', () => {
                    beforeEach(() => {
                        isClearShotRow.mockReturnValue(false);
                        isClearShotColumn.mockReturnValue(false);
                    });

                    it('calls changeDirectionFallback()', () => {
                        const mockChange = vi.spyOn(ghost, 'changeDirectionFallback').mockImplementation(() => {});
                        ghost.updatePosition(maze, 1000);
                        expect(mockChange).toHaveBeenCalledOnce();
                    });
                })
            });
        });

        it('returns to chasing Pacman after enough time', () => {
            mockGame.playTime += 12000;
            ghost.updatePosition({} as Maze, 1000);
            expect(ghost.motionState).toEqual(MotionState.CHASING_PACMAN);
        });
    });

    describe('updatePositionEyes()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.reset();
            ghost.motionState = MotionState.EYES;
        });

        describe('when not at an intersection', () => {
            beforeEach(() => {
                vi.spyOn(ghost, 'atIntersection').mockReturnValue(false);
                vi.spyOn(ghost, 'continueInCurrentDirection');
            });

            it('continues in the current direction', () => {
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.continueInCurrentDirection).toHaveBeenCalledOnce();
            });

            describe('when they are aligned with the penalty box entrance', () => {
                beforeEach(() => {
                    ghost.setLocation(8, 8);
                    mockGame.PENALTY_BOX_EXIT_X = 8;
                    mockGame.PENALTY_BOX_EXIT_Y = 0;
                });

                it('changes to the EYES_ENTERING_BOX state', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.motionState).toEqual(MotionState.EYES_ENTERING_BOX);
                    expect(ghost.continueInCurrentDirection).not.toHaveBeenCalled();
                });
            });
        });

        describe('when at an intersection', () => {
            const getPathBreadthFirst = vi.fn();
            const mockMaze = {
                getPathBreadthFirst,
            } as unknown as Maze;

            beforeEach(() => {
                vi.spyOn(ghost, 'atIntersection').mockReturnValue(true);
                vi.spyOn(ghost, 'incX');
                vi.spyOn(ghost, 'incY');
            });

            it('when null is returned, changes to the EYES_ENTERING_BOX state', () => {
                getPathBreadthFirst.mockReturnValue(null);
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.motionState).toEqual(MotionState.EYES_ENTERING_BOX);
                expect(getPathBreadthFirst).toHaveBeenCalledOnce();
            });

            it('turns left when the path is to the left', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column - 1 });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.WEST);
                expect(ghost.incX).toHaveBeenCalledExactlyOnceWith(-ghost.moveAmount);
                expect(ghost.incY).not.toHaveBeenCalled();
            });

            it('turns right when the path is to the right', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column + 1 });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.EAST);
                expect(ghost.incX).toHaveBeenCalledExactlyOnceWith(ghost.moveAmount);
                expect(ghost.incY).not.toHaveBeenCalled();
            });

            it('turns up when the path is above', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row - 1, col: ghost.column });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.NORTH);
                expect(ghost.incY).toHaveBeenCalledExactlyOnceWith(-ghost.moveAmount);
                expect(ghost.incX).not.toHaveBeenCalled();
            });

            it('turns down when the path is below', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row + 1, col: ghost.column });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.SOUTH);
                expect(ghost.incY).toHaveBeenCalledExactlyOnceWith(ghost.moveAmount);
                expect(ghost.incX).not.toHaveBeenCalled();
            });
        });
    });

    describe('updatePositionEyesEnteringBox()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.reset();
            ghost.motionState = MotionState.EYES_ENTERING_BOX;
            vi.spyOn(ghost, 'incY');
        });

        describe('when not leaving the box', () => {
            it('continues moving into the box', () => {
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.direction).toEqual(Direction.SOUTH);
                expect(ghost.incY).toHaveBeenCalledOnce();
            });
        });

        describe('when the ghost is completely in the box', () => {
            beforeEach(() => {
                ghost.y = 1000;
            });

            it('changes the leaving the box state', () => {
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.motionState).toEqual(MotionState.LEAVING_BOX);
                expect(ghost.incY).not.toHaveBeenCalled();
            });
        });
    });

    describe('updatePositionInBox()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.reset();
            ghost.motionState = MotionState.IN_BOX;
            vi.spyOn(ghost, 'incY');
        });

        [Direction.WEST, Direction.NORTH].forEach(direction => {
            describe('when the ghost is low enough in the box', () => {
                beforeEach(() => {
                    ghost.y = 140;
                    ghost.direction = direction;
                });

                it('keeps moving north', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.direction).toEqual(direction); // unchanged
                    expect(ghost.incY).toHaveBeenCalledOnce();
                });
            });

            describe('when the ghost reaches a high enough y position', () => {
                beforeEach(() => {
                    ghost.y = 110;
                    ghost.direction = direction;
                });

                it('starts moving south', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.direction).toEqual(Direction.SOUTH);
                    expect(ghost.incY).not.toHaveBeenCalled();
                });
            });
        });

        [Direction.EAST, Direction.SOUTH].forEach(direction => {
            describe('when the ghost is high enough in the box', () => {
                beforeEach(() => {
                    ghost.y = 80;
                    ghost.direction = direction;
                });

                it('keeps moving south', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.direction).toEqual(direction); // unchanged
                    expect(ghost.incY).toHaveBeenCalledOnce();
                });
            });

            describe('when the ghost reaches a low enough y position', () => {
                beforeEach(() => {
                    ghost.y = 125;
                    ghost.direction = direction;
                });

                it('starts moving north', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.direction).toEqual(Direction.NORTH);
                    expect(ghost.incY).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('updatePositionLeavingBox()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.reset();
            ghost.motionState = MotionState.LEAVING_BOX;
            vi.spyOn(ghost, 'incX');
        });

        describe('when to the left of the exit', () => {
            beforeEach(() => {
                ghost.x = mockGame.PENALTY_BOX_EXIT_X - 10;
            });

            it('moves right', () => {
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.direction).toEqual(Direction.EAST);
                expect(ghost.incX).toHaveBeenCalledOnce();
            });
        });

        describe('when to the right of the exit', () => {
            beforeEach(() => {
                ghost.x = mockGame.PENALTY_BOX_EXIT_X + 10;
            });

            it('moves left', () => {
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.direction).toEqual(Direction.WEST);
                expect(ghost.incX).toHaveBeenCalledOnce();
            });
        });

        describe('when horizontally aligned with the exit', () => {
            beforeEach(() => {
                ghost.x = mockGame.PENALTY_BOX_EXIT_X;
                ghost.y = mockGame.PENALTY_BOX_EXIT_Y + 20;
            });

            it('decrements y position', () => {
                const prevY = ghost.y;
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.y).toBeLessThan(prevY);
                expect(ghost.direction).toEqual(Direction.NORTH);
            });

            describe('when they have left the penalty box', () => {
                beforeEach(() => {
                    ghost.y = mockGame.PENALTY_BOX_EXIT_Y;
                });

                it('changes to the SCATTERING state', () => {
                    ghost.updatePosition({} as Maze, 1000);
                    expect(ghost.motionState).toEqual(MotionState.SCATTERING);
                    expect(ghost.direction).toEqual(Direction.WEST);
                });
            });
        });
    });

    describe('updatePositionScattering()', () => {
        const ghost: ConcreteGhost = new ConcreteGhost(mockGame);

        beforeEach(() => {
            ghost.reset();
            ghost.motionState = MotionState.SCATTERING;
            vi.spyOn(ghost, 'incX');
            vi.spyOn(ghost, 'incY');
        });

        describe('when not at an intersection', () => {
            it('continues in current direction', () => {
                vi.spyOn(ghost, 'continueInCurrentDirection').mockImplementation(() => {});
                vi.spyOn(ghost, 'atIntersection').mockReturnValue(false);
                ghost.updatePosition({} as Maze, 1000);
                expect(ghost.continueInCurrentDirection).toHaveBeenCalledOnce();
            });
        });

        describe('when at an intersection', () => {
            const getPathBreadthFirst = vi.fn();
            const mockMaze = {
                getPathBreadthFirst,
            } as unknown as Maze;

            beforeEach(() => {
                vi.spyOn(ghost, 'atIntersection').mockReturnValue(true);
            });

            it('when null is returned, changes direction', () => {
                getPathBreadthFirst.mockReturnValue(null);
                vi.spyOn(ghost, 'changeDirectionFallback').mockImplementation(() => {});
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.changeDirectionFallback).toHaveBeenCalledOnce();
            });

            it('turns left when the path is to the left', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column - 1 });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.WEST);
                expect(ghost.incX).toHaveBeenCalledExactlyOnceWith(-ghost.moveAmount);
                expect(ghost.incY).not.toHaveBeenCalled();
            });

            it('turns right when the path is to the right', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row, col: ghost.column + 1 });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.EAST);
                expect(ghost.incX).toHaveBeenCalledExactlyOnceWith(ghost.moveAmount);
                expect(ghost.incY).not.toHaveBeenCalled();
            });

            it('turns up when the path is above', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row - 1, col: ghost.column });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.NORTH);
                expect(ghost.incY).toHaveBeenCalledExactlyOnceWith(-ghost.moveAmount);
                expect(ghost.incX).not.toHaveBeenCalled();
            });

            it('turns down when the path is below', () => {
                getPathBreadthFirst.mockReturnValue({ row: ghost.row + 1, col: ghost.column });
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.direction).toEqual(Direction.SOUTH);
                expect(ghost.incY).toHaveBeenCalledExactlyOnceWith(ghost.moveAmount);
                expect(ghost.incX).not.toHaveBeenCalled();
            });

            it('goes back to chasing Pacman after a while', () => {
                mockGame.playTime += 10000;
                ghost.updatePosition(mockMaze, 1000);
                expect(ghost.motionState).toEqual(MotionState.CHASING_PACMAN);
            });
        });
    });
});
