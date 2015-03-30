var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');

var HandleMorph = Class.create(Morph, {

	// HandleMorph ////////////////////////////////////////////////////////

	// I am a resize / move handle that can be attached to any Morph

	initialize: function(target, minX, minY, insetX, insetY, type){
		this.init(target, minX, minY, insetX, insetY, type);
	},

	init: function($super, target, minX, minY, insetX, insetY, type){
		var size = MorphicPreferences.handleSize;
	    this.target = target || null;
	    this.minExtent = new Point(minX || 0, minY || 0);
	    this.inset = new Point(insetX || 0, insetY || insetX || 0);
	    this.type =  type || 'resize'; // can also be 'move'
	    $super();
	    this.color = new Color(255, 255, 255);
	    this.isDraggable = false;
	    this.noticesTransparentClick = true;
	    this.setExtent(new Point(size, size));
	},

	// HandleMorph drawing:

	drawNew: function () {
	    this.normalImage = newCanvas(this.extent());
	    this.highlightImage = newCanvas(this.extent());
	    this.drawOnCanvas(
	        this.normalImage,
	        this.color,
	        new Color(100, 100, 100)
	    );
	    this.drawOnCanvas(
	        this.highlightImage,
	        new Color(100, 100, 255),
	        new Color(255, 255, 255)
	    );
	    this.image = this.normalImage;
	    if (this.target) {
	        this.setPosition(
	            this.target.bottomRight().subtract(
	                this.extent().add(this.inset)
	            )
	        );
	        this.target.add(this);
	        this.target.changed();
	    }
	},

	drawOnCanvas: function (
	    aCanvas,
	    color,
	    shadowColor
	) {
	    var context = aCanvas.getContext('2d'),
	        p1,
	        p11,
	        p2,
	        p22,
	        i;

	    context.lineWidth = 1;
	    context.lineCap = 'round';

	    context.strokeStyle = color.toString();

	    if (this.type === 'move') {

	        p1 = this.bottomLeft().subtract(this.position());
	        p11 = p1.copy();
	        p2 = this.topRight().subtract(this.position());
	        p22 = p2.copy();

	        for (i = 0; i <= this.height(); i = i + 6) {
	            p11.y = p1.y - i;
	            p22.y = p2.y - i;

	            context.beginPath();
	            context.moveTo(p11.x, p11.y);
	            context.lineTo(p22.x, p22.y);
	            context.closePath();
	            context.stroke();
	        }
	    }

	    p1 = this.bottomLeft().subtract(this.position());
	    p11 = p1.copy();
	    p2 = this.topRight().subtract(this.position());
	    p22 = p2.copy();

	    for (i = 0; i <= this.width(); i = i + 6) {
	        p11.x = p1.x + i;
	        p22.x = p2.x + i;

	        context.beginPath();
	        context.moveTo(p11.x, p11.y);
	        context.lineTo(p22.x, p22.y);
	        context.closePath();
	        context.stroke();
	    }

	    context.strokeStyle = shadowColor.toString();

	    if (this.type === 'move') {

	        p1 = this.bottomLeft().subtract(this.position());
	        p11 = p1.copy();
	        p2 = this.topRight().subtract(this.position());
	        p22 = p2.copy();

	        for (i = -2; i <= this.height(); i = i + 6) {
	            p11.y = p1.y - i;
	            p22.y = p2.y - i;

	            context.beginPath();
	            context.moveTo(p11.x, p11.y);
	            context.lineTo(p22.x, p22.y);
	            context.closePath();
	            context.stroke();
	        }
	    }

	    p1 = this.bottomLeft().subtract(this.position());
	    p11 = p1.copy();
	    p2 = this.topRight().subtract(this.position());
	    p22 = p2.copy();

	    for (i = 2; i <= this.width(); i = i + 6) {
	        p11.x = p1.x + i;
	        p22.x = p2.x + i;

	        context.beginPath();
	        context.moveTo(p11.x, p11.y);
	        context.lineTo(p22.x, p22.y);
	        context.closePath();
	        context.stroke();
	    }
	},

	// HandleMorph stepping:

	step: null,

	mouseDownLeft: function (pos) {
	    var world = this.root(),
	        offset = pos.subtract(this.bounds.origin),
	        myself = this;

	    if (!this.target) {
	        return null;
	    }
	    this.step = function () {
	        var newPos, newExt;
	        if (world.hand.mouseButton) {
	            newPos = world.hand.bounds.origin.copy().subtract(offset);
	            if (this.type === 'resize') {
	                newExt = newPos.add(
	                    myself.extent().add(myself.inset)
	                ).subtract(myself.target.bounds.origin);
	                newExt = newExt.max(myself.minExtent);
	                myself.target.setExtent(newExt);

	                myself.setPosition(
	                    myself.target.bottomRight().subtract(
	                        myself.extent().add(myself.inset)
	                    )
	                );
	            } else { // type === 'move'
	                myself.target.setPosition(
	                    newPos.subtract(this.target.extent())
	                        .add(this.extent())
	                );
	            }
	        } else {
	            this.step = null;
	        }
	    };
	    if (!this.target.step) {
	        this.target.step = function () {
	            nop();
	        };
	    }
	},

	// HandleMorph dragging and dropping:

	rootForGrab: function () {
	    return this;
	},

	// HandleMorph events:

	mouseEnter: function () {
	    this.image = this.highlightImage;
	    this.changed();
	},

	mouseLeave: function () {
	    this.image = this.normalImage;
	    this.changed();
	},

	// HandleMorph duplicating:

	copyRecordingReferences: function (dict) {
	    // inherited, see comment in Morph
	    var c = HandleMorph.uber.copyRecordingReferences.call(
	        this,
	        dict
	    );
	    if (c.target && dict[this.target]) {
	        c.target = (dict[this.target]);
	    }
	    return c;
	},

	// HandleMorph menu:

	attach: function (menu) {
		// menu is a instance of MenuMorph;
	    var choices = this.overlappedMorphs(),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each.toString().slice(0, 50), function () {
	            myself.isDraggable = false;
	            myself.target = each;
	            myself.drawNew();
	            myself.noticesTransparentClick = true;
	        });
	    });
	    if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	}
});

HandleMorph.uber = Morph.prototype;
HandleMorph.className = 'HandleMorph';

module.exports = HandleMorph;