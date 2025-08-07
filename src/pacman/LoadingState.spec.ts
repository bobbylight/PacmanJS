import { describe, expect, test, vi } from 'vitest';
import { LoadingState } from './LoadingState';
import { ConcreteGhost } from './Ghost.spec';

describe('LoadingState', () => {

    describe('update()', () => {
        test('Loads the "loading" image', () => {
            const mockGame: any /* PacmanGame */ = {
                assets: {
                    addImage: vi.fn(),
                    onLoad: vi.fn(),
                },
                inputManager: {},
            };
            const loadingState = new LoadingState({ game: mockGame });
            loadingState.enter(mockGame);
            loadingState.update(mockGame);

            expect(mockGame.assets.addImage).toHaveBeenCalledWith('loading', 'res/loadingMessage.png');
            expect(mockGame.assets.onLoad).toHaveBeenCalled();
        });

        test('when the loading image is loaded, it loads other assets', () => {
            const mockGame: any /* PacmanGame */ = {
                assets: {
                    addImage: vi.fn(),
                    addSpriteSheet: vi.fn(),
                    addJson: vi.fn(),
                    addSound: vi.fn(),
                    get: vi.fn(() => (
                        [
                            [ [ 0, 1 ], [ 1, 0 ] ],
                            [ [ 1, 0 ], [ 0, 1 ] ]
                        ]
                    )),
                    onLoad: vi.fn((callback) => callback()),
                },
                checkLoopedSound: vi.fn(),
                getGhost: () => new ConcreteGhost(mockGame),
                getWidth: () => 300,
                inputManager: {},
                pacman: {
                    setLocation: vi.fn(),
                },
                startGame: vi.fn(),
                setState: vi.fn(),
            };
            const loadingState = new LoadingState({ game: mockGame });
            loadingState.enter(mockGame);
            loadingState.update(mockGame);

            expect(mockGame.assets.addImage).toHaveBeenCalledWith('title', 'res/title.png');
            expect(mockGame.assets.addSpriteSheet).toHaveBeenCalledWith('font', 'res/font.png', 9, 7, 0, 0);
            expect(mockGame.assets.addImage).toHaveBeenCalledWith('sprites', 'res/sprite_tiles.png', true);
            expect(mockGame.assets.addSpriteSheet).toHaveBeenCalledWith('mapTiles', 'res/map_tiles.png', 8, 8, 0, 0);
            expect(mockGame.assets.addSpriteSheet).toHaveBeenCalledWith('points', 'res/points.png', 18, 9, 0, 0);
            expect(mockGame.assets.addJson).toHaveBeenCalledWith('levels', 'res/levelData.json');
            expect(mockGame.assets.addSound).toHaveBeenCalledTimes(12); // Assuming there are 12 sounds
        });
    });
});
