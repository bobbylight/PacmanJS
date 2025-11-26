import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Keys } from 'gtp';
import { BaseState } from './BaseState';
import { PacmanGame } from './PacmanGame';

const mocks = vi.hoisted(() => {
    return {
        timestamp: vi.fn(),
    };
});

class TestableState extends BaseState {
    constructor(game: PacmanGame) {
        super({ game });
    }

    override handleDefaultKeys() {
        super.handleDefaultKeys();
    }
}

describe('BaseState', () => {
    let game: PacmanGame;

    beforeEach(() => {
        vi.mock(import('gtp'), async(importOriginal) => {
            const original = await importOriginal();
            return {
                ...original,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Utils: {
                    timestamp: mocks.timestamp,
                } as never,
            };
        });
        game = new PacmanGame();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('handleDefaultKeys()', () => {
        it('does nothing if not enough time has passed', () => {
            const state = new TestableState(game);
            expect(() => {
                state.handleDefaultKeys();
            }).not.toThrow();
        });

        describe('when enough time has passed', () => {
            it('mutes the game if M key is pressed', () => {
                const toggleMutedSpy = vi.spyOn(game, 'toggleMuted');
                vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys, clear?: boolean) => {
                    return !!(key === Keys.KEY_M && clear);
                });

                mocks.timestamp.mockReturnValue(10);
                const state = new TestableState(game);
                mocks.timestamp.mockReturnValue(1500);
                state.handleDefaultKeys();
                expect(toggleMutedSpy).toHaveBeenCalled();
            });

            describe('and Z is depressed', () => {
                let setStatusMessageSpy: MockInstance<PacmanGame['setStatusMessage']>;

                beforeEach(() => {
                    setStatusMessageSpy = vi.spyOn(game, 'setStatusMessage');
                });

                describe('increases canvas size if P is pressed', () => {
                    let state: TestableState;

                    beforeEach(() => {
                        vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys, clear?: boolean) => {
                            return !!(key === Keys.KEY_Z || key === Keys.KEY_P && clear);
                        });

                        mocks.timestamp.mockReturnValue(10);
                        state = new TestableState(game);
                        mocks.timestamp.mockReturnValue(1500);
                    });

                    it('with no style attribute', () => {
                        state.handleDefaultKeys();
                        expect(game.canvas.style.width).toBe('641px');
                        expect(game.canvas.style.height).toBe('481px');
                        expect(setStatusMessageSpy).toHaveBeenCalledWith('Canvas size now: (641px, 481px)');
                    });

                    it('with style attribute', () => {
                        const canvas = game.canvas;
                        canvas.style.width = '100px';
                        canvas.style.height = '100px';
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('101px');
                        expect(canvas.style.height).toBe('101px');
                        expect(setStatusMessageSpy).toHaveBeenCalledWith('Canvas size now: (101px, 101px)');
                    });
                });

                describe('decreases canvas size if L is pressed', () => {
                    let state: TestableState;

                    beforeEach(() => {
                        vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys, clear?: boolean) => {
                            return !!(key === Keys.KEY_Z || key === Keys.KEY_L && clear);
                        });

                        mocks.timestamp.mockReturnValue(10);
                        state = new TestableState(game);
                        mocks.timestamp.mockReturnValue(1500);
                    });

                    it('with no style attribute', () => {
                        state.handleDefaultKeys();
                        expect(game.canvas.style.width).toBe('639px');
                        expect(game.canvas.style.height).toBe('479px');
                        expect(setStatusMessageSpy).toHaveBeenCalledWith('Canvas size now: (639px, 479px)');
                    });

                    it('with style attribute', () => {
                        const canvas = game.canvas;
                        canvas.style.width = '100px';
                        canvas.style.height = '100px';
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('99px');
                        expect(canvas.style.height).toBe('99px');
                        expect(setStatusMessageSpy).toHaveBeenCalledWith('Canvas size now: (99px, 99px)');
                    });
                });

                it('toggles god mode if G is pressed', () => {
                    const toggleGodModeSpy = vi.spyOn(game, 'toggleGodMode');
                    vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys, clear?: boolean) => {
                        return !!(key === Keys.KEY_Z || key === Keys.KEY_G && clear);
                    });

                    mocks.timestamp.mockReturnValue(10);
                    const state = new TestableState(game);
                    mocks.timestamp.mockReturnValue(1500);
                    state.handleDefaultKeys();

                    expect(toggleGodModeSpy).toHaveBeenCalled();
                });

                it('toggles stretch mode if S is pressed', () => {
                    const toggleStretchModeSpy = vi.spyOn(game, 'toggleStretchMode');
                    vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys, clear?: boolean) => {
                        return !!(key === Keys.KEY_Z || key === Keys.KEY_S && clear);
                    });

                    mocks.timestamp.mockReturnValue(10);
                    const state = new TestableState(game);
                    mocks.timestamp.mockReturnValue(1500);
                    state.handleDefaultKeys();

                    expect(toggleStretchModeSpy).toHaveBeenCalled();
                });
            });
        });
    });
});
