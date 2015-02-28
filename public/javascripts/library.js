/**
* Created by Undisputed Seraphim on 6/11/2014.
*
* library.js
*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2014-November-11';

// Declarations

var LibraryMorph;
var SelectionDialogBoxMorph;

// LibraryMorph /////////////////////////////////////////////////////////

// I am the the window that lets the user select an eternal resource to be imported
// into CodeCraft.

LibraryMorph.prototype = new DialogBoxMorph();
LibraryMorph.prototype.constructor = LibraryMorph;
LibraryMorph.uber = DialogBoxMorph.prototype;
LibraryMorph.className = 'LibraryMorph';

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

LibraryMorph.prototype.openIn = function (world, callback) {
	// Open the library dialog box.
	this.callback = callback || nop;

	this.processKeyUp = function () {
		this.shift = false;
		this.propertiesControls.constrain.refresh();
	};

	this.processKeyDown = function () {
		this.shift = this.world().currentKey === 16;
		this.propertiesControls.constrain.refresh();
	};

	// Other functions go here maybe?

	this.key = 'library';
	this.popUp(world);
};

LibraryMorph.prototype.fixLayout = function () {
	var oldFlag = Morph.prototype.trackChanges;

	this.changed();
	oldFlag = Morph.prototype.trackChanges;
	Morph.prototype.trackChanges = false;

	if (this.selectionbox) {
		this.selectionbox.buildContents();
		this.selectionbox.drawNew();
	}
	if (this.controls) { this.controls.fixLayout(); }
	if (this.body) { this.body.fixLayout(); }
	LibraryMorph.uber.fixLayout.call(this);

	Morph.prototype.trackChanges = oldFlag;
	this.changed();
};

LibraryMorph.prototype.refreshToolButtons = function () {
	this.toolbox.children.forEach(function (toggle) {
		toggle.refresh();
	});
};

LibraryMorph.prototype.cancel = function () {
	if (this.oncancel) { this.oncancel(); }
	this.destroy();
};

LibraryMorph.prototype.getUserColor = function () {
	var myself = this,
		world = this.world(),
		hand = world.hand,
		posInDocument = getDocumentPositionOf(world.worldCanvas),
		mouseMoveBak = hand.processMouseMove,
		mouseDownBak = hand.processMouseDown,
		mouseUpBak = hand.processMouseUp;

	hand.processMouseMove = function (event) {
		var color;
		hand.setPosition(new Point(
				event.pageX - posInDocument.x,
				event.pageY - posInDocument.y
		));
		color = world.getGlobalPixelColor(hand.position());
		color.a = 255;
		myself.propertiesControls.colorpicker.action(color);
	};

	hand.processMouseDown = nop;

	hand.processMouseUp = function () {
		myself.paper.currentTool = 'brush';
		myself.paper.toolChanged('brush');
		myself.refreshToolButtons();
		hand.processMouseMove = mouseMoveBak;
		hand.processMouseDown = mouseDownBak;
		hand.processMouseUp = mouseUpBak;
	};
};

// SelectionBoxMorph /////////////////////////////////////////////////////////

function SelectionBoxMorph () {
	this.init();
};

SelectionBoxMorph.prototype.init = function () {

}

SelectionBoxMorph.prototype.buildContents = function() {

}