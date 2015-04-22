
var PushButtonMorph = require('./PushButtonMorph');
var Point = require('./Point');
var TextMorph = require('./TextMorph');
var StringMorph = require('./StringMorph');
var Morph = require('./Morph');
var ToggleElementMorph = require('./ToggleElementMorph');
var ToggleButtonMorph = require('./ToggleButtonMorph');

var ToggleMorph = Class.create(PushButtonMorph, {
    

    // ToggleMorph ///////////////////////////////////////////////////////

    /*
        I am a PushButton which toggles a check mark ( becoming check box)
        or a bullet (becoming a radio button). I can have both or either an
        additional label and an additional pictogram, whereas the pictogram
        can be either an instance of (any) Morph, in which case the pictogram
        will be an interactive toggle itself or a Canvas, in which case it
        is just going to be a picture.
    */

    initialize: function(
        style, // 'checkbox' or 'radiobutton'
        target,
        action, // a toggle function
        labelString,
        query, // predicate/selector
        environment,
        hint,
        template,
        element, // optional Morph or Canvas to display
        builder // method which constructs the element (only for Morphs)
        
    ) {
        this.init(
            style,
            target,
            action,
            labelString,
            query,
            environment,
            hint,
            template,
            element,
            builder
        );
    },

    init: function (
        $super,
        style,
        target,
        action,
        labelString,
        query,
        environment,
        hint,
        template,
        element,
        builder
    ) {
        // additional properties:
        this.padding = 1;
        style = style || 'checkbox';
        this.corner = (style === 'checkbox' ?
                0 : fontHeight(this.fontSize) / 2 + this.outline + this.padding);
        this.state = false;
        this.query = query || function () {return true; };
        this.tick = null;
        this.captionString = labelString || null;
        this.labelAlignment = 'right';
        this.element = element || null;
        this.builder = builder || null;
        this.toggleElement = null;

        // initialize inherited properties:
        $super(
            target,
            action,
            (style === 'checkbox' ? '\u2713' : '\u25CF'),
            environment,
            hint,
            template
            );

        this.refresh();
        this.drawNew();
        this.createLabel();
        
    },

    // ToggleMorph layout:

    fixLayout: function () {
        var padding = this.padding * 2 + this.outline * 2,
            y;
        if (this.tick !== null) {
            this.silentSetHeight(this.tick.rawHeight() + padding);
            this.silentSetWidth(this.tick.width() + padding);

            this.setExtent(new Point(
                Math.max(this.width(), this.height()),
                Math.max(this.width(), this.height())
            ));
            this.tick.setCenter(this.center());
        }
        if (this.state) {
            this.tick.show();
        } else {
            this.tick.hide();
        }
        if (this.toggleElement && (this.labelAlignment === 'right')) {
            y = this.top() + (this.height() - this.toggleElement.height()) / 2;
            this.toggleElement.setPosition(new Point(
                this.right() + padding,
                y
            ));
        }
        if (this.label !== null) {
            y = this.top() + (this.height() - this.label.height()) / 2;
            if (this.labelAlignment === 'right') {
                this.label.setPosition(new Point(
                    this.toggleElement ?
                            this.toggleElement instanceof ToggleElementMorph ?
                                    this.toggleElement.right()
                                    : this.toggleElement.right() + padding
                            : this.right() + padding,
                    y
                ));
            } else {
                this.label.setPosition(new Point(
                    this.left() - this.label.width() - padding,
                    y
                ));
            }
        }
    },

    createLabel: function () {
        var shading = !MorphicPreferences.isFlat || this.is3D;

        if (this.label === null) {
            if (this.captionString) {
                this.label = new TextMorph(
                    localize(this.captionString),
                    this.fontSize + 4,
                    this.fontStyle,
                    true
                );
                this.add(this.label);
            }
        }
        if (this.tick === null) {
            this.tick = new StringMorph(
                localize(this.labelString),
                this.fontSize + 5,
                this.fontStyle,
                true,
                false,
                false,
                shading ? new Point(1, 1) : null,
                new Color(240, 240, 240)
            );
            this.add(this.tick);
        }
        if (this.toggleElement === null) {
            if (this.element) {
                if (this.element instanceof Morph) {
                    this.toggleElement = new ToggleElementMorph(
                        this.target,
                        this.action,
                        this.element,
                        this.query,
                        this.environment,
                        this.hint,
                        this.builder
                    );
                } else if (this.element instanceof HTMLCanvasElement) {
                    this.toggleElement = new Morph();
                    this.toggleElement.silentSetExtent(new Point(
                        this.element.width,
                        this.element.height
                    ));
                    this.toggleElement.image = this.element;
                }
                this.add(this.toggleElement);
            }
        }
    },

    // ToggleMorph action:

    trigger: function () {
        ToggleMorph.uber.trigger.call(this);
        this.refresh();
    },

    refresh: function () {
        /*
        if query is a function:
        execute the query with target as environment (can be null)
        for lambdafied (inline) actions

        else if query is a String:
        treat it as function property of target and execute it
        for selector-like queries
        */
        if (typeof this.query === 'function') {
            this.state = this.query.call(this.target);
        } else { // assume it's a String
            this.state = this.target[this.query]();
        }
        if (this.state) {
            this.tick.show();
        } else {
            this.tick.hide();
        }
        if (this.toggleElement && this.toggleElement.refresh) {
            this.toggleElement.refresh();
        }
    },

    // ToggleMorph events

    mouseDownLeft: function () {
        PushButtonMorph.uber.mouseDownLeft.call(this);
        if (this.tick) {
            this.tick.setCenter(this.center().add(1));
        }
    },

    mouseClickLeft: function () {
        PushButtonMorph.uber.mouseClickLeft.call(this);
        if (this.tick) {
            this.tick.setCenter(this.center());
        }
    },

    mouseLeave: function () {
        PushButtonMorph.uber.mouseLeave.call(this);
        if (this.tick) {
            this.tick.setCenter(this.center());
        }
    },

    // ToggleMorph hiding and showing:

    /*
        override the inherited behavior to recursively hide/show all
        children, so that my instances get restored correctly when
        hiding/showing my parent.
    */

    hide: ToggleButtonMorph.prototype.hide,

    show: ToggleButtonMorph.prototype.show
});

ToggleMorph.uber = PushButtonMorph.prototype;
ToggleMorph.className = 'ToggleMorph';

module.exports = ToggleMorph;