var Morph = require('./Morph');

var ShadowMorph = Class.create(Morph, {
	
	initialize: function(){
		this.init();
	}
});

ShadowMorph.uber = Morph.prototype;
ShadowMorph.className = 'ShadowMorph';

module.exports = ShadowMorph;