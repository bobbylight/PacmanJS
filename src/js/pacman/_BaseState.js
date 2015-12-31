var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var _BaseState = (function (_super) {
        __extends(_BaseState, _super);
        /**
         * Functionality common amongst all states in this game.
         * @constructor
         */
        function _BaseState(args) {
            _super.call(this, args);
        }
        _BaseState.prototype.createScreenshot = function () {
            var canvas = gtp.ImageUtils.createCanvas(game.getWidth(), game.getHeight());
            var ctx = canvas.getContext('2d');
            this.render(ctx);
            return canvas;
        };
        Object.defineProperty(_BaseState, "INPUT_REPEAT_MILLIS", {
            get: function () {
                return 200;
            },
            enumerable: true,
            configurable: true
        });
        _BaseState.prototype.handleDefaultKeys = function (time) {
            time = time || this.game.playTime;
            var im = this.game.inputManager;
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
        };
        return _BaseState;
    })(gtp.State);
    pacman._BaseState = _BaseState;
})(pacman || (pacman = {}));

//# sourceMappingURL=_BaseState.js.map
