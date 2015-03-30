/**
 * Created by Aigis on 30-Mar-15.
 */

var Point = require('./Point');
var Morph = require('./Morph');
var FrameMorph = require('./FrameMorph');

var WardrobeMorph = require('./WardrobeMorph');

// ShareBoxAssetsMorph ///////////////////////////////////////////////////////

// I am a watcher on the Sharebox for shared costumes

// ShareBoxAssetsMorph inherits from WardrobeMorph

// Huan Song: Some interesting inheritance going here. I still need to figure out what's going on, but this works atm.

var ShareBoxAssetsMorph = Class.create(WardrobeMorph, {
	initialize: function() {

	},

	init: function (aSprite, sliderColor) {
		// additional properties
		this.sprite = aSprite || new SpriteMorph();
		this.costumesVersion = null;
		this.spriteVersion = null;

		// initialize inherited properties
		ShareBoxAssetsMorph.uber.init.call(this, null, null, sliderColor);

		// configure inherited properties
		this.fps = 30;
		this.updateList();
	},

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

		/*
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
		 */
		var numCostumes = 0;
		this.sprite.costumes.asArray().forEach(function (costume) {
			template = icon = new CostumeIconMorph(costume, template);
			icon.setPosition(new Point(x, y));
			myself.addContents(icon);
			numCostumes++;
			if (numCostumes != 0 && numCostumes%5 == 0) {
				y = icon.bottom() + padding;
				x = myself.left() + 5;
			} else {
				x = icon.right() + padding;
			}
		});
		this.costumesVersion = this.sprite.costumes.lastChanged;

		this.contents.setPosition(oldPos);
		this.adjustScrollBars();
		Morph.prototype.trackChanges = oldFlag;
		this.changed();

		this.updateSelection();
	},

	// Huan Song: Slightly modified version of the original WardrobeMorph reactToDropOf
	reactToDropOf: function (icon) {
		// Primarily differs in preventing the costume from being removed from WardrobeMorph on sharing
		// as well avoiding costume duplication from dragging around inside ShareBoxAssetsMorph as a result
		// of the aforementioned

		// Returns sprite to the original location regardless of origin
		icon.slideBackTo(world.hand.grabOrigin, 10);
		// If sprite isn't from ShareBoxAssetsMorph, add costumes
		if (!(world.hand.grabOrigin.origin.parent instanceof ShareBoxAssetsMorph)) {
			var idx = 0,
				costume = icon.object,
				top = icon.top();
			//icon.destroy();
			this.contents.children.forEach(function (item) {
				if (item instanceof CostumeIconMorph && item.top() < top - 4) {
					idx += 1;
				}
			});
			this.sprite.costumes.add(costume, idx + 1);
			this.updateList();
			icon.mouseClickLeft(); // select
		} else {
			// Restore dragged costume
			this.sprite.costumes.add(icon.object);
			this.updateList();
			icon.mouseClickLeft();
			icon.destroy();
		}
	}
});

ShareBoxAssetsMorph.uber = WardrobeMorph.prototype;
ShareBoxAssetsMorph.className = 'ShareBoxAssetsMorph';

module.exports = ShareBoxAssetsMorph;