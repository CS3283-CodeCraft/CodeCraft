var Color = require('./Color');
var Point = require('./Point');
var ColorPaletteMorph = require('./ColorPaletteMorph');

var GrayPaletteMorph = Class.create(ColorPaletteMorph, {
	
	initialize: function(target, sizePoint){
		this.init(
        	target || null,
        	sizePoint || new Point(80, 10)
    	);
	},

	drawNew: function () {
	    var context, ext, gradient;

	    ext = this.extent();
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');
	    this.choice = new Color();
	    gradient = context.createLinearGradient(0, 0, ext.x, ext.y);
	    gradient.addColorStop(0, 'black');
	    gradient.addColorStop(1, 'white');
	    context.fillStyle = gradient;
	    context.fillRect(0, 0, ext.x, ext.y);
	}
});

GrayPaletteMorph.uber = ColorPaletteMorph.prototype;
GrayPaletteMorph.className = 'GrayPaletteMorph';

module.exports = GrayPaletteMorph;