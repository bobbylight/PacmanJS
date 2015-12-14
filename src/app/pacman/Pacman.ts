module pacman {
  'use strict';

  export class Pacman extends _BaseSprite {

    _dyingFrame: number;

    constructor() {
      super(3);
      this._dyingFrame = 0;
    }

    render(ctx: CanvasRenderingContext2D) {

      var SPRITE_SIZE = 16;

      var x = this.bounds.x;
      var y = this.bounds.y;

      var srcX: number,
          srcY: number;
      if (this._dyingFrame > 0) {
         srcX = SPRITE_SIZE * this._dyingFrame;
         srcY = 96;
      }
      else {
         srcX = this.direction * SPRITE_SIZE * this.getFrameCount() +
               this.getFrame() * SPRITE_SIZE;
         srcY = 80;
      }

      game.drawSprite(x,y, srcX,srcY);
    }

    reset() {

      var TILE_SIZE = 8;

      super.reset();
      this.direction = Direction.WEST;
      this.setLocation(13 * TILE_SIZE, 24 * TILE_SIZE - TILE_SIZE / 2);
      this._frame = 0;
    }

    setLocation(x: number, y: number) {
      super.setLocation(x, y);
    }
  }
}
