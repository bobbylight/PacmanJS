var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pacman;
(function (pacman_1) {
    'use strict';
    var Substate;
    (function (Substate) {
        Substate[Substate["READY"] = 0] = "READY";
        Substate[Substate["IN_GAME"] = 1] = "IN_GAME";
        Substate[Substate["DYING"] = 2] = "DYING";
        Substate[Substate["GAME_OVER"] = 3] = "GAME_OVER";
    })(Substate || (Substate = {}));
    var MazeState = (function (_super) {
        __extends(MazeState, _super);
        function MazeState(mazeFile) {
            _super.call(this);
            this._mazeFile = mazeFile;
        }
        Object.defineProperty(MazeState, "DYING_FRAME_DELAY_MILLIS", {
            get: function () {
                return 75;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeState.prototype, "_readyDelayMillis", {
            get: function () {
                return this._firstTimeThrough ? 4500 : 2000;
            },
            enumerable: true,
            configurable: true
        });
        MazeState.prototype.enter = function () {
            game.pacman.reset();
            game.resetGhosts();
            this._maze = new pacman_1.Maze(this._mazeFile);
            this._firstTimeThrough = true;
            this._updateScoreIndex = -1;
            // Prevents the user's "Enter" press to start the game from being
            // picked up by our handleInput().
            this._lastMazeScreenKeypressTime = game.playTime + MazeState.INPUT_REPEAT_MILLIS;
            this._substate = Substate.READY;
            this._firstTimeThrough = true;
            this._substateStartTime = 0;
            this._nextDyingFrameTime = 0;
            this._nextUpdateTime = 0;
            this._lastSpriteFrameTime = 0;
        };
        MazeState.prototype._paintExtraLives = function (ctx) {
            // The indentation on either side of the status stuff at the bottom
            // (extra life count, possible fruits, etc.).
            var BOTTOM_INDENT = 24;
            var TILE_SIZE = 8;
            var lives = game.lives;
            if (lives > 0) {
                var x = BOTTOM_INDENT;
                var y = game.getHeight() - 2 * TILE_SIZE;
                var w = 2 * TILE_SIZE;
                for (var i = 0; i < lives; i++) {
                    game.drawSprite(x, y, 12 * 16, 3 * 16);
                    x += w;
                }
            }
        };
        MazeState.prototype._paintPossibleFruits = function (ctx) {
            // The indentation on either side of the status stuff at the bottom
            // (extra life count, possible fruits, etc.).
            var BOTTOM_INDENT = 12;
            var TILE_SIZE = pacman_1.PacmanGame.TILE_SIZE;
            var x = game.getWidth() - BOTTOM_INDENT - 2 * TILE_SIZE;
            var y = game.getHeight() - 2 * TILE_SIZE;
            switch (game.level) {
                default:
                case 7:
                    game.drawSprite(x - 112, y, 13 * 16, 3 * 16);
                // Fall through
                case 6:
                    game.drawSprite(x - 96, y, 13 * 16, 6 * 16);
                // Fall through
                case 5:
                    game.drawSprite(x - 80, y, 12 * 16, 6 * 16);
                // Fall through.
                case 4:
                    game.drawSprite(x - 64, y, 13 * 16, 2 * 16);
                // Fall through.
                case 3:
                    game.drawSprite(x - 48, y, 13 * 16, 5 * 16);
                // Fall through.
                case 2:
                    game.drawSprite(x - 32, y, 12 * 16, 5 * 16);
                // Fall through.
                case 1:
                    game.drawSprite(x - 16, y, 13 * 16, 4 * 16);
                // Fall through.
                case 0:
                    game.drawSprite(x, y, 12 * 16, 4 * 16);
                    break;
            }
        };
        MazeState.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
            this._maze.render(ctx);
            // "window.pacman" because of hoisting of pacman let below
            var TILE_SIZE = 8;
            var mazeY = game.getHeight() - 2 * TILE_SIZE -
                pacman_1.Maze.TILE_COUNT_VERTICAL * TILE_SIZE;
            ctx.translate(0, mazeY);
            game.drawFruit(ctx);
            var pacman = game.pacman;
            if (this._updateScoreIndex === -1) {
                if (this._substate !== Substate.GAME_OVER) {
                    pacman.render(ctx);
                }
            }
            else {
                var x = pacman.bounds.x;
                var y = pacman.bounds.y;
                game.paintPointsEarned(ctx, this._updateScoreIndex, x, y);
            }
            game.drawGhosts(ctx);
            ctx.translate(0, -mazeY);
            game.drawScores(ctx);
            this._paintExtraLives(ctx);
            this._paintPossibleFruits(ctx);
            if (this._substate === Substate.READY) {
                // These calculations should be fast enough, especially considering
                // that "READY!" is only displayed for about 4 seconds.
                var ready = 'READY!';
                var x = (game.getWidth() - ready.length * 9) / 2;
                // Give "Ready!" a little nudge to the right.  This is because the
                // ending '!' doesn't fill up the standard 8 pixels for a character,
                // so "READY!" looks slightly too far to the left without it.
                x += 3;
                game.drawString(x, 160, ready);
            }
            else if (this._substate === Substate.GAME_OVER) {
                var gameOver = 'GAME OVER';
                var x = (game.getWidth() - gameOver.length * 9) / 2;
                game.drawString(x, 160, gameOver);
            }
            if (game.paused) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
                ctx.globalAlpha = 1;
                ctx.fillRect(50, 100, game.getWidth() - 100, game.getHeight() - 200);
                var paused = 'PAUSED';
                var x = (game.getWidth() - paused.length * 9) / 2;
                game.drawString(x, (game.getHeight() - 18) / 2, paused);
            }
        };
        MazeState.prototype.reset = function () {
            this._maze.reset();
            game.resetPlayTime();
            game.pacman.reset();
            game.resetGhosts(); // Do AFTER resetting playtime!
            this._substate = Substate.READY;
            this._substateStartTime = 0; // Play time was just reset
            this._lastSpriteFrameTime = 0;
            // Prevents the user's "Enter" press to start the game from being
            // picked up by our handleInput().
            this._lastMazeScreenKeypressTime = game.playTime + MazeState.INPUT_REPEAT_MILLIS;
        };
        MazeState.prototype._handleInput = function (delta, time) {
            this.handleDefaultKeys();
            var input = game.inputManager;
            // Enter -> Pause.  Don't check for pausing on "Game Over" screen as
            // that will carry over into the next game!
            if (this._substate !== Substate.GAME_OVER && input.enter(true)) {
                game.paused = !game.paused;
                this._lastMazeScreenKeypressTime = time;
                return;
            }
            if (!game.paused) {
                switch (this._substate) {
                    case Substate.IN_GAME:
                        game.pacman.handleInput(this._maze);
                        break;
                    case Substate.GAME_OVER:
                        if (input.enter(true)) {
                            game.setState(new pacman.TitleState(game));
                        }
                        break;
                }
            }
            if (time >= this._lastMazeScreenKeypressTime + MazeState.INPUT_REPEAT_MILLIS) {
                // Hidden options (Z + keypress)
                if (!game.paused && this._substate === Substate.IN_GAME &&
                    input.isKeyDown(gtp.Keys.KEY_Z)) {
                    // Z+X => auto-load next level
                    if (input.isKeyDown(gtp.Keys.KEY_X)) {
                        game.loadNextLevel();
                        this._lastMazeScreenKeypressTime = time;
                    }
                    else if (input.isKeyDown(gtp.Keys.KEY_C)) {
                        if (this._substate !== Substate.DYING) {
                            game.startPacmanDying();
                            this._substate = Substate.DYING;
                            this._nextDyingFrameTime = time + MazeState.DYING_FRAME_DELAY_MILLIS;
                            this._lastMazeScreenKeypressTime = time;
                        }
                    }
                }
            }
        };
        MazeState.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
            // playTime may reset in handleInput, so we fetch it again afterward
            this._handleInput(delta, game.playTime);
            var time = game.playTime;
            switch (this._substate) {
                case Substate.READY:
                    if (this._firstTimeThrough && this._substateStartTime === 0) {
                        this._substateStartTime = time;
                        game.audio.playSound(pacman.Sounds.OPENING);
                    }
                    if (time >= this._substateStartTime + this._readyDelayMillis) {
                        this._substate = Substate.IN_GAME;
                        this._substateStartTime = time;
                        game.resetPlayTime();
                        this._lastMazeScreenKeypressTime = game.playTime;
                        game.setLoopedSound(pacman.Sounds.SIREN);
                        this._firstTimeThrough = false;
                    }
                    break;
                case Substate.IN_GAME:
                    this._updateInGameImpl(time);
                    break;
                case Substate.DYING:
                    if (time >= this._nextDyingFrameTime) {
                        if (!game.pacman.incDying()) {
                            if (game.increaseLives(-1) <= 0) {
                                this._substate = Substate.GAME_OVER;
                            }
                            else {
                                game.resetPlayTime();
                                this._lastMazeScreenKeypressTime = game.playTime;
                                game.pacman.reset();
                                game.resetGhosts(); // Do AFTER resetting play time!
                                this._substate = Substate.READY;
                                this._substateStartTime = 0; // Play time was just reset
                                this._lastSpriteFrameTime = 0;
                            }
                        }
                        else {
                            this._nextDyingFrameTime = time + MazeState.DYING_FRAME_DELAY_MILLIS;
                        }
                    }
                    break;
                case Substate.GAME_OVER:
                    // Do nothing
                    break;
            }
        };
        MazeState.prototype._updateInGameImpl = function (time) {
            // If Pacman is eating a ghost, add a slight delay
            if (this._nextUpdateTime > 0 && time < this._nextUpdateTime) {
                return;
            }
            this._nextUpdateTime = 0;
            this._updateScoreIndex = -1;
            // Don't update sprite frame at each rendered frame; that would be
            // too fast
            if (time >= this._lastSpriteFrameTime + 100) {
                this._lastSpriteFrameTime = time;
                game.updateSpriteFrames();
            }
            // Update Pacman's, ghosts', and possibly fruit's positions
            game.updateSpritePositions(this._maze, time);
            // If Pacman hit a ghost, decide what to do
            var ghostHit = game.checkForCollisions();
            if (ghostHit) {
                switch (ghostHit.motionState) {
                    case pacman_1.MotionState.BLUE:
                        this._nextUpdateTime = time + pacman_1.PacmanGame.SCORE_DISPLAY_LENGTH;
                        ghostHit.motionState = pacman_1.MotionState.EYES;
                        this._updateScoreIndex = game.ghostEaten(ghostHit);
                        break;
                    case pacman_1.MotionState.EYES:
                    case pacman_1.MotionState.EYES_ENTERING_BOX:
                        // Do nothing
                        break;
                    default:
                        if (!game.godMode) {
                            game.startPacmanDying();
                            this._substate = Substate.DYING;
                            this._nextDyingFrameTime = game.playTime + MazeState.DYING_FRAME_DELAY_MILLIS;
                        }
                        break;
                }
            }
        };
        return MazeState;
    })(pacman_1._BaseState);
    pacman_1.MazeState = MazeState;
})(pacman || (pacman = {}));

//# sourceMappingURL=MazeState.js.map
