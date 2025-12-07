import { describe, expect, vi, it } from 'vitest';
import { LoadingState } from './LoadingState';
import { PacmanGame } from './PacmanGame';

describe('LoadingState', () => {

    describe('update()', () => {
        it('Loads the "loading" image', () => {
            const game = new PacmanGame();
            const loadingState = new LoadingState(game);

            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            const onLoadSpy = vi.spyOn(game.assets, 'onLoad');

            loadingState.enter();
            loadingState.update(16);

            expect(addImageSpy).toHaveBeenCalledWith('loading', 'res/loadingMessage.png');
            expect(onLoadSpy).toHaveBeenCalled();
        });

        it('when the loading image is loaded, it loads other assets', () => {
            const game = new PacmanGame();
            game.assets.set('levels', [
                [ [ 0, 1 ], [ 1, 0 ] ],
                [ [ 1, 0 ], [ 0, 1 ] ],
            ]);

            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            const addSpriteSheetSpy = vi.spyOn(game.assets, 'addSpriteSheet');
            const addJsonSpy = vi.spyOn(game.assets, 'addJson');
            const addSoundSpy = vi.spyOn(game.assets, 'addSound');
            const setSpy = vi.spyOn(game.assets, 'set');

            vi.spyOn(game.assets, 'onLoad').mockImplementation((callback) => {
                callback();
            });

            const loadingState = new LoadingState(game);
            loadingState.enter();
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
