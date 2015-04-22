var Morph = require('./Morph');

var SyntaxElementMorph = Class.create(Morph, {

	// SyntaxElementMorph //////////////////////////////////////////////////

	// I am the ancestor of all blocks and input slots

	// SyntaxElementMorph preferences settings:

	/*
	    the following settings govern the appearance of all syntax elements
	    (blocks and slots) where applicable:

	    outline:

	        corner        - radius of command block rounding
	        rounding    - radius of reporter block rounding
	        edge        - width of 3D-ish shading box
	        hatHeight    - additional top space for hat blocks
	        hatWidth    - minimum width for hat blocks
	        rfBorder    - pixel width of reification border (grey outline)
	        minWidth    - minimum width for any syntax element's contents

	    jigsaw shape:

	        inset        - distance from indentation to left edge
	        dent        - width of indentation bottom

	    paddings:

	        bottomPadding    - adds to the width of the bottom most c-slot
	        cSlotPadding    - adds to the width of the open "C" in c-slots
	        typeInPadding    - adds pixels between text and edge in input slots
	        labelPadding    - adds left/right pixels to block labels

	    label:

	        labelFontName    - <string> specific font family name
	        labelFontStyle    - <string> generic font family name, cascaded
	        fontSize        - duh
	        embossing        - <Point> offset for embossing effect
	        labelWidth        - column width, used for word wrapping
	        labelWordWrap    - <bool> if true labels can break after each word
	        dynamicInputLabels - <bool> if true inputs can have dynamic labels

	    snapping:

	        feedbackColor        - <Color> for displaying drop feedbacks
	        feedbackMinHeight    - height of white line for command block snaps
	        minSnapDistance        - threshold when commands start snapping
	        reporterDropFeedbackPadding    - increases reporter drop feedback

	    color gradients:

	        contrast        - <percent int> 3D-ish shading gradient contrast
	        labelContrast    - <percent int> 3D-ish label shading contrast
	        activeHighlight    - <Color> for stack highlighting when active
	        errorHighlight    - <Color> for error highlighting
	        activeBlur        - <pixels int> shadow for blurred activeHighlight
	        activeBorder    - <pixels int> unblurred activeHighlight
	        rfColor            - <Color> for reified outlines and slot backgrounds
	*/
	
	initialize: function(){
		this.init();

		
	},

	init: function(){
		SyntaxElementMorph.prototype.setScale(1);
		this.cachedClr = null;
	    this.cachedClrBright = null;
	    this.cachedClrDark = null;
	    this.isStatic = false; // if true, I cannot be exchanged
	    SyntaxElementMorph.uber.init.call(this);
	    this.defaults = [];
	},

	setScale: function(num){
		var scale = Math.min(Math.max(num, 1), 25);
	    this.scale = scale;
	    this.corner = 3 * scale;
	    this.rounding = 9 * scale;
	    this.edge = 1.000001 * scale;
	    this.inset = 6 * scale;
	    this.hatHeight = 12 * scale;
	    this.hatWidth = 70 * scale;
	    this.rfBorder = 3 * scale;
	    this.minWidth = 0;
	    this.dent = 8 * scale;
	    this.bottomPadding = 3 * scale;
	    this.cSlotPadding = 4 * scale;
	    this.typeInPadding = scale;
	    this.labelPadding = 4 * scale;
	    this.labelFontName = 'Verdana';
	    this.labelFontStyle = 'sans-serif';
	    this.fontSize = 10 * scale;
	    this.embossing = new Point(
	        -1 * Math.max(scale / 2, 1),
	        -1 * Math.max(scale / 2, 1)
	    );
	    this.labelWidth = 450 * scale;
	    this.labelWordWrap = true;
	    this.dynamicInputLabels = true;
	    this.feedbackColor = new Color(255, 255, 255);
	    this.feedbackMinHeight = 5;
	    this.minSnapDistance = 20;
	    this.reporterDropFeedbackPadding = 10 * scale;
	    this.contrast = 65;
	    this.labelContrast = 25;
	    this.activeHighlight = new Color(153, 255, 213);
	    this.errorHighlight = new Color(173, 15, 0);
	    this.activeBlur = 20;
	    this.activeBorder = 4;
	    this.rfColor = new Color(120, 120, 120);
	},

	// SyntaxElementMorph accessing:

	parts: function () {
	    // answer my non-crontrol submorphs
	    var nb = null;
	    if (this.nextBlock) { // if I am a CommandBlock or a HatBlock
	        nb = this.nextBlock();
	    }
	    return this.children.filter(function (child) {
	        return (child !== nb)
	            && !(child.instanceOf('ShadowMorph'))
	            && !(child.instanceOf('BlockHighlightMorph'));
	    });
	},

	inputs: function () {
	    // answer my arguments and nested reporters
	    return this.parts().filter(function (part) {
	        return part.instanceOf('SyntaxElementMorph');
	    });

	},

	allInputs: function () {
	    // answer arguments and nested reporters of all children
	    var myself = this;
	    return this.allChildren().slice(0).reverse().filter(
	        function (child) {
	            return (child.instanceOf('ArgMorph')) ||
	                (child.instanceOf('ReporterBlockMorph') &&
	                child !== myself);
	        }
	    );
	},

	allEmptySlots: function () {
	/*
	    answer empty input slots of all children excluding myself,
	    but omit those in nested rings (lambdas) and JS-Function primitives
	*/
	    var empty = [];
	    if (!(this.instanceOf('RingMorph')) &&
	            (this.selector !== 'reportJSFunction')) {
	        this.children.forEach(function (morph) {
	            if (morph.isEmptySlot && morph.isEmptySlot()) {
	                empty.push(morph);
	            } else if (morph.allEmptySlots) {
	                empty = empty.concat(morph.allEmptySlots());
	            }
	        });
	    }
	    return empty;
	},

	replaceInput: function (oldArg, newArg) {
	    var scripts = this.parentThatIsA('ScriptsMorph'),
	        replacement = newArg,
	        idx = this.children.indexOf(oldArg),
	        i = 0,
	        nb;

	    // try to find the ArgLabel embedding the newArg,
	    // used for the undrop() feature
	    if (idx === -1 && newArg.instanceOf('MultiArgMorph')) {
	        this.children.forEach(function (morph) {
	            if (morph.instanceOf('ArgLabelMorph') &&
	                    morph.argMorph() === oldArg) {
	                idx = i;
	            }
	            i += 1;
	        });
	    }

	    if ((idx === -1) || (scripts === null)) {
	        return null;
	    }
	    this.startLayout();
	    if (newArg.parent) {
	        newArg.parent.removeChild(newArg);
	    }
	    if (oldArg.instanceOf('MultiArgMorph')) {
	        oldArg.inputs().forEach(function (inp) { // preserve nested reporters
	            oldArg.replaceInput(inp, new InputSlotMorph());
	        });
	        if (this.dynamicInputLabels) {
	            replacement = new ArgLabelMorph(newArg);
	        }
	    }
	    replacement.parent = this;
	    this.children[idx] = replacement;
	    if (oldArg.instanceOf('ReporterBlockMorph')) {
	        if (!(oldArg.instanceOf('RingMorph'))
	                || (oldArg.instanceOf('RingMorph') && oldArg.contents())) {
	            scripts.add(oldArg);
	            oldArg.moveBy(replacement.extent());
	            oldArg.fixBlockColor();
	        }
	    } else if (oldArg.instanceOf('CommandSlotMorph')) {
	        nb = oldArg.nestedBlock();
	        if (nb) {
	            scripts.add(nb);
	            nb.moveBy(replacement.extent());
	            nb.fixBlockColor();
	        }
	    }
	    if (replacement.instanceOf('MultiArgMorph')
	            || replacement.instanceOf('ArgLabelMorph')
	            || replacement.constructor === CommandSlotMorph) {
	        replacement.fixLayout();
	        if (this.fixLabelColor) { // special case for variadic continuations
	            this.fixLabelColor();
	        }
	    } else {
	        replacement.drawNew();
	        this.fixLayout();
	    }
	    this.endLayout();
	},

	silentReplaceInput: function (oldArg, newArg) {
	    // used by the Serializer or when programatically
	    // changing blocks
	    var i = this.children.indexOf(oldArg),
	        replacement;

	    if (i === -1) {
	        return;
	    }

	    if (newArg.parent) {
	        newArg.parent.removeChild(newArg);
	    }
	    if (oldArg.instanceOf('MultiArgMorph') && this.dynamicInputLabels) {
	        replacement = new ArgLabelMorph(newArg);
	    } else {
	        replacement = newArg;
	    }
	    replacement.parent = this;
	    this.children[i] = replacement;

	    if (replacement.instanceOf('MultiArgMorph')
	            || replacement.instanceOf('ArgLabelMorph')
	            || replacement.constructor === CommandSlotMorph) {
	        replacement.fixLayout();
	        if (this.fixLabelColor) { // special case for variadic continuations
	            this.fixLabelColor();
	        }
	    } else {
	        replacement.drawNew();
	        this.fixLayout();
	    }
	},

	revertToDefaultInput: function (arg, noValues) {
	    var idx = this.parts().indexOf(arg),
	        inp = this.inputs().indexOf(arg),
	        deflt = new InputSlotMorph();

	    if (idx !== -1) {
	        if (this.instanceOf('BlockMorph')) {
	            deflt = this.labelPart(this.parseSpec(this.blockSpec)[idx]);
	            if (deflt.instanceOf('InputSlotMorph') && this.definition) {
	                deflt.setChoices.apply(
	                    deflt,
	                    this.definition.inputOptionsOfIdx(inp)
	                );
	                deflt.setContents(
	                    this.definition.defaultValueOfInputIdx(inp)
	                );
	            }
	        } else if (this.instanceOf('MultiArgMorph')) {
	            deflt = this.labelPart(this.slotSpec);
	        } else if (this.instanceOf('ReporterSlotMorph')) {
	            deflt = this.emptySlot();
	        }
	    }
	    // set default value
	    if (!noValues) {
	        if (inp !== -1) {
	            if (deflt.instanceOf('MultiArgMorph')) {
	                deflt.setContents(this.defaults);
	                deflt.defaults = this.defaults;
	            } else if (!isNil(this.defaults[inp])) {
	                deflt.setContents(this.defaults[inp]);
	            }
	        }
	    }
	    this.silentReplaceInput(arg, deflt);
	    if (deflt.instanceOf('MultiArgMorph')) {
	        deflt.refresh();
	    } else if (deflt.instanceOf('RingMorph')) {
	        deflt.fixBlockColor();
	    }
	},

	isLocked: function () {
	    // answer true if I can be exchanged by a dropped reporter
	    return this.isStatic;
	},

	// SyntaxElementMorph enumerating:

	topBlock: function () {
	    if (this.parent && this.parent.topBlock) {
	        return this.parent.topBlock();
	    }
	    return this;
	},

	// SyntaxElementMorph drag & drop:

	reactToGrabOf: function (grabbedMorph) {
	    var topBlock = this.topBlock(),
	        affected;
	    if (grabbedMorph.instanceOf('CommandBlockMorph')) {
	        affected = this.parentThatIsA('CommandSlotMorph');
	        if (affected) {
	            this.startLayout();
	            affected.fixLayout();
	            this.endLayout();
	        }
	    }
	    if (topBlock) {
	        topBlock.allComments().forEach(function (comment) {
	            comment.align(topBlock);
	        });
	        if (topBlock.getHighlight()) {
	            topBlock.addHighlight(topBlock.removeHighlight());
	        }
	    }
	},

	// SyntaxElementMorph 3D - border color rendering:

	bright: function () {
	    return this.color.lighter(this.contrast).toString();
	},

	dark: function () {
	    return this.color.darker(this.contrast).toString();
	},

	// SyntaxElementMorph color changing:

	setColor: function (aColor) {
	    if (aColor) {
	        if (!this.color.eq(aColor)) {
	            this.color = aColor;
	            this.drawNew();
	            this.children.forEach(function (child) {
	                child.drawNew();
	                child.changed();
	            });
	            this.changed();
	        }
	    }
	},

	setLabelColor: function (
	    textColor,
	    shadowColor,
	    shadowOffset
	) {
	    this.children.forEach(function (morph) {
	        if (morph.instanceOf('StringMorph') && !morph.isProtectedLabel) {
	            morph.shadowOffset = shadowOffset || morph.shadowOffset;
	            morph.shadowColor = shadowColor || morph.shadowColor;
	            morph.setColor(textColor);
	        } else if (morph.instanceOf('MultiArgMorph')
	                || morph.instanceOf('ArgLabelMorph')
	                || (morph.instanceOf('SymbolMorph') && !morph.isProtectedLabel)
	                || (morph.instanceOf('InputSlotMorph')
	                    && morph.isReadOnly)) {
	            morph.setLabelColor(textColor, shadowColor, shadowOffset);
	        }
	    });
	},


	// SyntaxElementMorph zebra coloring

	fixBlockColor: function (
	    nearestBlock,
	    isForced
	) {
	    this.children.forEach(function (morph) {
	        if (morph.instanceOf('SyntaxElementMorph')) {
	            morph.fixBlockColor(nearestBlock, isForced);
	        }
	    });
	},

	// SyntaxElementMorph label parts:

	labelPart: function (spec) {
	    var part, tokens;
	    if (spec[0] === '%' &&
	            spec.length > 1 &&
	            (this.selector !== 'reportGetVar' ||
	                (spec === '%turtleOutline' && this.isObjInputFragment()))) {

	        // check for variable multi-arg-slot:
	        if ((spec.length > 5) && (spec.slice(0, 5) === '%mult')) {
	            part = new MultiArgMorph(spec.slice(5));
	            part.addInput();
	            return part;
	        }

	        // single-arg and specialized multi-arg slots:
	        switch (spec) {
	        case '%imgsource':
	            part = new InputSlotMorph(
	                null, // text
	                false, // non-numeric
	                {
	                    'pen trails': ['pen trails'],
	                    'stage image': ['stage image']
	                },
	                true
	            );
	            part.setContents(['pen trails']);
	            break;
	        case '%inputs':
	            part = new MultiArgMorph('%s', 'with inputs');
	            part.isStatic = false;
	            part.canBeEmpty = false;
	            break;
	        case '%scriptVars':
	            part = new MultiArgMorph('%t', null, 1, spec);
	            part.canBeEmpty = false;
	            break;
	        case '%parms':
	            part = new MultiArgMorph('%t', 'Input Names:', 0, spec);
	            part.canBeEmpty = false;
	            break;
	        case '%ringparms':
	            part = new MultiArgMorph(
	                '%t',
	                'input names:',
	                0,
	                spec
	            );
	            break;
	        case '%cmdRing':
	            part = new RingMorph();
	            part.color = SpriteMorph.prototype.blockColor.other;
	            part.selector = 'reifyScript';
	            part.setSpec('%rc %ringparms');
	            part.isDraggable = true;
	            break;
	        case '%repRing':
	            part = new RingMorph();
	            part.color = SpriteMorph.prototype.blockColor.other;
	            part.selector = 'reifyReporter';
	            part.setSpec('%rr %ringparms');
	            part.isDraggable = true;
	            part.isStatic = true;
	            break;
	        case '%predRing':
	            part = new RingMorph(true);
	            part.color = SpriteMorph.prototype.blockColor.other;
	            part.selector = 'reifyPredicate';
	            part.setSpec('%rp %ringparms');
	            part.isDraggable = true;
	            part.isStatic = true;
	            break;
	        case '%words':
	            part = new MultiArgMorph('%s', null, 0);
	            part.addInput(); // allow for default value setting
	            part.addInput(); // allow for default value setting
	            part.isStatic = false;
	            break;
	        case '%exp':
	            part = new MultiArgMorph('%s', null, 0);
	            part.addInput();
	            part.isStatic = true;
	            part.canBeEmpty = false;
	            break;
	        case '%br':
	            part = new Morph();
	            part.setExtent(new Point(0, 0));
	            part.isBlockLabelBreak = true;
	            part.getSpec = function () {
	                return '%br';
	            };
	            break;
	        case '%inputName':
	            part = new ReporterBlockMorph();
	            part.category = 'variables';
	            part.color = SpriteMorph.prototype.blockColor.variables;
	            part.setSpec(localize('Input name'));
	            break;
	        case '%s':
	            part = new InputSlotMorph();
	            break;
	        case '%anyUE':
	            part = new InputSlotMorph();
	            part.isUnevaluated = true;
	            break;
	        case '%txt':
	            part = new InputSlotMorph();
	            part.minWidth = part.height() * 1.7; // "landscape"
	            part.fixLayout();
	            break;
	        case '%mlt':
	            part = new TextSlotMorph();
	            part.fixLayout();
	            break;
	        case '%code':
	            part = new TextSlotMorph();
	            part.contents().fontName = 'monospace';
	            part.contents().fontStyle = 'monospace';
	            part.fixLayout();
	            break;
	        case '%obj':
	            part = new ArgMorph('object');
	            break;
	        case '%n':
	            part = new InputSlotMorph(null, true);
	            break;
	        case '%dir':
	            part = new InputSlotMorph(
	                null,
	                true,
	                {
	                    '(90) right' : 90,
	                    '(-90) left' : -90,
	                    '(0) up' : '0',
	                    '(180) down' : 180
	                }
	            );
	            part.setContents(90);
	            break;
	        case '%inst':
	            part = new InputSlotMorph(
	                null,
	                true,
	                {
	                    '(1) Acoustic Grand' : 1,
	                    '(2) Bright Acoustic' : 2,
	                    '(3) Electric Grand' : 3,
	                    '(4) Honky Tonk' : 4,
	                    '(5) Electric Piano 1' : 5,
	                    '(6) Electric Piano 2' : 6,
	                    '(7) Harpsichord' : 7
	                }
	            );
	            part.setContents(1);
	            break;
	        case '%month':
	            part = new InputSlotMorph(
	                null, // text
	                false, // numeric?
	                {
	                    'January' : ['January'],
	                    'February' : ['February'],
	                    'March' : ['March'],
	                    'April' : ['April'],
	                    'May' : ['May'],
	                    'June' : ['June'],
	                    'July' : ['July'],
	                    'August' : ['August'],
	                    'September' : ['September'],
	                    'October' : ['October'],
	                    'November' : ['November'],
	                    'December' : ['December']
	                },
	                true // read-only
	            );
	            break;
	        case '%dates':
	            part = new InputSlotMorph(
	                null, // text
	                false, // non-numeric
	                {
	                    'year' : ['year'],
	                    'month' : ['month'],
	                    'date' : ['date'],
	                    'day of week' : ['day of week'],
	                    'hour' : ['hour'],
	                    'minute' : ['minute'],
	                    'second' : ['second'],
	                    'time in milliseconds' : ['time in milliseconds']
	                },
	                true // read-only
	            );
	            part.setContents(['date']);
	            break;
	        case '%delim':
	            part = new InputSlotMorph(
	                null, // text
	                false, // numeric?
	                {
	                    'letter' : ['letter'],
	                    'whitespace' : ['whitespace'],
	                    'line' : ['line'],
	                    'tab' : ['tab'],
	                    'cr' : ['cr']
	                },
	                false // read-only
	            );
	            break;
	        case '%ida':
	            part = new InputSlotMorph(
	                null,
	                true,
	                {
	                    '1' : 1,
	                    last : ['last'],
	                    '~' : null,
	                    all : ['all']
	                }
	            );
	            part.setContents(1);
	            break;
	        case '%idx':
	            part = new InputSlotMorph(
	                null,
	                true,
	                {
	                    '1' : 1,
	                    last : ['last'],
	                    any : ['any']
	                }
	            );
	            part.setContents(1);
	            break;
	        case '%spr':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'objectsMenu',
	                true
	            );
	            break;
	        case '%col': // collision detection
	            part = new InputSlotMorph(
	                null,
	                false,
	                'collidablesMenu',
	                true
	            );
	            break;
	        case '%dst': // distance measuring
	            part = new InputSlotMorph(
	                null,
	                false,
	                'distancesMenu',
	                true
	            );
	            break;
	        case '%cln': // clones
	            part = new InputSlotMorph(
	                null,
	                false,
	                'clonablesMenu',
	                true
	            );
	            break;
	        case '%cst':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'costumesMenu',
	                true
	            );
	            break;
	        case '%eff':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {   brightness : ['brightness'],
	                    ghost : ['ghost'],
	                    negative : ['negative'],
	                    comic: ['comic'],
	                    duplicate: ['duplicate'],
	                    confetti: ['confetti']
	                    },
	                true
	            );
	            part.setContents(['ghost']);
	            break;
	        case '%snd':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'soundsMenu',
	                true
	            );
	            break;
	        case '%key':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    'up arrow': ['up arrow'],
	                    'down arrow': ['down arrow'],
	                    'right arrow': ['right arrow'],
	                    'left arrow': ['left arrow'],
	                    space : ['space'],
	                    a : ['a'],
	                    b : ['b'],
	                    c : ['c'],
	                    d : ['d'],
	                    e : ['e'],
	                    f : ['f'],
	                    g : ['g'],
	                    h : ['h'],
	                    i : ['i'],
	                    j : ['j'],
	                    k : ['k'],
	                    l : ['l'],
	                    m : ['m'],
	                    n : ['n'],
	                    o : ['o'],
	                    p : ['p'],
	                    q : ['q'],
	                    r : ['r'],
	                    s : ['s'],
	                    t : ['t'],
	                    u : ['u'],
	                    v : ['v'],
	                    w : ['w'],
	                    x : ['x'],
	                    y : ['y'],
	                    z : ['z'],
	                    '0' : ['0'],
	                    '1' : ['1'],
	                    '2' : ['2'],
	                    '3' : ['3'],
	                    '4' : ['4'],
	                    '5' : ['5'],
	                    '6' : ['6'],
	                    '7' : ['7'],
	                    '8' : ['8'],
	                    '9' : ['9']
	                },
	                true
	            );
	            part.setContents(['space']);
	            break;
	        case '%keyHat':
	            part = this.labelPart('%key');
	            part.isStatic = true;
	            break;
	        case '%msg':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'messagesMenu',
	                true
	            );
	            break;
	        case '%msgHat':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'messagesReceivedMenu',
	                true
	            );
	            part.isStatic = true;
	            break;
	        case '%att':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'attributesMenu',
	                true
	            );
	            break;
	        case '%fun':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    abs : ['abs'],
	                    floor : ['floor'],
	                    sqrt : ['sqrt'],
	                    sin : ['sin'],
	                    cos : ['cos'],
	                    tan : ['tan'],
	                    asin : ['asin'],
	                    acos : ['acos'],
	                    atan : ['atan'],
	                    ln : ['ln'],
	                    // log : 'log',
	                    'e^' : ['e^']
	                    // '10^' : '10^'
	                },
	                true
	            );
	            part.setContents(['sqrt']);
	            break;
	        case '%txtfun':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    'encode URI' : ['encode URI'],
	                    'decode URI' : ['decode URI'],
	                    'encode URI component' : ['encode URI component'],
	                    'decode URI component' : ['decode URI component'],
	                    'XML escape' : ['XML escape'],
	                    'XML unescape' : ['XML unescape'],
	                    'hex sha512 hash' : ['hex sha512 hash']
	                },
	                true
	            );
	            part.setContents(['encode URI']);
	            break;
	        case '%stopChoices':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    'all' : ['all'],
	                    'this script' : ['this script'],
	                    'this block' : ['this block']
	                },
	                true
	            );
	            part.setContents(['all']);
	            part.isStatic = true;
	            break;
	        case '%stopOthersChoices':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    'all but this script' : ['all but this script'],
	                    'other scripts in sprite' : ['other scripts in sprite']
	                },
	                true
	            );
	            part.setContents(['all but this script']);
	            part.isStatic = true;
	            break;
	        case '%typ':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    number : ['number'],
	                    text : ['text'],
	                    Boolean : ['Boolean'],
	                    list : ['list'],
	                    command : ['command'],
	                    reporter : ['reporter'],
	                    predicate : ['predicate']
	                    // ring : 'ring'
	                    // object : 'object'
	                },
	                true
	            );
	            part.setContents(['number']);
	            break;
	        case '%var':
	            part = new InputSlotMorph(
	                null,
	                false,
	                'getVarNamesDict',
	                true
	            );
	            part.isStatic = true;
	            break;
	        case '%lst':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    list1 : 'list1',
	                    list2 : 'list2',
	                    list3 : 'list3'
	                },
	                true
	            );
	            break;
	        case '%codeKind':
	            part = new InputSlotMorph(
	                null,
	                false,
	                {
	                    code : ['code'],
	                    header : ['header']
	                },
	                true
	            );
	            part.setContents(['code']);
	            break;
	        case '%l':
	            part = new ArgMorph('list');
	            break;
	        case '%b':
	        case '%boolUE':
	            part = new BooleanSlotMorph(null, true);
	            break;
	        case '%cmd':
	            part = new CommandSlotMorph();
	            break;
	        case '%rc':
	            part = new RingCommandSlotMorph();
	            part.isStatic = true;
	            break;
	        case '%rr':
	            part = new RingReporterSlotMorph();
	            part.isStatic = true;
	            break;
	        case '%rp':
	            part = new RingReporterSlotMorph(true);
	            part.isStatic = true;
	            break;
	        case '%c':
	            part = new CSlotMorph();
	            part.isStatic = true;
	            break;
	        case '%cs':
	            part = new CSlotMorph(); // non-static
	            break;
	        case '%clr':
	            part = new ColorSlotMorph();
	            part.isStatic = true;
	            break;
	        case '%t':
	            part = new TemplateSlotMorph('a');
	            break;
	        case '%upvar':
	            part = new TemplateSlotMorph('\u2191'); // up-arrow
	            break;
	        case '%f':
	            part = new FunctionSlotMorph();
	            break;
	        case '%r':
	            part = new ReporterSlotMorph();
	            break;
	        case '%p':
	            part = new ReporterSlotMorph(true);
	            break;

	    // code mapping (experimental)

	        case '%codeListPart':
	            part = new InputSlotMorph(
	                null, // text
	                false, // numeric?
	                {
	                    'list' : ['list'],
	                    'item' : ['item'],
	                    'delimiter' : ['delimiter']
	                },
	                true // read-only
	            );
	            break;
	        case '%codeListKind':
	            part = new InputSlotMorph(
	                null, // text
	                false, // numeric?
	                {
	                    'collection' : ['collection'],
	                    'variables' : ['variables'],
	                    'parameters' : ['parameters']
	                },
	                true // read-only
	            );
	            break;

	    // symbols:

	        case '%turtle':
	            part = new SymbolMorph('turtle');
	            part.size = this.fontSize * 1.2;
	            part.color = new Color(255, 255, 255);
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%turtleOutline':
	            part = new SymbolMorph('turtleOutline');
	            part.size = this.fontSize;
	            part.color = new Color(255, 255, 255);
	            part.isProtectedLabel = true; // doesn't participate in zebraing
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%clockwise':
	            part = new SymbolMorph('turnRight');
	            part.size = this.fontSize * 1.5;
	            part.color = new Color(255, 255, 255);
	            part.isProtectedLabel = false; // zebra colors
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%counterclockwise':
	            part = new SymbolMorph('turnLeft');
	            part.size = this.fontSize * 1.5;
	            part.color = new Color(255, 255, 255);
	            part.isProtectedLabel = false; // zebra colors
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%greenflag':
	            part = new SymbolMorph('flag');
	            part.size = this.fontSize * 1.5;
	            part.color = new Color(0, 200, 0);
	            part.isProtectedLabel = true; // doesn't participate in zebraing
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%stop':
	            part = new SymbolMorph('octagon');
	            part.size = this.fontSize * 1.5;
	            part.color = new Color(200, 0, 0);
	            part.isProtectedLabel = true; // doesn't participate in zebraing
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        case '%pause':
	            part = new SymbolMorph('pause');
	            part.size = this.fontSize;
	            part.color = new Color(255, 220, 0);
	            part.isProtectedLabel = true; // doesn't participate in zebraing
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            break;
	        default:
	            nop();
	        }
	    } else if (spec[0] === '$' &&
	            spec.length > 1 &&
	            this.selector !== 'reportGetVar') {
	/*
	        // allow costumes as label symbols
	        // has issues when loading costumes (asynchronously)
	        // commented out for now

	        var rcvr = this.definition.receiver || this.receiver(),
	            id = spec.slice(1),
	            cst;
	        if (!rcvr) {return this.labelPart('%stop'); }
	        cst = detect(
	            rcvr.costumes.asArray(),
	            function (each) {return each.name === id; }
	        );
	        part = new SymbolMorph(cst);
	        part.size = this.fontSize * 1.5;
	        part.color = new Color(255, 255, 255);
	        part.isProtectedLabel = true; // doesn't participate in zebraing
	        part.drawNew();
	*/

	        // allow GUI symbols as label icons
	        // usage: $symbolName[-size-r-g-b], size and color values are optional
	        tokens = spec.slice(1).split('-');
	        if (!contains(SymbolMorph.prototype.names, tokens[0])) {
	            part = new StringMorph(spec);
	            part.fontName = this.labelFontName;
	            part.fontStyle = this.labelFontStyle;
	            part.fontSize = this.fontSize;
	            part.color = new Color(255, 255, 255);
	            part.isBold = true;
	            part.shadowColor = this.color.darker(this.labelContrast);
	            part.shadowOffset = MorphicPreferences.isFlat ?
	                    new Point() : this.embossing;
	            part.drawNew();
	            return part;
	        }
	        part = new SymbolMorph(tokens[0]);
	        part.size = this.fontSize * (+tokens[1] || 1.2);
	        part.color = new Color(
	            +tokens[2] === 0 ? 0 : +tokens[2] || 255,
	            +tokens[3] === 0 ? 0 : +tokens[3] || 255,
	            +tokens[4] === 0 ? 0 : +tokens[4] || 255
	        );
	        part.isProtectedLabel = tokens.length > 2; // zebra colors
	        part.shadowColor = this.color.darker(this.labelContrast);
	        part.shadowOffset = MorphicPreferences.isFlat ?
	                new Point() : this.embossing;
	        part.drawNew();
	    } else {
	        part = new StringMorph(spec);
	        part.fontName = this.labelFontName;
	        part.fontStyle = this.labelFontStyle;
	        part.fontSize = this.fontSize;
	        part.color = new Color(255, 255, 255);
	        part.isBold = true;
	        part.shadowColor = this.color.darker(this.labelContrast);
	        part.shadowOffset = MorphicPreferences.isFlat ?
	                new Point() : this.embossing;
	        part.drawNew();
	    }
	    return part;
	},

	isObjInputFragment: function () {
	    // private - for displaying a symbol in a variable block template
	    return (this.selector === 'reportGetVar') &&
	        (this.getSlotSpec() === '%t') &&
	        (this.parent.fragment.type === '%obj');
	},

	// SyntaxElementMorph layout:

	fixLayout: function () {
	    var nb,
	        parts = this.parts(),
	        myself = this,
	        x = 0,
	        y,
	        lineHeight = 0,
	        maxX = 0,
	        blockWidth = this.minWidth,
	        blockHeight,
	        affected,
	        l = [],
	        lines = [],
	        space = this.isPrototype ?
	                1 : Math.floor(fontHeight(this.fontSize) / 3),
	        bottomCorrection,
	        initialExtent = this.extent();

	    if ((this.instanceOf('MultiArgMorph')) && (this.slotSpec !== '%c')) {
	        blockWidth += this.arrows().width();
	    } else if (this.instanceOf('ReporterBlockMorph')) {
	        blockWidth += (this.rounding * 2) + (this.edge * 2);
	    } else {
	        blockWidth += (this.corner * 4)
	            + (this.edge * 2)
	            + (this.inset * 3)
	            + this.dent;
	    }

	    if (this.nextBlock) {
	        nb = this.nextBlock();
	    }

	    // determine lines
	    parts.forEach(function (part) {
	        if ((part.instanceOf('CSlotMorph'))
	                || (part.slotSpec === '%c')) {
	            if (l.length > 0) {
	                lines.push(l);
	                lines.push([part]);
	                l = [];
	                x = 0;
	            } else {
	                lines.push([part]);
	            }
	        } else if (part.instanceOf('BlockHighlightMorph')) {
	            nop(); // should be redundant now
	            // myself.fullChanged();
	            // myself.removeChild(part);
	        } else {
	            if (part.isVisible) {
	                x += part.fullBounds().width() + space;
	            }
	            if ((x > myself.labelWidth) || part.isBlockLabelBreak) {
	                if (l.length > 0) {
	                    lines.push(l);
	                    l = [];
	                    x = part.fullBounds().width() + space;
	                }
	            }
	            l.push(part);
	            if (part.isBlockLabelBreak) {
	                x = 0;
	            }
	        }
	    });
	    if (l.length > 0) {
	        lines.push(l);
	    }

	    // distribute parts on lines
	    if (this.instanceOf('CommandBlockMorph')) {
	        y = this.top() + this.corner + this.edge;
	        if (this.instanceOf('HatBlockMorph')) {
	            y += this.hatHeight;
	        }
	    } else if (this.instanceOf('ReporterBlockMorph')) {
	        y = this.top() + (this.edge * 2);
	    } else if (this.instanceOf('MultiArgMorph')
	            || this.instanceOf('ArgLabelMorph')) {
	        y = this.top();
	    }
	    lines.forEach(function (line) {
	        x = myself.left() + myself.edge + myself.labelPadding;
	        if (myself.instanceOf('RingMorph')) {
	            x = myself.left() + space; //myself.labelPadding;
	        } else if (myself.isPredicate) {
	            x = myself.left() + myself.rounding;
	        } else if (myself.instanceOf('MultiArgMorph')
	                || myself.instanceOf('ArgLabelMorph')) {
	            x = myself.left();
	        }
	        y += lineHeight;
	        lineHeight = 0;
	        line.forEach(function (part) {
	            if (part.instanceOf('CSlotMorph')) {
	                x -= myself.labelPadding;
	                if (myself.isPredicate) {
	                    x = myself.left() + myself.rounding;
	                }
	                part.setColor(myself.color);
	                part.setPosition(new Point(x, y));
	                lineHeight = part.height();
	            } else {
	                part.setPosition(new Point(x, y));
	                if (!part.isBlockLabelBreak) {
	                    if (part.slotSpec === '%c') {
	                        x += part.width();
	                    } else if (part.isVisible) {
	                        x += part.fullBounds().width() + space;
	                    }
	                }
	                maxX = Math.max(maxX, x);
	                lineHeight = Math.max(
	                    lineHeight,
	                    part.instanceOf('StringMorph') ?
	                            part.rawHeight() : part.height()
	                );
	            }
	        });

	    // center parts vertically on each line:
	        line.forEach(function (part) {
	            part.moveBy(new Point(
	                0,
	                Math.floor((lineHeight - part.height()) / 2)
	            ));
	        });
	    });

	    // determine my height:
	    y += lineHeight;
	    if (this.children.some(function (any) {
	            return any.instanceOf('CSlotMorph');
	        })) {
	        bottomCorrection = this.bottomPadding;
	        if (this.instanceOf('ReporterBlockMorph') && !this.isPredicate) {
	            bottomCorrection = Math.max(
	                this.bottomPadding,
	                this.rounding - this.bottomPadding
	            );
	        }
	        y += bottomCorrection;
	    }
	    if (this.instanceOf('CommandBlockMorph')) {
	        blockHeight = y - this.top() + (this.corner * 2);
	    } else if (this.instanceOf('ReporterBlockMorph')) {
	        blockHeight = y - this.top() + (this.edge * 2);
	    } else if (this.instanceOf('MultiArgMorph')
	            || this.instanceOf('ArgLabelMorph')) {
	        blockHeight = y - this.top();
	    }

	    // determine my width:
	    if (this.isPredicate) {
	        blockWidth = Math.max(
	            blockWidth,
	            maxX - this.left() + this.rounding
	        );
	    } else if (this.instanceOf('MultiArgMorph')
	            || this.instanceOf('ArgLabelMorph')) {
	        blockWidth = Math.max(
	            blockWidth,
	            maxX - this.left() - space
	        );
	    } else {
	        blockWidth = Math.max(
	            blockWidth,
	            maxX - this.left() + this.labelPadding - this.edge
	        );
	        // adjust right padding if rightmost input has arrows
	        if (parts[parts.length - 1].instanceOf('MultiArgMorph')
	                && (lines.length === 1)) {
	            blockWidth -= space;
	        }
	        // adjust width to hat width
	        if (this.instanceOf('HatBlockMorph')) {
	            blockWidth = Math.max(blockWidth, this.hatWidth * 1.5);
	        }
	    }

	    // set my extent:
	    this.setExtent(new Point(blockWidth, blockHeight));

	    // adjust CSlots
	    parts.forEach(function (part) {
	        if (part.instanceOf('CSlotMorph')) {
	            if (myself.isPredicate) {
	                part.setWidth(blockWidth - myself.rounding * 2);
	            } else {
	                part.setWidth(blockWidth - myself.edge);
	            }
	        }
	    });

	    // redraw in order to erase CSlot backgrounds
	    this.drawNew();

	    // position next block:
	    if (nb) {
	        nb.setPosition(
	            new Point(
	                this.left(),
	                this.bottom() - (this.corner)
	            )
	        );
	    }

	    // find out if one of my parents needs to be fixed
	    if (this.instanceOf('CommandBlockMorph')) {
	        if (this.height() !== initialExtent.y) {
	            affected = this.parentThatIsA('CommandSlotMorph');
	            if (affected) {
	                affected.fixLayout();
	            }
	        }
	        if (this.width() !== initialExtent.x) {
	            affected = this.parentThatIsAnyOf(
	                ['ReporterBlockMorph', 'CommandSlotMorph', 'RingCommandSlotMorph']
	            );
	            if (affected) {
	                affected.fixLayout();
	            }
	        }
	        if (affected) {
	            return;
	        }
	    } else if (this.instanceOf('ReporterBlockMorph')) {
	        if (this.parent) {
	            if (this.parent.fixLayout) {
	                return this.parent.fixLayout();
	            }
	        }
	    }

	    this.fixHighlight();
	},

	fixHighlight: function () {
	    var top = this.topBlock();
	    if (top.getHighlight && top.getHighlight()) {
	        top.addHighlight(top.removeHighlight());
	    }
	},

	// SyntaxElementMorph evaluating:

	evaluate: function () {
	    // responsibility of my children, default is to answer null
	    return null;
	},

	isEmptySlot: function () {
	    // responsibility of my children, default is to answer false
	    return false;
	},

	// SyntaxElementMorph speech bubble feedback:

	showBubble: function (value, exportPic) {
	    var bubble,
	        txt,
	        img,
	        morphToShow,
	        isClickable = false,
	        sf = this.parentThatIsA('ScrollFrameMorph'),
	        wrrld = this.world();

	    if ((value === undefined) || !wrrld) {
	        return null;
	    }
	    if (value.instanceOf('ListWatcherMorph')) {
	        morphToShow = value;
	        morphToShow.update(true);
	        morphToShow.step = value.update;
	        morphToShow.isDraggable = false;
	        isClickable = true;
	    } else if (value.instanceOf('Morph')) {
	        img = value.fullImage();
	        morphToShow = new Morph();
	        morphToShow.silentSetWidth(img.width);
	        morphToShow.silentSetHeight(img.height);
	        morphToShow.image = img;
	    } else if (value.instanceOf('Costume')) {
	        img = value.thumbnail(new Point(40, 40));
	        morphToShow = new Morph();
	        morphToShow.silentSetWidth(img.width);
	        morphToShow.silentSetHeight(img.height);
	        morphToShow.image = img;
	    } else if (value.instanceOf('Context')) {
	        img = value.image();
	        morphToShow = new Morph();
	        morphToShow.silentSetWidth(img.width);
	        morphToShow.silentSetHeight(img.height);
	        morphToShow.image = img;
	    } else if (typeof value === 'boolean') {
	        morphToShow = SpriteMorph.prototype.booleanMorph.call(
	            null,
	            value
	        );
	    } else if (isString(value)) {
	        txt  = value.length > 500 ? value.slice(0, 500) + '...' : value;
	        morphToShow = new TextMorph(
	            txt,
	            this.fontSize
	        );
	    } else if (value === null) {
	        morphToShow = new TextMorph(
	            '',
	            this.fontSize
	        );
	    } else if (value === 0) {
	        morphToShow = new TextMorph(
	            '0',
	            this.fontSize
	        );
	    } else if (value.toString) {
	        morphToShow = new TextMorph(
	            value.toString(),
	            this.fontSize
	        );
	    }
	    bubble = new SpeechBubbleMorph(
	        morphToShow,
	        null,
	        Math.max(this.rounding - 2, 6),
	        0
	    );
	    bubble.popUp(
	        wrrld,
	        this.rightCenter().add(new Point(2, 0)),
	        isClickable
	    );
	    if (exportPic) {
	        this.exportPictureWithResult(bubble);
	    }
	    if (sf) {
	        bubble.keepWithin(sf);
	    }
	},

	exportPictureWithResult: function (aBubble) {
	    var scr = this.fullImage(),
	        bub = aBubble.fullImageClassic(),
	        taller = Math.max(0, bub.height - scr.height),
	        pic = newCanvas(new Point(
	            scr.width + bub.width + 2,
	            scr.height + taller
	        )),
	        ctx = pic.getContext('2d');
	    ctx.drawImage(scr, 0, pic.height - scr.height);
	    ctx.drawImage(bub, scr.width + 2, 0);
	    window.open(pic.toDataURL());
	},

	// SyntaxElementMorph code mapping

	/*
	    code mapping lets you use blocks to generate arbitrary text-based
	    source code that can be exported and compiled / embedded elsewhere,
	    it's not part of Snap's evaluator and not needed for Snap itself
	*/

	mappedCode: function (definitions) {
	    var result = this.evaluate();
	    if (result.instanceOf('BlockMorph')) {
	        return result.mappedCode(definitions);
	    }
	    return result;
	},

	// SyntaxElementMorph layout update optimization

	startLayout: function () {
	    this.topBlock().fullChanged();
	    Morph.prototype.trackChanges = false;
	},

	endLayout: function () {
	    Morph.prototype.trackChanges = true;
	    this.topBlock().fullChanged();
	}
});

SyntaxElementMorph.uber = Morph.prototype;
SyntaxElementMorph.className = 'SyntaxElementMorph';

module.exports = SyntaxElementMorph;