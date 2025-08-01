import { CanvasResizer, Game, Image, Point, SpriteSheet, StretchMode, Utils } from 'gtp';
import SOUNDS from './Sounds';
import { Pacman } from './Pacman';
import { Fruit } from './Fruit';
import { Ghost } from './Ghost';
import { Blinky } from './Blinky';
import { Pinky } from './Pinky';
import { Inky } from './Inky';
import { Clyde } from './Clyde';
import { MazeState } from './MazeState';
import { Maze } from './Maze';
import Constants from './Constants';

/**
 * The default high score displayed in the game.
 */
const DEFAULT_HIGH_SCORE: number = 50000;

export enum GhostUpdateStrategy {
    UPDATE_ALL, UPDATE_NONE, UPDATE_ONE
}

export class PacmanGame extends Game {

    private highScore: number;
    private _lives: number;
    private score: number;
    private _level: number;
    private _ghostUpdateStrategy: GhostUpdateStrategy;
    private chompSound: number;
    pacman: Pacman;
    private fruit: Fruit | null;
    private readonly ghosts: Ghost[];
    private readonly extraPointsArray: number[];

    /**
     * Whether this game is being played as a desktop game (e.g. in electron).
     */
    private readonly desktopGame: boolean;

    /**
     * How we're stretching the game's canvas to fit the window.  This field is only used when the
     * game is being played in desktop mode (e.g. in electron).
     */
    private stretchMode: StretchMode = StretchMode.STRETCH_PROPORTIONAL;

    /**
     * Whether the player has earned an extra life (from achieving a
     * certain score).
     */
    private earnedExtraLife: boolean;

    /**
     * The sound effect currently looping (the background siren, the ghosts
     * running away, the ghost eyes running away, etc.).
     */
    private loopedSoundId: number | null;

    private loopedSoundName: string | null;

    /**
     * A flag used internally to decide when a ghost changing state should
     * also change the background noise (siren, eyes, etc.).
     */
    private resettingGhostStates: boolean;

    /**
     * The index into the "points" image containing the image for an
     * amount of points being earned, e.g. for eating a ghost.
     */
    private eatenGhostPointsIndex: number;

    /**
     * The playtime (in nanoseconds) after which an eaten fruit's score
     * should stop displaying.
     */
    private fruitScoreEndTime: number;

    /**
     * The index into scores of the current fruit.
     */
    private fruitScoreIndex: number;

    private _godMode: boolean;

    constructor(args?: any) {
        super(args);
        this.highScore = DEFAULT_HIGH_SCORE;
        this.pacman = new Pacman();
        this.ghosts = this._createGhostArray();
        this.chompSound = 0;
        this._ghostUpdateStrategy = GhostUpdateStrategy.UPDATE_ALL;
        this.score = 0; // For title screen
        this.desktopGame = args.desktopGame ? args.desktopGame : this._isRunningInElectron();

        this.extraPointsArray = [100, 200, 300, 400, 500, 700, 800,
            1000, 1600, 2000, 3000, 5000];

        this._possiblyRegisterDesktopModeListeners();
    }

    addFruit() {
        if (!this.fruit) { // Should always be true.
            this.fruit = new Fruit(this); // Made appropriate for current level.
            this.fruitScoreIndex = -1;
            this.fruitScoreEndTime = -1;
        }
    }

    checkForCollisions(): Ghost | null {

        for (const ghost of this.ghosts) {
            if (this.pacman.intersects(ghost)) {
                return ghost;
            }
        }

        if (this.fruit && this.fruitScoreIndex === -1 &&
            this.pacman.intersects(this.fruit)) {
            this.increaseScore(this.extraPointsArray[this.fruit.pointsIndex]);
            this.audio.playSound(SOUNDS.EATING_FRUIT, false);
            this.fruitScoreIndex = this.fruit.pointsIndex;
            this.fruitScoreEndTime = this.playTime + PacmanGame.SCORE_DISPLAY_LENGTH;
        }

        return null;
    }

