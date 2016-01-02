module pacman {
	'use strict';

	export class _BaseState extends gtp.State {

		private _lastConfigKeypressTime: number;

		/**
		 * Functionality common amongst all states in this game.
		 * @constructor
		 */
		constructor(args?: gtp.Game | gtp.BaseStateArgs) {
			super(args);
		}

		createScreenshot(): HTMLCanvasElement {
			const canvas: HTMLCanvasElement = gtp.ImageUtils.createCanvas(
				game.getWidth(), game.getHeight());
			const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
			this.render(ctx);
			return canvas;
		}

		static get INPUT_REPEAT_MILLIS(): number {
      return 200;
    }

		handleDefaultKeys(time?: number) {

			time = time || this.game.playTime;
			const im: gtp.InputManager = this.game.inputManager;

			if (time > (this._lastConfigKeypressTime + _BaseState.INPUT_REPEAT_MILLIS)) {

				// Debugging actions
				if (im.shift()) {

					// Increase canvas size
					if (im.isKeyDown(gtp.Keys.KEY_P, true)) {
						if (!game.canvas.style.width) {
							game.canvas.style.width = game.canvas.width + 'px';
						}
						if (!game.canvas.style.height) {
							game.canvas.style.height = game.canvas.height + 'px';
						}
						game.canvas.style.width = (parseInt(game.canvas.style.width.substring(0, game.canvas.style.width.length - 2), 10) + 1) + 'px';
						game.canvas.style.height = (parseInt(game.canvas.style.height.substring(0, game.canvas.style.height.length - 2), 10) + 1) + 'px';
						game.setStatusMessage('Canvas size now: (' + game.canvas.style.width + ', ' + game.canvas.style.height + ')');
						this._lastConfigKeypressTime = time;
					}

					// Decrease canvas size
					else if (im.isKeyDown(gtp.Keys.KEY_L, true)) {
						if (!game.canvas.style.width) {
							game.canvas.style.width = game.canvas.width + 'px';
						}
						if (!game.canvas.style.height) {
							game.canvas.style.height = game.canvas.height + 'px';
						}
						game.canvas.style.width = (parseInt(game.canvas.style.width.substring(0, game.canvas.style.width.length - 2), 10) - 1) + 'px';
						game.canvas.style.height = (parseInt(game.canvas.style.height.substring(0, game.canvas.style.height.length - 2), 10) - 1) + 'px';
						game.setStatusMessage('Canvas size now: (' + game.canvas.style.width + ', ' + game.canvas.style.height + ')');
						this._lastConfigKeypressTime = time;
					}

					// Audio stuff
					else if (im.isKeyDown(gtp.Keys.KEY_M, true)) {
						game.toggleMuted();
						this._lastConfigKeypressTime = time;
					}

					else if (im.isKeyDown(gtp.Keys.KEY_G, true)) {
						game.toggleGodMode();
						this._lastConfigKeypressTime = time;
					}
				}

			}

		}
	}

}
