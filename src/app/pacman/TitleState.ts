import {_BaseState} from './_BaseState';
import {PacmanGame} from './PacmanGame';
import {Pacman} from './Pacman';
import {Direction} from './Direction';
import {Ghost} from './Ghost';
import {Sounds} from './Sounds';
import {InputManager} from 'gtp';
import {BaseStateArgs} from 'gtp';
import {Game} from 'gtp';
import {Image} from 'gtp';
declare var game: PacmanGame;

export class TitleState extends _BaseState {

    private _choice: number;
    private _lastKeypressTime: number;

    /**
     * State that renders the title screen.
     * @constructor
     */
    constructor(args?: PacmanGame | BaseStateArgs) {
        super(args);
        // Initialize our sprites not just in enter() so they are positioned
        // correctly while FadeOutInState is running
        this._initSprites();
    }

    enter() {

        super.enter(game);

        game.canvas.addEventListener('touchstart', this.handleStart, false);
        this._choice = 0;
        this._lastKeypressTime = game.playTime;

        this._initSprites();
    }

    private _initSprites() {
        const pacman: Pacman = game.pacman;
        pacman.setLocation(game.getWidth() / 2, 240);
        pacman.direction = Direction.EAST;
        const ghost: Ghost = game.getGhost(0);
        ghost.setLocation(game.getWidth() / 2 - 3 * PacmanGame.SPRITE_SIZE, 240);
        ghost.direction = Direction.EAST;
    }

    leaving(game: Game) {
        game.canvas.removeEventListener('touchstart', this.handleStart, false);
    }

    private getGame(): PacmanGame {
        return <PacmanGame>this.game;
    }

    handleStart() {
        console.log('Yee, touch detected!');
        this._startGame();
    }

    render(ctx: CanvasRenderingContext2D) {

        let SCREEN_WIDTH: number = game.getWidth(),
            SCREEN_HEIGHT: number = game.getHeight(),
            charWidth: number = 9;

        this._renderStaticStuff(ctx);

        // Draw the menu "choice" arrow
        // " - 5" to account for differently sized choices
        let x: number = (SCREEN_WIDTH - charWidth * 15) / 2 - 5;
        let y: number = (SCREEN_HEIGHT - 15 * 2) / 2;
        this.getGame().drawString(x, y + this._choice * 15, '>');

        // Draw the small and big dots
        x += charWidth * 1.5;
        y = 200;
        game.canvas.getContext('2d').fillStyle = '#ffffff';
        game.drawSmallDot(x + 3, y + 2);
        y += 9;
        game.drawBigDot(x, y);

        // Draw the sprites
        game.pacman.render(ctx);
        game.getGhost(0).paint(ctx);

        if (!game.audio.isInitialized()) {
            this._renderNoSoundMessage();
        }
    }

    _stringWidth(str: string): number {
        return game.assets.get('font').cellW * str.length;
    }

    _renderNoSoundMessage() {

        let w: number = game.getWidth();

        let text: string = 'SOUND IS DISABLED AS';
        let x: number = (w - this._stringWidth(text)) / 2;
        let y: number = game.getHeight() - 20 - 9 * 3;
        this.getGame().drawString(x, y, text);
        text = 'YOUR BROWSER DOES NOT';
        x = ( w - this._stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
        text = 'SUPPORT WEB AUDIO';
        x = (w - this._stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
    }

    // TODO: Move this stuff into an image that gets rendered each frame?
    _renderStaticStuff(ctx: CanvasRenderingContext2D) {

        const game: Game = this.game;
        game.clearScreen('rgb(0,0,0)');
        const SCREEN_WIDTH: number = game.getWidth();
        const charWidth: number = 9;

        // Render the "scores" stuff at the top.
        (<PacmanGame>game).drawScores(ctx);
        (<PacmanGame>game).drawScoresHeaders(ctx);

        // Title image
        let titleImage: Image = game.assets.get('title');
        let x: number = (SCREEN_WIDTH - titleImage.width) / 2;
        let y: number = titleImage.height * 1.2;
        titleImage.draw(ctx, x, y);

        // Game menu
        let temp: string = 'STANDARD MAZE';
        let charCount: number = temp.length - 1; // "-1" for selection arrow
        // " - 5" to account for differently sized choices
        x = (SCREEN_WIDTH - charWidth * charCount) / 2 - 5;
        y = (game.getHeight() - 15 * 2) / 2;
        this.getGame().drawString(x, y, temp, ctx);
        temp = 'ALTERNATE MAZE';
        y += 15;
        this.getGame().drawString(x, y, temp, ctx);

        // Scores for the dot types
        x += charWidth * 2;
        temp = '10 POINTS';
        charCount = temp.length - 2; // "-2" for animated dots
        y = 200;
        this.getGame().drawString(x, y, temp, ctx);
        temp = '50 POINTS';
        y += 9;
        this.getGame().drawString(x, y, temp, ctx);

        // Copyright
        temp = '2015 OLD MAN GAMES';
        x = (SCREEN_WIDTH - charWidth * temp.length) / 2;
        y = game.getHeight() - 20;
        this.getGame().drawString(x, y, temp, ctx);
    }

    _startGame() {
        game.startGame(this._choice);
    }

    update(delta: number) {

        this.handleDefaultKeys();

        let playTime: number = game.playTime;
        if (playTime > this._lastKeypressTime + _BaseState.INPUT_REPEAT_MILLIS + 100) {

            let im: InputManager = game.inputManager;

            if (im.up()) {
                this._choice = Math.abs(this._choice - 1);
                game.audio.playSound(Sounds.TOKEN);
                this._lastKeypressTime = playTime;
            }
            else if (im.down()) {
                this._choice = (this._choice + 1) % 2;
                game.audio.playSound(Sounds.TOKEN);
                this._lastKeypressTime = playTime;
            }
            else if (im.enter(true)) {
                this._startGame();
            }
        }

        let pacman: Pacman = game.pacman;
        let ghost: Ghost = game.getGhost(0);

        // Update the animated Pacman
        let moveAmount: number = pacman.moveAmount;
        if (pacman.direction === Direction.WEST) {
            moveAmount = -moveAmount;
        }
        pacman.incX(moveAmount);
        moveAmount = ghost.moveAmount;
        if (ghost.direction === Direction.WEST) {
            moveAmount = -moveAmount;
        }
        ghost.incX(moveAmount);

        // Check whether it's time to turn around
        if (pacman.x + pacman.width >= this.game.getWidth() - 30) {
            pacman.direction = ghost.direction = Direction.WEST;
        }
        else if (ghost.x <= 30) {
            pacman.direction = ghost.direction = Direction.EAST;
        }

        this._updateSpriteFrames();
    }
}
