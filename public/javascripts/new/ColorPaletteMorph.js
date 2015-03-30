var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');

var ColorPaletteMorph = Class.create(Morph, {

	// ColorPaletteMorph ///////////////////////////////////////////////////
	
	initialize: function(target, sizePoint){
		this.init(
	        target || null,
	        sizePoint || new Point(80, 50)
    	);
	},

	// ColorPaletteMorph inherits from Morph:

	init: function ($super, target, size) {
	    $super();
	    this.target = target;
	    this.targetSetter = 'color';
	    this.silentSetExtent(size);
	    this.choice = null;
	    this.drawNew();
	},

	drawNew: function () {
	    var context, ext, x, y, h, l;

	    ext = this.extent();
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');
	    this.choice = new Color();
	    for (x = 0; x <= ext.x; x += 1) {
	        h = 360 * x / ext.x;
	        for (y = 0; y <= ext.y; y += 1) {
	            l = 100 - (y / ext.y * 100);
	            context.fillStyle = 'hsl(' + h + ',100%,' + l + '%)';
	            context.fillRect(x, y, 1, 1);
	        }
	    }
	},

	mouseMove: function (pos) {
	    this.choice = this.getPixelColor(pos);
	    this.updateTarget();
	},

	mouseDownLeft: function (pos) {
	    this.choice = this.getPixelColor(pos);
	    this.updateTarget();
	},

	updateTarget: function () {
	    if (this.target instanceof Morph && this.choice !== null) {
	        if (this.target[this.targetSetter] instanceof Function) {
	            this.target[this.targetSetter](this.choice);
	        } else {
	            this.target[this.targetSetter] = this.choice;
	            this.target.drawNew();
	            this.target.changed();
	        }
	    }
	},

	// ColorPaletteMorph duplicating:

	copyRecordingReferences: function (dict) {
	    // inherited, see comment in Morph
	    var c = ColorPaletteMorph.uber.copyRecordingReferences.call(
	        this,
	        dict
	    );
	    if (c.target && dict[this.target]) {
	        c.target = (dict[this.target]);
	    }
	    return c;
	},

	// ColorPaletteMorph menu:

	developersMenu: function () {
	    var menu = ColorPaletteMorph.uber.developersMenu.call(this);
	    menu.addLine();
	    menu.addItem(
	        'set target',
	        "setTarget",
	        'choose another morph\nwhose color property\n will be' +
	            ' controlled by this one'
	    );
	    return menu;
	},

	setTarget: function (targetMenu, propertyMenu) {
	    var choices = this.overlappedMorphs(),
	        // targetMenu = new MenuMorph(this, 'choose target:'),
	        // propertyMenu = new MenuMorph(this, 'choose target property:'),
	        myself = this;

	    choices.push(this.world());
	    choices.forEach(function (each) {
	        targetMenu.addItem(each.toString().slice(0, 50), function () {
	            myself.target = each;
	            myself.setTargetSetter(propertyMenu);
	        });
	    });
	    if (choices.length === 1) {
	        this.target = choices[0];
	        this.setTargetSetter(propertyMenu);
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

	setTargetSetter: function (menu) {
	    var choices = this.target.colorSetters(),
	        // menu = new MenuMorph(this, 'choose target property:'),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each, function () {
	            myself.targetSetter = each;
	        });
	    });
	    if (choices.length === 1) {
	        this.targetSetter = choices[0];
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	}
});

ColorPaletteMorph.uber = Morph.prototype;
ColorPaletteMorph.className = 'ColorPaletteMorph';

module.exports = ColorPaletteMorph;