    /**
     * Ensures the background sound effect being played is appropriate for
     * the ghosts' current states.
     */
    checkLoopedSound() {

        if (this.resettingGhostStates) {
            return;
        }

        let blue: boolean = false;

        for (const ghost of this.ghosts) {
            if (ghost.isEyes()) {
                this.setLoopedSound(SOUNDS.EYES_RUNNING);
                return; // "eye" noise trumps blue noise.
            }
            else if (ghost.isBlue()) {
                blue = true;
            }
        }

        this.setLoopedSound(blue ? SOUNDS.CHASING_GHOSTS : SOUNDS.SIREN);

    }

    /**
     * Creates the array of ghosts the game will use.
     *
     * @return The array of ghosts.
     */
    private _createGhostArray(): Ghost[] {
        const ghosts: Ghost[] = [];
        this.resettingGhostStates = true;
        ghosts.push(new Blinky(this));
        ghosts.push(new Pinky(this));
        ghosts.push(new Inky(this));
        ghosts.push(new Clyde(this));
        this.resettingGhostStates = false;
        return ghosts;
    }

    drawBigDot(x: number, y: number) {
        const ms: number = this.playTime;
        if (ms < 0 || (ms % 500) > 250) {
            const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
            const sx: number = 135,
                sy: number = 38;
            const image: Image = this.assets.get('sprites');
            image.drawScaled2(ctx, sx, sy, 8, 8, x, y, 8, 8);
        }
    }

    drawFruit(ctx: CanvasRenderingContext2D) {
        if (this.fruit && this.fruitScoreIndex > -1) {
            this.paintPointsEarned(ctx, this.fruitScoreIndex,
                this.fruit.x, this.fruit.y);
            const time: number = this.playTime;
            if (time >= this.fruitScoreEndTime) {
                this.fruit = null;
                this.fruitScoreIndex = -1;
                this.fruitScoreEndTime = -1;
            }
        }
        else if (this.fruit) {
            this.fruit.paint(ctx);
        }
    }

    /**
     * Paints all four ghosts in their present location and state.
     *
     * @param ctx The context with which to paint.
     */
    drawGhosts(ctx: CanvasRenderingContext2D) {
        this.ghosts.forEach((ghost: Ghost) => {
            ghost.paint(ctx);
        });
    }

    drawScores(ctx: CanvasRenderingContext2D) {

        let scoreStr: string = this.score.toString();
        let x: number = 55 - scoreStr.length * 8;
        const y: number = 10;
        this.drawString(x, y, scoreStr, ctx);

        scoreStr = this.highScore.toString();
        x = 132 - scoreStr.length * 8;
        this.drawString(x, y, scoreStr, ctx);
    }

    drawScoresHeaders(ctx: CanvasRenderingContext2D) {
        this.drawString(16, 0, '1UP', ctx);
        this.drawString(67, 0, 'HIGH SCORE', ctx);
    }

    drawSmallDot(x: number, y: number) {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
        ctx.fillRect(x, y, 2, 2);
    }

    drawSprite(dx: number, dy: number, sx: number, sy: number) {
        const image: Image = this.assets.get('sprites');
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
        image.drawScaled2(ctx, sx, sy, 16, 16, dx, dy, 16, 16);
    }

    drawString(x: number, y: number, text: string | number,
        ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!) {

        const str: string = text.toString(); // Allow us to pass in stuff like numerics

        // Note we have a SpriteSheet, not a BitmapFont, so our
        // calculation of what sub-image to draw is a little convoluted
        const fontImage: SpriteSheet = this.assets.get('font');
        const alphaOffs: number = 'A'.charCodeAt(0);
        const numericOffs: number = '0'.charCodeAt(0);
        let index: number;

        for (let i: number = 0; i < str.length; i++) {

            const ch: string = str[i];
            const chCharCode: number = str.charCodeAt(i);
            if (ch >= 'A' && ch <= 'Z') {
                index = fontImage.colCount + (chCharCode - alphaOffs);
            }
            else if (ch >= '0' && ch <= '9') {
                index = chCharCode - numericOffs;
            }
            else {
                switch (ch) {
                    case '-':
                        index = 10;
                        break;
                    case '.':
                        index = 11;
                        break;
                    case '>':
                        index = 12;
                        break;
                    case '@':
                        index = 13;
                        break;
                    case '!':
                        index = 14;
                        break;
                    default:
                        index = 15; // whitespace
                        break;
                }
            }
            fontImage.drawByIndex(ctx, x, y, index);
            x += 9; //CHAR_WIDTH
        }
    }

