(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Color = Class.create({
	
	initialize: function(r, g, b, a){
		this.className = 'Color';
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || ((a === 0) ? 0 : 1);
	},
	
	toString: function () {
		return 'rgba(' +
			Math.round(this.r) + ',' +
			Math.round(this.g) + ',' +
			Math.round(this.b) + ',' +
			this.a + ')';
	},

	copy: function () {
		return new Color(
			this.r,
			this.g,
			this.b,
			this.a
		);
	},

	// Color comparison:

	eq: function (aColor) {
	    // ==
	    return aColor &&
	        this.r === aColor.r &&
	        this.g === aColor.g &&
	        this.b === aColor.b;
	},

	// Color conversion (hsv):

	hsv: function () {
	    // ignore alpha
	    var max, min, h, s, v, d,
	        rr = this.r / 255,
	        gg = this.g / 255,
	        bb = this.b / 255;
	    max = Math.max(rr, gg, bb);
	    min = Math.min(rr, gg, bb);
	    h = max;
	    s = max;
	    v = max;
	    d = max - min;
	    s = max === 0 ? 0 : d / max;
	    if (max === min) {
	        h = 0;
	    } else {
	        switch (max) {
	        case rr:
	            h = (gg - bb) / d + (gg < bb ? 6 : 0);
	            break;
	        case gg:
	            h = (bb - rr) / d + 2;
	            break;
	        case bb:
	            h = (rr - gg) / d + 4;
	            break;
	        }
	        h /= 6;
	    }
	    return [h, s, v];
	},

	set_hsv: function (h, s, v) {
	    // ignore alpha, h, s and v are to be within [0, 1]
	    var i, f, p, q, t;
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	    case 0:
	        this.r = v;
	        this.g = t;
	        this.b = p;
	        break;
	    case 1:
	        this.r = q;
	        this.g = v;
	        this.b = p;
	        break;
	    case 2:
	        this.r = p;
	        this.g = v;
	        this.b = t;
	        break;
	    case 3:
	        this.r = p;
	        this.g = q;
	        this.b = v;
	        break;
	    case 4:
	        this.r = t;
	        this.g = p;
	        this.b = v;
	        break;
	    case 5:
	        this.r = v;
	        this.g = p;
	        this.b = q;
	        break;
	    }

	    this.r *= 255;
	    this.g *= 255;
	    this.b *= 255;

	},

	// Color mixing:

	mixed: function (proportion, otherColor) {
	    // answer a copy of this color mixed with another color, ignore alpha
	    var frac1 = Math.min(Math.max(proportion, 0), 1),
	        frac2 = 1 - frac1;
	    return new Color(
	        this.r * frac1 + otherColor.r * frac2,
	        this.g * frac1 + otherColor.g * frac2,
	        this.b * frac1 + otherColor.b * frac2
	    );
	},

	darker: function (percent) {
	    // return an rgb-interpolated darker copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(0, 0, 0));
	},

	lighter: function (percent) {
	    // return an rgb-interpolated lighter copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(255, 255, 255));
	},

	dansDarker: function () {
	    // return an hsv-interpolated darker copy of me, ignore alpha
	    var hsv = this.hsv(),
	        result = new Color(),
	        vv = Math.max(hsv[2] - 0.16, 0);
	    result.set_hsv(hsv[0], hsv[1], vv);
	    return result;
	}

})


