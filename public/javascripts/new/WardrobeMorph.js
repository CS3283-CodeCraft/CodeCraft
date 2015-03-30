/**
 * Created by Shurelia on 30/3/2015.
 */

var Point = require('./Point');
var Morph = require('./Morph');
var TextMorph = require('./TextMorph');
var FrameMorph = require('./FrameMorph');
var PushButtonMorph = require('./Push ButtonMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');

// WardrobeMorph ///////////////////////////////////////////////////////

// I am a watcher on a sprite's costume list

// WardrobeMorph inherits from ScrollFrameMorph

var WardrobeMorph = Class.create(ScrollFrameMorph, {
	intialize: function() {

	},

	init: function ($super, aSprite, sliderColor) {
		$super();

		// additional properties
		this.sprite = aSprite || new SpriteMorph();
		this.costumesVersion = null;
		this.spriteVersion = null;

		// initialize inherited properties
		WardrobeMorph.uber.init.call(this, null, null, sliderColor);

		// configure inherited properties
		this.fps = 30;
		this.updateList();
	},

	// Wardrobe updating
	updateList: function () {
		var myself = this,
			x = this.left() + 5,
			y = this.top() + 5,
			padding = 4,
			oldFlag = Morph.prototype.trackChanges,
			oldPos = this.contents.position(),
			icon,
			template,
			txt,
			paintbutton;

		this.changed();
		oldFlag = Morph.prototype.trackChanges;
		Morph.prototype.trackChanges = false;

		this.contents.destroy();
		this.contents = new FrameMorph(this);
		this.contents.acceptsDrops = false;
		this.contents.reactToDropOf = function (icon) {
			myself.reactToDropOf(icon);
		};
		this.addBack(this.contents);

		icon = new TurtleIconMorph(this.sprite);
		icon.setPosition(new Point(x, y));
		myself.addContents(icon);
		y = icon.bottom() + padding;

		paintbutton = new PushButtonMorph(
			this,
			"paintNew",
			new SymbolMorph("brush", 15)
		);
		paintbutton.padding = 0;
		paintbutton.corner = 12;
		paintbutton.color = IDE_Morph.prototype.groupColor;
		paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
		paintbutton.pressColor = paintbutton.highlightColor;
		paintbutton.labelMinExtent = new Point(36, 18);
		paintbutton.labelShadowOffset = new Point(-1, -1);
		paintbutton.labelShadowColor = paintbutton.highlightColor;
		paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
		paintbutton.contrast = this.buttonContrast;
		paintbutton.drawNew();
		paintbutton.hint = "Paint a new costume";
		paintbutton.setPosition(new Point(x, y));
		paintbutton.fixLayout();
		paintbutton.setCenter(icon.center());
		paintbutton.setLeft(icon.right() + padding * 4);


		this.addContents(paintbutton);

		txt = new TextMorph(localize(
			"costumes tab help" // look up long string in translator
		));
		txt.fontSize = 9;
		txt.setColor(SpriteMorph.prototype.paletteTextColor);

		txt.setPosition(new Point(x, y));
		this.addContents(txt);
		y = txt.bottom() + padding;


		this.sprite.costumes.asArray().forEach(function (costume) {
			template = icon = new CostumeIconMorph(costume, template);
			icon.setPosition(new Point(x, y));
			myself.addContents(icon);
			y = icon.bottom() + padding;
		});
		this.costumesVersion = this.sprite.costumes.lastChanged;

		this.contents.setPosition(oldPos);
		this.adjustScrollBars();
		Morph.prototype.trackChanges = oldFlag;
		this.changed();

		this.updateSelection();
	},

	updateSelection: function () {
		this.contents.children.forEach(function (morph) {
			if (morph.refresh) {
				morph.refresh();
			}
		});
		this.spriteVersion = this.sprite.version;
	},

	// Wardrobe stepping
	step: function () {
		if (this.costumesVersion !== this.sprite.costumes.lastChanged) {
			this.updateList();
		}
		if (this.spriteVersion !== this.sprite.version) {
			this.updateSelection();
		}
	},

	// Wardrobe ops
	removeCostumeAt: function (idx) {
		this.sprite.costumes.remove(idx);
		this.updateList();
	},

	paintNew: function () {
		var cos = new Costume(
				newCanvas(),
				this.sprite.newCostumeName('Untitled')
			),
			ide = this.parentThatIsA('IDE_Morph'),
			myself = this;
		cos.edit(this.world(), ide, true, null, function () {
			myself.sprite.addCostume(cos);
			myself.updateList();
			if (ide) {
				ide.currentSprite.wearCostume(cos);
			}
		});
	},

	// Wardrobe drag & drop
	wantsDropOf: function (morph) {
		return morph instanceof CostumeIconMorph;
	},

	reactToDropOf: function (icon) {
		var idx = 0,
			costume = icon.object,
			top = icon.top();

		icon.destroy();
		this.contents.children.forEach(function (item) {
			if (item instanceof CostumeIconMorph && item.top() < top - 4) {
				idx += 1;
			}
		});
		this.sprite.costumes.add(costume, idx + 1);
		this.updateList();
		icon.mouseClickLeft(); // select
	}
});

WardrobeMorph.uber = ScrollFrameMorph.prototype;
WardrobeMorph.className = 'WardrobeMorph';

module.exports = WardrobeMorph;