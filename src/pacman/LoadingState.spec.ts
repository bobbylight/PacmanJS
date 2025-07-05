import { describe, expect, test, vi } from 'vitest';
import { LoadingState } from './LoadingState';

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

    })
});
