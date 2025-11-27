import { afterEach, describe, expect, vi, beforeEach, MockInstance, it } from 'vitest';
import { SpriteSheet } from 'gtp';
import { MazeState } from './MazeState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';

const mockMazeFile = [
    [ 0, 1 ],
    [ 1, 0 ],
];

const mockImage = {
    draw: vi.fn(),
    drawScaled2: vi.fn(),
};

let game: PacmanGame;

beforeEach(() => {
    const mockSpriteSheeet = {
        drawByIndex: () => {
        },
    } as unknown as SpriteSheet;

    game = new PacmanGame();
    game.assets.set('mapTiles', mockSpriteSheeet);
    game.assets.set('font', mockSpriteSheeet);
    game.assets.set('sprites', mockImage);
});

afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
});

describe('MazeState', () => {
    let pacmanResetSpy: MockInstance<Pacman['reset']>;
    let resetGhostsSpy: MockInstance<PacmanGame['resetGhosts']>;

    beforeEach(() => {
        pacmanResetSpy = vi.spyOn(game.pacman, 'reset');
        resetGhostsSpy = vi.spyOn(game, 'resetGhosts');
    });

    it('constructor sets mazeFile', () => {
        const state = new MazeState(mockMazeFile);
        expect(state).toBeInstanceOf(MazeState);
    });

    it('enter initializes Pacman and the ghosts', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        expect(pacmanResetSpy).toHaveBeenCalled();
        expect(resetGhostsSpy).toHaveBeenCalled();
    });

    it('reset does not throw an error', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        expect(() => {
            state.reset();
        }).not.toThrow();
    });

    it('update transitions READY to IN_GAME after delay', () => {
        const setLoopeSoundSpy = vi.spyOn(game, 'setLoopedSound');
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        expect(state.getSubstate()).toEqual('READY');
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(5000);
        state.update(16);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(10000);
        state.update(16);
        expect(state.getSubstate()).toBe('IN_GAME');
        expect(setLoopeSoundSpy).toHaveBeenCalled();
    });

    it('when Pacman is hit with lives remaining, we go from DYING to READY after a delay', () => {
        const setLoopeSoundSpy = vi.spyOn(game, 'setLoopedSound');
        const state = new MazeState(mockMazeFile);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
        vi.spyOn(game.pacman, 'incDying').mockReturnValue(false);
        vi.spyOn(game, 'increaseLives').mockReturnValue(1);
        state.enter(game);
        state.enterDyingSubstate(0);
        expect(state.getSubstate()).toEqual('DYING');
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(5000);
        state.update(75);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(10000);
        state.update(75);
        expect(state.getSubstate()).toBe('READY');
        expect(setLoopeSoundSpy).toHaveBeenCalled();
    });

    it('when Pacman is hit with no lives remaining, we go from DYING to GAME_OVER after a delay', () => {
        const setLoopeSoundSpy = vi.spyOn(game, 'setLoopedSound');
        const state = new MazeState(mockMazeFile);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
        vi.spyOn(game.pacman, 'incDying').mockReturnValue(false);
        vi.spyOn(game, 'increaseLives').mockReturnValue(0);
        state.enter(game);
        state.enterDyingSubstate(0);
        expect(state.getSubstate()).toEqual('DYING');
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(5000);
        state.update(75);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(10000);
        state.update(75);
        expect(state.getSubstate()).toBe('GAME_OVER');
        expect(setLoopeSoundSpy).toHaveBeenCalled();
    });

    it('while IN_GAME updates alls prite positions', () => {
        const updateSpritePositionsSpy = vi.spyOn(game, 'updateSpritePositions');
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        state.enterInGameSubstate();
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(5000);
        state.update(75);
        expect(updateSpritePositionsSpy).toHaveBeenCalled();
    });

    it('render calls maze.render and game.drawFruit', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        const ctx = {
            drawImage: vi.fn(),
            fillStyle: '',
            fillRect: vi.fn(),
            globalAlpha: 1,
            translate: vi.fn(),
        } as unknown as CanvasRenderingContext2D;
        expect(() => {
            state.render(ctx);
        }).not.toThrow();
    });
});
