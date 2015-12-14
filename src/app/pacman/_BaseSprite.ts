module pacman {
  'use strict';

  export class _BaseSprite {

    bounds: gtp.Rectangle;
    _intersectBounds: gtp.Rectangle;
    direction: Direction;
    _frame: number;
    _frameCount: number;
    _lastUpdateTime: number;

    constructor(frameCount: number) {
      this.bounds = new gtp.Rectangle();
      this._intersectBounds = new gtp.Rectangle();
      this.direction = Direction.EAST;
      this._frame = 0;
      this._frameCount = frameCount;
      this._lastUpdateTime = 0;
    }

    getFrame() {
       return this._frame;
    }

    getFrameCount() {
       return this._frameCount;
    }

    reset() {
       this._lastUpdateTime = 0;
    }

    setLocation(x: number,  y: number) {
       this.bounds.x = x;
       this.bounds.y = y;
    }
  }
}
