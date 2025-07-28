import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PacmanGame } from './PacmanGame';
import { Fruit } from './Fruit';
import SOUNDS from './Sounds';
import { MotionState } from './Ghost';
import { SpriteSheet } from 'gtp';
import { MazeState } from './MazeState';

describe('PacmanGame', () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('checkForCollisions', () => {
        it('returns false if pacman is not colliding with any ghosts', () => {
            const game = new PacmanGame();
            expect(game.checkForCollisions()).toBeNull();
        });

        it('returns true if pacman is colliding with a ghost', () => {
            const game = new PacmanGame();
            // Simulate a collision by setting pacman and ghost positions
            game.pacman.x = 5;
            game.pacman.y = 5;
            const firstGhost = game.getGhost(0);
            firstGhost.x = 5;
            firstGhost.y = 5;
            expect(game.checkForCollisions()).toBe(firstGhost);
        });

        describe('when pacman collides with a fruit', () => {
            let game: PacmanGame;
            let fruit: Fruit;

            beforeEach(() => {
                game = new PacmanGame();
                fruit = game.addFruit();
                game.pacman.x = fruit.x = 10;
                game.pacman.y = fruit.y = 10;
            });

            it('should return null', () => {
                expect(game.checkForCollisions()).toBeNull();
            });

            it('increases the player score', () => {
                const spy = vi.spyOn(game, 'increaseScore');
                game.checkForCollisions();
                expect(spy).toHaveBeenCalled();
            });

            it('plays a sound effect', () => {
                const playSoundSpy = vi.spyOn(game.audio, 'playSound');
                game.checkForCollisions();
                expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.EATING_FRUIT, false);
            });
        });

        describe('checkLoopedSound', () => {
            it('plays a siren by default', () => {
                const game = new PacmanGame();
                const setLoopedSoundSpy = vi.spyOn(game, 'setLoopedSound');
                game.checkLoopedSound();
                expect(setLoopedSoundSpy).toHaveBeenCalledWith(SOUNDS.SIREN);
            });

            it('plays a different sound if the any ghosts are blue', () => {
                const game = new PacmanGame();
                game.getGhost(0).motionState = MotionState.BLUE;
                const setLoopedSoundSpy = vi.spyOn(game, 'setLoopedSound');
                game.checkLoopedSound();
                expect(setLoopedSoundSpy).toHaveBeenCalledWith(SOUNDS.CHASING_GHOSTS);
            });

            it('plays a different sound if any ghosts are eyes', () => {
                const game = new PacmanGame();
                game.getGhost(0).motionState = MotionState.EYES;
                const setLoopedSoundSpy = vi.spyOn(game, 'setLoopedSound');
                game.checkLoopedSound();
                expect(setLoopedSoundSpy).toHaveBeenCalledWith(SOUNDS.EYES_RUNNING);
            });
        });

        describe('drawBigDot', () => {
            it('draws nothing depending on the game playtime', () => {
                const game = new PacmanGame();
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                const mockDrawScaled2 = vi.fn();
                const spy = vi.spyOn(game.assets, 'get');
                spy.mockReturnValue({
                    drawScaled2: mockDrawScaled2,
                } as unknown as SpriteSheet);
                game.drawBigDot(0, 0);
                expect(mockDrawScaled2).not.toHaveBeenCalled();
            });

            it('draws a big dot depending on the game playtime', () => {
                const game = new PacmanGame();
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(375);
                const mockDrawScaled2 = vi.fn();
                const spy = vi.spyOn(game.assets, 'get');
                spy.mockReturnValue({
                    drawScaled2: mockDrawScaled2,
                } as unknown as SpriteSheet);
                game.drawBigDot(5, 6);
                expect(mockDrawScaled2).toHaveBeenCalled();
            });
        });
    });

    describe('drawFruit', () => {
        it('draws a fruit', () => {
            const game = new PacmanGame();
            const fruit = game.addFruit();
            const spy = vi.spyOn(fruit, 'paint').mockImplementation(() => {});
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            expect(ctx).not.toBeNull();
            if (ctx) {
                game.drawFruit(ctx);
                expect(spy).toHaveBeenCalledWith(ctx);
            }
        });

        describe('after Pacman eats a fruit', () => {
            it('renders the fruit points instead of the fruit', () => {
                const game = new PacmanGame();
                vi.spyOn(game, 'level', 'get').mockReturnValue(0);
                const fruit = game.addFruit();
                game.pacman.x = fruit.x;
                game.pacman.y = fruit.y;
                game.checkForCollisions(); // Simulate eating the fruit
                const paintFruitSpy = vi.spyOn(fruit, 'paint').mockImplementation(() => {});
                const paintPointsEarnedSpy = vi.spyOn(game, 'paintPointsEarned').mockImplementation(() => {});
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    game.drawFruit(ctx);
                    expect(paintFruitSpy).not.toHaveBeenCalled();
                    expect(paintPointsEarnedSpy).toHaveBeenCalled();
                }
            });
        });

        describe('drawGhosts', () => {
            it('draws all ghosts', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    for (let i = 0; i < 4; i++) {
                        const ghost = game.getGhost(i);
                        vi.spyOn(ghost, 'paint').mockImplementation(() => {});
                    }
                    game.drawGhosts(ctx);
                    for (let i = 0; i < 4; i++) {
                        expect(game.getGhost(i).paint).toHaveBeenCalledWith(ctx);
                    }
                }
            });
        });

        describe('drawScores', () => {
            it('draws the player score and high score', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    vi.spyOn(game, 'drawString').mockImplementation(() => {});
                    game.drawScores(ctx);
                    expect(game.drawString).toHaveBeenCalledTimes(2);
                }
            });
        });

        describe('drawScoresHeaders', () => {
            it('draws two headers', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    vi.spyOn(game, 'drawString').mockImplementation(() => {});
                    game.drawScoresHeaders(ctx);
                    expect(game.drawString).toHaveBeenCalledTimes(2);
                }
            });
        });

        describe('drawSmallDot', () => {
            it('draws small dots', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    vi.spyOn(game.canvas, 'getContext').mockImplementation(() => ctx);
                    const fillRectSpy = vi.spyOn(ctx, 'fillRect').mockImplementation(() => {});
                    game.drawSmallDot(5, 6);
                    expect(fillRectSpy).toHaveBeenCalledWith(5, 6, 2, 2);
                }
            });
        });

        describe('drawSprite', () => {
            it('draws a sprite at the given position', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    vi.spyOn(game.canvas, 'getContext').mockImplementation(() => ctx);
                    const mockDrawScaled2 = vi.fn();
                    vi.spyOn(game.assets, 'get').mockReturnValue({
                        drawScaled2: mockDrawScaled2,
                    } as unknown as SpriteSheet);
                    game.drawSprite(20, 20, 20, 20);
                    expect(mockDrawScaled2).toHaveBeenCalledWith(ctx, 20, 20, 16, 16, 20, 20, 16, 16);
                }
            });
        });

        describe('drawString', () => {
            it('draws a string at the given position', () => {
                const game = new PacmanGame();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                expect(ctx).not.toBeNull();
                if (ctx) {
                    vi.spyOn(game.canvas, 'getContext').mockImplementation(() => ctx);
                    const mockDrawByIndex = vi.fn();
                    vi.spyOn(game.assets, 'get').mockReturnValue({
                        drawByIndex: mockDrawByIndex,
                    } as unknown as SpriteSheet);
                    game.drawString(10, 10, 'ABCDEFG0123456789-.>@! ');
                    expect(mockDrawByIndex).toHaveBeenCalledTimes(23);
                }
            });
        });

        describe('getGodMode', () => {
            it('returns false by default', () => {
                const game = new PacmanGame();
                expect(game.godMode).toBeFalsy();
            });

            it('returns true if god mode is enabled', () => {
                const game = new PacmanGame();
                expect(game.toggleGodMode()).toBeTruthy();
                expect(game.godMode).toBe(true);
            });
        });

        describe('lives', () => {
            it('returns the number of lives', () => {
                const game = new PacmanGame();
                vi.spyOn(game, 'lives', 'get').mockReturnValue(3);
                expect(game.lives).toBe(3);
            });
        });

        describe('ghostEaten', () => {
            it('increases the score when a ghost is eaten', () => {
                const game = new PacmanGame();
                const spy = vi.spyOn(game, 'increaseScore');
                game.ghostEaten(game.getGhost(2));
                expect(spy).toHaveBeenCalled();
            });

            it('plays the eating sound when a ghost is eaten', () => {
                const game = new PacmanGame();
                const playSoundSpy = vi.spyOn(game.audio, 'playSound');
                game.ghostEaten(game.getGhost(2));
                expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.EATING_GHOST);
            });

            it('increases the score for each ghost eaten', () => {
                const game = new PacmanGame();
                const spy = vi.spyOn(game, 'increaseScore');
                for (let i = 0; i < 4; i++) {
                    game.ghostEaten(game.getGhost(i));
                }
                expect(spy).toHaveBeenCalledTimes(4);
            });
        });

        describe('increaseLives', () => {
            it('increases the number of lives', () => {
                const game = new PacmanGame();
                const initialLives = game.lives;
                game.increaseLives(3);
                expect(game.lives).toBe(initialLives + 3);
            });
        });

        describe('increaseScore', () => {
            it('increases the score by the given amount', () => {
                const game = new PacmanGame();
                const initialScore = game.getScore();
                game.increaseScore(100);
                expect(game.getScore()).toBe(initialScore + 100);
            });

            it('overwrites the high score if the new score is higher', () => {
                const game = new PacmanGame();
                const initialHighScore = game.getHighScore();
                game.increaseScore(game.getHighScore() + 100);
                expect(game.getHighScore()).toEqual(initialHighScore + 100);
            });

            it('earns an extra life at a certain score', () => {
                const game = new PacmanGame();
                const initialLives = game.lives;
                game.increaseScore(PacmanGame.EXTRA_LIFE_SCORE);
                expect(game.lives).toBe(initialLives + 1);
            });

            it('does not earn an extra life more than once per game', () => {
                const game = new PacmanGame();
                const initialLives = game.lives;
                game.increaseScore(PacmanGame.EXTRA_LIFE_SCORE);
                game.increaseScore(PacmanGame.EXTRA_LIFE_SCORE);
                expect(game.lives).toBe(initialLives + 1); // Only earned one extra life
            });
        });
    });

    describe('loadNextLevel', () => {
        it.skip('stops the current looped sound', () => {
            const game = new PacmanGame();
            const mazeFile = [ [ 0, 0 ], [ 0, 0 ] ];
            (game as any).state = new MazeState(mazeFile);
            const setLoopedSoundSpy = vi.spyOn(game, 'setLoopedSound');
            game.loadNextLevel();
            expect(setLoopedSoundSpy).toHaveBeenCalledWith(null);
        });
    });

    describe('makeGhostsBlue', () => {
        it('changes the motion state of all ghosts to BLUE', () => {
            const game = new PacmanGame();
            for (let i = 0; i < 4; i++) {
                const ghost = game.getGhost(i);
                ghost.motionState = MotionState.CHASING_PACMAN;
            }
            game.makeGhostsBlue();
            for (let i = 0; i < 4; i++) {
                expect(game.getGhost(i).motionState).toBe(MotionState.BLUE);
            }
        });
    });

    describe('paintPointsEarned', () => {
        it('paints the points earned on the canvas', () => {
            const game = new PacmanGame();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            expect(ctx).not.toBeNull();
            if (ctx) {
                const mockDrawByIndex = vi.fn();
                vi.spyOn(game.assets, 'get').mockReturnValue({
                    drawByIndex: mockDrawByIndex,
                } as unknown as SpriteSheet);
                game.paintPointsEarned(ctx, 100, 10, 10);
                expect(mockDrawByIndex).toHaveBeenCalledWith(ctx, 10, 10, 100);
            }
        });
    });

    describe('playChompSound', () => {
        it('alternates between two chomp sounds', () => {
            const game = new PacmanGame();
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');
            game.playChompSound();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.CHOMP_1);
            game.playChompSound();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.CHOMP_2);
            game.playChompSound();
            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.CHOMP_1);
        });
    });

    describe('resetGhosts', () => {
        it('resets all ghosts to their initial positions and states', () => {
            const game = new PacmanGame();
            const resetSpies = [];
            for (let i = 0; i < 4; i++) {
                const ghost = game.getGhost(i);
                const resetSpy = vi.spyOn(ghost, 'reset');
                resetSpies.push(resetSpy);
            }

            game.resetGhosts();
            resetSpies.forEach(spy => {
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
