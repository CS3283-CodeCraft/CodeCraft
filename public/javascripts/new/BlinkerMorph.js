var Morph = require('./Morph');
var Color = require('./Color');

var BlinkerMorph = Class.create(Morph, {
	
	// BlinkerMorph ////////////////////////////////////////////////////////

	// can be used for text cursors

	initialize: function(rate){
		this.init(rate);
	},

	init: function ($super, rate) {
	    $super();
	    this.color = new Color(0, 0, 0);
	    this.fps = rate || 2;
	    this.drawNew();
	},

	step: function () {
    	this.toggleVisibility();
	}
});

BlinkerMorph.uber = Morph.prototype;
BlinkerMorph.className = 'BlinkerMorph';

module.exports = BlinkerMorph;