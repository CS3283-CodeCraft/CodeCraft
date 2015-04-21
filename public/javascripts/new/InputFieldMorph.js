var Morph = require('./Morph');
var StringFieldMorph = require('./StringFieldMorph');
var ArrowMorph = require('./ArrowMorph');
var Color = require('./Color');

var InputFieldMorph = Class.create(Morph, {

    edge: 2,
    fontSize: 12,
    typeInPadding: 2,
    contrast: 65,

    
    // InputFieldMorph //////////////////////////////////////////////////////
    
    initialize: function(text, isNumeric, choiceDict, isReadOnly){
        this.init(text, isNumeric, choiceDict, isReadOnly);
    },


    init: function (
        $super, 
        text,
        isNumeric,
        choiceDict,
        isReadOnly
    ) {
        var contents = new StringFieldMorph(text || ''),
            arrow = new ArrowMorph(
                'down',
                0,
                Math.max(Math.floor(this.fontSize / 6), 1)
            );

        this.choices = choiceDict || null; // object, function or selector
        this.isReadOnly = isReadOnly || false;
        this.isNumeric = isNumeric || false;

        contents.alpha = 0;
        contents.fontSize = this.fontSize;
        contents.drawNew();

        this.oldContentsExtent = contents.extent();
        this.isNumeric = isNumeric || false;

        $super();
        this.color = new Color(255, 255, 255);
        this.add(contents);
        this.add(arrow);
        contents.isDraggable = false;
        this.drawNew();
    },

    // InputFieldMorph accessing:

    contents: function () {
        return detect(
            this.children,
            function (child) {
                return (child instanceof StringFieldMorph);
            }
        );
    },

    arrow: function () {
        return detect(
            this.children,
            function (child) {
                return (child instanceof ArrowMorph);
            }
        );
    },

    setChoice: function (aStringOrFloat) {
        this.setContents(aStringOrFloat);
        this.escalateEvent('reactToChoice', aStringOrFloat);
    },

    setContents: function (aStringOrFloat) {
        var cnts = this.contents();
        cnts.text.text = aStringOrFloat;
        if (aStringOrFloat === undefined) {
            return null;
        }
        if (aStringOrFloat === null) {
            cnts.text.text = '';
        } else if (aStringOrFloat.toString) {
            cnts.text.text = aStringOrFloat.toString();
        }
        cnts.drawNew();
        cnts.changed();
    },

    edit: function () {
        var c = this.contents();
        c.text.edit();
        c.text.selectAll();
    },

    setIsNumeric: function (bool) {
        var value;

        this.isNumeric = bool;
        this.contents().isNumeric = bool;
        this.contents().text.isNumeric = bool;

        // adjust my shown value to conform with the numeric flag
        value = this.getValue();
        if (this.isNumeric) {
            value = parseFloat(value);
            if (isNaN(value)) {
                value = null;
            }
        }
        this.setContents(value);
    },

    // InputFieldMorph drop-down menu:

    dropDownMenu: function () {
        var choices = this.choices,
            key,
            menu = new MenuMorph(
                this.setChoice,
                null,
                this,
                this.fontSize
            );

        if (choices instanceof Function) {
            choices = choices.call(this);
        } else if (isString(choices)) {
            choices = this[choices]();
        }
        if (!choices) {
            return null;
        }
        menu.addItem(' ', null);
        if (choices instanceof Array) {
            choices.forEach(function (choice) {
                menu.addItem(choice[0], choice[1]);
            });
        } else { // assuming a dictionary
            for (key in choices) {
                if (Object.prototype.hasOwnProperty.call(choices, key)) {
                    if (key[0] === '~') {
                        menu.addLine();
                    } else {
                        menu.addItem(key, choices[key]);
                    }
                }
            }
        }
        if (menu.items.length > 0) {
            menu.popUpAtHand(this.world());
        } else {
            return null;
        }
    },

    // InputFieldMorph layout:

    fixLayout: function () {
        var contents = this.contents(),
            arrow = this.arrow();

        if (!contents) {return null; }
        contents.isNumeric = this.isNumeric;
        contents.isEditable = (!this.isReadOnly);
        if (this.choices) {
            arrow.setSize(this.fontSize);
            arrow.show();
        } else {
            arrow.setSize(0);
            arrow.hide();
        }
        this.silentSetHeight(
            contents.height()
                + this.edge * 2
                + this.typeInPadding * 2
        );
        this.silentSetWidth(Math.max(
            contents.minWidth
                + this.edge * 2
                + this.typeInPadding * 2,
            this.width()
        ));

        contents.setWidth(
            this.width() - this.edge - this.typeInPadding -
                (this.choices ? arrow.width() + this.typeInPadding : 0)
        );

        contents.silentSetPosition(new Point(
            this.edge,
            this.edge
        ).add(this.typeInPadding).add(this.position()));

        arrow.silentSetPosition(new Point(
            this.right() - arrow.width() - this.edge,
            contents.top()
        ));

    },

    // InputFieldMorph events:

    mouseClickLeft: function (pos) {
        if (this.arrow().bounds.containsPoint(pos)) {
            this.dropDownMenu();
        } else if (this.isReadOnly) {
            this.dropDownMenu();
        } else {
            this.escalateEvent('mouseClickLeft', pos);
        }
    },

    // InputFieldMorph retrieving:

    getValue: function () {
    /*
        answer my content's text string. If I am numerical convert that
        string to a number. If the conversion fails answer the string
        otherwise the numerical value.
    */
        var num,
            contents = this.contents();
        if (this.isNumeric) {
            num = parseFloat(contents.text);
            if (!isNaN(num)) {
                return num;
            }
        }
        return this.normalizeSpaces(contents.string());
    },

    normalizeSpaces: function (string) {
        var ans = '', i, c, flag = false;

        for (i = 0; i < string.length; i += 1) {
            c = string[i];
            if (c === ' ') {
                if (flag) {
                    ans += c;
                    flag = false;
                }
            } else {
                ans += c;
                flag = true;
            }
        }
        return ans.trim();
    },

    // InputFieldMorph drawing:

    drawNew: function () {
        var context, borderColor;

        this.fixLayout();

        // initialize my surface property
        this.image = newCanvas(this.extent());
        context = this.image.getContext('2d');
        if (this.parent) {
            if (this.parent.color.eq(new Color(255, 255, 255))) {
                this.color = this.parent.color.darker(this.contrast * 0.1);
            } else {
                this.color = this.parent.color.lighter(this.contrast * 0.75);
            }
            borderColor = this.parent.color;
        } else {
            borderColor = new Color(120, 120, 120);
        }
        context.fillStyle = this.color.toString();

        // cache my border colors
        this.cachedClr = borderColor.toString();
        this.cachedClrBright = borderColor.lighter(this.contrast)
            .toString();
        this.cachedClrDark = borderColor.darker(this.contrast).toString();

        context.fillRect(
            this.edge,
            this.edge,
            this.width() - this.edge * 2,
            this.height() - this.edge * 2
        );

        this.drawRectBorder(context);
    },

    drawRectBorder: function (context) {
        var shift = this.edge * 0.5,
            gradient;

        if (MorphicPreferences.isFlat && !this.is3D) {return; }

        context.lineWidth = this.edge;
        context.lineJoin = 'round';
        context.lineCap = 'round';

        context.shadowOffsetY = shift;
        context.shadowBlur = this.edge * 4;
        context.shadowColor = this.cachedClrDark;

        gradient = context.createLinearGradient(
            0,
            0,
            0,
            this.edge
        );

        gradient.addColorStop(0, this.cachedClr);
        gradient.addColorStop(1, this.cachedClrDark);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(this.edge, shift);
        context.lineTo(this.width() - this.edge - shift, shift);
        context.stroke();

        context.shadowOffsetY = 0;

        gradient = context.createLinearGradient(
            0,
            0,
            this.edge,
            0
        );
        gradient.addColorStop(0, this.cachedClr);
        gradient.addColorStop(1, this.cachedClrDark);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(shift, this.edge);
        context.lineTo(shift, this.height() - this.edge - shift);
        context.stroke();

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;

        gradient = context.createLinearGradient(
            0,
            this.height() - this.edge,
            0,
            this.height()
        );
        gradient.addColorStop(0, this.cachedClrBright);
        gradient.addColorStop(1, this.cachedClr);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(this.edge, this.height() - shift);
        context.lineTo(this.width() - this.edge, this.height() - shift);
        context.stroke();

        gradient = context.createLinearGradient(
            this.width() - this.edge,
            0,
            this.width(),
            0
        );
        gradient.addColorStop(0, this.cachedClrBright);
        gradient.addColorStop(1, this.cachedClr);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(this.width() - shift, this.edge);
        context.lineTo(this.width() - shift, this.height() - this.edge);
        context.stroke();
    }

});

InputFieldMorph.uber = Morph.prototype;
InputFieldMorph.className = 'InputFieldMorph';

module.exports = InputFieldMorph;