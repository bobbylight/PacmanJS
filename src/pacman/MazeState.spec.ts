import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MazeState } from './MazeState';
import { Maze } from './Maze';
import { SpriteSheet } from 'gtp';

const mockMazeFile = [
    [0, 1],
    [1, 0]
];

let mockGame: any;

beforeEach(() => {
    const mapTilesSpriteSheet = {
        drawByIndex: () => {
        }
    } as unknown as SpriteSheet;

    mockGame = {
        assets: {
            get: () => mapTilesSpriteSheet
        },
        drawScoresHeaders: vi.fn(),
        pacman: {reset: vi.fn(), render: vi.fn(), bounds: {x: 1, y: 2}, handleInput: vi.fn(), incDying: vi.fn()},
        resetGhosts: vi.fn(),
        getHeight: vi.fn(() => 224),
        getWidth: vi.fn(() => 224),
        drawSprite: vi.fn(),
        drawFruit: vi.fn(),
        drawGhosts: vi.fn(),
        drawScores: vi.fn(),
        drawString: vi.fn(),
        paintPointsEarned: vi.fn(),
        inputManager: {enter: vi.fn(), isKeyDown: vi.fn()},
        playTime: 0,
        resetPlayTime: vi.fn(),
        paused: false,
        getLevel: () => 0,
        audio: {playSound: vi.fn()},
        setLoopedSound: vi.fn(),
        ghostEaten: vi.fn(),
        checkForCollisions: vi.fn(() => null),
        updateSpritePositions: vi.fn(),
        increaseLives: vi.fn(() => 1),
        setState: vi.fn(),
        loadNextLevel: vi.fn(),
        startPacmanDying: vi.fn(),
        godMode: false,
        getLives: () => 3
    };
});

describe('MazeState', () => {
    test('constructor sets mazeFile', () => {
        const state = new MazeState(mockMazeFile);
        expect(state).toBeInstanceOf(MazeState);
    });

    test('enter initializes game and maze', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(mockGame);
        expect(mockGame.pacman.reset).toHaveBeenCalled();
        expect(mockGame.resetGhosts).toHaveBeenCalled();
        expect(state['maze']).toBeInstanceOf(Maze);
        expect(state['substate']).toBe('READY');
    });

    test('reset calls maze.reset and game.resetPlayTime', () => {
        const state = new MazeState(mockMazeFile);
        state['maze'] = {reset: vi.fn()} as unknown as Maze;
        state.enter(mockGame);
        expect(() => state.reset()).not.toThrow();
    });

    test('update transitions READY to IN_GAME after delay', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(mockGame);
        state['substate'] = 'READY';
        state['firstTimeThrough'] = true;
        state['substateStartTime'] = 0;
        mockGame.playTime = 5000;
        state.update(16);
        mockGame.playTime = 10000;
        state.update(16);
        expect(state['substate']).toBe('IN_GAME');
        expect(mockGame.setLoopedSound).toHaveBeenCalled();
    });

    test('updateInGameImpl calls updateSpritePositions', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(mockGame);
        state['substate'] = 'IN_GAME';
        state['nextUpdateTime'] = 0;
        state['updateScoreIndex'] = -1;
        state['maze'] = new Maze(mockGame, mockMazeFile);
        state['updateInGameImpl'](mockGame.playTime);
        expect(mockGame.updateSpritePositions).toHaveBeenCalled();
    });

    test('render calls maze.render and game.drawFruit', () => {
        const state = new MazeState(mockMazeFile);
        state.enter(mockGame);
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
