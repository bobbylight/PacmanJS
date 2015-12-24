var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman) {
    'use strict';
    (function (GhostUpdateStrategy) {
        GhostUpdateStrategy[GhostUpdateStrategy["UPDATE_ALL"] = 0] = "UPDATE_ALL";
        GhostUpdateStrategy[GhostUpdateStrategy["UPDATE_NONE"] = 1] = "UPDATE_NONE";
        GhostUpdateStrategy[GhostUpdateStrategy["UPDATE_ONE"] = 2] = "UPDATE_ONE";
    })(pacman.GhostUpdateStrategy || (pacman.GhostUpdateStrategy = {}));
    var GhostUpdateStrategy = pacman.GhostUpdateStrategy;
    var PacmanGame = (function (_super) {
        __extends(PacmanGame, _super);
        function PacmanGame(args) {
            _super.call(this, args);
            this._highScore = 0;
            this.pacman = new pacman.Pacman();
            this._ghosts = this._createGhostArray();
            this._chompSound = 0;
            this._ghostUpdateStrategy = GhostUpdateStrategy.UPDATE_ALL;
            this._extraPointsArray = [100, 200, 300, 400, 500, 700, 800,
                1000, 1600, 2000, 3000, 5000];
        }
        PacmanGame.prototype.addFruit = function () {
            // TODO
        };
        PacmanGame.prototype.checkForCollisions = function () {
            for (var i = 0; i < this._ghosts.length; i++) {
                if (this.pacman.intersects(this._ghosts[i])) {
                    return this._ghosts[i];
                }
            }
            // if (this._fruit && this._fruitScoreIndex === -1 &&
            //     this.pacman.intersects(this._fruit)) {
            // 	this.increaseScore(this._extraPointsArray[fruit.getPointsIndex()]);
            // 	this.audio.playSound(Sounds.SOUND_EATING_FRUIT, false);
            // 	this._fruitScoreIndex = this._fruit.getPointsIndex();
            // 	this._fruitScoreEndTime = game.playTime + PacmanGame.SCORE_DISPLAY_LENGTH;
            // }
            return null;
        };
        /**
         * Ensures the background sound effect being played is appropriate for
         * the ghosts' current states.
         */
        PacmanGame.prototype.checkLoopedSound = function () {
            if (this._resettingGhostStates) {
                return;
            }
            var blue = false;
            for (var i = 0; i < this._ghosts.length; i++) {
                if (this._ghosts[i].isEyes()) {
                    this.setLoopedSound(pacman.Sounds.EYES_RUNNING);
                    return; // "eye" noise trumps blue noise.
                }
                else if (this._ghosts[i].isBlue()) {
                    blue = true;
                }
            }
            this.setLoopedSound(blue ? pacman.Sounds.CHASING_GHOSTS : pacman.Sounds.SIREN);
        };
        /**
         * Creates the array of ghosts the game will use.
         *
         * @return The array of ghosts.
         */
        PacmanGame.prototype._createGhostArray = function () {
            var ghosts = [];
            this._resettingGhostStates = true;
            ghosts.push(new pacman.Blinky(this));
            // ghosts.push(new Pinky());
            // ghosts.push(new Inky());
            // ghosts.push(new Clyde());
            this._resettingGhostStates = false;
            return ghosts;
        };
        PacmanGame.prototype.drawBigDot = function (x, y) {
            var ms = this.playTime;
            if (ms < 0 || (ms % 500) > 250) {
                var ctx = this.canvas.getContext('2d');
                var sx = 135, sy = 38;
                game.assets.get('sprites').drawScaled2(ctx, sx, sy, 8, 8, x, y, 8, 8);
            }
        };
        /**
         * Paints all four ghosts in their present location and state.
         *
         * @param ctx The context with which to paint.
         */
        PacmanGame.prototype.drawGhosts = function (ctx) {
            this._ghosts.forEach(function (ghost) {
                ghost.paint(ctx);
            });
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
        Object.defineProperty(PacmanGame.prototype, "godMode", {
            get: function () {
                return this._godMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame, "EXTRA_LIFE_SCORE", {
            get: function () {
                return 10000;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(PacmanGame.prototype, "PENALTY_BOX_EXIT_X", {
            get: function () {
                return (this.getWidth() - PacmanGame.SPRITE_SIZE) / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame.prototype, "PENALTY_BOX_EXIT_Y", {
            get: function () {
                return 12 * PacmanGame.TILE_SIZE - PacmanGame.TILE_SIZE / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame, "SCORE_DISPLAY_LENGTH", {
            /**
             * Amount of time, in milliseconds, that points earned by Pacman should
             * be displayed (e.g. from eating a ghost or a fruit).
             */
            get: function () {
                return 750;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame, "SPRITE_SIZE", {
            get: function () {
                return 16;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PacmanGame, "TILE_SIZE", {
            get: function () {
                return 8;
            },
            enumerable: true,
            configurable: true
        });
        PacmanGame.prototype.ghostEaten = function (ghost) {
            switch (this._eatenGhostPointsIndex) {
                case 0:
                    this._eatenGhostPointsIndex = 1;
                    break;
                case 1:
                    this._eatenGhostPointsIndex = 3;
                    break;
                case 3:
                    this._eatenGhostPointsIndex = 6;
                    break;
                default: // Should never happen.
                case 6:
                    this._eatenGhostPointsIndex = 8;
                    break;
            }
            this.increaseScore(this._extraPointsArray[this._eatenGhostPointsIndex]);
            this.audio.playSound(pacman.Sounds.EATING_GHOST);
            return this._eatenGhostPointsIndex;
        };
        PacmanGame.prototype.increaseLives = function (amount) {
            return this._lives += amount;
        };
        PacmanGame.prototype.increaseScore = function (amount) {
            this._score += amount;
            if (!this._earnedExtraLife && this._score >= PacmanGame.EXTRA_LIFE_SCORE) {
                this.audio.playSound(pacman.Sounds.EXTRA_LIFE);
                this.increaseLives(1);
                this._earnedExtraLife = true;
            }
        };
        PacmanGame.prototype.loadNextLevel = function () {
            this.setLoopedSound(null);
            this._level++;
            //this.fruit = null;
            this._fruitScoreIndex = -1;
            this._fruitScoreEndTime = -1;
            var state = this.state;
            state.reset();
        };
        PacmanGame.prototype.makeGhostsBlue = function () {
            this._eatenGhostPointsIndex = 0;
            this._ghosts.forEach(function (ghost) {
                ghost.possiblyTurnBlue();
            });
            // Don't just change to "blue" sound as "eyes" sound trumps "blue".
            this.checkLoopedSound();
        };
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
        /**
         * Plays the next appropriate chomp sound.
         */
        PacmanGame.prototype.playChompSound = function () {
            this.audio.playSound(this._chompSound === 0 ?
                pacman.Sounds.CHOMP_1 : pacman.Sounds.CHOMP_2);
            this._chompSound = (this._chompSound + 1) % 2;
        };
        PacmanGame.prototype.resetGhosts = function () {
            this._resettingGhostStates = true;
            // Have each ghost go to one of four random corners while in scatter
            // mode, but ensure each ghost goes to a different corner.
            var corners = [
                new gtp.Point(2, 1),
                new gtp.Point(2, pacman.Maze.TILE_COUNT_HORIZONTAL - 2),
                new gtp.Point(pacman.Maze.TILE_COUNT_VERTICAL - 2, 1),
                new gtp.Point(pacman.Maze.TILE_COUNT_VERTICAL - 2, pacman.Maze.TILE_COUNT_HORIZONTAL - 2)
            ];
            var cornerSeed = gtp.Utils.randomInt(4);
            for (var i = 0; i < this._ghosts.length; i++) {
                this._ghosts[i].reset();
                this._ghosts[i].setCorner(corners[(cornerSeed + i) % 4]);
            }
            this._resettingGhostStates = false;
        };
        /**
         * Starts looping a sound effect.
         * @param {string} sound The sound effect to loop.
         */
        PacmanGame.prototype.setLoopedSound = function (sound) {
            if (sound !== this._loopedSoundName) {
                if (this._loopedSoundId != null) {
                    this.audio.stopSound(this._loopedSoundId);
                }
                this._loopedSoundName = sound;
                if (sound != null) {
                    this._loopedSoundId = game.audio.playSound(sound, true);
                }
                else {
                    this._loopedSoundId = null;
                }
            }
        };
        Object.defineProperty(PacmanGame.prototype, "ghostUpdateStrategy", {
            /**
             * Sets whether to update none, one, or all of the ghosts' positions
             * each frame.  This is used for debugging purposes.
             * @param state How many ghosts to update.
             */
            set: function (strategy) {
                this._ghostUpdateStrategy = strategy;
            },
            enumerable: true,
            configurable: true
        });
        PacmanGame.prototype.toggleGodMode = function () {
            this._godMode = !this._godMode;
            this.setStatusMessage('God mode ' + (this._godMode ? 'enabled' : 'disabled'));
            return this._godMode;
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
        PacmanGame.prototype.startPacmanDying = function () {
            this.setLoopedSound(null);
            this.audio.playSound(pacman.Sounds.DIES);
            this.pacman.startDying();
            // this.fruit = null;
            // this._fruitScoreIndex = -1;
            // this._fruitScoreEndTime = -1;
        };
        /**
         * Goes to the next animation frame for pacman, the ghosts and the
         * fruit.
         */
        PacmanGame.prototype.updateSpriteFrames = function () {
            this.pacman.updateFrame();
            this._ghosts.forEach(function (ghost) {
                ghost.updateFrame();
            });
        };
        /**
         * Updates the position of pacman, the ghosts and the fruit, in the
         * specified maze.
         * @param {Maze} maze The maze.
         * @param {number} time
         */
        PacmanGame.prototype.updateSpritePositions = function (maze, time) {
            // NOTE: We MUST update ghost positions before PacMan position.  This
            // is because pacman.upatePosition() can cause the engine's "playtime"
            // to reset to 0, which in turn will mess up the ghosts'
            // updatePosition() calls (since we're using a "cached" time to pass
            // to them).  This is seen when PacMan eats the last dot in a level
            // and the next level is loaded.
            switch (this._ghostUpdateStrategy) {
                case GhostUpdateStrategy.UPDATE_ALL:
                    this._ghosts.forEach(function (ghost) {
                        ghost.updatePosition(maze, time);
                    });
                    break;
                case GhostUpdateStrategy.UPDATE_NONE:
                    break;
                case GhostUpdateStrategy.UPDATE_ONE:
                    this._ghosts[0].updatePosition(maze, time);
                    break;
            }
            this.pacman.updatePosition(maze, time);
        };
        return PacmanGame;
    })(gtp.Game);
    pacman.PacmanGame = PacmanGame;
})(pacman || (pacman = {}));

//# sourceMappingURL=PacmanGame.js.map
