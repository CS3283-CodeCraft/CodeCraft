/**
 * Created by Aigis on 30-Mar-15.
 */


var Point = require('./Point');
;var Morph = require('./Morph')
var TextMorph = require('./TextMorph');
var FrameMorph = require('./FrameMorph');

var ScrollFrameMorph = require('./ScrollFrameMorph');

// JukeboxMorph /////////////////////////////////////////////////////

/*
 I am JukeboxMorph, like WardrobeMorph, but for sounds
 */

// JukeboxMorph instance creation

var JukeBoxMorph = Class.create(ScrollFrameMorph, {
    initialize: function(aSprite, sliderColor) {
        this.init(aSprite, sliderColor);
    },

    init: function ($super, aSprite, sliderColor) {
        $super();

        // additional properties
        this.sprite = aSprite || new SpriteMorph();
        this.costumesVersion = null;
        this.spriteVersion = null;

        // initialize inherited properties
        JukeboxMorph.uber.init.call(this, null, null, sliderColor);

        // configure inherited properties
        this.acceptsDrops = false;
        this.fps = 2;
        this.updateList();
    },

    // Jukebox updating
    updateList: function () {
        var myself = this,
            x = this.left() + 5,
            y = this.top() + 5,
            padding = 4,
            oldFlag = Morph.prototype.trackChanges,
            icon,
            template,
            txt;

        this.changed();
        oldFlag = Morph.prototype.trackChanges;
        Morph.prototype.trackChanges = false;

        this.contents.destroy();
        this.contents = new FrameMorph(this);
        this.contents.acceptsDrops = false;
        this.contents.reactToDropOf = function (icon) {
            myself.reactToDropOf(icon);
        };
        this.addBack(this.contents);

        txt = new TextMorph(localize(
            'import a sound from your computer\nby dragging it into here'
        ));
        txt.fontSize = 9;
        txt.setColor(SpriteMorph.prototype.paletteTextColor);
        txt.setPosition(new Point(x, y));
        this.addContents(txt);
        y = txt.bottom() + padding;

        this.sprite.sounds.asArray().forEach(function (sound) {
            template = icon = new SoundIconMorph(sound, template);
            icon.setPosition(new Point(x, y));
            myself.addContents(icon);
            y = icon.bottom() + padding;
        });

        Morph.prototype.trackChanges = oldFlag;
        this.changed();

        this.updateSelection();
    },

    updateSelection: function () {
        this.contents.children.forEach(function (morph) {
            if (morph.refresh) {
                morph.refresh();
            }
        });
        this.spriteVersion = this.sprite.version;
    },

    // Jukebox stepping
    step: function () {
        if (this.spriteVersion !== this.sprite.version) {
            this.updateSelection();
        }
    },

    // Jukebox ops
    removeSound: function (idx) {
        this.sprite.sounds.remove(idx);
        this.updateList();
    },

    // Jukebox drag & drop
    wantsDropOf: function (morph) {
        return morph instanceof SoundIconMorph;
    },

    reactToDropOf: function (icon) {
        var idx = 0,
            costume = icon.object,
            top = icon.top();

        icon.destroy();
        this.contents.children.forEach(function (item) {
            if (item.top() < top - 4) {
                idx += 1;
            }
        });
        this.sprite.sounds.add(costume, idx);
        this.updateList();
    }
});

JukeBoxMorph.uber = ScrollFrameMorph.prototype;
JukeBoxMorph.className = 'JukeBoxMorph';

module.exports = JukeBoxMorph;