var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');

var ArrowMorph = Class.create(Morph, {
	// ArrowMorph //////////////////////////////////////////////////////////

	/*
	    I am a triangular arrow shape, for use in drop-down menus etc.
	    My orientation is governed by my 'direction' property, which can be
	    'down', 'up', 'left' or 'right'.
	*/

	initialize: function(direction, size, padding, color){
		this.init(direction, size, padding, color);
	},

	init: function ($super, direction, size, padding, color) {
	    this.direction = direction || 'down';
	    this.size = size || ((size === 0) ? 0 : 50);
	    this.padding = padding || 0;

	    $super();
	    this.color = color || new Color(0, 0, 0);
	    this.setExtent(new Point(this.size, this.size));
	},

	setSize: function (size) {
	    var min = Math.max(size, 1);
	    this.size = size;
	    this.setExtent(new Point(min, min));
	},

	// ArrowMorph displaying:

	drawNew: function () {
	    // initialize my surface property
	    this.image = newCanvas(this.extent());
	    var context = this.image.getContext('2d'),
	        pad = this.padding,
	        h = this.height(),
	        h2 = Math.floor(h / 2),
	        w = this.width(),
	        w2 = Math.floor(w / 2);

	    context.fillStyle = this.color.toString();
	    context.beginPath();
	    if (this.direction === 'down') {
	        context.moveTo(pad, h2);
	        context.lineTo(w - pad, h2);
	        context.lineTo(w2, h - pad);
	    } else if (this.direction === 'up') {
	        context.moveTo(pad, h2);
	        context.lineTo(w - pad, h2);
	        context.lineTo(w2, pad);
	    } else if (this.direction === 'left') {
	        context.moveTo(pad, h2);
	        context.lineTo(w2, pad);
	        context.lineTo(w2, h - pad);
	    } else { // 'right'
	        context.moveTo(w2, pad);
	        context.lineTo(w - pad, h2);
	        context.lineTo(w2, h - pad);
	    }
	    context.closePath();
	    context.fill();
	}
});

ArrowMorph.uber = Morph.prototype;
ArrowMorph.className = 'ArrowMorph';

module.exports = ArrowMorph;