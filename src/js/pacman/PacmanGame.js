var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    var PacmanGame = (function (_super) {
        __extends(PacmanGame, _super);
        function PacmanGame(args) {
            _super.call(this, args);
            this._highScore = 0;
            this.pacman = new pacman.Pacman();
        }
        PacmanGame.prototype.drawBigDot = function (x, y) {
            var ms = this.playTime;
            if (ms < 0 || (ms % 500) > 250) {
                var ctx = this.canvas.getContext('2d');
                var sx = 135, sy = 38;
                game.assets.get('sprites').drawScaled2(ctx, sx, sy, 8, 8, x, y, 8, 8);
            }
        };
        PacmanGame.prototype.drawScores = function (ctx) {
            var scoreStr = this._score.toString();
            var x = 55 - scoreStr.length * 8;
            var y = 10;
            this.drawString(x, y, scoreStr, ctx);
            scoreStr = this._highScore.toString();
            x = 132 - scoreStr.length * 8;
            this.drawString(x, y, scoreStr, ctx);
        };
        PacmanGame.prototype.drawSmallDot = function (x, y) {
            var ctx = this.canvas.getContext('2d');
            ctx.fillRect(x, y, 2, 2);
        };
        PacmanGame.prototype.drawSprite = function (dx, dy, sx, sy) {
            var image = game.assets.get('sprites');
            var ctx = this.canvas.getContext('2d');
            image.drawScaled2(ctx, sx, sy, 16, 16, dx, dy, 16, 16);
        };
        PacmanGame.prototype.drawString = function (x, y, text, ctx) {
            if (ctx === void 0) { ctx = game.canvas.getContext('2d'); }
            var str = text.toString(); // Allow us to pass in stuff like numerics
            // Note we have a gtp.SpriteSheet, not a gtp.BitmapFont, so our
            // calculation of what sub-image to draw is a little convoluted
            var fontImage = this.assets.get('font');
            var alphaOffs = 'A'.charCodeAt(0);
            var numericOffs = '0'.charCodeAt(0);
            var index;
            for (var i = 0; i < str.length; i++) {
                var ch = str[i];
                var chCharCode = str.charCodeAt(i);
                if (ch >= 'A' && ch <= 'Z') {
                    index = fontImage.colCount + (chCharCode - alphaOffs);
                }
                else if (ch >= '0' && ch <= '9') {
                    index = chCharCode - numericOffs;
                }
                else {
                    switch (ch) {
                        case '-':
                            index = 10;
                            break;
                        case '.':
                            index = 11;
                            break;
                        case '>':
                            index = 12;
                            break;
                        case '@':
                            index = 13;
                            break;
                        case '!':
                            index = 14;
                            break;
                        default:
                            index = 15; // whitespace
                            break;
                    }
                }
                fontImage.drawByIndex(ctx, x, y, index);
                x += 9; //CHAR_WIDTH
            }
        };
        Object.defineProperty(PacmanGame.prototype, "level", {
            get: function () {
                return this._level;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame.prototype, "lives", {
            get: function () {
                return this._lives;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Paints the "points earned," for example, when PacMan eats a ghost or
         * fruit.
         *
         * @param {CanvasContext2D} ctx The graphics context to use.
         * @param {int} ptsIndex The index into the points array.
         * @param {int} dx The x-coordinate at which to draw.
         * @param {int} dy The y-coordinate at which to draw.
         */
        PacmanGame.prototype.paintPointsEarned = function (ctx, ptsIndex, dx, dy) {
            'use strict';
            //         var y = 9 * ptsIndex;
            //         this._ptsImage.drawScaled2(ctx, 0,y, 17,9, dx,dy, 17,9);
        };
        PacmanGame.prototype.startGame = function (level) {
            this._lives = 3;
            this._score = 0;
            this._level = 0;
            var levelData = game.assets.get('levels')[level];
            var mazeState = new pacman.MazeState(levelData);
            //this.setState(new gtp.FadeOutInState(this.state, mazeState));
            this.setState(mazeState); // The original did not fade in/out
        };
        return PacmanGame;
    })(gtp.Game);
    pacman.PacmanGame = PacmanGame;
})(pacman || (pacman = {}));

//# sourceMappingURL=PacmanGame.js.map
