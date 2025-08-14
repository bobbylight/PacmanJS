import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseState } from './BaseState';
import { PacmanGame } from './PacmanGame';
import { Keys } from 'gtp';

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
    let canvas: HTMLCanvasElement;
    const mockGame: any /* PacmanGame */ = {
        checkLoopedSound: () => {},
        inputManager: {},
        setStatusMessage: vi.fn(),
        toggleGodMode: vi.fn(),
        toggleMuted: vi.fn(),
        toggleStretchMode: vi.fn(),
    };

    beforeEach(() => {
        vi.mock(import('gtp'), async(importOriginal) => {
            const original = await importOriginal();
            return {
                ...original,
                Utils: {
                    timestamp: mocks.timestamp,
                } as any,
            };
        });

        canvas = document.createElement('canvas');
        mockGame.canvas = canvas;
        // canvas.style.width = '100px';
        // canvas.style.height = '100px';
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('handleDefaultKeys()', () => {
        it('does nothing if not enough time has passed', () => {
            const state = new TestableState(mockGame);
            expect(() => state.handleDefaultKeys()).not.toThrow();
        });

        describe('when enough time has passed', () => {
            it('mutes the game if M key is pressed', () => {
                mockGame.inputManager = {
                    isKeyDown: vi.fn((key: number, clear?: boolean) => {
                        return !!(key === Keys.KEY_M && clear);
                    }),
                };

                mocks.timestamp.mockReturnValue(10);
                const state = new TestableState(mockGame);
                mocks.timestamp.mockReturnValue(1500);
                state.handleDefaultKeys();
                expect(mockGame.toggleMuted).toHaveBeenCalled();
            });

            describe('and Z is depressed', () => {
                describe('increases canvas size if P is pressed', () => {
                    let state: TestableState;

                    beforeEach(() => {
                        mockGame.inputManager = {
                            isKeyDown: vi.fn((key: Keys, clear?: boolean) => {
                                return !!(key === Keys.KEY_Z || (key === Keys.KEY_P && clear));
                            }),
                        };

                        mocks.timestamp.mockReturnValue(10);
                        state = new TestableState(mockGame);
                        mocks.timestamp.mockReturnValue(1500);
                    });

                    it('with no style attribute', () => {
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('301px');
                        expect(canvas.style.height).toBe('151px');
                        expect(mockGame.setStatusMessage).toHaveBeenCalledWith('Canvas size now: (301px, 151px)');
                    });

                    it('with style attribute', () => {
                        canvas.style.width = '100px';
                        canvas.style.height = '100px';
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('101px');
                        expect(canvas.style.height).toBe('101px');
                        expect(mockGame.setStatusMessage).toHaveBeenCalledWith('Canvas size now: (101px, 101px)');
                    });
                });

                describe('decreases canvas size if L is pressed', () => {
                    let state: TestableState;

                    beforeEach(() => {
                        mockGame.inputManager = {
                            isKeyDown: vi.fn((key: Keys, clear?: boolean) => {
                                return !!(key === Keys.KEY_Z || (key === Keys.KEY_L && clear));
                            }),
                        };

                        mocks.timestamp.mockReturnValue(10);
                        state = new TestableState(mockGame);
                        mocks.timestamp.mockReturnValue(1500);
                    });

                    it('with no style attribute', () => {
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('299px');
                        expect(canvas.style.height).toBe('149px');
                        expect(mockGame.setStatusMessage).toHaveBeenCalledWith('Canvas size now: (299px, 149px)');
                    });

                    it('with style attribute', () => {
                        canvas.style.width = '100px';
                        canvas.style.height = '100px';
                        state.handleDefaultKeys();
                        expect(canvas.style.width).toBe('99px');
                        expect(canvas.style.height).toBe('99px');
                        expect(mockGame.setStatusMessage).toHaveBeenCalledWith('Canvas size now: (99px, 99px)');
                    });
                });

                it('toggles god mode if G is pressed', () => {
                    mockGame.inputManager = {
                        isKeyDown: vi.fn((key: Keys, clear?: boolean) => {
                            return !!(key === Keys.KEY_Z || (key === Keys.KEY_G && clear));
                        }),
                    };

                    mocks.timestamp.mockReturnValue(10);
                    const state = new TestableState(mockGame);
                    mocks.timestamp.mockReturnValue(1500);
                    state.handleDefaultKeys();

                    expect(mockGame.toggleGodMode).toHaveBeenCalled();
                });

                it('toggles stretch mode if S is pressed', () => {
                    mockGame.inputManager = {
                        isKeyDown: vi.fn((key: number, clear?: boolean) => {
                            return !!(key === Keys.KEY_Z || (key === Keys.KEY_S && clear));
                        }),
                    };

                    mocks.timestamp.mockReturnValue(10);
                    const state = new TestableState(mockGame);
                    mocks.timestamp.mockReturnValue(1500);
                    state.handleDefaultKeys();

                    expect(mockGame.toggleStretchMode).toHaveBeenCalled();
                });
            });
        });
    });
});
