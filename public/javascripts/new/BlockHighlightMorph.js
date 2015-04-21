var Morph = require('./Morph');

var BlockHighlightMorph = Class.create(Morph, {

	// BlockHighlightMorph /////////////////////////////////////////////////

	initialize: function(){
		this.init();
	}
});

BlockHighlightMorph.uber = Morph.prototype;
BlockHighlightMorph.className = 'BlockHighlightMorph';

module.exports = BlockHighlightMorph;