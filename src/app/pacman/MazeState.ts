import {_BaseState} from './_BaseState';
import {Maze} from './Maze';
import {PacmanGame} from './PacmanGame';
import {Pacman} from './Pacman';
import {TitleState} from './TitleState';
import {Sounds} from './Sounds';
import {Ghost, MotionState} from './Ghost';
import {Keys} from 'gtp/dist/gtp/Keys';
import {InputManager} from 'gtp/dist/gtp/InputManager';
declare var game: PacmanGame;

type Substate = 'READY' | 'IN_GAME' | 'DYING' | 'GAME_OVER';

export class MazeState extends _BaseState {

    private _mazeFile: number[][];
    private _maze: Maze;
    private _firstTimeThrough: boolean;
    private _updateScoreIndex: number;
    private _substate: Substate;
    private _substateStartTime: number;
    private _nextUpdateTime: number;
    private _nextDyingFrameTime: number;
    private _lastMazeScreenKeypressTime: number;

    constructor(mazeFile: number[][]) {
        super();
        this._mazeFile = mazeFile;
    }

    private static get DYING_FRAME_DELAY_MILLIS(): number {
        return 75;
    }

    private get _readyDelayMillis(): number {
        return this._firstTimeThrough ? 4500 : 2000;
    }

    enter() {

        game.pacman.reset();
        game.resetGhosts();

        this._maze = new Maze(this._mazeFile);
        this._firstTimeThrough = true;
        this._updateScoreIndex = -1;

        // Prevents the user's "Enter" press to start the game from being
        // picked up by our handleInput().
        this._lastMazeScreenKeypressTime = game.playTime + MazeState.INPUT_REPEAT_MILLIS;

        this._substate = 'READY';
        this._firstTimeThrough = true;
        this._substateStartTime = 0;
        this._nextDyingFrameTime = 0;
        this._nextUpdateTime = 0;
        this._lastSpriteFrameTime = 0;
    }

    private _paintExtraLives(ctx: CanvasRenderingContext2D) {

        // The indentation on either side of the status stuff at the bottom
        // (extra life count, possible fruits, etc.).
        const BOTTOM_INDENT: number = 24;
        const TILE_SIZE: number = 8;

        const lives: number = game.lives;
        if (lives > 0) {
            let x: number = BOTTOM_INDENT;
            const y: number = game.getHeight() - 2 * TILE_SIZE;
            const w: number = 2 * TILE_SIZE;
            for (let i: number = 0; i < lives; i++) {
                game.drawSprite(x, y, 12 * 16, 3 * 16);
                x += w;
            }
        }
    }

    private _paintPossibleFruits(ctx: CanvasRenderingContext2D) {

        // The indentation on either side of the status stuff at the bottom
        // (extra life count, possible fruits, etc.).
        const BOTTOM_INDENT: number = 12;
        const TILE_SIZE: number = PacmanGame.TILE_SIZE;

        let x: number = game.getWidth() - BOTTOM_INDENT - 2 * TILE_SIZE;
        let y: number = game.getHeight() - 2 * TILE_SIZE;

        switch (game.level) {
            default:
            case 7: // Key
                game.drawSprite(x - 112, y, 13 * 16, 3 * 16);
            // Fall through
            case 6: // Space Invaders ship
                game.drawSprite(x - 96, y, 13 * 16, 6 * 16);
            // Fall through
            case 5: // Green thing (grapes?)
                game.drawSprite(x - 80, y, 12 * 16, 6 * 16);
            // Fall through.
            case 4: // Apple
                game.drawSprite(x - 64, y, 13 * 16, 2 * 16);
            // Fall through.
            case 3: // Yellow bell
                game.drawSprite(x - 48, y, 13 * 16, 5 * 16);
            // Fall through.
            case 2: // Peach
                game.drawSprite(x - 32, y, 12 * 16, 5 * 16);
            // Fall through.
            case 1: // Strawberry
                game.drawSprite(x - 16, y, 13 * 16, 4 * 16);
            // Fall through.
            case 0: // Cherry
                game.drawSprite(x, y, 12 * 16, 4 * 16);
                break;
        }
    }

