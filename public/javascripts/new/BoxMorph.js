var Morph = require('./Morph');
var Color = require('./Color');

var BoxMorph = Class.create(Morph, {

    // BoxMorph ////////////////////////////////////////////////////////////

    // I can have an optionally rounded border
    
    initialize: function(edge, border, borderColor) {
        this.init(edge, border, borderColor);
    },

    init: function ($super, edge, border, borderColor) {
        this.edge = edge || 4;
        this.border = border || ((border === 0) ? 0 : 2);
        this.borderColor = borderColor || new Color();
        $super();
    },

    // BoxMorph drawing:

    drawNew: function ($super) {
        var context;

        this.image = newCanvas(this.extent());
        context = this.image.getContext('2d');
        if ((this.edge === 0) && (this.border === 0)) {
            $super();
            return null;
        }
        context.fillStyle = this.color.toString();
        context.beginPath();
        this.outlinePath(
            context,
            Math.max(this.edge - this.border, 0),
            this.border
        );
        context.closePath();
        context.fill();
        if (this.border > 0) {
            context.lineWidth = this.border;
            context.strokeStyle = this.borderColor.toString();
            context.beginPath();
            this.outlinePath(context, this.edge, this.border / 2);
            context.closePath();
            context.stroke();
        }
    },

    outlinePath: function (context, radius, inset) {
        var offset = radius + inset,
            w = this.width(),
            h = this.height();

        // top left:
        context.arc(
            offset,
            offset,
            radius,
            radians(-180),
            radians(-90),
            false
        );
        // top right:
        context.arc(
            w - offset,
            offset,
            radius,
            radians(-90),
            radians(-0),
            false
        );
        // bottom right:
        context.arc(
            w - offset,
            h - offset,
            radius,
            radians(0),
            radians(90),
            false
        );
        // bottom left:
        context.arc(
            offset,
            h - offset,
            radius,
            radians(90),
            radians(180),
            false
        );
    },

    // BoxMorph menus:

    developersMenu: function ($super) {
        var menu = $super();
        menu.addLine();
        menu.addItem(
            "border width...",
            function () {
                this.prompt(
                    menu.title + '\nborder\nwidth:',
                    this.setBorderWidth,
                    this,
                    this.border.toString(),
                    null,
                    0,
                    100,
                    true
                );
            },
            'set the border\'s\nline size'
        );
        menu.addItem(
            "border color...",
            function () {
                this.pickColor(
                    menu.title + '\nborder color:',
                    this.setBorderColor,
                    this,
                    this.borderColor
                );
            },
            'set the border\'s\nline color'
        );
        menu.addItem(
            "corner size...",
            function () {
                this.prompt(
                    menu.title + '\ncorner\nsize:',
                    this.setCornerSize,
                    this,
                    this.edge.toString(),
                    null,
                    0,
                    100,
                    true
                );
            },
            'set the corner\'s\nradius'
        );
        return menu;
    },

    setBorderWidth: function (size) {
        // for context menu demo purposes
        var newSize;
        if (typeof size === 'number') {
            this.border = Math.max(size, 0);
        } else {
            newSize = parseFloat(size);
            if (!isNaN(newSize)) {
                this.border = Math.max(newSize, 0);
            }
        }
        this.drawNew();
        this.changed();
    },

    setBorderColor: function (color) {
        // for context menu demo purposes
        if (color) {
            this.borderColor = color;
            this.drawNew();
            this.changed();
        }
    },

    setCornerSize: function (size) {
        // for context menu demo purposes
        var newSize;
        if (typeof size === 'number') {
            this.edge = Math.max(size, 0);
        } else {
            newSize = parseFloat(size);
            if (!isNaN(newSize)) {
                this.edge = Math.max(newSize, 0);
            }
        }
        this.drawNew();
        this.changed();
    },

    colorSetters: function () {
        // for context menu demo purposes
        return ['color', 'borderColor'];
    },

    numericalSetters: function ($super) {
        // for context menu demo purposes
        var list = $super();
        list.push('setBorderWidth', 'setCornerSize');
        return list;
    }
});

BoxMorph.uber = Morph.prototype;
BoxMorph.className = 'BoxMorph';

module.exports = BoxMorph;