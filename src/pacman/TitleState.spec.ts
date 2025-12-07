import { afterEach, beforeEach, describe, expect, MockInstance, vi, it } from 'vitest';
import { SpriteSheet } from 'gtp';
import { TitleState } from './TitleState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';
import { Direction } from './Direction';

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
    let ghostPaintSpy: MockInstance<Ghost['paint']>;

    beforeEach(() => {

        game = new PacmanGame();
        game.assets.set('font', mockSpriteSheet);
        game.assets.set('image', mockImage);
        game.assets.set('title', mockImage);
        game.assets.set('sprites', mockImage);

        canvas = game.canvas;
        game.pacman = new Pacman(game);
        ghost = game.getGhost(0);
        ghostPaintSpy = vi.spyOn(ghost, 'paint');
        ghost.direction = Direction.WEST;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('enter() sets up Pinky properly', () => {
        new TitleState(game);
        expect(ghost.direction).toEqual(Direction.EAST);
    });

    it('enter() and exit() attach and remove listeners to the canvas properly', () => {

        const state: TitleState = new TitleState(game);
        const addSpy = vi.spyOn(canvas, 'addEventListener');
        const removeSpy = vi.spyOn(canvas, 'removeEventListener');

        state.enter();
        expect(addSpy).toHaveBeenCalled();

        state.leaving();
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

        it('draws our screen', () => {
            const ctx = game.getRenderingContext();
            const state: TitleState = new TitleState(game);
            state.enter();
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalled();
            expect(drawSmallDotSpy).toHaveBeenCalled();
            expect(drawBigDotSpy).toHaveBeenCalled();
            //expect(mockGame.pacman.render).toHaveBeenCalled();
            expect(ghostPaintSpy).toHaveBeenCalledWith(ctx);
        });

        it('renders a message about no audio if audio is not initialized', () => {
            game.audio.isInitialized = () => false;
            const ctx = game.getRenderingContext();
            const state: TitleState = new TitleState(game);
            state.enter();
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SOUND IS DISABLED AS');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'YOUR BROWSER DOES NOT');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'SUPPORT WEB AUDIO');
        });
    });

    describe('update()', () => {
        it('works', () => {
            const updateSpriteFramesSpy = vi.spyOn(game, 'updateSpriteFrames');
            const state: TitleState = new TitleState(game);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter();
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            state.update(500);

            expect(updateSpriteFramesSpy).toHaveBeenCalled();
        });

        it('plays a sound when the user presses up', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            const state: TitleState = new TitleState(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter();
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            vi.spyOn(game.inputManager, 'up').mockReturnValue(true);
            state.update(500);

            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        it('plays a sound when the user presses down', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            const state: TitleState = new TitleState(game);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            state.enter();
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
            vi.spyOn(game.inputManager, 'down').mockReturnValue(true);
            state.update(500);

            expect(playSoundSpy).toHaveBeenCalledWith(SOUNDS.TOKEN);
        });

        describe('when enter is pressed', () => {
            it('starts the game with the default maze', () => {
                const startGameSpy = vi.spyOn(game, 'startGame').mockImplementation(() => {});

                const state: TitleState = new TitleState(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                state.enter();
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(500); // simulate enough time passing
                vi.spyOn(game.inputManager, 'enter').mockReturnValue(true);
                state.update(500);

                expect(startGameSpy).toHaveBeenCalledWith(0);
            });

            it('starts the game with the alternate game if it was selected', () => {
                const startGameSpy = vi.spyOn(game, 'startGame').mockImplementation(() => {});

                const state: TitleState = new TitleState(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                state.enter();
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(500);
                vi.spyOn(game.inputManager, 'down').mockReturnValue(true);
                state.update(500);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(1000); // simulate enough time passing
                vi.spyOn(game.inputManager, 'down').mockReturnValue(false);
                vi.spyOn(game.inputManager, 'enter').mockReturnValue(true);
                state.update(500);

                expect(startGameSpy).toHaveBeenCalledWith(1);
            });
        });
    });
});
