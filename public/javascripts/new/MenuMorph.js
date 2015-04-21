var BoxMorph = require('./BoxMorph');
var MenuItemMorph = require('./MenuItemMorph');
var FrameMorph = require('./FrameMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var StringFieldMorph = require('./StringFieldMorph');
var ColorPickerMorph = require('./ColorPickerMorph');
var SliderMorph = require('./SliderMorph');
var Color = require('./Color');
var Point = require('./Point');
var TextMorph = require('./TextMorph');

var MenuMorph = Class.create(BoxMorph, {

	// MenuMorph ///////////////////////////////////////////////////////////
	
	initialize: function(target, title, environment, fontSize) {
	    this.init(target, title, environment, fontSize);

	    /*
	    if target is a function, use it as callback:
	    execute target as callback function with the action property
	    of the triggered MenuItem as argument.
	    Use the environment, if it is specified.
	    Note: if action is also a function, instead of becoming
	    the argument itself it will be called to answer the argument.
	    For selections, Yes/No Choices etc.

	    else (if target is not a function):

	        if action is a function:
	        execute the action with target as environment (can be null)
	        for lambdafied (inline) actions

	        else if action is a String:
	        treat it as function property of target and execute it
	        for selector-like actions
	    */
	},



	init: function ($super, target, title, environment, fontSize) {
	    // additional properties:
	    this.target = target;
	    this.title = title || null;
	    this.environment = environment || null;
	    this.fontSize = fontSize || null;
	    this.items = [];
	    this.label = null;
	    this.world = null;
	    this.isListContents = false;

	    // initialize inherited properties:
	    $super();

	    // override inherited properties:
	    this.isDraggable = false;

	    // immutable properties:
	    this.border = null;
	    this.edge = null;
	},

	addItem: function (
	    labelString,
	    action,
	    hint,
	    color,
	    bold, // bool
	    italic, // bool
	    doubleClickAction // optional, when used as list contents
	) {
	    /*
	    labelString is normally a single-line string. But it can also be one
	    of the following:

	        * a multi-line string (containing line breaks)
	        * an icon (either a Morph or a Canvas)
	        * a tuple of format: [icon, string]
	    */
	    this.items.push([
	        localize(labelString || 'close'),
	        action || nop,
	        hint,
	        color,
	        bold || false,
	        italic || false,
	        doubleClickAction]);
	},

	addLine: function (width) {
	    this.items.push([0, width || 1]);
	},

	createLabel: function () {
	    var text;
	    if (this.label !== null) {
	        this.label.destroy();
	    }
	    text = new TextMorph(
	        localize(this.title),
	        this.fontSize || MorphicPreferences.menuFontSize,
	        MorphicPreferences.menuFontName,
	        true,
	        false,
	        'center'
	    );
	    text.alignment = 'center';
	    text.color = new Color(255, 255, 255);
	    text.backgroundColor = this.borderColor;
	    text.drawNew();
	    this.label = new BoxMorph(3, 0);
	    if (MorphicPreferences.isFlat) {
	        this.label.edge = 0;
	    }
	    this.label.color = this.borderColor;
	    this.label.borderColor = this.borderColor;
	    this.label.setExtent(text.extent().add(4));
	    this.label.drawNew();
	    this.label.add(text);
	    this.label.text = text;
	},

	drawNew: function ($super) {
	    var myself = this,
	        item,
	        fb,
	        x,
	        y,
	        isLine = false;

	    this.children.forEach(function (m) {
	        m.destroy();
	    });
	    this.children = [];
	    if (!this.isListContents) {
	        this.edge = MorphicPreferences.isFlat ? 0 : 5;
	        this.border = MorphicPreferences.isFlat ? 1 : 2;
	    }
	    this.color = new Color(255, 255, 255);
	    this.borderColor = new Color(60, 60, 60);
	    this.silentSetExtent(new Point(0, 0));

	    y = 2;
	    x = this.left() + 4;
	    if (!this.isListContents) {
	        if (this.title) {
	            this.createLabel();
	            this.label.setPosition(this.bounds.origin.add(4));
	            this.add(this.label);
	            y = this.label.bottom();
	        } else {
	            y = this.top() + 4;
	        }
	    }
	    y += 1;
	    this.items.forEach(function (tuple) {
	        isLine = false;
	        if (tuple instanceof StringFieldMorph ||
	                tuple instanceof ColorPickerMorph ||
	                tuple instanceof SliderMorph) {
	            item = tuple;
	        } else if (tuple[0] === 0) {
	            isLine = true;
	            item = new Morph();
	            item.color = myself.borderColor;
	            item.setHeight(tuple[1]);
	        } else {
	            item = new MenuItemMorph(
	                myself.target,
	                tuple[1],
	                tuple[0],
	                myself.fontSize || MorphicPreferences.menuFontSize,
	                MorphicPreferences.menuFontName,
	                myself.environment,
	                tuple[2], // bubble help hint
	                tuple[3], // color
	                tuple[4], // bold
	                tuple[5], // italic
	                tuple[6] // doubleclick action
	            );
	        }
	        if (isLine) {
	            y += 1;
	        }
	        item.setPosition(new Point(x, y));
	        myself.add(item);
	        y = y + item.height();
	        if (isLine) {
	            y += 1;
	        }
	    });

	    fb = this.fullBounds();
	    this.silentSetExtent(fb.extent().add(4));
	    this.adjustWidths();
	    $super();
	},

	maxWidth: function () {
	    var w = 0;

	    if (this.parent instanceof FrameMorph) {
	        if (this.parent.scrollFrame instanceof ScrollFrameMorph) {
	            w = this.parent.scrollFrame.width();
	        }
	    }
	    this.children.forEach(function (item) {

	        if (item instanceof MenuItemMorph) {
	            w = Math.max(w, item.children[0].width() + 8);
	        } else if ((item instanceof StringFieldMorph) ||
	                (item instanceof ColorPickerMorph) ||
	                (item instanceof SliderMorph)) {
	            w = Math.max(w, item.width());
	        }
	    });
	    if (this.label) {
	        w = Math.max(w, this.label.width());
	    }
	    return w;
	},

	adjustWidths: function () {
	    var w = this.maxWidth(),
	        isSelected,
	        myself = this;
	    this.children.forEach(function (item) {
	        item.silentSetWidth(w);
	        if (item instanceof MenuItemMorph) {
	            isSelected = (item.image === item.pressImage);
	            item.createBackgrounds();
	            if (isSelected) {
	                item.image = item.pressImage;
	            }
	        } else {
	            item.drawNew();
	            if (item === myself.label) {
	                item.text.setPosition(
	                    item.center().subtract(
	                        item.text.extent().floorDivideBy(2)
	                    )
	                );
	            }
	        }
	    });
	},

	unselectAllItems: function () {
	    this.children.forEach(function (item) {
	        if (item instanceof MenuItemMorph) {
	            item.image = item.normalImage;
	        }
	    });
	    this.changed();
	},

	popup: function (world, pos) {
	    this.drawNew();
	    this.setPosition(pos);
	    this.addShadow(new Point(2, 2), 80);
	    this.keepWithin(world);
	    if (world.activeMenu) {
	        world.activeMenu.destroy();
	    }
	    if (this.items.length < 1 && !this.title) { // don't show empty menus
	        return;
	    }
	    world.add(this);
	    world.activeMenu = this;
	    this.fullChanged();
	},

	popUpAtHand: function (world) {
	    var wrrld = world || this.world;
	    this.popup(wrrld, wrrld.hand.position());
	},

	popUpCenteredAtHand: function (world) {
	    var wrrld = world || this.world;
	    this.drawNew();
	    this.popup(
	        wrrld,
	        wrrld.hand.position().subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	},

	popUpCenteredInWorld: function (world) {
	    var wrrld = world || this.world;
	    this.drawNew();
	    this.popup(
	        wrrld,
	        wrrld.center().subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	}
});

MenuMorph.uber = BoxMorph.prototype;
MenuMorph.className = 'MenuMorph';

module.exports = MenuMorph;