    getGhost(index: number): Ghost {
        return this.ghosts[index];
    }

    get godMode(): boolean {
        return this._godMode;
    }

    static get EXTRA_LIFE_SCORE(): number {
        return 10000;
    }

    get level(): number {
        return this._level;
    }

    get lives(): number {
        return this._lives;
    }

    get PENALTY_BOX_EXIT_X(): number {
        return (this.getWidth() - Constants.SPRITE_SIZE) / 2;
    }

    get PENALTY_BOX_EXIT_Y(): number {
        return 12 * Constants.TILE_SIZE - Constants.TILE_SIZE / 2;
    }

    /**
     * Amount of time, in milliseconds, that points earned by Pacman should
     * be displayed (e.g. from eating a ghost or a fruit).
     */
    static get SCORE_DISPLAY_LENGTH(): number {
        return 750;
    }

    ghostEaten(ghost: Ghost): number {

        switch (this.eatenGhostPointsIndex) {
            case 0: // 1st ghost eaten
                this.eatenGhostPointsIndex = 1;
                break;
            case 1: // 2nd ghost
                this.eatenGhostPointsIndex = 3;
                break;
            case 3: // 3rd ghost
                this.eatenGhostPointsIndex = 6;
                break;
            default: // Should never happen.
            case 6: // 4th ghost
                this.eatenGhostPointsIndex = 8;
                break;
        }
        this.increaseScore(this.extraPointsArray[this.eatenGhostPointsIndex]);

        this.audio.playSound(SOUNDS.EATING_GHOST);
        return this.eatenGhostPointsIndex;
    }

    increaseLives(amount: number): number {
        return this._lives += amount;
    }

    increaseScore(amount: number) {

        this.score += amount;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }

