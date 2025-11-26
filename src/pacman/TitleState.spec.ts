import { TitleState } from './TitleState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';
import { Direction } from './Direction';

import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { SOUNDS } from './Sounds';
import { Ghost, MotionState } from './Ghost';
import { Maze } from './Maze';

const mockSpriteSheet = {
    draw: () => {},
    drawByIndex: () => {},
} as unknown as SpriteSheet;

const mockImage = {
    draw: vi.fn(),
    drawScaled2: vi.fn(),
};

export class ConcreteGhost extends Ghost {

    constructor(game: PacmanGame) {
        super(game, 0, 0);
        this.setMotionState(MotionState.CHASING_PACMAN);
    }

    protected updatePositionChasingPacman(maze: Maze): void {
    }
}

describe('TitleState', () => {

    let ghost: Ghost;
    let game: PacmanGame;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {

        game = new PacmanGame();
        game.assets.set('font', mockSpriteSheet);
        game.assets.set('image', mockImage);
        game.assets.set('title', mockImage);
        game.assets.set('sprites', mockImage);

        canvas = game.canvas;
        game.pacman = new Pacman(game);
        ghost = game.getGhost(0);
        ghost.paint = vi.fn();
        ghost.direction = Direction.WEST;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    test('enter() sets up Pinky properly', () => {
        new TitleState(game);
        expect(ghost.direction).toEqual(Direction.EAST);
    });

    test('enter() and exit() attach and remove listeners to the canvas properly', () => {

        const state: TitleState = new TitleState(game);
        const addSpy = vi.spyOn(canvas, 'addEventListener');
        const removeSpy = vi.spyOn(canvas, 'removeEventListener');

        state.enter(game);
        expect(addSpy).toHaveBeenCalled();

        state.leaving(game);
        expect(removeSpy).toHaveBeenCalled();
    });

    describe('render()', () => {
        let drawStringSpy: MockInstance<PacmanGame['drawString']>;
        let drawSmallDotSpy: MockInstance<PacmanGame['drawSmallDot']>;
        let drawBigDotSpy: MockInstance<PacmanGame['drawBigDot']>;

        beforeEach(() => {
            drawStringSpy = vi.spyOn(game, 'drawString');
            drawSmallDotSpy = vi.spyOn(game, 'drawSmallDot');
            drawBigDotSpy = vi.spyOn(game, 'drawBigDot');
        });

        test('draws our screen', () => {
            const ctx = canvas.getContext('2d')!;
            const state: TitleState = new TitleState(game);
            state.enter(game);
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalled();
            expect(drawSmallDotSpy).toHaveBeenCalled();
            expect(drawBigDotSpy).toHaveBeenCalled();
            //expect(mockGame.pacman.render).toHaveBeenCalled();
            expect(ghost.paint).toHaveBeenCalledWith(ctx);
        });

        test('renders a message about no audio if audio is not initialized', () => {
            game.audio.isInitialized = () => false;
            const ctx = canvas.getContext('2d')!;
            const state: TitleState = new TitleState(game);
            state.enter(game);
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SOUND IS DISABLED AS');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'YOUR BROWSER DOES NOT');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SUPPORT WEB AUDIO');
        });
    });

    describe('update()', () => {
        test('works', () => {
            const updateSpriteFramesSpy = vi.spyOn(game, 'updateSpriteFrames');
            const state: TitleState = new TitleState(game);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            state.update(500);

            expect(updateSpriteFramesSpy).toHaveBeenCalled();
        });

        test('plays a sound when the user presses up', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            const state: TitleState = new TitleState(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            vi.spyOn(game.inputManager, 'up').mockReturnValue(true);
            state.update(500);

            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        test('plays a sound when the user presses down', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            const state: TitleState = new TitleState(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            vi.spyOn(game.inputManager, 'down').mockReturnValue(true);
            state.update(500);

            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        describe('when enter is pressed', () => {
            test('starts the game with the default maze', () => {
                const startGameSpy = vi.spyOn(game, 'startGame').mockImplementation(() => {});

                const state: TitleState = new TitleState(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                state.enter(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
                vi.spyOn(game.inputManager, 'enter').mockReturnValue(true);
                state.update(500);

                expect(startGameSpy).toHaveBeenCalledWith(0);
            });

            test('starts the game with the alternate game if it was selected', () => {
                const startGameSpy = vi.spyOn(game, 'startGame').mockImplementation(() => {});

                const state: TitleState = new TitleState(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                state.enter(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(500);
                vi.spyOn(game.inputManager, 'down').mockReturnValue(true);
                state.update(500);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(1000); // simulate enough time passing
                vi.spyOn(game.inputManager, 'down').mockReturnValue(false);
                vi.spyOn(game.inputManager, 'enter').mockReturnValue(true);
                state.update(500);

                expect(startGameSpy).toHaveBeenCalledWith(1);
            });
        })
    });
});
