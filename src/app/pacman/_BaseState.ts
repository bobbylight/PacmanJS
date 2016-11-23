import {Keys} from 'gtp/dist/gtp/Keys';
import {State, BaseStateArgs} from 'gtp/dist/gtp/State';
import {Game} from 'gtp/dist/gtp/Game';
import {Utils} from 'gtp/dist/gtp/Utils';
import {InputManager} from 'gtp/dist/gtp/InputManager';
import {PacmanGame} from './PacmanGame';
declare var game: PacmanGame;

export class _BaseState extends State {

    private _lastConfigKeypressTime: number;
    protected _lastSpriteFrameTime: number;

    /**
     * Functionality common amongst all states in this game.
     * @constructor
     */
    constructor(args?: Game | BaseStateArgs) {
        super(args);
        this._lastConfigKeypressTime = Utils.timestamp();
        this._lastSpriteFrameTime = 0;
    }

    static get INPUT_REPEAT_MILLIS(): number {
        return 200;
    }

    protected handleDefaultKeys() {

        // We use a timestamp instead of game.playTime since game.playTime gets
        // reset, which messes us up
        const time: number = Utils.timestamp(); // this.game.playTime;
        const im: InputManager = this.game.inputManager;

        if (time > (this._lastConfigKeypressTime + _BaseState.INPUT_REPEAT_MILLIS)) {

            // Audio stuff
            if (im.isKeyDown(Keys.KEY_M, true)) {
                game.toggleMuted();
                this._lastConfigKeypressTime = time;
            }

            // Debugging actions
            if (im.isKeyDown(Keys.KEY_Z)) {

                // Increase canvas size
                if (im.isKeyDown(Keys.KEY_P, true)) {
                    const style: CSSStyleDeclaration = game.canvas.style;
                    if (!style.width) {
                        style.width = game.canvas.width + 'px';
                    }
                    if (!style.height) {
                        style.height = game.canvas.height + 'px';
                    }
                    style.width = (parseInt(style.width.substring(0, style.width.length - 2), 10) + 1) + 'px';
                    style.height = (parseInt(style.height.substring(0, style.height.length - 2), 10) + 1) + 'px';
                    game.setStatusMessage('Canvas size now: (' + style.width + ', ' + style.height + ')');
                    this._lastConfigKeypressTime = time;
                }

                // Decrease canvas size
                else if (im.isKeyDown(Keys.KEY_L, true)) {
                    const style: CSSStyleDeclaration = game.canvas.style;
                    if (!style.width) {
                        style.width = game.canvas.width + 'px';
                    }
                    if (!style.height) {
                        style.height = game.canvas.height + 'px';
                    }
                    style.width = (parseInt(style.width.substring(0, style.width.length - 2), 10) - 1) + 'px';
                    style.height = (parseInt(style.height.substring(0, style.height.length - 2), 10) - 1) + 'px';
                    game.setStatusMessage('Canvas size now: (' + style.width + ', ' + style.height + ')');
                    this._lastConfigKeypressTime = time;
                }

                else if (im.isKeyDown(Keys.KEY_G, true)) {
                    game.toggleGodMode();
                    this._lastConfigKeypressTime = time;
                }

                else if (im.isKeyDown(Keys.KEY_S, true)) {
                    game.toggleStretchMode();
                }
            }

        }

    }

    protected _updateSpriteFrames() {
        const time: number = game.playTime;
        // Don't update sprite frame at each rendered frame; that would be
        // too fast
        if (time >= this._lastSpriteFrameTime + 100) {
            this._lastSpriteFrameTime = time;
            game.updateSpriteFrames();
        }
    }

}
