var Morph = require('./Morph');
var Point = require('./Point');

var AlignmentMorph = Class.create(Morph, {

    // AlignmentMorph /////////////////////////////////////////////////////

    // I am a reified layout, either a row or a column of submorphs
    
    initialize: function(orientation, padding){
        this.init(orientation, padding);
    },

    init: function ($super, orientation, padding) {
        // additional properties:
        this.orientation = orientation || 'row'; // or 'column'
        this.alignment = 'center'; // or 'left' in a column
        this.padding = padding || 0;
        this.respectHiddens = false;

        // initialize inherited properties:
        $super();

        // override inherited properites:
    },

    // AlignmentMorph displaying and layout

    drawNew: function () {
        this.image = newCanvas(new Point(1, 1));
        this.fixLayout();
    },

    fixLayout: function () {
        var myself = this,
            last = null,
            newBounds;
        if (this.children.length === 0) {
            return null;
        }
        this.children.forEach(function (c) {
            var cfb = c.fullBounds(),
                lfb;
            if (c.isVisible || myself.respectHiddens) {
                if (last) {
                    lfb = last.fullBounds();
                    if (myself.orientation === 'row') {
                        c.setPosition(
                            lfb.topRight().add(new Point(
                                myself.padding,
                                (lfb.height() - cfb.height()) / 2
                            ))
                        );
                    } else { // orientation === 'column'
                        c.setPosition(
                            lfb.bottomLeft().add(new Point(
                                myself.alignment === 'center' ?
                                        (lfb.width() - cfb.width()) / 2
                                                : 0,
                                myself.padding
                            ))
                        );
                    }
                    newBounds = newBounds.merge(cfb);
                } else {
                    newBounds = cfb;
                }
                last = c;
            }
        });
        this.bounds = newBounds;
    }

});

AlignmentMorph.uber = Morph.prototype;
AlignmentMorph.className = 'AlignmentMorph';

module.exports = AlignmentMorph;