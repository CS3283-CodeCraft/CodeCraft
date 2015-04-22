var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');
var StringMorph = require('./StringMorph');
var SymbolMorph = require('./SymbolMorph');

var PushButtonMoprhConfig = {
    FONT_SIZE: 10,
    FONT_STYLE: 'sans-serif',
    LABEL_COLOR: new Color(0, 0, 0),
    LABEL_SHADOW_COLOR: new Color(255, 255, 255),
    LABEL_SHADOW_COLOR_OFFSET: new Point(1, 1),
    COLOR: new Color(220, 220, 220),
    PRESS_COLOR: new Color(115, 180, 240),
    OUTLINE_COLOR: new Color(30, 30, 30),
    OUTLINE_GRADIENT: false,
    OUTLINE_COLOR: false,
    CONTRAST: 60,
    EDGE: 2,
    CORNER: 5,
    OUTLINE: 1.00001, 
    PADDING: 3,
};

var PushButtonMorph = Class.create(TriggerMorph, {

    // PushButtonMorph /////////////////////////////////////////////////////

    // I am a Button with rounded corners and 3D-ish graphical effects

    // PushButtonMorph preferences settings:

    fontSize: PushButtonMoprhConfig.FONT_SIZE,
    fontStyle: PushButtonMoprhConfig.FONT_STYLE,
    labelColor: PushButtonMoprhConfig.LABEL_COLOR,
    labelShadowColor: PushButtonMoprhConfig.LABEL_SHADOW_COLOR,
    labelShadowOffset: PushButtonMoprhConfig.LABEL_SHADOW_COLOR_OFFSET,

    color: PushButtonMoprhConfig.COLOR,
    //color: "rgb(155, 102, 102)", 
    pressColor: PushButtonMoprhConfig.PRESS_COLOR,
    highlightColor: PushButtonMoprhConfig.PRESS_COLOR.lighter(50),
    outlineColor: PushButtonMoprhConfig.OUTLINE_COLOR,
    outlineGradient: PushButtonMoprhConfig.OUTLINE_GRADIENT,
    contrast: PushButtonMoprhConfig.CONTRAST,

    edge: PushButtonMoprhConfig.EDGE,
    corner: PushButtonMoprhConfig.CORNER,
    outline: PushButtonMoprhConfig.OUTLINE,
    padding: PushButtonMoprhConfig.PADDING,


    initialize: function(
        target,
        action,
        labelString,
        environment,
        hint,
        template,
        style
    ){
        this.init(
            target,
            action,
            labelString,
            environment,
            hint,
            template,
            style
        );
    },



    init: function (
        target,
        action,
        labelString,
        environment,
        hint,
        template,
        style
    ) {
        // additional properties:
        this.is3D = false; // for "flat" design exceptions
        this.target = target || null;
        this.action = action || null;
        this.environment = environment || null;
        this.labelString = labelString || null;
        this.label = null;
        this.labelMinExtent = new Point(0, 0);
        this.hint = hint || null;
        this.template = template || null; // for pre-computed backbrounds
        // if a template is specified, its background images are used as cache

        // initialize inherited properties:
        // BUG? TYPO?
        TriggerMorph.uber.init.call(this);

        // override inherited properties:
        this.color = PushButtonMorph.prototype.color;


        if(style === "show green button"){
            var greenColor = new Color(60, 158, 0);
            var lightGreenColor = new Color(80, 209, 0);
            var col = new Color(255,255,255,0.01);
            
            this.color = col;
            this.labelColor = new Color(0,0,0,0.1);
            this.highlightColor = greenColor;
            this.pressColor = lightGreenColor;
            this.outlineColor = new Color(30,30,30,0.1);
            this.outline = 0.01;
            this.edge = 0;
            this.padding = 0;
            this.corner = 35;
            this.fontSize = 40;
            this.label.setCenter(this.center());
        }

        // xinni: using demo to style buttons. rename demo to 'style' at a later time
        if (style === "green") {
            var greenColor = new Color(60, 158, 0);
            var lightGreenColor = new Color(80, 209, 0);
            var white = new Color(255, 255, 255);

            this.color = greenColor;
            this.highlightColor = lightGreenColor;
            this.pressColor = lightGreenColor;
            this.labelColor = white;

            this.fontSize = 15;
            this.label.setCenter(this.center());
            this.padding = 7;
        }

        if (style === "red") {
            var redColor = new Color(204, 0, 0);
            var lightRedColor = new Color(255, 51, 51);
            var white = new Color(255, 255, 255);

            this.color = redColor;
            this.highlightColor = lightRedColor;
            this.pressColor = lightRedColor;
            this.labelColor = white;

            this.fontSize = 15;
            this.label.setCenter(this.center());
            this.padding = 7;
        }

        if (style === "symbolButton") {
            var colors = [
                (new Color(230, 230, 230)).darker(3),
                (new Color(255, 255, 255)).darker(40),
                (new Color(255, 255, 255)).darker(40),
                new Color(70, 70, 70)
            ];

            this.corner = 12;
            this.color = colors[0];
            this.highlightColor = colors[1];
            this.pressColor = colors[2];
            this.labelMinExtent = new Point(36, 18);
            this.padding = 0;
            this.labelShadowOffset = new Point(-1, -1);
            this.labelShadowColor = colors[1];
            this.labelColor = colors[3];
            this.contrast = 30;
        }

        if (style === "iconButton") {
            var colors = [
                (new Color(230, 230, 230)).darker(3),
                (new Color(255, 255, 255)).darker(40),
                (new Color(255, 255, 255)).darker(40),
                new Color(70, 70, 70)
            ];

            this.corner = 14;
            this.color = colors[0];
            this.highlightColor = colors[1];
            this.pressColor = colors[2];
            this.labelMinExtent = new Point(36, 18);
            this.padding = 0;
            this.labelShadowOffset = new Point(-1, -1);
            this.labelShadowColor = colors[1];
            this.labelColor = colors[3];
            this.contrast = 30;
            this.fontName = "fontawesome";
            this.fontSize = 14;
        }

        if (style === "redCircleIconButton") {
            var colors = [
                (new Color(255, 61, 61)).darker(3),
                (new Color(255, 138, 138)).darker(40),
                (new Color(214, 0, 0)).darker(40),
                new Color(255, 255, 255)
            ];

            this.corner = 11;
            this.color = colors[0];
            this.highlightColor = colors[1];
            this.pressColor = colors[2];
            this.labelMinExtent = new Point(16, 16);
            this.padding = 0;
            this.labelShadowOffset = new Point(-1, -1);
            this.labelShadowColor = colors[1];
            this.labelColor = colors[3];
            this.contrast = 30;
            this.fontName = "fontawesome";
        }

        if (style === "deleteIconButton") {
            var colors = [
                (new Color(255, 61, 61)).darker(3),
                (new Color(255, 138, 138)).darker(40),
                (new Color(214, 0, 0)).darker(40),
                new Color(255, 255, 255)
            ];

            this.corner = 14;
            this.color = colors[0];
            this.highlightColor = colors[1];
            this.pressColor = colors[2];
            this.labelMinExtent = new Point(20, 20);
            this.padding = 0;
            this.labelShadowOffset = new Point(-1, -1);
            this.labelShadowColor = colors[1];
            this.labelColor = colors[3];
            this.contrast = 30;
            this.fontName = "fontawesome";
        }

        this.drawNew();
        this.fixLayout();
    },

    // PushButtonMorph layout:

    fixLayout: function () {
        // make sure I at least encompass my label
        if (this.label !== null) {
            var padding = this.padding * 2 + this.outline * 2 + this.edge * 2;
            this.setExtent(new Point(
                Math.max(this.label.width(), this.labelMinExtent.x) + padding,
                Math.max(this.label instanceof StringMorph ?
                    this.label.rawHeight() :
                    this.label.height(), this.labelMinExtent.y) + padding
            ));
            this.label.setCenter(this.center());
        }
    },

    // PushButtonMorph events

    mouseDownLeft: function ($super) {
        $super();
        if (this.label) {
            this.label.setCenter(this.center().add(1));
        }
    },

    mouseClickLeft: function ($super) {
        $super();
        if (this.label) {
            this.label.setCenter(this.center());
        }
    },

    mouseLeave: function ($super) {
        $super();
        if (this.label) {
            this.label.setCenter(this.center());
        }
    },

    // PushButtonMorph drawing:

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

    drawOutline: function (context) {
        var outlineStyle,
            isFlat = MorphicPreferences.isFlat && !this.is3D;

        if (!this.outline || isFlat) {return null; }
        if (this.outlineGradient) {
            outlineStyle = context.createLinearGradient(
                0,
                0,
                0,
                this.height()
            );
            outlineStyle.addColorStop(1, 'white');
            outlineStyle.addColorStop(0, this.outlineColor.darker().toString());
        } else {
            outlineStyle = this.outlineColor.toString();
        }
        context.fillStyle = outlineStyle;
        context.beginPath();
        this.outlinePath(
            context,
            /*isFlat ? 0 : */this.corner,
            0
        );
        context.closePath();
        context.fill();
    },

    drawBackground: function (context, color) {
        var isFlat = MorphicPreferences.isFlat && !this.is3D;

        context.fillStyle = color.toString();
        context.beginPath();
        this.outlinePath(
            context,
            /*isFlat ? 0 : */Math.max(this.corner - this.outline, 0),
            this.outline
        );
        context.closePath();
        context.fill();
        context.lineWidth = this.outline;
    },

    drawEdges: function (
        context,
        color,
        topColor,
        bottomColor
    ) {
        if (MorphicPreferences.isFlat && !this.is3D) {return; }
        var minInset = Math.max(this.corner, this.outline + this.edge),
            w = this.width(),
            h = this.height(),
            gradient;

        // top:
        gradient = context.createLinearGradient(
            0,
            this.outline,
            0,
            this.outline + this.edge
        );
        gradient.addColorStop(0, topColor.toString());
        gradient.addColorStop(1, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.moveTo(minInset, this.outline + this.edge / 2);
        context.lineTo(w - minInset, this.outline + this.edge / 2);
        context.stroke();

        // top-left corner:
        gradient = context.createRadialGradient(
            this.corner,
            this.corner,
            Math.max(this.corner - this.outline - this.edge, 0),
            this.corner,
            this.corner,
            Math.max(this.corner - this.outline, 0)
        );
        gradient.addColorStop(1, topColor.toString());
        gradient.addColorStop(0, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.arc(
            this.corner,
            this.corner,
            Math.max(this.corner - this.outline - this.edge / 2, 0),
            radians(180),
            radians(270),
            false
        );
        context.stroke();

        // left:
        gradient = context.createLinearGradient(
            this.outline,
            0,
            this.outline + this.edge,
            0
        );
        gradient.addColorStop(0, topColor.toString());
        gradient.addColorStop(1, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.moveTo(this.outline + this.edge / 2, minInset);
        context.lineTo(this.outline + this.edge / 2, h - minInset);
        context.stroke();

        // bottom:
        gradient = context.createLinearGradient(
            0,
            h - this.outline,
            0,
            h - this.outline - this.edge
        );
        gradient.addColorStop(0, bottomColor.toString());
        gradient.addColorStop(1, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.moveTo(minInset, h - this.outline - this.edge / 2);
        context.lineTo(w - minInset, h - this.outline - this.edge / 2);
        context.stroke();

        // bottom-right corner:
        gradient = context.createRadialGradient(
            w - this.corner,
            h - this.corner,
            Math.max(this.corner - this.outline - this.edge, 0),
            w - this.corner,
            h - this.corner,
            Math.max(this.corner - this.outline, 0)
        );
        gradient.addColorStop(1, bottomColor.toString());
        gradient.addColorStop(0, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.arc(
            w - this.corner,
            h - this.corner,
            Math.max(this.corner - this.outline - this.edge / 2, 0),
            radians(0),
            radians(90),
            false
        );
        context.stroke();

        // right:
        gradient = context.createLinearGradient(
            w - this.outline,
            0,
            w - this.outline - this.edge,
            0
        );
        gradient.addColorStop(0, bottomColor.toString());
        gradient.addColorStop(1, color.toString());

        context.strokeStyle = gradient;
        context.lineCap = 'round';
        context.lineWidth = this.edge;
        context.beginPath();
        context.moveTo(w - this.outline - this.edge / 2, minInset);
        context.lineTo(w - this.outline - this.edge / 2, h - minInset);
        context.stroke();
    },

    createBackgrounds: function () {
        var context,
            ext = this.extent();

        if (this.template) { // take the backgrounds images from the template
            this.image = this.template.image;
            this.normalImage = this.template.normalImage;
            this.highlightImage = this.template.highlightImage;
            this.pressImage = this.template.pressImage;
            return null;
        }

        this.normalImage = newCanvas(ext);
        context = this.normalImage.getContext('2d');
        this.drawOutline(context);
        this.drawBackground(context, this.color);
        this.drawEdges(
            context,
            this.color,
            this.color.lighter(this.contrast),
            this.color.darker(this.contrast)
        );

        this.highlightImage = newCanvas(ext);
        context = this.highlightImage.getContext('2d');
        this.drawOutline(context);
        this.drawBackground(context, this.highlightColor);
        this.drawEdges(
            context,
            this.highlightColor,
            this.highlightColor.lighter(this.contrast),
            this.highlightColor.darker(this.contrast)
        );

        this.pressImage = newCanvas(ext);
        context = this.pressImage.getContext('2d');
        this.drawOutline(context);
        this.drawBackground(context, this.pressColor);
        this.drawEdges(
            context,
            this.pressColor,
            this.pressColor.darker(this.contrast),
            this.pressColor.lighter(this.contrast)
        );

        this.image = this.normalImage;
    },

    createLabel: function () {
        var shading = !MorphicPreferences.isFlat || this.is3D;

        if (this.label !== null) {
            this.label.destroy();
        }
        if (this.labelString instanceof SymbolMorph) {
            this.label = this.labelString.fullCopy();
            if (shading) {
                this.label.shadowOffset = this.labelShadowOffset;
                this.label.shadowColor = this.labelShadowColor;
            }
            this.label.color = this.labelColor;
            this.label.drawNew();
        } else {
            this.label = new StringMorph(
                localize(this.labelString),
                this.fontSize,
                this.fontStyle,
                true,
                false,
                false,
                shading ? this.labelShadowOffset : null,
                this.labelShadowColor,
                this.labelColor,
                this.fontName
            );
        }
        this.add(this.label);
    }
});

PushButtonMorph.uber = TriggerMorph.prototype;
PushButtonMorph.className = 'PushButtonMorph';

module.exports = PushButtonMorph;