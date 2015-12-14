var pacman;
(function (pacman) {
    'use strict';
    var _BaseSprite = (function () {
        function _BaseSprite(frameCount) {
            this.bounds = new gtp.Rectangle();
            this._intersectBounds = new gtp.Rectangle();
            this.direction = pacman.Direction.EAST;
            this._frame = 0;
            this._frameCount = frameCount;
            this._lastUpdateTime = 0;
        }
        _BaseSprite.prototype.getFrame = function () {
            return this._frame;
        };
        _BaseSprite.prototype.getFrameCount = function () {
            return this._frameCount;
        };
        _BaseSprite.prototype.reset = function () {
            this._lastUpdateTime = 0;
        };
        _BaseSprite.prototype.setLocation = function (x, y) {
            this.bounds.x = x;
            this.bounds.y = y;
        };
        return _BaseSprite;
    })();
    pacman._BaseSprite = _BaseSprite;
})(pacman || (pacman = {}));

//# sourceMappingURL=_BaseSprite.js.map
