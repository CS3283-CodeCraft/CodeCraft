/**
 * Created by Shurelia on 30/3/2015.
 */

var ToggleButtonMorph = require('./ToggleButtonMorph');

// SoundIconMorph ///////////////////////////////////////////////////////

/*
 I am an element in the SpriteEditor's "Sounds" tab.
 */

// SoundIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

var SoundIconMorph = Class.create(ToggleButtonMorph, {
	initialize: function() {

	},

	init: function($super, aSound, aTemplate) {
        $super();

		var colors, action, query;

		if (!aTemplate) {
			colors = [
				IDE_Morph.prototype.groupColor,
				IDE_Morph.prototype.frameColor,
				IDE_Morph.prototype.frameColor
			];

		}

		action = function () {
			nop(); // When I am selected (which is never the case for sounds)
		};

		query = function () {
			return false;
		};

		// additional properties:
		this.object = aSound; // mandatory, actually
		this.version = this.object.version;
		this.thumbnail = null;

		// initialize inherited properties:
		SoundIconMorph.uber.init.call(
			this,
			colors, // color overrides, <array>: [normal, highlight, pressed]
			null, // target - not needed here
			action, // a toggle function
			this.object.name, // label string
			query, // predicate/selector
			null, // environment
			null, // hint
			aTemplate // optional, for cached background images
		);

		// override defaults and build additional components
		this.isDraggable = true;
		this.createThumbnail();
		this.padding = 2;
		this.corner = 8;
		this.fixLayout();
		this.fps = 1;
	}
});

SoundIconMorph.uber = ToggleButtonMorph.prototype;
SoundIconMorph.className = 'SoundIconMorph';

module.exports = SoundIconMorph;