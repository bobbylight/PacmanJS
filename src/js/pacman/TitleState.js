var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var TitleState = (function (_super) {
        __extends(TitleState, _super);
        /**
             * State that renders the title screen.
             * @constructor
             */
        function TitleState(args) {
            _super.call(this, args);
        }
        TitleState.prototype.init = function () {
            _super.prototype.init.call(this);
            game.canvas.addEventListener('touchstart', this.handleStart, false);
            this._delay = new gtp.Delay({ millis: [600, 400] });
            this._blink = true;
            this._choice = 0;
        };
        TitleState.prototype.leaving = function (game) {
            game.canvas.removeEventListener('touchstart', this.handleStart, false);
        };
        TitleState.prototype.handleStart = function () {
            console.log('Yee, touch detected!');
            this._startGame();
        };
        TitleState.prototype.update = function (delta) {
            this.handleDefaultKeys();
            if (this._delay.update(delta)) {
                this._delay.reset();
                this._blink = !this._blink;
            }
            var im = game.inputManager;
            if (im.up(true)) {
                this._choice = Math.abs(this._choice - 1);
                game.audio.playSound(pacman.Sounds.TOKEN);
            }
            else if (im.down(true)) {
                this._choice = (this._choice + 1) % 2;
                game.audio.playSound(pacman.Sounds.TOKEN);
            }
            else if (im.enter(true)) {
                this._startGame();
            }
        };
        TitleState.prototype.render = function (ctx) {
            var SCREEN_WIDTH = game.getWidth(), SCREEN_HEIGHT = game.getHeight(), charWidth = 9;
            this._renderStaticStuff(ctx);
            // Draw the menu "choice" arrow
            // " - 5" to account for differently sized choices
            var x = (SCREEN_WIDTH - charWidth * 15) / 2 - 5;
            var y = (SCREEN_HEIGHT - 15 * 2) / 2;
            this.getGame().drawString(x, y + this._choice * 15, '>');
            // Draw the small and big dots
            x += charWidth * 1.5;
            y = 200;
            game.canvas.getContext('2d').fillStyle = '#ffffff';
            game.drawSmallDot(x + 3, y + 2);
            y += 9;
            game.drawBigDot(x, y);
            if (!game.audio.isInitialized()) {
                this._renderNoSoundMessage();
            }
        };
        TitleState.prototype._stringWidth = function (str) {
            return game.assets.get('font').cellW * str.length;
        };
        TitleState.prototype._renderNoSoundMessage = function () {
            var w = game.getWidth();
            var text = 'SOUND IS DISABLED AS';
            var x = (w - this._stringWidth(text)) / 2;
            var y = game.getHeight() - 20 - 9 * 3;
            this.getGame().drawString(x, y, text);
            text = 'YOUR BROWSER DOES NOT';
            x = (w - this._stringWidth(text)) / 2;
            y += 9;
            this.getGame().drawString(x, y, text);
            text = 'SUPPORT WEB AUDIO';
            x = (w - this._stringWidth(text)) / 2;
            y += 9;
            this.getGame().drawString(x, y, text);
        };
        // TODO: Move this stuff into an image that gets rendered each frame?
        TitleState.prototype._renderStaticStuff = function (ctx) {
            var game = this.game;
            game.clearScreen('rgb(0,0,0)');
            var SCREEN_WIDTH = game.getWidth();
            var charWidth = 9;
            // Title image
            var titleImage = game.assets.get('title');
            var x = (SCREEN_WIDTH - titleImage.width) / 2;
            var y = titleImage.height * 1.2;
            titleImage.draw(ctx, x, y);
            // Game menu
            var temp = 'STANDARD MAZE';
            var charCount = temp.length - 1; // "-1" for selection arrow
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
        };
        TitleState.prototype._startGame = function () {
            game.startGame(this._choice);
        };
        TitleState.prototype.getGame = function () {
            return this.game;
        };
        return TitleState;
    })(pacman._BaseState);
    pacman.TitleState = TitleState;
})(pacman || (pacman = {}));

//# sourceMappingURL=TitleState.js.map
