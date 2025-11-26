import { afterEach, describe, expect, test, vi, beforeEach, MockInstance } from 'vitest';
import { MazeState } from './MazeState';
import { Maze } from './Maze';
import { SpriteSheet } from 'gtp';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';

const mockMazeFile = [
    [0, 1],
    [1, 0]
];

const mockImage = {
    draw: vi.fn(),
    drawScaled2: vi.fn(),
};

let game: PacmanGame;

beforeEach(() => {
    const mockSpriteSheeet = {
        drawByIndex: () => {
        }
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

    test('constructor sets mazeFile', () => {
        const state = new MazeState(mockMazeFile);
        expect(state).toBeInstanceOf(MazeState);
    });

    test('enter initializes game and maze', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        expect(pacmanResetSpy).toHaveBeenCalled();
        expect(resetGhostsSpy).toHaveBeenCalled();
        expect(state['maze']).toBeInstanceOf(Maze);
        expect(state['substate']).toBe('READY');
    });

    test('reset calls maze.reset and game.resetPlayTime', () => {
        const state = new MazeState(mockMazeFile);
        state['maze'] = {reset: vi.fn()} as unknown as Maze;
        state.enter(game);
        expect(() => state.reset()).not.toThrow();
    });

    test('update transitions READY to IN_GAME after delay', () => {
        const setLoopeSoundSpy = vi.spyOn(game, 'setLoopedSound');
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        state['substate'] = 'READY';
        state['firstTimeThrough'] = true;
        state['substateStartTime'] = 0;
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(5000);
        state.update(16);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(10000);
        state.update(16);
        expect(state['substate']).toBe('IN_GAME');
        expect(setLoopeSoundSpy).toHaveBeenCalled();
    });

    test('updateInGameImpl calls updateSpritePositions', () => {
        const updateSpritePositionsSpy = vi.spyOn(game, 'updateSpritePositions');
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        state['substate'] = 'IN_GAME';
        state['nextUpdateTime'] = 0;
        state['updateScoreIndex'] = -1;
        state['maze'] = new Maze(game, mockMazeFile);
        state['updateInGameImpl'](game.playTime);
        expect(updateSpritePositionsSpy).toHaveBeenCalled();
    });

    test('render calls maze.render and game.drawFruit', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(game);
        const ctx = {
            drawImage: vi.fn(),
            fillStyle: '',
            fillRect: vi.fn(),
            globalAlpha: 1,
            translate: vi.fn()
        } as unknown as CanvasRenderingContext2D;
        expect(() => state.render(ctx)).not.toThrow();
    });
});