module.exports = Color;
},{}],2:[function(require,module,exports){
// Nodes ///////////////////////////////////////////////////////////////

var Node = Class.create({

    initialize: function(parent, childrenArray){
        this.init(parent || null, childrenArray || []);
        this.className = 'Node';
    },

    init: function (parent, childrenArray) {
	    this.parent = parent || null;
	    this.children = childrenArray || [];
	},

	// Node string representation: e.g. 'a Node[3]'

	toString: function () {
	    return 'a Node' + '[' + this.children.length.toString() + ']';
	},

	// Node accessing:

	addChild: function (aNode) {
	    this.children.push(aNode);
	    aNode.parent = this;
	},

	addChildFirst: function (aNode) {
	    this.children.splice(0, null, aNode);
	    aNode.parent = this;
	},

	removeChild: function (aNode) {
	    var idx = this.children.indexOf(aNode);
	    if (idx !== -1) {
	        this.children.splice(idx, 1);
	    }
	},

	// Node functions:

	root: function () {
	    if (this.parent === null) {
	        return this;
	    }
	    return this.parent.root();
	},

	depth: function () {
	    if (this.parent === null) {
	        return 0;
	    }
	    return this.parent.depth() + 1;
	},

	allChildren: function () {
	    // includes myself
	    var result = [this];
	    this.children.forEach(function (child) {
	        result = result.concat(child.allChildren());
	    });
	    return result;
	},

	forAllChildren: function (aFunction) {
	    if (this.children.length > 0) {
	        this.children.forEach(function (child) {
	            child.forAllChildren(aFunction);
	        });
	    }
	    aFunction.call(null, this);
	},

	allLeafs: function () {
	    var result = [];
	    this.allChildren().forEach(function (element) {
	        if (element.children.length === 0) {
	            result.push(element);
	        }
	    });
	    return result;
	},

	allParents: function () {
	    // includes myself
	    var result = [this];
	    if (this.parent !== null) {
	        result = result.concat(this.parent.allParents());
	    }
	    return result;
	},

	siblings: function () {
	    var myself = this;
	    if (this.parent === null) {
	        return [];
	    }
	    return this.parent.children.filter(function (child) {
	        return child !== myself;
	    });
	},

	parentThatIsA: function (constructor) {
	    // including myself
	    if (this instanceof constructor) {
	        return this;
	    }
	    if (!this.parent) {
	        return null;
	    }
	    return this.parent.parentThatIsA(constructor);
	},

	parentThatIsAnyOf: function (constructors) {
	    // including myself
	    var yup = false,
	        myself = this;
	    constructors.forEach(function (each) {
	        if (myself.constructor === each) {
	            yup = true;
	            return;
	        }
	    });
	    if (yup) {
	        return this;
	    }
	    if (!this.parent) {
	        return null;
	    }
	    return this.parent.parentThatIsAnyOf(constructors);
	}

});

module.exports = Node;
},{}],3:[function(require,module,exports){
// Points //////////////////////////////////////////////////////////////

var Point = Class.create({
    
    initialize: function(x, y){
        this.className = 'Point';
        this.x = x || 0;
        this.y = y || 0;
    },

    // Point string representation: e.g. '12@68'

    toString: function () {
        return Math.round(this.x.toString()) +
            '@' + Math.round(this.y.toString());
    },

    // Point copying:

    copy: function () {
        return new Point(this.x, this.y);
    },

    // Point comparison:

    eq: function (aPoint) {
        // ==
        return this.x === aPoint.x && this.y === aPoint.y;
    },

    lt: function (aPoint) {
        // <
        return this.x < aPoint.x && this.y < aPoint.y;
    },

    gt: function (aPoint) {
        // >
        return this.x > aPoint.x && this.y > aPoint.y;
    },

    ge: function (aPoint) {
        // >=
        return this.x >= aPoint.x && this.y >= aPoint.y;
    },

    le: function (aPoint) {
        // <=
        return this.x <= aPoint.x && this.y <= aPoint.y;
    },

    max: function (aPoint) {
        return new Point(Math.max(this.x, aPoint.x),
            Math.max(this.y, aPoint.y));
    },

    min: function (aPoint) {
        return new Point(Math.min(this.x, aPoint.x),
            Math.min(this.y, aPoint.y));
    },

    // Point conversion:

    round: function () {
        return new Point(Math.round(this.x), Math.round(this.y));
    },

    abs: function () {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    },

    neg: function () {
        return new Point(-this.x, -this.y);
    },

    mirror: function () {
        return new Point(this.y, this.x);
    },

    floor: function () {
        return new Point(
            Math.max(Math.floor(this.x), 0),
            Math.max(Math.floor(this.y), 0)
        );
    },

    ceil: function () {
        return new Point(Math.ceil(this.x), Math.ceil(this.y));
    },

    // Point arithmetic:

    add: function (other) {
        if (other instanceof Point) {
            return new Point(this.x + other.x, this.y + other.y);
        }
        return new Point(this.x + other, this.y + other);
    },

    subtract: function (other) {
        if (other instanceof Point) {
            return new Point(this.x - other.x, this.y - other.y);
        }
        return new Point(this.x - other, this.y - other);
    },

    multiplyBy: function (other) {
        if (other instanceof Point) {
            return new Point(this.x * other.x, this.y * other.y);
        }
        return new Point(this.x * other, this.y * other);
    },

    divideBy: function (other) {
        if (other instanceof Point) {
            return new Point(this.x / other.x, this.y / other.y);
        }
        return new Point(this.x / other, this.y / other);
    },

    floorDivideBy: function (other) {
        if (other instanceof Point) {
            return new Point(Math.floor(this.x / other.x),
                Math.floor(this.y / other.y));
        }
        return new Point(Math.floor(this.x / other),
            Math.floor(this.y / other));
    },

    // Point polar coordinates:

    r: function () {
        var t = (this.multiplyBy(this));
        return Math.sqrt(t.x + t.y);
    },

    degrees: function () {
    /*
        answer the angle I make with origin in degrees.
        Right is 0, down is 90
    */
        var tan, theta;

        if (this.x === 0) {
            if (this.y >= 0) {
                return 90;
            }
            return 270;
        }
        tan = this.y / this.x;
        theta = Math.atan(tan);
        if (this.x >= 0) {
            if (this.y >= 0) {
                return degrees(theta);
            }
            return 360 + (degrees(theta));
        }
        return 180 + degrees(theta);
    },

    theta: function () {
    /*
        answer the angle I make with origin in radians.
        Right is 0, down is 90
    */
        var tan, theta;

        if (this.x === 0) {
            if (this.y >= 0) {
                return radians(90);
            }
            return radians(270);
        }
        tan = this.y / this.x;
        theta = Math.atan(tan);
        if (this.x >= 0) {
            if (this.y >= 0) {
                return theta;
            }
            return radians(360) + theta;
        }
        return radians(180) + theta;
    },

    // Point functions:

    crossProduct: function (aPoint) {
        return this.multiplyBy(aPoint.mirror());
    },

    distanceTo: function (aPoint) {
        return (aPoint.subtract(this)).r();
    },

    rotate: function (direction, center) {
        // direction must be 'right', 'left' or 'pi'
        var offset = this.subtract(center);
        if (direction === 'right') {
            return new Point(-offset.y, offset.y).add(center);
        }
        if (direction === 'left') {
            return new Point(offset.y, -offset.y).add(center);
        }
        // direction === 'pi'
        return center.subtract(offset);
    },

    flip: function (direction, center) {
        // direction must be 'vertical' or 'horizontal'
        if (direction === 'vertical') {
            return new Point(this.x, center.y * 2 - this.y);
        }
        // direction === 'horizontal'
        return new Point(center.x * 2 - this.x, this.y);
    },

    distanceAngle: function (dist, angle) {
        var deg = angle, x, y;
        if (deg > 270) {
            deg = deg - 360;
        } else if (deg < -270) {
            deg = deg + 360;
        }
        if (-90 <= deg && deg <= 90) {
            x = Math.sin(radians(deg)) * dist;
            y = Math.sqrt((dist * dist) - (x * x));
            return new Point(x + this.x, this.y - y);
        }
        x = Math.sin(radians(180 - deg)) * dist;
        y = Math.sqrt((dist * dist) - (x * x));
        return new Point(x + this.x, this.y + y);
    },

    // Point transforming:

    scaleBy: function (scalePoint) {
        return this.multiplyBy(scalePoint);
    },

    translateBy: function (deltaPoint) {
        return this.add(deltaPoint);
    },

    rotateBy: function (angle, centerPoint) {
        var center = centerPoint || new Point(0, 0),
            p = this.subtract(center),
            r = p.r(),
            theta = angle - p.theta();
        return new Point(
            center.x + (r * Math.cos(theta)),
            center.y - (r * Math.sin(theta))
        );
    },

    // Point conversion:

    asArray: function () {
        return [this.x, this.y];
    },

    corner: function (rectangle, cornerPoint) {
    // answer a new Rectangle
        if(rectangle.className == "Rectangle"){
            rectangle.setTo(this.x, this.y, cornerPoint.x, cornerPoint.y);
            return rectangle;
        } else {
            return this;
        }
    },

    rectangle: function (rectangle, aPoint) {
        // answer a new Rectangle
        if(rectangle.className == "Rectangle"){
            var org, crn;
            org = this.min(aPoint);
            crn = this.max(aPoint);
            rectangle.setTo(org.x, org.y, crn.x, crn.y);
            return rectangle;
        } else {
            return this;
        }
    },

    extent: function (rectangle, aPoint) {
        //answer a new Rectangle
        if(rectangle.className == "Rectangle"){
            var crn = this.add(aPoint);
            rectangle.setTo(this.x, this.y, crn.x, crn.y);
            return rectangle;
        } else {
            return this;
        }
    }

})


module.exports = Point;
},{}],4:[function(require,module,exports){
Point = require('./Point');

// Rectangles //////////////////////////////////////////////////////////

// Rectangle instance creation:

var Rectangle = Class.create({

    initialize: function(left, top, right, bottom) {
        this.className = 'Rectangle';
        this.init(new Point((left || 0), (top || 0)),
        new Point((right || 0), (bottom || 0)));
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



})


module.exports = Rectangle;
},{"./Point":3}],5:[function(require,module,exports){
(function (global){
global.Color = require('./Color');
global.Point = require('./Point');
global.Rectangle = require('./Rectangle');
global.Node = require('./Node');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Color":1,"./Node":2,"./Point":3,"./Rectangle":4}]},{},[5]);
