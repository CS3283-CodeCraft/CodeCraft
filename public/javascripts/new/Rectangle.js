Point = require('./Point');

// Rectangles //////////////////////////////////////////////////////////

// Rectangle instance creation:

var Rectangle = Class.create({

    initialize: function(left, top, right, bottom) {
        this.init(new Point((left || 0), (top || 0)),
        new Point((right || 0), (bottom || 0)));
    },

    instanceOf : function(className){
        var a = this.constructor;
        return instanceOf(a, className);
    },

    init: function (originPoint, cornerPoint) {
        this.origin = originPoint;
        this.corner = cornerPoint;
    },

    // Rectangle string representation: e.g. '[0@0 | 160@80]'

    toString: function () {
        return '[' + this.origin.toString() + ' | ' +
            this.extent().toString() + ']';
    },

    // Rectangle copying:

    copy: function () {
        return new Rectangle(
            this.left(),
            this.top(),
            this.right(),
            this.bottom()
        );
    },


    // Rectangle accessing - setting:

    setTo: function (left, top, right, bottom) {
        // note: all inputs are optional and can be omitted

        this.origin = new Point(
            left || ((left === 0) ? 0 : this.left()),
            top || ((top === 0) ? 0 : this.top())
        );

        this.corner = new Point(
            right || ((right === 0) ? 0 : this.right()),
            bottom || ((bottom === 0) ? 0 : this.bottom())
        );
    },

    // Rectangle accessing - getting:

    area: function () {
        //requires width() and height() to be defined
        var w = this.width();
        if (w < 0) {
            return 0;
        }
        return Math.max(w * this.height(), 0);
    },

    bottom: function () {
        return this.corner.y;
    },

    bottomCenter: function () {
        return new Point(this.center().x, this.bottom());
    },

    bottomLeft: function () {
        return new Point(this.origin.x, this.corner.y);
    },

    bottomRight: function () {
        return this.corner.copy();
    },

    boundingBox: function () {
        return this;
    },

    center: function () {
        return this.origin.add(
            this.corner.subtract(this.origin).floorDivideBy(2)
        );
    },

    corners: function () {
        return [this.origin,
            this.bottomLeft(),
            this.corner,
            this.topRight()];
    },

    extent: function () {
        return this.corner.subtract(this.origin);
    },

    height: function () {
        return this.corner.y - this.origin.y;
    },

    left: function () {
        return this.origin.x;
    },

    leftCenter: function () {
        return new Point(this.left(), this.center().y);
    },

    right: function () {
        return this.corner.x;
    },

    rightCenter: function () {
        return new Point(this.right(), this.center().y);
    },

    top: function () {
        return this.origin.y;
    },

    topCenter: function () {
        return new Point(this.center().x, this.top());
    },

    topLeft: function () {
        return this.origin;
    },

    topRight: function () {
        return new Point(this.corner.x, this.origin.y);
    },

    width: function () {
        return this.corner.x - this.origin.x;
    },

    position: function () {
        return this.origin;
    },

    // Rectangle comparison:

    eq: function (aRect) {
        return this.origin.eq(aRect.origin) &&
            this.corner.eq(aRect.corner);
    },

    abs: function () {
        var newOrigin, newCorner, rect;
        rect = new Rectangle(0,0,0,0);
        newOrigin = this.origin.abs();
        newCorner = this.corner.max(newOrigin);
        return newOrigin.corner(rect, newCorner);
    },

    // Rectangle functions:

    insetBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.add(delta);
        result.corner = this.corner.subtract(delta);
        return result;
    },

    expandBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.subtract(delta);
        result.corner = this.corner.add(delta);
        return result;
    },

    growBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.copy();
        result.corner = this.corner.add(delta);
        return result;
    },

    intersect: function (aRect) {
        var result = new Rectangle();
        result.origin = this.origin.max(aRect.origin);
        result.corner = this.corner.min(aRect.corner);
        return result;
    },

    merge: function (aRect) {
        var result = new Rectangle();
        result.origin = this.origin.min(aRect.origin);
        result.corner = this.corner.max(aRect.corner);
        return result;
    },

    mergeWith: function (aRect) {
        // mutates myself
        this.origin = this.origin.min(aRect.origin);
        this.corner = this.corner.max(aRect.corner);
    },

    round: function () {
        rect = new Rectangle(0,0,0,0);
        return this.origin.round().corner(rect, this.corner.round());
    },

    spread: function () {
        // round me by applying floor() to my origin and ceil() to my corner
        rect = new Rectangle(0,0,0,0);
        return this.origin.floor().corner(rect, this.corner.ceil());
    },

    amountToTranslateWithin: function (aRect) {
    /*
        Answer a Point, delta, such that self + delta is forced within
        aRectangle. when all of me cannot be made to fit, prefer to keep
        my topLeft inside. Taken from Squeak.
    */
        var dx = 0, dy = 0;

        if (this.right() > aRect.right()) {
            dx = aRect.right() - this.right();
        }
        if (this.bottom() > aRect.bottom()) {
            dy = aRect.bottom() - this.bottom();
        }
        if ((this.left() + dx) < aRect.left()) {
            dx = aRect.left() - this.left();
        }
        if ((this.top() + dy) < aRect.top()) {
            dy = aRect.top() - this.top();
        }
        return new Point(dx, dy);
    },

    // Rectangle testing:

    containsPoint: function (aPoint) {
        return this.origin.le(aPoint) && aPoint.lt(this.corner);
    },

    containsRectangle: function (aRect) {
        return aRect.origin.gt(this.origin) &&
            aRect.corner.lt(this.corner);
    },

    intersects: function (aRect) {
        var ro = aRect.origin, rc = aRect.corner;
        return (rc.x >= this.origin.x) &&
            (rc.y >= this.origin.y) &&
            (ro.x <= this.corner.x) &&
            (ro.y <= this.corner.y);
    },

    isNearTo: function (aRect, threshold) {
        var ro = aRect.origin, rc = aRect.corner, border = threshold || 0;
        return (rc.x + border >= this.origin.x) &&
            (rc.y  + border >= this.origin.y) &&
            (ro.x - border <= this.corner.x) &&
            (ro.y - border <= this.corner.y);
    },

    // Rectangle transforming:

    scaleBy: function (scale) {
        // scale can be either a Point or a scalar
        var o = this.origin.multiplyBy(scale),
            c = this.corner.multiplyBy(scale);
        return new Rectangle(o.x, o.y, c.x, c.y);
    },

    translateBy: function (factor) {
        // factor can be either a Point or a scalar
        var o = this.origin.add(factor),
            c = this.corner.add(factor);
        return new Rectangle(o.x, o.y, c.x, c.y);
    },

    // Rectangle converting:

    asArray: function () {
        return [this.left(), this.top(), this.right(), this.bottom()];
    },

    asArray_xywh: function () {
        return [this.left(), this.top(), this.width(), this.height()];
    }
});

Rectangle.className = 'Rectangle';

module.exports = Rectangle;