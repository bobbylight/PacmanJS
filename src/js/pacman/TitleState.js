var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
    var TitleState = (function (_super) {
        __extends(TitleState, _super);
        /**
             * State that renders the title screen.
             * @constructor
             */
        function TitleState(args) {
            _super.call(this, args);
            // Initialize our sprites not just in enter() so they are positioned
            // correctly while FadeOutInState is running
            this._initSprites();
        }
        TitleState.prototype.enter = function () {
            _super.prototype.enter.call(this, game);
            game.canvas.addEventListener('touchstart', this.handleStart, false);
            this._choice = 0;
            this._lastKeypressTime = game.playTime;
            this._initSprites();
        };
        TitleState.prototype._initSprites = function () {
            var pacman = game.pacman;
            pacman.setLocation(game.getWidth() / 2, 240);
            pacman.direction = pacman_1.Direction.EAST;
            var ghost = game.getGhost(0);
            ghost.setLocation(game.getWidth() / 2 - 3 * pacman_1.PacmanGame.SPRITE_SIZE, 240);
            ghost.direction = pacman_1.Direction.EAST;
        };
        TitleState.prototype.leaving = function (game) {
            game.canvas.removeEventListener('touchstart', this.handleStart, false);
        };
        TitleState.prototype.getGame = function () {
            return this.game;
        };
        TitleState.prototype.handleStart = function () {
            console.log('Yee, touch detected!');
            this._startGame();
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
            // Draw the sprites
            game.pacman.render(ctx);
            game.getGhost(0).paint(ctx);
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
            // Render the "scores" stuff at the top.
            game.drawScores(ctx);
            game.drawScoresHeaders(ctx);
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
        TitleState.prototype.update = function (delta) {
            this.handleDefaultKeys();
            var playTime = game.playTime;
            if (playTime > this._lastKeypressTime + pacman_1._BaseState.INPUT_REPEAT_MILLIS + 100) {
                var im = game.inputManager;
                if (im.up()) {
                    this._choice = Math.abs(this._choice - 1);
                    game.audio.playSound(pacman_1.Sounds.TOKEN);
                    this._lastKeypressTime = playTime;
                }
                else if (im.down()) {
                    this._choice = (this._choice + 1) % 2;
                    game.audio.playSound(pacman_1.Sounds.TOKEN);
                    this._lastKeypressTime = playTime;
                }
                else if (im.enter(true)) {
                    this._startGame();
                }
            }
            var pacman = game.pacman;
            var ghost = game.getGhost(0);
            // Update the animated Pacman
            var moveAmount = pacman.moveAmount;
            if (pacman.direction === pacman_1.Direction.WEST) {
                moveAmount = -moveAmount;
            }
            pacman.incX(moveAmount);
            moveAmount = ghost.moveAmount;
            if (ghost.direction === pacman_1.Direction.WEST) {
                moveAmount = -moveAmount;
            }
            ghost.incX(moveAmount);
            // Check whether it's time to turn around
            if (pacman.x + pacman.width >= this.game.getWidth() - 30) {
                pacman.direction = ghost.direction = pacman_1.Direction.WEST;
            }
            else if (ghost.x <= 30) {
                pacman.direction = ghost.direction = pacman_1.Direction.EAST;
            }
            pacman.updateFrame();
            ghost.updateFrame();
        };
        return TitleState;
    })(pacman_1._BaseState);
    pacman_1.TitleState = TitleState;
})(pacman || (pacman = {}));

//# sourceMappingURL=TitleState.js.map