        if (!this.earnedExtraLife && this.score >= PacmanGame.EXTRA_LIFE_SCORE) {
            this.audio.playSound(SOUNDS.EXTRA_LIFE);
            this.increaseLives(1);
            this.earnedExtraLife = true;
        }
    }

    /**
     * Returns whether this game is being played on the desktop, as opposed to in a browser.
     *
     * @returns Whether this game is being played on the desktop.
     */
    isDesktopGame(): boolean {
        return this.desktopGame;
    }

    private _isRunningInElectron(): boolean {
        return false;
    }

    loadNextLevel() {
        this.setLoopedSound(null);
        this._level++;
        this.fruit = null;
        this.fruitScoreIndex = -1;
        this.fruitScoreEndTime = -1;
        const state: MazeState = this.state as MazeState;
        state.reset();
    }

    makeGhostsBlue() {
        this.eatenGhostPointsIndex = 0;
        this.ghosts.forEach((ghost: Ghost) => {
            ghost.possiblyTurnBlue();
        });
        // Don't just change to "blue" sound as "eyes" sound trumps "blue".
        this.checkLoopedSound();
    }

    /**
     * Paints the "points earned," for example, when PacMan eats a ghost or
     * fruit.
     *
     * @param ctx The graphics context to use.
     * @param ptsIndex The index into the points array.
     * @param dx The x-coordinate at which to draw.
     * @param dy The y-coordinate at which to draw.
     */
    paintPointsEarned(ctx: CanvasRenderingContext2D, ptsIndex: number, dx: number, dy: number) {
        const points: SpriteSheet = this.assets.get('points');
        points.drawByIndex(ctx, dx, dy, ptsIndex);
    }

    /**
     * Plays the next appropriate chomp sound.
     */
    playChompSound() {
        this.audio.playSound(this.chompSound === 0 ?
            SOUNDS.CHOMP_1 : SOUNDS.CHOMP_2);
        this.chompSound = (this.chompSound + 1) % 2;
    }

    /**
     * Registers events that are specific to the desktop mode of the game.
     */
    private _possiblyRegisterDesktopModeListeners() {
        if (this.isDesktopGame()) {

            window.addEventListener('resize', () => {
                CanvasResizer.resize(this.canvas, this.stretchMode);
            });
        }
    }

    resetGhosts() {

        this.resettingGhostStates = true;

        // Have each ghost go to one of four random corners while in scatter
        // mode, but ensure each ghost goes to a different corner.
        const corners: Point[] = [
            new Point(2, 1),
            new Point(2, Maze.TILE_COUNT_HORIZONTAL - 2),
            new Point(Maze.TILE_COUNT_VERTICAL - 2, 1),
            new Point(Maze.TILE_COUNT_VERTICAL - 2, Maze.TILE_COUNT_HORIZONTAL - 2)
        ];
        const cornerSeed: number = Utils.randomInt(4);

        for (let i: number = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].reset();
            this.ghosts[i].setCorner(corners[(cornerSeed + i) % 4]);
        }

        this.resettingGhostStates = false;
    }

    /**
     * Starts looping a sound effect.
     * @param sound The sound effect to loop.
     */
    setLoopedSound(sound: string | null) {
        if (sound !== this.loopedSoundName) {
            if (this.loopedSoundId != null) {
                this.audio.stopSound(this.loopedSoundId);
            }
            this.loopedSoundName = sound;
            this.loopedSoundId = sound != null ? this.audio.playSound(sound, true) : null;
        }
    }

    /**
     * Sets whether to update none, one, or all of the ghosts' positions
     * each frame.  This is used for debugging purposes.
     *
     * @param strategy How to update the ghosts.
     */
    set ghostUpdateStrategy(strategy: GhostUpdateStrategy) {
        this._ghostUpdateStrategy = strategy;
    }

    startGame(level: number) {

        this._lives = 3;
        this.score = 0;
        this._level = 0;

        const levelsData: any = this.assets.get('levels');
        const levelData: any = levelsData[level];
        const mazeState: any = new MazeState(levelData);
        //this.setState(new FadeOutInState(this.state, mazeState));
        this.setState(mazeState); // The original did not fade in/out
    }

    startPacmanDying() {
        this.setLoopedSound(null);
        this.audio.playSound(SOUNDS.DIES);
        this.pacman.startDying();
        this.fruit = null;
        this.fruitScoreIndex = -1;
        this.fruitScoreEndTime = -1;
    }

    toggleGodMode(): boolean {
        this._godMode = !this._godMode;
        this.setStatusMessage('God mode ' + (this._godMode ? 'enabled' : 'disabled'));
        return this._godMode;
    }

    toggleStretchMode() {
        if (this.isDesktopGame()) {
            switch (this.stretchMode) {
                default:
                case StretchMode.STRETCH_NONE:
                    this.stretchMode = StretchMode.STRETCH_FILL;
                    break;
                case StretchMode.STRETCH_FILL:
                    this.stretchMode = StretchMode.STRETCH_PROPORTIONAL;
                    break;
                case StretchMode.STRETCH_PROPORTIONAL:
                    this.stretchMode = StretchMode.STRETCH_NONE;
                    break;
            }
            this.setStatusMessage('Stretch mode: ' + this.stretchMode);
            CanvasResizer.resize(this.canvas, this.stretchMode);
        }
    }

    /**
     * Goes to the next animation frame for pacman, the ghosts and the
     * fruit.
     */
    updateSpriteFrames() {
        this.pacman.updateFrame();
        this.ghosts.forEach((ghost: Ghost) => {
            ghost.updateFrame();
        });
    }

    /**
     * Updates the position of pacman, the ghosts and the fruit, in the
     * specified maze.
     * @param maze The maze.
     * @param time The amount of elapsed time.
     */
    updateSpritePositions(maze: Maze, time: number) {

        // NOTE: We MUST update ghost positions before PacMan position.  This
        // is because pacman.updatePosition() can cause the engine's "playtime"
        // to reset to 0, which in turn will mess up the ghosts'
        // updatePosition() calls (since we're using a "cached" time to pass
        // to them).  This is seen when PacMan eats the last dot in a level
        // and the next level is loaded.

        switch (this._ghostUpdateStrategy) {
            case GhostUpdateStrategy.UPDATE_ALL:
                this.ghosts.forEach((ghost: Ghost) => {
                    ghost.updatePosition(maze, time);
                });
                break;
            case GhostUpdateStrategy.UPDATE_NONE:
                break;
            case GhostUpdateStrategy.UPDATE_ONE:
                this.ghosts[0].updatePosition(maze, time);
                break;
        }

        this.pacman.updatePosition(maze, time);

    }
}
