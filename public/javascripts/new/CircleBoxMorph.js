var Morph = require('./Morph');
var Point = require('./Point');
var Rectangle = require('./Rectangle');

var CircleBoxMorph = Class.create(Morph, {

	// CircleBoxMorph //////////////////////////////////////////////////////

	// I can be used for sliders
	
	initialize: function(orientation) {
	    this.init(orientation || 'vertical');
	},


	init: function ($super, orientation) {
	    $super();
	    this.orientation = orientation;
	    this.autoOrient = true;
	    this.setExtent(new Point(20, 100));
	},

	autoOrientation: function () {
	    if (this.height() > this.width()) {
	        this.orientation = 'vertical';
	    } else {
	        this.orientation = 'horizontal';
	    }
	},

	drawNew: function () {
	    var radius, center1, center2, rect, points, x, y,
	        context, ext,
	        myself = this;

	    if (this.autoOrient) {
	        this.autoOrientation();
	    }
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');

	    if (this.orientation === 'vertical') {
	        radius = this.width() / 2;
	        x = this.center().x;
	        center1 = new Point(x, this.top() + radius);
	        center2 = new Point(x, this.bottom() - radius);
	        rect = new Rectangle(0,0,0,0);
	        rect = this.bounds.origin.add(new Point(0, radius)).corner(
	            rect, 
	            this.bounds.corner.subtract(new Point(0, radius))
	        );
	    } else {
	        radius = this.height() / 2;
	        y = this.center().y;
	        center1 = new Point(this.left() + radius, y);
	        center2 = new Point(this.right() - radius, y);
	        rect = new Rectangle(0,0,0,0);
	        rect = this.bounds.origin.add(new Point(radius, 0)).corner(
	            rect, 
	            this.bounds.corner.subtract(new Point(radius, 0))
	        );
	    }
	    points = [ center1.subtract(this.bounds.origin),
	        center2.subtract(this.bounds.origin)];
	    points.forEach(function (center) {
	        context.fillStyle = myself.color.toString();
	        context.beginPath();
	        context.arc(
	            center.x,
	            center.y,
	            radius,
	            0,
	            2 * Math.PI,
	            false
	        );
	        context.closePath();
	        context.fill();
	    });
	    rect = rect.translateBy(this.bounds.origin.neg());
	    ext = rect.extent();
	    if (ext.x > 0 && ext.y > 0) {
	        context.fillRect(
	            rect.origin.x,
	            rect.origin.y,
	            rect.width(),
	            rect.height()
	        );
	    }
	},

	// CircleBoxMorph menu:

	developersMenu: function ($super) {
		
	    var menu = $super();
	    menu.addLine();
	    if (this.orientation === 'vertical') {
	        menu.addItem(
	            "horizontal...",
	            'toggleOrientation',
	            'toggle the\norientation'
	        );
	    } else {
	        menu.addItem(
	            "vertical...",
	            'toggleOrientation',
	            'toggle the\norientation'
	        );
	    }
	    return menu;
	},

	toggleOrientation: function () {
	    var center = this.center();
	    this.changed();
	    if (this.orientation === 'vertical') {
	        this.orientation = 'horizontal';
	    } else {
	        this.orientation = 'vertical';
	    }
	    this.silentSetExtent(new Point(this.height(), this.width()));
	    this.setCenter(center);
	    this.drawNew();
	    this.changed();
	}
});

CircleBoxMorph.uber = Morph.prototype;
CircleBoxMorph.className = 'CircleBoxMorph';

module.exports = CircleBoxMorph;