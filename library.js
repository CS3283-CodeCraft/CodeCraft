/**
* Created by Undisputed Seraphim on 6/11/2014.
*
* library.js
*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2014-November-6';

// Declarations

var LibraryMorph;
var SelectionDialogBoxMorph;

// LibraryMorph /////////////////////////////////////////////////////////

// I am the the window that lets the user select an eternal resource to be imported
// into CodeCraft.

LibraryMorph.prototype = new DialogBoxMorph();
LibraryMorph.prototype.constructor = LibraryMorph;
LibraryMorph.uber = DialogBoxMorph.prototype;

LibraryMorph.prototype.padding = 10;

function LibraryMorph() {
	this.init();
};

LibraryMorph.prototype.init = function () {
	// additional properties:
	this.oncancel = null;
	this.selectionbox = null;

	// initialize inherited properties:
	LibraryMorph.uber.init.call(this);

	// override inherited properties:
	this.labelString = "My Library";
	this.createLabel();

	// build contents:
	this.buildContents();
};

LibraryMorph.prototype.buildContents = function () {
	var myself = this;

	this.selectionbox = new SelectionBoxMorph(function () {return myself.shift; });
	this.selectionbox.setExtent(StageMorph.prototype.dimensions);

	this.addBody(new AlignmentMorph('row', this.padding));
	this.controls = new AlignmentMorph('column', this.padding / 2);
	this.controls.alignment = 'left';

	this.edits = new AlignmentMorph('row', this.padding / 2);
	this.buildEdits();
	this.controls.add(this.edits);

	this.body.color = this.color;

	this.body.add(this.controls);
	this.body.add(this.selectionbox);

	this.toolbox = new BoxMorph();
	this.toolbox.color = SpriteMorph.prototype.paletteColor.lighter(8);
	this.toolbox.borderColor = this.toolbox.color.lighter(40);
	if (MorphicPreferences.isFlat) {
		this.toolbox.edge = 0;
	}

	this.buildToolbox();
	this.controls.add(this.toolbox);

	this.scaleBox = new AlignmentMorph('row', this.padding / 2);
	this.buildScaleBox();
	this.controls.add(this.scaleBox);

	this.propertiesControls = {
		selectionbox: null,
		all: null,
		people: null,
		animals: null,
		objects: null,
		singapore: null,
		malaysia: null,
		indonesia: null,
		china: null,
		thailand: null,
		japan: null
	};
	this.populatePropertiesMenu();

	this.addButton("ok", "OK");
	this.addButton("cancel", "Cancel");

	this.refreshToolButtons();
	this.fixLayout();
	this.drawNew();
};

LibraryMorph.prototype.cancel = function () {
	if (this.oncancel) { this.oncancel(); }
	this.destroy();
};



// SelectionBoxMorph /////////////////////////////////////////////////////////