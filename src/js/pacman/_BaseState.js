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
            this._lastConfigKeypressTime = gtp.Utils.timestamp();
            this._lastSpriteFrameTime = 0;
        }
        Object.defineProperty(_BaseState, "INPUT_REPEAT_MILLIS", {
            get: function () {
                return 200;
            },
            enumerable: true,
            configurable: true
        });
        _BaseState.prototype.handleDefaultKeys = function () {
            // We use a timestamp instead of game.playTime since game.playTime gets
            // reset, which messes us up
            var time = gtp.Utils.timestamp(); // this.game.playTime;
            var im = this.game.inputManager;
            if (time > (this._lastConfigKeypressTime + _BaseState.INPUT_REPEAT_MILLIS)) {
                // Audio stuff
                if (im.isKeyDown(gtp.Keys.KEY_M, true)) {
                    game.toggleMuted();
                    this._lastConfigKeypressTime = time;
                }
                // Debugging actions
                if (im.isKeyDown(gtp.Keys.KEY_Z)) {
                    // Increase canvas size
                    if (im.isKeyDown(gtp.Keys.KEY_P, true)) {
                        var style = game.canvas.style;
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
                    else if (im.isKeyDown(gtp.Keys.KEY_L, true)) {
                        var style = game.canvas.style;
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
                    else if (im.isKeyDown(gtp.Keys.KEY_G, true)) {
                        game.toggleGodMode();
                        this._lastConfigKeypressTime = time;
                    }
                    else if (im.isKeyDown(gtp.Keys.KEY_S, true)) {
                        game.toggleStretchMode();
                    }
                }
            }
        };
        _BaseState.prototype._updateSpriteFrames = function () {
            var time = game.playTime;
            // Don't update sprite frame at each rendered frame; that would be
            // too fast
            if (time >= this._lastSpriteFrameTime + 100) {
                this._lastSpriteFrameTime = time;
                game.updateSpriteFrames();
            }
        };
        return _BaseState;
    })(gtp.State);
    pacman._BaseState = _BaseState;
})(pacman || (pacman = {}));

//# sourceMappingURL=_BaseState.js.map
