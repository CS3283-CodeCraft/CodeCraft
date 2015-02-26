var Morph = require('./Morph');
var Color = require('./Color');

var BlinkerMorph = Class.create(Morph, {
	
	// BlinkerMorph ////////////////////////////////////////////////////////

	// can be used for text cursors

	initialize: function(rate){
		this.init(rate);
		this.className = 'BlinkerMorph';
	},

	init: function ($super) {
	    $super();
	    this.color = new Color(0, 0, 0);
	    this.fps = rate || 2;
	    this.drawNew();
	},

	step: function () {
    	this.toggleVisibility();
	},

})

BlinkerMorph.uber = Morph.prototype;

module.exports = BlinkerMorph;

