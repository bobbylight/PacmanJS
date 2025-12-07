import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { StretchMode } from 'gtp';
import { GhostUpdateStrategy, PacmanGame } from './PacmanGame';
import { SOUNDS } from './Sounds';
import { Ghost, MotionState } from './Ghost';
import { Fruit } from './Fruit';
import { MazeState } from './MazeState';
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
            const increaseScoreSpy = vi.spyOn(game, 'increaseScore');
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            const fruit = game.addFruit();
            if (!fruit) {
                throw new Error('unexpected null fruit!');
            }
            game.pacman.setLocation(fruit.x, fruit.y);
            expect(game.checkForCollisions()).toBeNull();
            expect(increaseScoreSpy).toHaveBeenCalledOnce();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.EATING_FRUIT, false);
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
            expect(setLoopedSound).toHaveBeenCalledWith(SOUNDS.SIREN);
        });

        describe('when a ghost is blue', () => {
            beforeEach(() => {
                // State transitions are verified in the game logic so must be valid here
                game.getGhost(2).setMotionState(MotionState.CHASING_PACMAN);
                game.getGhost(2).setMotionState(MotionState.BLUE);
            });

            it('plays a different sound', () => {
                game.checkLoopedSound();
                expect(setLoopedSound).toHaveBeenCalledWith(SOUNDS.CHASING_GHOSTS);
            });

            describe('and an earlier ghost is eyes', () => {
                beforeEach(() => {
                    game.getGhost(1).setMotionState(MotionState.EYES);
                });

                it('plays the eyes sound', () => {
                    game.checkLoopedSound();
                    expect(setLoopedSound).toHaveBeenCalledWith(SOUNDS.EYES_RUNNING);
                });
            });

            describe('and a later ghost is eyes', () => {
                beforeEach(() => {
                    game.getGhost(3).setMotionState(MotionState.EYES);
                });

                it('plays the eyes sound', () => {
                    game.checkLoopedSound();
                    expect(setLoopedSound).toHaveBeenCalledWith(SOUNDS.EYES_RUNNING);
                });
            });
        });

        describe('when a ghost is eyes', () => {
            beforeEach(() => {
                game.getGhost(2).setMotionState(MotionState.EYES);
            });

            it('plays the eyes sound', () => {
                game.checkLoopedSound();
                expect(setLoopedSound).toHaveBeenCalledWith(SOUNDS.EYES_RUNNING);
            });
        });
    });

    describe('drawBigDot', () => {
        const game = new PacmanGame();
        const mockImage = {
            drawScaled2: vi.fn(),
        };

        beforeEach(() => {
            game.assets.set('sprites', mockImage);
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
            expect(() => {
                game.drawFruit(game.getRenderingContext());
            }).not.toThrow();
            expect(paintPointsEarned).not.toHaveBeenCalled();
        });

        describe('when there is a fruit', () => {
            let fruit: Fruit | null;
            beforeEach(() => {
                fruit = game.addFruit();
            });

            it('draws the fruit', () => {
                const ctx = game.getRenderingContext();
                if (!fruit) {
                    throw new Error('unexpected null fruit!');
                }
                const paintSpy = vi.spyOn(fruit, 'paint').mockImplementation(() => {});
                expect(() => {
                    game.drawFruit(ctx);
                }).not.toThrow();
                expect(paintSpy).toHaveBeenCalledWith(ctx);
            });

            describe('and it is eaten', () => {
                beforeEach(() => {
                    if (!fruit) {
                        throw new Error('unexpected null fruit!');
                    }
                    game.pacman.setLocation(fruit.x, fruit.y);
                    game.checkForCollisions();
                });

                it('draws the points earned', () => {
                    const ctx = game.getRenderingContext();
                    if (!fruit) {
                        throw new Error('unexpected null fruit!');
                    }
                    expect(() => {
                        game.drawFruit(ctx);
                    }).not.toThrow();
                    expect(paintPointsEarned).toHaveBeenCalled();
                });

                describe('and enough time has passed for the fruit to disappear', () => {
                    beforeEach(() => {
                        game.fruitScoreEndTime = game.playTime;
                    });

                    it('removes the fruit', () => {
                        // No good way to test this currently
                        expect(() => {
                            game.drawFruit(game.getRenderingContext());
                        }).not.toThrow();
                    });
                });
            });
        });
    });

    describe('drawGhosts()', () => {
        const game = new PacmanGame();

        it('draws all ghosts', () => {
            const ctx = game.getRenderingContext();
            const paintSpy0 = vi.spyOn(game.getGhost(0), 'paint').mockImplementation(() => {});
            const paintSpy1 = vi.spyOn(game.getGhost(1), 'paint').mockImplementation(() => {});
            const paintSpy2 = vi.spyOn(game.getGhost(2), 'paint').mockImplementation(() => {});
            const paintSpy3 = vi.spyOn(game.getGhost(3), 'paint').mockImplementation(() => {});
            expect(() => {
                game.drawGhosts(ctx);
            }).not.toThrow();
            expect(paintSpy0).toHaveBeenCalledWith(ctx);
            expect(paintSpy1).toHaveBeenCalledWith(ctx);
            expect(paintSpy2).toHaveBeenCalledWith(ctx);
            expect(paintSpy3).toHaveBeenCalledWith(ctx);
        });
    });

    describe('drawScores()', () => {
        const game = new PacmanGame();

        it('draws the scores', () => {
            const drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
            const ctx = game.getRenderingContext();
            game.drawScores(ctx);
            expect(drawStringSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('drawScoresHeaders()', () => {
        const game = new PacmanGame();

        it('draws the score headers', () => {
            const drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
            const ctx = game.getRenderingContext();
            game.drawScoresHeaders(ctx);
            expect(drawStringSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('drawSmallDot()', () => {
        const game = new PacmanGame();

        it('draws a small dot at the correct position', () => {
            const ctx = game.getRenderingContext();
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            game.drawSmallDot(50, 50);
            expect(fillRectSpy).toHaveBeenCalledWith(50, 50, 2, 2);
        });
    });

    describe('drawSprite()', () => {
        const game = new PacmanGame();
        const drawScaled2 = vi.fn();
        const mockImage = {
            drawScaled2,
        };

        beforeEach(() => {
            game.assets.set('sprites', mockImage);
        });

        it('should draw a sprite at the correct position', () => {
            game.drawSprite(10, 10, 50, 50);
            expect(drawScaled2).toHaveBeenCalledOnce();
        });
    });

    describe('drawString()', () => {
        const game = new PacmanGame();
        const mockFontImage = {
            drawByIndex: vi.fn(),
        };

        it('draws a string', () => {
            const assetsGetSpy = vi.spyOn(game.assets, 'get').mockReturnValue(mockFontImage);
            const ctx = game.getRenderingContext();
            const text = 'HELLO1-.>@! ';
            game.drawString(10, 10, text, ctx);
            expect(assetsGetSpy).toHaveBeenCalledWith('font');
            expect(mockFontImage.drawByIndex).toHaveBeenCalledTimes(text.length);
        });
    });

    it('godMode()', () => {
        expect(new PacmanGame().isGodMode()).toEqual(false);
    });

    it('ghostEaten()', () => {
        const game = new PacmanGame();
        const increaseScoreSpy = vi.spyOn(game, 'increaseScore');
        const playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);

        for (let i = 0; i < 4; i++) {
            expect(game.ghostEaten(game.getGhost(i))).toBeGreaterThan(0);
            expect(increaseScoreSpy).toHaveBeenCalled();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.EATING_GHOST);
        }
    });

    it('increaseLives()', () => {
        const game = new PacmanGame();
        expect(() => game.increaseLives(5)).not.toThrow();
    });

    describe('increaseScore()', () => {
        const game = new PacmanGame();

        it('gives an extra life but only once', () => {
            const increaseLivesSpy = vi.spyOn(game, 'increaseLives');
            game.increaseScore(PacmanGame.EXTRA_LIFE_SCORE);
            expect(increaseLivesSpy).toHaveBeenCalledWith(1);

            game.increaseScore(100000);
            expect(increaseLivesSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadNextLevel()', () => {
        const game = new PacmanGame();

        it('resets the level', () => {
            const state = new MazeState(game, [ [ 0, 1 ], [ 1, 0 ] ]);
            const resetSpy = vi.spyOn(state, 'reset').mockImplementation(() => {});
            game.state = state;
            game.loadNextLevel();
            expect(resetSpy).toHaveBeenCalled();
        });
    });

    describe('makeGhostsBlue()', () => {
        const game = new PacmanGame();

        it('sets all ghosts to blue', () => {
            const checkLoopedSoundSpy = vi.spyOn(game, 'checkLoopedSound').mockImplementation(() => null);
            const possiblyTurnedBlySpy = [];
            for (let i = 0; i < 4; i++) {
                possiblyTurnedBlySpy.push(vi.spyOn(game.getGhost(i), 'possiblyTurnBlue'));
            }
            game.makeGhostsBlue();
            for (let i = 0; i < 4; i++) {
                expect(possiblyTurnedBlySpy[i]).toHaveBeenCalledOnce();
            }
            expect(checkLoopedSoundSpy).toHaveBeenCalled();
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
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');
            game.playChompSound();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.CHOMP_1);
            game.playChompSound();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.CHOMP_2);
        });
    });

    describe('startGame()', () => {
        const game = new PacmanGame();

        it('calls setState', () => {
            const setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});

            const levelsData = [ [ 0, 1 ], [ 1, 0 ] ];
            vi.spyOn(game.assets, 'get').mockReturnValue(levelsData);

            game.startGame(1);
            expect(setStateSpy).toHaveBeenCalledOnce();
        });
    });

    describe('startPacmanDying()', () => {
        const game = new PacmanGame();

        it('stops the looping sound', () => {
            const setLoopedSoundSpy = vi.spyOn(game, 'setLoopedSound').mockImplementation(() => {});
            game.startPacmanDying();
            expect(setLoopedSoundSpy).toHaveBeenCalledWith(null);
        });

        it('plays the pacman death sound', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            game.startPacmanDying();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.DIES);
        });

        it('starts the pacman dying animation', () => {
            const startDyingSpy = vi.spyOn(game.pacman, 'startDying').mockImplementation(() => {});
            game.startPacmanDying();
            expect(startDyingSpy).toHaveBeenCalledOnce();
        });
    });

    it('toggleGodMode()', () => {
        const game = new PacmanGame();
        vi.spyOn(game, 'toggleGodMode');
        expect(game.isGodMode()).toEqual(false);
        expect(game.toggleGodMode()).toEqual(true);
        expect(game.isGodMode()).toEqual(true);
    });

    describe('toggleStretchMode()', () => {
        const game = new PacmanGame();

        it('does not throw when not desktop mode', () => {
            expect(() => {
                game.toggleStretchMode();
            }).not.toThrow();
        });

        describe('when in desktop mode', () => {
            let setStretchModeSpy: MockInstance<PacmanGame['setStretchMode']>;

            beforeEach(() => {
                vi.spyOn(game, 'isDesktopGame').mockReturnValue(true);
                setStretchModeSpy = vi.spyOn(game, 'setStretchMode');
            });

            it('updates properly when coming from NONE', () => {
                game.setStretchMode(StretchMode.STRETCH_NONE);
                expect(() => {
                    game.toggleStretchMode();
                }).not.toThrow();
                expect(setStretchModeSpy).toHaveBeenCalledWith(StretchMode.STRETCH_FILL);
            });

            it('updates properly when coming from FILL', () => {
                game.setStretchMode(StretchMode.STRETCH_FILL);
                expect(() => {
                    game.toggleStretchMode();
                }).not.toThrow();
                expect(setStretchModeSpy).toHaveBeenCalledWith(StretchMode.STRETCH_PROPORTIONAL);
            });

            it('updates properly when coming from PROPORTIONAL', () => {
                game.setStretchMode(StretchMode.STRETCH_PROPORTIONAL);
                expect(() => {
                    game.toggleStretchMode();
                }).not.toThrow();
                expect(setStretchModeSpy).toHaveBeenCalledWith(StretchMode.STRETCH_NONE);
            });
        });
    });

    describe('updateSpriteFrames()', () => {
        const game = new PacmanGame();

        it('updates the sprite frames', () => {
            const pacmanUpdateFrameSpy = vi.spyOn(game.pacman, 'updateFrame').mockImplementation(() => {});
            const ghostUpdateFrameSpy = [];
            for (let i = 0; i < 4; i++) {
                ghostUpdateFrameSpy.push(vi.spyOn(game.getGhost(i), 'updateFrame').mockImplementation(() => {}));
            }
            game.updateSpriteFrames();
            expect(pacmanUpdateFrameSpy).toHaveBeenCalledOnce();
            for (let i = 0; i < 4; i++) {
                expect(ghostUpdateFrameSpy[i]).toHaveBeenCalledOnce();
            }
        });
    });

    describe('updateSpritePositions()', () => {
        const game = new PacmanGame();
        let updatePositionSpies: MockInstance<Ghost['updatePosition']>[];

        beforeEach(() => {
            updatePositionSpies = [];
            for (let i = 0; i < 4; i++) {
                updatePositionSpies[i] = vi.spyOn(game.getGhost(i), 'updatePosition').mockImplementation(() => {});
            }
        });

        describe('with ghost strategy UPDATE_ALL', () => {
            it('updates all ghosts', () => {
                game.updateSpritePositions({} as Maze, 0);
                for (let i = 0; i < 4; i++) {
                    expect(updatePositionSpies[i]).toHaveBeenCalledOnce();
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
                    expect(updatePositionSpies[i]).not.toHaveBeenCalled();
                }
            });
        });

        describe('with ghost strategy UPDATE_ONE', () => {
            beforeEach(() => {
                game.setGhostUpdateStrategy(GhostUpdateStrategy.UPDATE_ONE);
            });

            it('updates only the first ghost', () => {
                game.updateSpritePositions({} as Maze, 0);
                expect(updatePositionSpies[0]).toHaveBeenCalledOnce();
                for (let i = 1; i < 4; i++) {
                    expect(updatePositionSpies[i]).not.toHaveBeenCalled();
                }
            });
        });
    });
});
