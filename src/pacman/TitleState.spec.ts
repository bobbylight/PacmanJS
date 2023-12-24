import { TitleState } from './TitleState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';
import { ConcreteGhost } from './Ghost.spec';
import { Direction } from './Direction';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('TitleState', () => {

    let ghost: ConcreteGhost;
    let mockGame: PacmanGame;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {

        canvas = document.createElement('canvas');//dom.window.document.createElement('canvas');

        ghost = new ConcreteGhost();
        ghost.direction = Direction.WEST;

        mockGame = {
            pacman: new Pacman(),
            getWidth: vi.fn(),
            getHeight: vi.fn(),
            clearScreen: vi.fn(),
            drawSmallDot: vi.fn(),
            drawBigDot: vi.fn(),
            drawScores: vi.fn(),
            drawScoresHeaders: vi.fn(),
            getGhost: () => {
                return ghost;
            },
            canvas,
        } as unknown as PacmanGame;
        (global as any).game = mockGame;
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

        state.enter();
        expect(addSpy).toHaveBeenCalled();

        state.leaving(mockGame);
        expect(removeSpy).toHaveBeenCalled();
    });

    // test('render() draws our screen', () => {
    //
    //     const state: TitleState = new TitleState(mockGame);
    //     state.render(canvas.getContext('2d')!);
    // });
});
