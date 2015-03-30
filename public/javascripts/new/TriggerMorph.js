
var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');
var StringMorph = require('./StringMorph');
var SpeechBubbleMorph = require('./SpeechBubbleMorph');

var TriggerMorph = Class.create(Morph, {

    // TriggerMorph ////////////////////////////////////////////////////////

    // I provide basic button functionality
    
    initialize: function(
        target,
        action,
        labelString,
        fontSize,
        fontStyle,
        environment,
        hint,
        labelColor,
        labelBold,
        labelItalic,
        doubleClickAction
    ) {
        this.init(
            target,
            action,
            labelString,
            fontSize,
            fontStyle,
            environment,
            hint,
            labelColor,
            labelBold,
            labelItalic,
            doubleClickAction
        );
    },

    init: function (
        $super,
        target,
        action,
        labelString,
        fontSize,
        fontStyle,
        environment,
        hint,
        labelColor,
        labelBold,
        labelItalic,
        doubleClickAction
    ) {
        // additional properties:
        this.target = target || null;
        this.action = action || null;
        this.doubleClickAction = doubleClickAction || null;
        this.environment = environment || null;
        this.labelString = labelString || null;
        this.label = null;
        this.hint = hint || null;
        this.fontSize = fontSize || MorphicPreferences.menuFontSize;
        this.fontStyle = fontStyle || 'sans-serif';
        this.highlightColor = new Color(192, 192, 192);
        this.pressColor = new Color(128, 128, 128);
        this.labelColor = labelColor || new Color(0, 0, 0);
        this.labelBold = labelBold || false;
        this.labelItalic = labelItalic || false;

        // initialize inherited properties:
        $super();

        // override inherited properites:
        this.color = new Color(255, 255, 255);
        this.drawNew();
    },

    // TriggerMorph drawing:

    drawNew: function () {
        this.createBackgrounds();
        if (this.labelString !== null) {
            this.createLabel();
        }
    },

    createBackgrounds: function () {
        var context,
            ext = this.extent();

        this.normalImage = newCanvas(ext);
        context = this.normalImage.getContext('2d');
        context.fillStyle = this.color.toString();
        context.fillRect(0, 0, ext.x, ext.y);

        this.highlightImage = newCanvas(ext);
        context = this.highlightImage.getContext('2d');
        context.fillStyle = this.highlightColor.toString();
        context.fillRect(0, 0, ext.x, ext.y);

        this.pressImage = newCanvas(ext);
        context = this.pressImage.getContext('2d');
        context.fillStyle = this.pressColor.toString();
        context.fillRect(0, 0, ext.x, ext.y);

        this.image = this.normalImage;
    },

    createLabel: function () {
        if (this.label !== null) {
            this.label.destroy();
        }
        this.label = new StringMorph(
            this.labelString,
            this.fontSize,
            this.fontStyle,
            this.labelBold,
            this.labelItalic,
            false, // numeric
            null, // shadow offset
            null, // shadow color
            this.labelColor
        );
        this.label.setPosition(
            this.center().subtract(
                this.label.extent().floorDivideBy(2)
            )
        );
        this.add(this.label);
    },

    // TriggerMorph duplicating:

    copyRecordingReferences: function ($super, dict) {
        // inherited, see comment in Morph
        var c = $super(dict);
        if (c.label && dict[this.label]) {
            c.label = (dict[this.label]);
        }
        return c;
    },

    // TriggerMorph action:

    trigger: function () {
        /*
        if target is a function, use it as callback:
        execute target as callback function with action as argument
        in the environment as optionally specified.
        Note: if action is also a function, instead of becoming
        the argument itself it will be called to answer the argument.
        for selections, Yes/No Choices etc. As second argument pass
        myself, so I can be modified to reflect status changes, e.g.
        inside a list box:

        else (if target is not a function):

            if action is a function:
            execute the action with target as environment (can be null)
            for lambdafied (inline) actions

            else if action is a String:
            treat it as function property of target and execute it
            for selector-like actions
        */
        if (typeof this.target === 'function') {
            if (typeof this.action === 'function') {
                this.target.call(this.environment, this.action.call(), this);
            } else {
                this.target.call(this.environment, this.action, this);
            }
        } else {
            if (typeof this.action === 'function') {
                this.action.call(this.target);
            } else { // assume it's a String
                this.target[this.action]();
            }
        }
    },

    triggerDoubleClick: function () {
        // same as trigger() but use doubleClickAction instead of action property
        // note that specifying a doubleClickAction is optional
        if (!this.doubleClickAction) {return; }
        if (typeof this.target === 'function') {
            if (typeof this.doubleClickAction === 'function') {
                this.target.call(
                    this.environment,
                    this.doubleClickAction.call(),
                    this
                );
            } else {
                this.target.call(this.environment, this.doubleClickAction, this);
            }
        } else {
            if (typeof this.doubleClickAction === 'function') {
                this.doubleClickAction.call(this.target);
            } else { // assume it's a String
                this.target[this.doubleClickAction]();
            }
        }
    },

    // TriggerMorph events:

    mouseEnter: function () {
        this.image = this.highlightImage;
        this.changed();
        if (this.hint) {
            this.bubbleHelp(this.hint);
        }
    },

    mouseLeave: function () {
        this.image = this.normalImage;
        this.changed();
        if (this.hint) {
            this.world().hand.destroyTemporaries();
        }
    },

    mouseDownLeft: function () {
        this.image = this.pressImage;
        this.changed();
    },

    mouseClickLeft: function () {
        this.image = this.highlightImage;
        this.changed();
        this.trigger();
    },

    mouseDoubleClick: function () {
        this.triggerDoubleClick();
    },

    rootForGrab: function ($super) {
        return this.isDraggable ? $super() : null;
    },

    // TriggerMorph bubble help:

    bubbleHelp: function (contents) {
        var myself = this;
        this.fps = 2;
        this.step = function () {
            if (this.bounds.containsPoint(this.world().hand.position())) {
                myself.popUpbubbleHelp(contents);
            }
            myself.fps = 0;
            delete myself.step;
        };
    },

    popUpbubbleHelp: function (contents) {
        new SpeechBubbleMorph(
            localize(contents),
            null,
            null,
            1
        ).popUp(this.world(), this.rightCenter().add(new Point(-8, 0)));
    }
});

TriggerMorph.uber = Morph.prototype;
TriggerMorph.className = 'TriggerMorph';

module.exports = TriggerMorph;