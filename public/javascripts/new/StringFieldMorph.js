var FrameMorph = require('./FrameMorph');
var Point = require('./Point');
var StringMorph = require('./StringMorph');

var StringFieldMorph = Class.create(FrameMorph, {
	
	initialize: function(
	    defaultContents,
	    minWidth,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric
	) {
	    this.init(
	        defaultContents || '',
	        minWidth || 100,
	        fontSize || 12,
	        fontStyle || 'sans-serif',
	        bold || false,
	        italic || false,
	        isNumeric
	    );
	},

	init: function (
		$super,
	    defaultContents,
	    minWidth,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric
	) {
	    this.defaultContents = defaultContents;
	    this.minWidth = minWidth;
	    this.fontSize = fontSize;
	    this.fontStyle = fontStyle;
	    this.isBold = bold;
	    this.isItalic = italic;
	    this.isNumeric = isNumeric || false;
	    this.text = null;
	    $super();
	    this.color = new Color(255, 255, 255);
	    this.isEditable = true;
	    this.acceptsDrops = false;
	    this.drawNew();
	},

	drawNew: function ($super) {
	    var txt;
	    txt = this.text ? this.string() : this.defaultContents;
	    this.text = null;
	    this.children.forEach(function (child) {
	        child.destroy();
	    });
	    this.children = [];
	    this.text = new StringMorph(
	        txt,
	        this.fontSize,
	        this.fontStyle,
	        this.isBold,
	        this.isItalic,
	        this.isNumeric
	    );

	    this.text.isNumeric = this.isNumeric; // for whichever reason...
	    this.text.setPosition(this.bounds.origin.copy());
	    this.text.isEditable = this.isEditable;
	    this.text.isDraggable = false;
	    this.text.enableSelecting();
	    this.silentSetExtent(
	        new Point(
	            Math.max(this.width(), this.minWidth),
	            this.text.height()
	        )
	    );
	    $super();
	    this.add(this.text);
	},

	string: function () {
	    return this.text.text;
	},

	mouseClickLeft: function (pos) {
	    if (this.isEditable) {
	        this.text.edit();
	    } else {
	        this.escalateEvent('mouseClickLeft', pos);
	    }
	},

	// StringFieldMorph duplicating:

	copyRecordingReferences: function ($super, dict) {
	    // inherited, see comment in Morph
	    var c = $super(dict);
	    if (c.text && dict[this.text]) {
	        c.text = (dict[this.text]);
	    }
	    return c;
	}
});

StringFieldMorph.uber = FrameMorph.prototype;
StringFieldMorph.className = 'StringFieldMorph';

module.exports = StringFieldMorph;