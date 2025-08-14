import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { GhostUpdateStrategy, PacmanGame } from './PacmanGame';
import Sounds from './Sounds';
import { MotionState } from './Ghost';
import { Fruit } from './Fruit';
import { MazeState } from './MazeState';
import { StretchMode } from 'gtp';
import { Maze } from './Maze';

describe('PacmanGame', () => {

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('addFruit()', () => {
        it('should only add one fruit to a game at a time', () => {
            const game = new PacmanGame();
            expect(game.addFruit()).not.toBeNull();
            expect(game.addFruit()).toBeNull();
        });
    });

    describe('checkForCollisions()', () => {
        const game = new PacmanGame();

        beforeEach(() => {
            game.resetGhosts();
        });

        it('returns null if Pacman is not intersecting anything', () => {
            expect(game.checkForCollisions()).toBeNull();
        });

        it('returns the ghost if Pacman collides with a ghost', () => {
            game.pacman.setLocation(100, 100);
            game.getGhost(2).setLocation(100, 100);
            expect(game.checkForCollisions()).toEqual(game.getGhost(2));
        });

        it('increases score and plays a sound but returns null if Pacman collides with a fruit', () => {
            vi.spyOn(game, 'increaseScore');
            vi.spyOn(game.audio, 'playSound');

            const fruit = game.addFruit();
            expect(fruit).not.toBeNull();
            if (fruit) {
                game.pacman.setLocation(fruit.x, fruit.y);
                expect(game.checkForCollisions()).toBeNull();
                expect(game.increaseScore).toHaveBeenCalledOnce();
                expect(game.audio.playSound).toHaveBeenCalledWith(Sounds.EATING_FRUIT, false);
            }
        });
    });

    describe('checkLoopedSound()', () => {
        const game = new PacmanGame();
        let setLoopedSound: MockInstance<PacmanGame['setLoopedSound']>;

        beforeEach(() => {
            setLoopedSound = vi.spyOn(game, 'setLoopedSound');
        });

        it('plays a siren sound by default', () => {
            game.checkLoopedSound();
            expect(setLoopedSound).toHaveBeenCalledWith(Sounds.SIREN);
        });

        describe('when a ghost is blue', () => {
            beforeEach(() => {
                // State transitions are verified in the game logic so must be valid here
                game.getGhost(2).setMotionState(MotionState.CHASING_PACMAN);
                game.getGhost(2).setMotionState(MotionState.BLUE);
            });

            it('plays a different sound', () => {
                game.checkLoopedSound();
                expect(setLoopedSound).toHaveBeenCalledWith(Sounds.CHASING_GHOSTS);
            });

            describe('and an earlier ghost is eyes', () => {
                beforeEach(() => {
                    game.getGhost(1).setMotionState(MotionState.EYES);
                });

                it('plays the eyes sound', () => {
                    game.checkLoopedSound();
                    expect(setLoopedSound).toHaveBeenCalledWith(Sounds.EYES_RUNNING);
                });
            });

            describe('and a later ghost is eyes', () => {
                beforeEach(() => {
                    game.getGhost(3).setMotionState(MotionState.EYES);
                });

                it('plays the eyes sound', () => {
                    game.checkLoopedSound();
                    expect(setLoopedSound).toHaveBeenCalledWith(Sounds.EYES_RUNNING);
                });
            });
        });

        describe('when a ghost is eyes', () => {
            beforeEach(() => {
                game.getGhost(2).setMotionState(MotionState.EYES);
            });

            it('plays the eyes sound', () => {
                game.checkLoopedSound();
                expect(setLoopedSound).toHaveBeenCalledWith(Sounds.EYES_RUNNING);
            });
        });
    });

    describe('drawBigDot', () => {
        const game = new PacmanGame();
        const mockImage = {
            drawScaled2: vi.fn(),
        } as any;

        beforeEach(() => {
            game.assets.get = vi.fn(() => mockImage);
        });

        it('should draw a big dot at the correct position if playTime < 0', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(-1);
            game.drawBigDot(50, 50);
            expect(mockImage.drawScaled2).toHaveBeenCalledOnce();
        });

        it('should draw a big dot at the correct position if playTime is every other 250 ms', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(251);
            game.drawBigDot(50, 50);
            expect(mockImage.drawScaled2).toHaveBeenCalledOnce();
        });

        it('draws nothing if playTime is not every other 250 ms', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500);
            game.drawBigDot(50, 50);
            expect(mockImage.drawScaled2).not.toHaveBeenCalled();
        });
    });

    describe('drawFruit', () => {
        let game: PacmanGame;
        let paintPointsEarned: MockInstance<PacmanGame['paintPointsEarned']>;

        beforeEach(() => {
            game = new PacmanGame();
            vi.spyOn(game, 'getLevel').mockReturnValue(1);
            paintPointsEarned = vi.spyOn(PacmanGame.prototype, 'paintPointsEarned').mockImplementation(() => {});
        });

        it('draws nothing if there is no fruit', () => {
            const game = new PacmanGame();
            const ctx = {} as any;
            expect(() => game.drawFruit(ctx)).not.toThrow();
            expect(paintPointsEarned).not.toHaveBeenCalled();
        });

        describe('when there is a fruit', () => {
            let fruit: Fruit | null;
            beforeEach(() => {
                fruit = game.addFruit();
            });

            it('draws the fruit', () => {
                const ctx = {} as any;
                expect(fruit).not.toBeNull();
                if (fruit) {
                    vi.spyOn(fruit, 'paint').mockImplementation(() => {});
                    expect(() => game.drawFruit(ctx)).not.toThrow();
                    expect(fruit.paint).toHaveBeenCalledWith(ctx);
                }
            });

            describe('and it is eaten', () => {
                beforeEach(() => {
                    expect(fruit).not.toBeNull();
                    if (fruit) {
                        game.pacman.setLocation(fruit.x, fruit.y);
                    }
                    game.checkForCollisions();
                });

                it('draws the points earned', () => {
                    const ctx = {} as any;
                    expect(fruit).not.toBeNull();
                    if (fruit) {
                        expect(() => game.drawFruit(ctx)).not.toThrow();
                        expect(paintPointsEarned).toHaveBeenCalled();
                    }
                });

                describe('and enough time has passed for the fruit to disappear', () => {
                    beforeEach(() => {
                        game.fruitScoreEndTime = game.playTime;
                    });

                    it('removes the fruit', () => {
                        // No good way to test this currently
                        expect(() => game.drawFruit({} as any)).not.toThrow();
                    });
                });
            });
        });
    });

    describe('drawGhosts()', () => {
        const game = new PacmanGame();

        it('draws all ghosts', () => {
            const ctx = {} as any;
            vi.spyOn(game.getGhost(0), 'paint').mockImplementation(() => {});
            vi.spyOn(game.getGhost(1), 'paint').mockImplementation(() => {});
            vi.spyOn(game.getGhost(2), 'paint').mockImplementation(() => {});
            vi.spyOn(game.getGhost(3), 'paint').mockImplementation(() => {});
            expect(() => game.drawGhosts(ctx)).not.toThrow();
            expect(game.getGhost(0).paint).toHaveBeenCalledWith(ctx);
            expect(game.getGhost(1).paint).toHaveBeenCalledWith(ctx);
            expect(game.getGhost(2).paint).toHaveBeenCalledWith(ctx);
            expect(game.getGhost(3).paint).toHaveBeenCalledWith(ctx);
        });
    });

    describe('drawScores()', () => {
        const game = new PacmanGame();

        it('draws the scores', () => {
            vi.spyOn(game, 'drawString').mockImplementation(() => {});
            const ctx = {} as any;
            game.drawScores(ctx);
            expect(game.drawString).toHaveBeenCalledTimes(2);
        });
    });

    describe('drawScoresHeaders()', () => {
        const game = new PacmanGame();

        it('draws the score headers', () => {
            vi.spyOn(game, 'drawString').mockImplementation(() => {});
            const ctx = {} as any;
            game.drawScoresHeaders(ctx);
            expect(game.drawString).toHaveBeenCalledTimes(2);
        });
    });

    describe('drawSmallDot()', () => {
        const game = new PacmanGame();

        it('draws a small dot at the correct position', () => {
            const ctx = game.canvas.getContext('2d');
            expect(ctx).toBeDefined();
            if (ctx) {
                vi.spyOn(ctx, 'fillRect');
                game.drawSmallDot(50, 50);
                expect(ctx.fillRect).toHaveBeenCalledWith(50, 50, 2, 2);
            }
        });
    });

    describe('drawSprite()', () => {
        const game = new PacmanGame();
        const mockImage = {
            drawScaled2: vi.fn(),
        } as any;

        beforeEach(() => {
            game.assets.get = vi.fn(() => mockImage);
        });

        it('should draw a sprite at the correct position', () => {
            game.drawSprite(10, 10, 50, 50);
            expect(mockImage.drawScaled2).toHaveBeenCalledOnce();
        });
    });

    describe('drawString()', () => {
        const game = new PacmanGame();
        const mockFontImage = {
            drawByIndex: vi.fn(),
        };

        it('draws a string', () => {
            vi.spyOn(game.assets, 'get').mockReturnValue(mockFontImage);
            const ctx = {} as any;
            const text = 'HELLO1-.>@! ';
            game.drawString(10, 10, text, ctx);
            expect(game.assets.get).toHaveBeenCalledWith('font');
            expect(mockFontImage.drawByIndex).toHaveBeenCalledTimes(text.length);
        });
    });

    it('godMode()', () => {
        expect(new PacmanGame().isGodMode()).toBeFalsy();
    });

    it('ghostEaten()', () => {
        const game = new PacmanGame();
        vi.spyOn(game, 'increaseScore');
        vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);

        for (let i = 0; i < 4; i++) {
            expect(game.ghostEaten(game.getGhost(i))).toBeGreaterThan(0);
            expect(game.increaseScore).toHaveBeenCalled();
            expect(game.audio.playSound).toHaveBeenCalledWith(Sounds.EATING_GHOST);
        }
    });

    it('increaseLives()', () => {
        const game = new PacmanGame();
        expect(() => game.increaseLives(5)).not.toThrow();
    });

    describe('increaseScore()', () => {
        const game = new PacmanGame();

        it('gives an extra life but only once', () => {
            vi.spyOn(game, 'increaseLives');
            game.increaseScore(PacmanGame.EXTRA_LIFE_SCORE);
            expect(game.increaseLives).toHaveBeenCalledWith(1);

            game.increaseScore(100000);
            expect(game.increaseLives).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadNextLevel()', () => {
        const game = new PacmanGame();

        it('resets the level', () => {
            const state = new MazeState([ [ 0, 1 ], [ 1, 0 ] ]);
            vi.spyOn(state, 'reset').mockImplementation(() => {});
            game.state = state;
            game.loadNextLevel();
            expect(state.reset).toHaveBeenCalled();
        });
    });

    describe('makeGhostsBlue()', () => {
        const game = new PacmanGame();

        it('sets all ghosts to blue', () => {
            vi.spyOn(game, 'checkLoopedSound').mockImplementation(() => null);
            for (let i = 0; i < 4; i++) {
                vi.spyOn(game.getGhost(i), 'possiblyTurnBlue');
            }
            game.makeGhostsBlue();
            for (let i = 0; i < 4; i++) {
                expect(game.getGhost(i).possiblyTurnBlue).toHaveBeenCalledOnce();
            }
            expect(game.checkLoopedSound).toHaveBeenCalled();
        });
    });

    it('paintPointsEarned()', () => {
        const mockSpriteSheet = {
            drawByIndex: vi.fn(),
        };
        const game = new PacmanGame();
        vi.spyOn(game.assets, 'get').mockReturnValue(mockSpriteSheet);

        game.paintPointsEarned({} as CanvasRenderingContext2D, 100, 100, 1000);
        expect(mockSpriteSheet.drawByIndex).toHaveBeenCalledOnce();
    });

    describe('playChompSound()', () => {
        const game = new PacmanGame();

        it('alternates between two sounds', () => {
            vi.spyOn(game.audio, 'playSound');
            game.playChompSound();
            expect(game.audio.playSound).toHaveBeenCalledWith(Sounds.CHOMP_1);
            game.playChompSound();
            expect(game.audio.playSound).toHaveBeenCalledWith(Sounds.CHOMP_2);
        });
    });

    describe('startGame()', () => {
        const game = new PacmanGame();

        it('calls setState', () => {
            vi.spyOn(game, 'setState').mockImplementation(() => {});

            const levelsData = [ [ 0, 1 ], [ 1, 0 ] ];
            vi.spyOn(game.assets, 'get').mockReturnValue(levelsData);

            game.startGame(1);
            expect(game.setState).toHaveBeenCalledOnce();
        });
    });

    describe('startPacmanDying()', () => {
        const game = new PacmanGame();

        it('stops the looping sound', () => {
            vi.spyOn(game, 'setLoopedSound').mockImplementation(() => {});
            game.startPacmanDying();
            expect(game.setLoopedSound).toHaveBeenCalledWith(null);
        });

        it('plays the pacman death sound', () => {
            vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            game.startPacmanDying();
            expect(game.audio.playSound).toHaveBeenCalledWith(Sounds.DIES);
        });

        it('starts the pacman dying animation', () => {
            vi.spyOn(game.pacman, 'startDying').mockImplementation(() => {});
            game.startPacmanDying();
            expect(game.pacman.startDying).toHaveBeenCalledOnce();
        });
    });

    it('toggleGodMode()', () => {
        const game = new PacmanGame();
        vi.spyOn(game, 'toggleGodMode');
        expect(game.isGodMode()).toBeFalsy();
        expect(game.toggleGodMode()).toBeTruthy();
        expect(game.isGodMode()).toBeTruthy();
    });

    describe('toggleStretchMode()', () => {
        const game = new PacmanGame();

        it('does not throw when not desktop mode', () => {
            expect(() => game.toggleStretchMode()).not.toThrow();
        });

        describe('when in desktop mode', () => {
            beforeEach(() => {
                vi.spyOn(game, 'isDesktopGame').mockReturnValue(true);
                vi.spyOn(game, 'setStretchMode');
            });

            it('updates properly when coming from NONE', () => {
                game.setStretchMode(StretchMode.STRETCH_NONE);
                expect(() => game.toggleStretchMode()).not.toThrow();
                expect(game.setStretchMode).toHaveBeenCalledWith(StretchMode.STRETCH_FILL);
            });

            it('updates properly when coming from FILL', () => {
                game.setStretchMode(StretchMode.STRETCH_FILL);
                expect(() => game.toggleStretchMode()).not.toThrow();
                expect(game.setStretchMode).toHaveBeenCalledWith(StretchMode.STRETCH_PROPORTIONAL);
            });

            it('updates properly when coming from PROPORTIONAL', () => {
                game.setStretchMode(StretchMode.STRETCH_PROPORTIONAL);
                expect(() => game.toggleStretchMode()).not.toThrow();
                expect(game.setStretchMode).toHaveBeenCalledWith(StretchMode.STRETCH_NONE);
            });
        });
    });

    describe('updateSpriteFrames()', () => {
        const game = new PacmanGame();

        it('updates the sprite frames', () => {
            vi.spyOn(game.pacman, 'updateFrame').mockImplementation(() => {});
            for (let i = 0; i < 4; i++) {
                vi.spyOn(game.getGhost(i), 'updateFrame').mockImplementation(() => {});
            }
            game.updateSpriteFrames();
            expect(game.pacman.updateFrame).toHaveBeenCalledOnce();
            for (let i = 0; i < 4; i++) {
                expect(game.getGhost(i).updateFrame).toHaveBeenCalledOnce();
            }
        });
    });

    describe('updateSpritePositions()', () => {
        const game = new PacmanGame();

        beforeEach(() => {
            for (let i = 0; i < 4; i++) {
                vi.spyOn(game.getGhost(i), 'updatePosition').mockImplementation(() => {});
            }
        });

        describe('with ghost strategy UPDATE_ALL', () => {
            it('updates all ghosts', () => {
                game.updateSpritePositions({} as Maze, 0);
                for (let i = 0; i < 4; i++) {
                    expect(game.getGhost(i).updatePosition).toHaveBeenCalledOnce();
                }
            });
        });

        describe('with ghost strategy UPDATE_NONE', () => {
            beforeEach(() => {
                game.setGhostUpdateStrategy(GhostUpdateStrategy.UPDATE_NONE);
            });

            it('updates no ghosts', () => {
                game.updateSpritePositions({} as Maze, 0);
                for (let i = 0; i < 4; i++) {
                    expect(game.getGhost(i).updatePosition).not.toHaveBeenCalled();
                }
            });
        });

        describe('with ghost strategy UPDATE_ONE', () => {
            beforeEach(() => {
                game.setGhostUpdateStrategy(GhostUpdateStrategy.UPDATE_ONE);
            });

            it('updates only the first ghost', () => {
                game.updateSpritePositions({} as Maze, 0);
                expect(game.getGhost(0).updatePosition).toHaveBeenCalledOnce();
                for (let i = 1; i < 4; i++) {
                    expect(game.getGhost(i).updatePosition).not.toHaveBeenCalled();
                }
            });
        });
    });
});
