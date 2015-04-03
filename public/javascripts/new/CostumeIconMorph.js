/**
 * Created by Shurelia on 30/3/2015.
 */

var ToggleButtonMorph = require('./ToggleButtonMorph');
var Color = require('./Color');
var DialogBoxMorph = require('./DialogBoxMorph');
var MenuMorph = require('./MenuMorph');


// CostumeIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a self-updating thumbnail of the costume I'm representing, and a
 self-updating label of the costume's name (in case it is changed
 elsewhere)
 */

// CostumeIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

var CostumeIconMorph = Class.create(ToggleButtonMorph, {
	initialize: function(aCostume, aTemplate) {
		this.init(aCostume, aTemplate);
	},

	init: function($super, aCostume, aTemplate) {
		$super();

		var colors, action, query, myself = this;

		if (!aTemplate) {
			colors = [
				IDE_Morph.prototype.groupColor,
				IDE_Morph.prototype.frameColor,
				IDE_Morph.prototype.frameColor
			];

		}

		action = function () {
			// make my costume the current one
			var ide = myself.parentThatIsA('IDE_Morph'),
				wardrobe = myself.parentThatIsA('WardrobeMorph');

			if (ide) {
				ide.currentSprite.wearCostume(myself.object);
			}
			if (wardrobe) {
				wardrobe.updateSelection();
			}
		};

		query = function () {
			// answer true if my costume is the current one
			var ide = myself.parentThatIsA('IDE_Morph');

			if (ide) {
				return ide.currentSprite.costume === myself.object;
			}
			return false;
		};

		// additional properties:
		this.object = aCostume || new Costume(); // mandatory, actually
		this.version = this.object.version;
		this.thumbnail = null;

		// initialize inherited properties:
		CostumeIconMorph.uber.init.call(
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
	},

	createThumbnail: SpriteIconMorph.prototype.createThumbnail,
	createLabel: SpriteIconMorph.prototype.createLabel,

	// CostumeIconMorph stepping
	step: SpriteIconMorph.prototype.step,

	// CostumeIconMorph layout
	fixLayout: SpriteIconMorph.prototype.fixLayout,

	// CostumeIconMorph menu
	userMenu: function () {
		var menu = new MenuMorph(this);
		if (!(this.object instanceof Costume)) {
			return null;
		}
		menu.addItem("edit", "editCostume");
		if (this.world().currentKey === 16) { // shift clicked
			menu.addItem(
				'edit rotation point only...',
				'editRotationPointOnly',
				null,
				new Color(100, 0, 0)
			);
		}
		menu.addItem("rename", "renameCostume");
		menu.addLine();
		menu.addItem("duplicate", "duplicateCostume");
		menu.addItem("delete", "removeCostume");
		menu.addLine();
		menu.addItem("export", "exportCostume");
		return menu;
	},

	editCostume: function () {
		if (this.object instanceof SVG_Costume) {
			this.object.editRotationPointOnly(this.world());
		} else {
			this.object.edit(
				this.world(),
				this.parentThatIsA('IDE_Morph')
			);
		}
	},

	editRotationPointOnly: function () {
		var ide = this.parentThatIsA('IDE_Morph');
		this.object.editRotationPointOnly(this.world());
		ide.hasChangedMedia = true;
	},

	renameCostume: function () {
		var costume = this.object,
			wardrobe = this.parentThatIsA('WardrobeMorph'),
			ide = this.parentThatIsA('IDE_Morph');
		new DialogBoxMorph(
			null,
			function (answer) {
				if (answer && (answer !== costume.name)) {
					costume.name = wardrobe.sprite.newCostumeName(
						answer,
						costume
					);
					costume.version = Date.now();
					ide.hasChangedMedia = true;
				}
			}
		).prompt(
			'rename costume',
			costume.name,
			this.world()
		);
	},

	duplicateCostume: function () {
		var wardrobe = this.parentThatIsA('WardrobeMorph'),
			ide = this.parentThatIsA('IDE_Morph'),
			newcos = this.object.copy();
		newcos.name = wardrobe.sprite.newCostumeName(newcos.name);
		wardrobe.sprite.addCostume(newcos);
		wardrobe.updateList();
		if (ide) {
			ide.currentSprite.wearCostume(newcos);
		}
	},

	removeCostume: function () {
		var wardrobe = this.parentThatIsA('WardrobeMorph'),
			idx = this.parent.children.indexOf(this),
			ide = this.parentThatIsA('IDE_Morph');
		wardrobe.removeCostumeAt(idx - 2);
		if (ide.currentSprite.costume === this.object) {
			ide.currentSprite.wearCostume(null);
		}
	},

	exportCostume: function () {
		if (this.object instanceof SVG_Costume) {
			window.open(this.object.contents.src);
		} else { // raster Costume
			window.open(this.object.contents.toDataURL());
		}
	},

	// CostumeIconMorph drawing
	createBackgrounds: SpriteIconMorph.prototype.createBackgrounds,

	// CostumeIconMorph drag & drop
	prepareToBeGrabbed: function () {
		this.mouseClickLeft(); // select me
		this.removeCostume();
	}
});

CostumeIconMorph.uber = ToggleButtonMorph.prototype;
CostumeIconMorph.className = 'CostumeIconMorph';

module.exports = CostumeIconMorph;