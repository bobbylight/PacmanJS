module pacman {
	'use strict';

	export class _BaseState extends gtp.State {

		/**
		 * Functionality common amongst all states in this game.
		 * @constructor
		 */
		constructor(args?: gtp.Game | gtp.BaseStateArgs) {
			super(args);
		}

		createScreenshot(): HTMLCanvasElement {
			var canvas = gtp.ImageUtils.createCanvas(game.getWidth(), game.getHeight());
			var ctx = canvas.getContext('2d');
			this.render(ctx);
			return canvas;
		}

		handleDefaultKeys() {

			var im = this.game.inputManager;

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
				}


				// Audio stuff
				else if (im.isKeyDown(gtp.Keys.KEY_M, true)) {
					game.toggleMuted();
				}

			}

		}

	}

}
