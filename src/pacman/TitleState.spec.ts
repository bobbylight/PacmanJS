import { TitleState } from './TitleState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';
import { ConcreteGhost } from './Ghost.spec';
import { Direction } from './Direction';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { SOUNDS } from './Sounds';

const mockSpriteSheet = {
    draw: () => {},
} as unknown as SpriteSheet;

describe('TitleState', () => {

    let ghost: ConcreteGhost;
    let mockGame: any;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {

        canvas = document.createElement('canvas');//dom.window.document.createElement('canvas');

        mockGame = {
            assets: {
                get: () => mockSpriteSheet,
            },
            audio: {
                isInitialized: () => true,
                playSound: vi.fn(),
            },
            canvas,
            checkLoopedSound: vi.fn(),
            clearScreen: vi.fn(),
            drawSmallDot: vi.fn(),
            drawBigDot: vi.fn(),
            drawScores: vi.fn(),
            drawScoresHeaders: vi.fn(),
            drawSprite: vi.fn(),
            drawString: vi.fn(),
            getGhost: () => ghost,
            getHeight: vi.fn(),
            getRenderingContext: () => canvas.getContext('2d')!,
            getWidth: vi.fn(),
            inputManager: {
                left: vi.fn(),
                right: vi.fn(),
                up: vi.fn(),
                down: vi.fn(),
                enter: vi.fn(),
            },
            playTime: 5000,
            startGame: vi.fn(),
            updateSpriteFrames: vi.fn(),
        } as unknown as PacmanGame;

        mockGame.pacman = new Pacman(mockGame);
        ghost = new ConcreteGhost(mockGame);
        ghost.paint = vi.fn();
        ghost.direction = Direction.WEST;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    test('enter() sets up Pinky properly', () => {
        new TitleState(mockGame);
        expect(ghost.direction).toEqual(Direction.EAST);
    });

    test('enter() and exit() attach and remove listeners to the canvas properly', () => {

        const state: TitleState = new TitleState(mockGame);
        const addSpy = vi.spyOn(canvas, 'addEventListener');
        const removeSpy = vi.spyOn(canvas, 'removeEventListener');

        state.enter(mockGame);
        expect(addSpy).toHaveBeenCalled();

        state.leaving(mockGame);
        expect(removeSpy).toHaveBeenCalled();
    });

    describe('render()', () => {
        test('draws our screen', () => {
            const ctx = canvas.getContext('2d')!;
            const state: TitleState = new TitleState(mockGame);
            state.enter(mockGame);
            state.render(ctx);

            expect(mockGame.drawString).toHaveBeenCalled();
            expect(mockGame.drawSmallDot).toHaveBeenCalled();
            expect(mockGame.drawBigDot).toHaveBeenCalled();
            //expect(mockGame.pacman.render).toHaveBeenCalled();
            expect(ghost.paint).toHaveBeenCalledWith(ctx);
        });

        test('renders a message about no audio if audio is not initialized', () => {
            mockGame.audio.isInitialized = () => false;
            const ctx = canvas.getContext('2d')!;
            const state: TitleState = new TitleState(mockGame);
            state.enter(mockGame);
            state.render(ctx);

            expect(mockGame.drawString).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SOUND IS DISABLED AS');
            expect(mockGame.drawString).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'YOUR BROWSER DOES NOT');
            expect(mockGame.drawString).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SUPPORT WEB AUDIO');
        });
    });

    describe('update()', () => {
        test('works', () => {
            const state: TitleState = new TitleState(mockGame);
            state.enter(mockGame);
            mockGame.playTime += 500; // simulate enough time passing
            state.update(500);

            expect(mockGame.checkLoopedSound).toHaveBeenCalled();
            expect(mockGame.updateSpriteFrames).toHaveBeenCalled();
        });

        test('plays a sound when the user presses up', () => {
            const state: TitleState = new TitleState(mockGame);
            state.enter(mockGame);
            mockGame.playTime += 500; // simulate enough time passing
            mockGame.inputManager.up.mockReturnValue(true); // simulate up pressed
            state.update(500);

            expect(mockGame.audio.playSound).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        test('plays a sound when the user presses down', () => {
            const state: TitleState = new TitleState(mockGame);
            state.enter(mockGame);
            mockGame.playTime += 500; // simulate enough time passing
            mockGame.inputManager.down.mockReturnValue(true); // simulate down pressed
            state.update(500);

            expect(mockGame.audio.playSound).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        describe('when enter is pressed', () => {
            test('starts the game with the default maze', () => {
                const state: TitleState = new TitleState(mockGame);
                state.enter(mockGame);
                mockGame.playTime += 500; // simulate enough time passing
                mockGame.inputManager.enter.mockReturnValue(true); // simulate enter pressed
                state.update(500);

                expect(mockGame.startGame).toHaveBeenCalledWith(0);
            });

            test('starts the game with the alternate game if it was selected', () => {
                const state: TitleState = new TitleState(mockGame);
                state.enter(mockGame);
                mockGame.playTime += 500;
                mockGame.inputManager.down.mockReturnValue(true);
                state.update(500);
                mockGame.playTime += 500; // simulate enough time passing
                mockGame.inputManager.down.mockReturnValue(false);
                mockGame.inputManager.enter.mockReturnValue(true);
                state.update(500);

                expect(mockGame.startGame).toHaveBeenCalledWith(1);
            });
        })
    });
});
