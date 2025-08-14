import { BaseStateArgs, InputManager, Keys, State, Utils } from 'gtp';
import { PacmanGame } from './PacmanGame';

export class BaseState extends State<PacmanGame> {

    private lastConfigKeypressTime: number;
    protected lastSpriteFrameTime: number;

    /**
     * Functionality common amongst all states in this game.
     */
    constructor(args?: PacmanGame | BaseStateArgs<PacmanGame>) {
        super(args);
        this.lastConfigKeypressTime = Utils.timestamp();
        this.lastSpriteFrameTime = 0;
    }

    static get INPUT_REPEAT_MILLIS(): number {
        return 200;
    }

    protected handleDefaultKeys() {

        // We use a timestamp instead of game.playTime since game.playTime gets
        // reset, which messes us up
        const time: number = Utils.timestamp(); // this.game.playTime;
        const game = this.game;
        const im: InputManager = game.inputManager;

        if (time > (this.lastConfigKeypressTime + BaseState.INPUT_REPEAT_MILLIS)) {

            // Audio stuff
            if (im.isKeyDown(Keys.KEY_M, true)) {
                game.toggleMuted();
                this.lastConfigKeypressTime = time;
            }

            // Debugging actions
            if (im.isKeyDown(Keys.KEY_Z)) {

                // Increase canvas size
                if (im.isKeyDown(Keys.KEY_P, true)) {
                    const style: CSSStyleDeclaration = game.canvas.style;
                    if (!style.width) {
                        style.width = `${game.canvas.width}px`;
                    }
                    if (!style.height) {
                        style.height = `${game.canvas.height}px`;
                    }
                    style.width = `${parseInt(style.width.substring(0, style.width.length - 2), 10) + 1}px`;
                    style.height = `${parseInt(style.height.substring(0, style.height.length - 2), 10) + 1}px`;
                    game.setStatusMessage(`Canvas size now: (${style.width}, ${style.height})`);
                    this.lastConfigKeypressTime = time;
                }

                // Decrease canvas size
                else if (im.isKeyDown(Keys.KEY_L, true)) {
                    const style: CSSStyleDeclaration = game.canvas.style;
                    if (!style.width) {
                        style.width = `${game.canvas.width}px`;
                    }
                    if (!style.height) {
                        style.height = `${game.canvas.height}px`;
                    }
                    style.width = `${parseInt(style.width.substring(0, style.width.length - 2), 10) - 1}px`;
                    style.height = `${parseInt(style.height.substring(0, style.height.length - 2), 10) - 1}px`;
                    game.setStatusMessage(`Canvas size now: (${style.width}, ${style.height})`);
                    this.lastConfigKeypressTime = time;
                }

                else if (im.isKeyDown(Keys.KEY_G, true)) {
                    game.toggleGodMode();
                    this.lastConfigKeypressTime = time;
                }

                else if (im.isKeyDown(Keys.KEY_S, true)) {
                    game.toggleStretchMode();
                }
            }

        }

    }

    protected updateSpriteFrames() {
        const time: number = this.game.playTime;
        // Don't update sprite frame at each rendered frame; that would be
        // too fast
        if (time >= this.lastSpriteFrameTime + 100) {
            this.lastSpriteFrameTime = time;
            this.game.updateSpriteFrames();
        }
    }

}