    render(ctx: CanvasRenderingContext2D) {

        super.render(ctx);
        this._maze.render(ctx);

        // "window.pacman" because of hoisting of pacman let below
        let TILE_SIZE: number = 8;
        let mazeY: number = game.getHeight() - 2 * TILE_SIZE -
            Maze.TILE_COUNT_VERTICAL * TILE_SIZE;
        ctx.translate(0, mazeY);

        game.drawFruit(ctx);

        const pacman: Pacman = game.pacman;
        if (this._updateScoreIndex === -1) {
            if (this._substate !== 'GAME_OVER') {
                pacman.render(ctx);
            }
        }
        else {
            const x: number = pacman.bounds.x;
            const y: number = pacman.bounds.y;
            game.paintPointsEarned(ctx, this._updateScoreIndex, x, y);
        }

        game.drawGhosts(ctx);

        ctx.translate(0, -mazeY);

        game.drawScores(ctx);
        this._paintExtraLives(ctx);
        this._paintPossibleFruits(ctx);

        if (this._substate === 'READY') {
            // These calculations should be fast enough, especially considering
            // that "READY!" is only displayed for about 4 seconds.
            let ready: string = 'READY!';
            let x: number = (game.getWidth() - ready.length * 9) / 2;
            // Give "Ready!" a little nudge to the right.  This is because the
            // ending '!' doesn't fill up the standard 8 pixels for a character,
            // so "READY!" looks slightly too far to the left without it.
            x += 3;
            game.drawString(x, 160, ready);
        }
        else if (this._substate === 'GAME_OVER') {
            let gameOver: string = 'GAME OVER';
            let x: number = (game.getWidth() - gameOver.length * 9) / 2;
            game.drawString(x, 160, gameOver);
        }

        if (game.paused) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
            ctx.globalAlpha = 1;
            ctx.fillRect(50, 100, game.getWidth() - 100, game.getHeight() - 200);
            let paused: string = 'PAUSED';
            let x: number = (game.getWidth() - paused.length * 9) / 2;
            game.drawString(x, (game.getHeight() - 18) / 2, paused);
        }
    }

    reset() {
        this._maze.reset();
        game.resetPlayTime();
        game.pacman.reset();
        game.resetGhosts(); // Do AFTER resetting playtime!
        this._substate = 'READY';
        this._substateStartTime = 0; // Play time was just reset
        this._lastSpriteFrameTime = 0;

        // Prevents the user's "Enter" press to start the game from being
        // picked up by our handleInput().
        this._lastMazeScreenKeypressTime = game.playTime + MazeState.INPUT_REPEAT_MILLIS;
    }

    private _handleInput(delta: number, time: number) {

        this.handleDefaultKeys();
        let input: InputManager = game.inputManager;

        // Enter -> Pause.  Don't check for pausing on "Game Over" screen as
        // that will carry over into the next game!
        if (this._substate !== 'GAME_OVER' && input.enter(true)) {
            game.paused = !game.paused;
            this._lastMazeScreenKeypressTime = time;
            return;
        }

        if (!game.paused) {

            switch (this._substate) {

                case 'IN_GAME':
                    game.pacman.handleInput(this._maze);
                    break;

                case 'GAME_OVER':
                    if (input.enter(true)) {
                        game.setState(new TitleState(game));
                    }
                    break;
            }

        }

        if (time >= this._lastMazeScreenKeypressTime + MazeState.INPUT_REPEAT_MILLIS) {

            // Hidden options (Z + keypress)
            if (!game.paused && this._substate === 'IN_GAME' &&
                input.isKeyDown(Keys.KEY_Z)) {

                // Z+X => auto-load next level
                if (input.isKeyDown(Keys.KEY_X)) {
                    game.loadNextLevel();
                    this._lastMazeScreenKeypressTime = time;
                }

                // Z+C => auto-death
                else if (input.isKeyDown(Keys.KEY_C)) {
                    if ((<any>this._substate) !== 'DYING') { // <any> cast due to what seems to be a bug in tsc
                        game.startPacmanDying();
                        this._substate = 'DYING';
                        this._nextDyingFrameTime = time + MazeState.DYING_FRAME_DELAY_MILLIS;
                        this._lastMazeScreenKeypressTime = time;
                    }
                }
            }

        }
    }

    update(delta: number) {
        super.update(delta);

        // playTime may reset in handleInput, so we fetch it again afterward
        this._handleInput(delta, game.playTime);
        const time: number = game.playTime;

        switch (this._substate) {

            case 'READY':
                if (this._firstTimeThrough && this._substateStartTime === 0) {
                    this._substateStartTime = time;
                    game.audio.playSound(Sounds.OPENING);
                }
                if (time >= this._substateStartTime + this._readyDelayMillis) {
                    this._substate = 'IN_GAME';
                    this._substateStartTime = time;
                    game.resetPlayTime();
                    this._lastMazeScreenKeypressTime = game.playTime;
                    game.setLoopedSound(Sounds.SIREN);
                    this._firstTimeThrough = false;
                }
                break;

            case 'IN_GAME':
                this._updateInGameImpl(time);
                break;

            case 'DYING':
                if (time >= this._nextDyingFrameTime) {
                    if (!game.pacman.incDying()) {
                        if (game.increaseLives(-1) <= 0) {
                            this._substate = 'GAME_OVER';
                        }
                        else {
                            game.resetPlayTime();
                            this._lastMazeScreenKeypressTime = game.playTime;
                            game.pacman.reset();
                            game.resetGhosts(); // Do AFTER resetting play time!
                            this._substate = 'READY';
                            this._substateStartTime = 0; // Play time was just reset
                            this._lastSpriteFrameTime = 0;
                        }
                    }
                    else {
                        this._nextDyingFrameTime = time + MazeState.DYING_FRAME_DELAY_MILLIS;
                    }
                }
                break;

            case 'GAME_OVER':
                // Do nothing
                break;
        }
    }

    private _updateInGameImpl(time: number) {

        // If Pacman is eating a ghost, add a slight delay
        if (this._nextUpdateTime > 0 && time < this._nextUpdateTime) {
            return;
        }
        this._nextUpdateTime = 0;
        this._updateScoreIndex = -1;

        this._updateSpriteFrames();

        // Update Pacman's, ghosts', and possibly fruit's positions
        game.updateSpritePositions(this._maze, time);

        // If Pacman hit a ghost, decide what to do
        let ghostHit: Ghost = game.checkForCollisions();
        if (ghostHit) {

            switch (ghostHit.motionState) {

                case MotionState.BLUE:
                    this._nextUpdateTime = time + PacmanGame.SCORE_DISPLAY_LENGTH;
                    ghostHit.motionState = MotionState.EYES;
                    this._updateScoreIndex = game.ghostEaten(ghostHit);
                    break;

                case MotionState.EYES:
                case MotionState.EYES_ENTERING_BOX:
                    // Do nothing
                    break;

                default:
                    if (!game.godMode) {
                        game.startPacmanDying();
                        this._substate = 'DYING';
                        this._nextDyingFrameTime = game.playTime + MazeState.DYING_FRAME_DELAY_MILLIS;
                    }
                    break;
            }
        }
    }
}
