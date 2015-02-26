var Morph = require('./Morph');

var ShadowMorph = Class.create(Morph, {
	
	initialize: function(){
		this.init();
		this.className = 'ShadowMorph';
	}

})

ShadowMorph.uber = Morph.prototype;

module.exports = ShadowMorph;
