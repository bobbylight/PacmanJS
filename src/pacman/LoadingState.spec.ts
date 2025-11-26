import { describe, expect, test, vi } from 'vitest';
import { LoadingState } from './LoadingState';
import { PacmanGame } from './PacmanGame';

describe('LoadingState', () => {

    describe('update()', () => {
        test('Loads the "loading" image', () => {
            const mockGame = new PacmanGame();
            const loadingState = new LoadingState({ game: mockGame });

            const addImageSpy = vi.spyOn(mockGame.assets, 'addImage');
            const onLoadSpy = vi.spyOn(mockGame.assets, 'onLoad');

            loadingState.enter(mockGame);
            loadingState.update(16);

            expect(addImageSpy).toHaveBeenCalledWith('loading', 'res/loadingMessage.png');
            expect(onLoadSpy).toHaveBeenCalled();
        });

        test('when the loading image is loaded, it loads other assets', () => {
            const mockGame = new PacmanGame();
            mockGame.assets.set('levels', [
                [ [ 0, 1 ], [ 1, 0 ] ],
                [ [ 1, 0 ], [ 0, 1 ] ],
            ]);

            const addImageSpy = vi.spyOn(mockGame.assets, 'addImage');
            const addSpriteSheetSpy = vi.spyOn(mockGame.assets, 'addSpriteSheet');
            const addJsonSpy = vi.spyOn(mockGame.assets, 'addJson');
            const addSoundSpy = vi.spyOn(mockGame.assets, 'addSound');
            const setSpy = vi.spyOn(mockGame.assets, 'set');

            vi.spyOn(mockGame.assets, 'onLoad').mockImplementation((callback) => {
                callback();
            });

            const loadingState = new LoadingState({ game: mockGame });
            loadingState.enter(mockGame);
            loadingState.update(60);

            expect(addImageSpy).toHaveBeenCalledWith('title', 'res/title.png');
            expect(addSpriteSheetSpy).toHaveBeenCalledWith('font', 'res/font.png', 9, 7, 0, 0);
            expect(addImageSpy).toHaveBeenCalledWith('sprites', 'res/sprite_tiles.png', true);
            expect(addSpriteSheetSpy).toHaveBeenCalledWith('mapTiles', 'res/map_tiles.png', 8, 8, 0, 0);
            expect(addSpriteSheetSpy).toHaveBeenCalledWith('points', 'res/points.png', 18, 9, 0, 0);
            expect(addJsonSpy).toHaveBeenCalledWith('levels', 'res/levelData.json');
            expect(addSoundSpy).toHaveBeenCalledTimes(12); // Assuming there are 12 sounds
            expect(setSpy).toHaveBeenCalledExactlyOnceWith('levels', expect.anything());
        });
    });
});
