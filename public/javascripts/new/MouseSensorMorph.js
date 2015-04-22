var BoxMorph = require('./BoxMorph');
var Color = require('./Color');

var MouseSensorMorph = Class.create(BoxMorph, {
	
	initialize: function(edge, border, borderColor) {
	    this.init(edge, border, borderColor);
	},

	init: function ($super, edge, border, borderColor) {
	    $super();
	    this.edge = edge || 4;
	    this.border = border || 2;
	    this.color = new Color(255, 255, 255);
	    this.borderColor = borderColor || new Color();
	    this.isTouched = false;
	    this.upStep = 0.05;
	    this.downStep = 0.02;
	    this.noticesTransparentClick = false;
	    this.drawNew();
	},

	touch: function () {
	    var myself = this;
	    if (!this.isTouched) {
	        this.isTouched = true;
	        this.alpha = 0.6;

	        this.step = function () {
	            if (myself.isTouched) {
	                if (myself.alpha < 1) {
	                    myself.alpha = myself.alpha + myself.upStep;
	                }
	            } else if (myself.alpha > (myself.downStep)) {
	                myself.alpha = myself.alpha - myself.downStep;
	            } else {
	                myself.alpha = 0;
	                myself.step = null;
	            }
	            myself.changed();
	        };
	    }
	},

	unTouch: function () {
	    this.isTouched = false;
	},

	mouseEnter: function () {
	    this.touch();
	},

	mouseLeave: function () {
	    this.unTouch();
	},

	mouseDownLeft: function () {
	    this.touch();
	},

	mouseClickLeft: function () {
	    this.unTouch();
	}
});

MouseSensorMorph.uber = BoxMorph.prototype;
MouseSensorMorph.className = 'MouseSensorMorph';

module.exports = MouseSensorMorph;