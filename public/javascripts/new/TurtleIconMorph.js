/**
 * Created by Shurelia on 30/3/2015.
 */


var Point = require('./Point');
var Color = require('./Color');
var FrameMorph = require('./FrameMorph');
var StringMorph = require('./StringMorph');
var MenuMorph = require('./MenuMorph');
var ToggleButtonMorph = require('./ToggleButtonMorph');

// TurtleIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a thumbnail of the sprite's or stage's default "Turtle" costume.
 */

// TurtleIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

var TurtleIconMorph = Class.create(ToggleButtonMorph, {
    initialize: function() {

    },

    init: function($super, aSpriteOrStage, aTemplate) {
        var colors, action, query, myself = this;

        if (!aTemplate) {
            colors = [
                IDE_Morph.prototype.groupColor,
                IDE_Morph.prototype.frameColor,
                IDE_Morph.prototype.frameColor
            ];

        }

        action = function () {
            // make my costume the current one
            var ide = myself.parentThatIsA('IDE_Morph'),
                wardrobe = myself.parentThatIsA('WardrobeMorph');

            if (ide) {
                ide.currentSprite.wearCostume(null);
            }
            if (wardrobe) {
                wardrobe.updateSelection();
            }
        };

        query = function () {
            // answer true if my costume is the current one
            var ide = myself.parentThatIsA('IDE_Morph');

            if (ide) {
                return ide.currentSprite.costume === null;
            }
            return false;
        };

        // additional properties:
        this.object = aSpriteOrStage; // mandatory, actually
        this.version = this.object.version;
        this.thumbnail = null;

        // initialize inherited properties:
        TurtleIconMorph.uber.init.call(
            this,
            colors, // color overrides, <array>: [normal, highlight, pressed]
            null, // target - not needed here
            action, // a toggle function
            'default', // label string
            query, // predicate/selector
            null, // environment
            null, // hint
            aTemplate // optional, for cached background images
        );

        // override defaults and build additional components
        this.isDraggable = false;
        this.createThumbnail();
        this.padding = 2;
        this.corner = 8;
        this.fixLayout();
    },

    createThumbnail: function () {
        var isFlat = MorphicPreferences.isFlat;

        if (this.thumbnail) {
            this.thumbnail.destroy();
        }
        if (this.object instanceof SpriteMorph) {
            this.thumbnail = new SymbolMorph(
                'turtle',
                this.thumbSize.y,
                this.labelColor,
                isFlat ? null : new Point(-1, -1),
                new Color(0, 0, 0)
            );
        } else {
            this.thumbnail = new SymbolMorph(
                'stage',
                this.thumbSize.y,
                this.labelColor,
                isFlat ? null : new Point(-1, -1),
                new Color(0, 0, 0)
            );
        }
        this.add(this.thumbnail);
    },

    createLabel: function () {
        var txt;

        if (this.label) {
            this.label.destroy();
        }
        txt = new StringMorph(
            localize(
                this.object instanceof SpriteMorph ? 'Turtle' : 'Empty'
            ),
            this.fontSize,
            this.fontStyle,
            true,
            false,
            false,
            this.labelShadowOffset,
            this.labelShadowColor,
            this.labelColor
        );

        this.label = new FrameMorph();
        this.label.acceptsDrops = false;
        this.label.alpha = 0;
        this.label.setExtent(txt.extent());
        txt.setPosition(this.label.position());
        this.label.add(txt);
        this.add(this.label);
    },

    // TurtleIconMorph layout
    fixLayout: SpriteIconMorph.prototype.fixLayout,

    // TurtleIconMorph drawing
    createBackgrounds: SpriteIconMorph.prototype.createBackgrounds,

    // TurtleIconMorph user menu
    userMenu: function () {
        var myself = this,
            menu = new MenuMorph(this, 'pen'),
            on = '\u25CF',
            off = '\u25CB';
        if (this.object instanceof StageMorph) {
            return null;
        }
        menu.addItem(
            (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
            function () {
                myself.object.penPoint = 'tip';
                myself.object.changed();
                myself.object.drawNew();
                myself.object.changed();
            }
        );
        menu.addItem(
            (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
                'middle'
            ),
            function () {
                myself.object.penPoint = 'middle';
                myself.object.changed();
                myself.object.drawNew();
                myself.object.changed();
            }
        );
        return menu;
    }
});

TurtleIconMorph.uber = ToggleButtonMorph.prototype;
TurtleIconMorph.className = 'TurtleIconMorph';

module.exports = TurtleIconMorph;