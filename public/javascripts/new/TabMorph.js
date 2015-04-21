var ToggleButtonMorph = require('./ToggleButtonMorph');
var Point = require('./Point');

var TabMorph = Class.create(ToggleButtonMorph, {
    
    // TabMorph ///////////////////////////////////////////////////////
    
    initialize: function(
        colors, // color overrides, <array>: [normal, highlight, pressed]
        target,
        action, // a toggle function
        labelString,
        query, // predicate/selector
        environment,
        hint
    ) {
        this.init(
            colors,
            target,
            action,
            labelString,
            query,
            environment,
            hint
        );
    },

    // TabMorph layout:

    fixLayout: function () {
        if (this.label !== null) {
            this.setExtent(new Point(
                this.label.width()
                    + this.padding * 2
                    + this.corner * 3
                    + this.edge * 2,
                (this.label instanceof StringMorph ?
                            this.label.rawHeight() : this.label.height())
                    + this.padding * 2
                    + this.edge
            ));
            this.label.setCenter(this.center());
        }
    },

    // TabMorph action:

    refresh: function ($super) {
        if (this.state) { // bring to front
            if (this.parent) {
                this.parent.add(this);
            }
        }
        $super()
    },

    // TabMorph drawing:

    drawBackground: function (context, color) {
        var w = this.width(),
            h = this.height(),
            c = this.corner;

        context.fillStyle = color.toString();
        context.beginPath();
        context.moveTo(0, h);
        context.bezierCurveTo(c, h, c, 0, c * 2, 0);
        context.lineTo(w - c * 2, 0);
        context.bezierCurveTo(w - c, 0, w - c, h, w, h);
        context.closePath();
        context.fill();
    },

    drawOutline: function () {
        nop();
    },

    drawEdges: function (
        context,
        color,
        topColor,
        bottomColor
    ) {
        if (MorphicPreferences.isFlat && !this.is3D) {return; }

        var w = this.width(),
            h = this.height(),
            c = this.corner,
            e = this.edge,
            eh = e / 2,
            gradient;

        nop(color); // argument not needed here

        gradient = context.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, topColor.toString());
        gradient.addColorStop(1, bottomColor.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = e;

        context.beginPath();
        context.moveTo(0, h + eh);
        context.bezierCurveTo(c, h, c, 0, c * 2, eh);
        context.lineTo(w - c * 2, eh);
        context.bezierCurveTo(w - c, 0, w - c, h, w, h + eh);
        context.stroke();
    }
});

TabMorph.uber = ToggleButtonMorph.prototype;
TabMorph.className = 'TabMorph';

module.exports = TabMorph;