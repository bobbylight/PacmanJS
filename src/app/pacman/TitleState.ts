module pacman {
  'use strict';

  export class TitleState extends _BaseState {

    private _delay: gtp.Delay;
    private _blink: boolean;
    private _choice: number;

    /**
		 * State that renders the title screen.
		 * @constructor
		 */
      constructor(args?: pacman.PacmanGame | gtp.BaseStateArgs) {
        super(args);
      }

      init() {
        super.init();
        game.canvas.addEventListener('touchstart', this.handleStart, false);
        this._delay = new gtp.Delay({ millis: [ 600, 400 ] });
        this._blink = true;
        this._choice = 0;
      }

      leaving(game: gtp.Game) {
        game.canvas.removeEventListener('touchstart', this.handleStart, false);
      }

      handleStart() {
        console.log('Yee, touch detected!');
        this._startGame();
      }

      update(delta: number) {

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

      }

      render(ctx: CanvasRenderingContext2D) {

        var SCREEN_WIDTH = game.getWidth(),
            SCREEN_HEIGHT = game.getHeight(),
            charWidth = 9;

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
      }

      _stringWidth(str: string): number {
        return game.assets.get('font').cellW * str.length;
      }

      _renderNoSoundMessage() {

        var w = game.getWidth();

        var text = 'SOUND IS DISABLED AS';
        var x = (w - this._stringWidth(text)) / 2;
        var y = game.getHeight() - 20 - 9*3;
        this.getGame().drawString(x, y, text);
        text = 'YOUR BROWSER DOES NOT';
        x = ( w - this._stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
        text = 'SUPPORT WEB AUDIO';
        x = (w - this._stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
      }

      // TODO: Move this stuff into an image that gets rendered each frame?
      _renderStaticStuff(ctx: CanvasRenderingContext2D) {

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
      }

      _startGame() {
        game.startGame(this._choice);
      }

      private getGame(): PacmanGame {
        return <PacmanGame>this.game;
      }
  }
}
