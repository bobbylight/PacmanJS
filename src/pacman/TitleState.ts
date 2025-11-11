import { Game, Image, InputManager, SpriteSheet } from 'gtp';
import { BaseState } from './BaseState';
import { PacmanGame } from './PacmanGame';
import { Pacman } from './Pacman';
import { Direction } from './Direction';
import { Ghost } from './Ghost';
import { SOUNDS } from './Sounds';
import { SPRITE_SIZE } from './Constants';

export class TitleState extends BaseState {

    private choice: number;
    private lastKeypressTime: number;

    /**
     * State that renders the title screen.
     */
    constructor(args: PacmanGame) {

        super(args);
        // Initialize our sprites not just in enter() so they are positioned
        // correctly while FadeOutInState is running
        this.initSprites(args);
    }

    override enter(game: PacmanGame) {
        this.game = game;
        super.enter(game);

        game.canvas.addEventListener('touchstart', this.handleStart.bind(this), { capture: false, passive: true });
        this.choice = 0;
        this.lastKeypressTime = game.playTime;

        this.initSprites(game);
    }

    private initSprites(game: PacmanGame) {
        const pacman: Pacman = game.pacman;
        pacman.setLocation(game.getWidth() / 2, 240);
        pacman.direction = Direction.EAST;
        const ghost: Ghost = game.getGhost(0);
        ghost.setLocation(game.getWidth() / 2 - 3 * SPRITE_SIZE, 240);
        ghost.direction = Direction.EAST;
    }

    override leaving(game: Game) {
        game.canvas.removeEventListener('touchstart', this.handleStart.bind(this), false);
    }

    handleStart() {
        // console.log('Yee, touch detected!');
        this.startGame();
    }

    override render(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        const screenWidth: number = game.getWidth(),
            screenHeight: number = game.getHeight(),
            charWidth = 9;

        this.renderStaticStuff(ctx);

        // Draw the menu "choice" arrow
        // " - 5" to account for differently sized choices
        let x: number = (screenWidth - charWidth * 15) / 2 - 5;
        let y: number = (screenHeight - 15 * 2) / 2;
        this.game.drawString(x, y + this.choice * 15, '>');

        // Draw the small and big dots
        x += charWidth * 1.5;
        y = 200;
        game.getRenderingContext().fillStyle = '#ffffff';
        game.drawSmallDot(x + 3, y + 2);
        y += 9;
        game.drawBigDot(x, y);

        // Draw the sprites
        game.pacman.render(ctx);
        game.getGhost(0).paint(ctx);

        if (!game.audio.isInitialized()) {
            this.renderNoSoundMessage();
        }
    }

    private stringWidth(str: string): number {
        const font: SpriteSheet = this.game.assets.get('font');
        return font.cellW * str.length;
    }

    private renderNoSoundMessage() {

        const w: number = this.game.getWidth();

        let text = 'SOUND IS DISABLED AS';
        let x: number = (w - this.stringWidth(text)) / 2;
        let y: number = this.game.getHeight() - 20 - 9 * 3;
        this.game.drawString(x, y, text);
        text = 'YOUR BROWSER DOES NOT';
        x = (w - this.stringWidth(text)) / 2;
        y += 9;
        this.game.drawString(x, y, text);
        text = 'SUPPORT WEB AUDIO';
        x = (w - this.stringWidth(text)) / 2;
        y += 9;
        this.game.drawString(x, y, text);
    }

    // TODO: Move this stuff into an image that gets rendered each frame?
    private renderStaticStuff(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        game.clearScreen('rgb(0,0,0)');
        const screenHeight: number = game.getWidth();
        const charWidth = 9;

        // Render the "scores" stuff at the top.
        game.drawScores(ctx);
        game.drawScoresHeaders(ctx);

        // Title image
        const titleImage: Image = game.assets.get('title');
        let x: number = (screenHeight - titleImage.width) / 2;
        let y: number = titleImage.height * 1.2;
        titleImage.draw(ctx, x, y);

        // Game menu
        let temp = 'STANDARD MAZE';
        let charCount: number = temp.length - 1; // "-1" for selection arrow
        // " - 5" to account for differently sized choices
        x = (screenHeight - charWidth * charCount) / 2 - 5;
        y = (game.getHeight() - 15 * 2) / 2;
        this.game.drawString(x, y, temp, ctx);
        temp = 'ALTERNATE MAZE';
        y += 15;
        this.game.drawString(x, y, temp, ctx);

        // Scores for the dot types
        x += charWidth * 2;
        temp = '10 POINTS';
        charCount = temp.length - 2; // "-2" for animated dots
        y = 200;
        this.game.drawString(x, y, temp, ctx);
        temp = '50 POINTS';
        y += 9;
        this.game.drawString(x, y, temp, ctx);

        // Copyright
        temp = '2015 OLD MAN GAMES';
        x = (screenHeight - charWidth * temp.length) / 2;
        y = game.getHeight() - 20;
        this.game.drawString(x, y, temp, ctx);
    }

    private startGame() {
        this.game.startGame(this.choice);
    }

    override update(delta: number) {
        const game = this.game;
        this.handleDefaultKeys();

        const playTime: number = game.playTime;
        if (playTime > this.lastKeypressTime + BaseState.INPUT_REPEAT_MILLIS + 100) {

            const im: InputManager = game.inputManager;

            if (im.up()) {
                this.choice = Math.abs(this.choice - 1);
                game.audio.playSound(SOUNDS.TOKEN);
                this.lastKeypressTime = playTime;
            }
            else if (im.down()) {
                this.choice = (this.choice + 1) % 2;
                game.audio.playSound(SOUNDS.TOKEN);
                this.lastKeypressTime = playTime;
            }
            else if (im.enter(true)) {
                this.startGame();
            }
        }

        const pacman: Pacman = game.pacman;
        const ghost: Ghost = game.getGhost(0);

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

        this.updateSpriteFrames();
    }
}
