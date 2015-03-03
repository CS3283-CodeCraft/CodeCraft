(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Morph = require('./Morph');
var Color = require('./Color');

var BlinkerMorph = Class.create(Morph, {
	
	// BlinkerMorph ////////////////////////////////////////////////////////

	// can be used for text cursors

	initialize: function(rate){
		this.init(rate);
	},

	init: function ($super) {
	    $super();
	    this.color = new Color(0, 0, 0);
	    this.fps = rate || 2;
	    this.drawNew();
	},

	step: function () {
    	this.toggleVisibility();
	},

})

BlinkerMorph.uber = Morph.prototype;
BlinkerMorph.className = 'BlinkerMorph';

module.exports = BlinkerMorph;


},{"./Color":6,"./Morph":18}],2:[function(require,module,exports){
var Morph = require('./Morph');
var Point = require('./Point');

var BouncerMorph = Class.create(Morph, {

	// BouncerMorph ////////////////////////////////////////////////////////
	
	initialize: function(){
		this.init();
	},

	init: function ($super, type, speed) {
	    $super()
	    this.fps = 50;

	    // additional properties:
	    this.isStopped = false;
	    this.type = type || 'vertical';
	    if (this.type === 'vertical') {
	        this.direction = 'down';
	    } else {
	        this.direction = 'right';
	    }
	    this.speed = speed || 1;
	},

	// BouncerMorph moving:

	moveUp: function () {
	    this.moveBy(new Point(0, -this.speed));
	},

	moveDown: function () {
	    this.moveBy(new Point(0, this.speed));
	},

	moveRight: function () {
	    this.moveBy(new Point(this.speed, 0));
	},

	moveLeft: function () {
	    this.moveBy(new Point(-this.speed, 0));
	},

	// BouncerMorph stepping:

	step: function () {
	    if (!this.isStopped) {
	        if (this.type === 'vertical') {
	            if (this.direction === 'down') {
	                this.moveDown();
	            } else {
	                this.moveUp();
	            }
	            if (this.fullBounds().top() < this.parent.top() &&
	                    this.direction === 'up') {
	                this.direction = 'down';
	            }
	            if (this.fullBounds().bottom() > this.parent.bottom() &&
	                    this.direction === 'down') {
	                this.direction = 'up';
	            }
	        } else if (this.type === 'horizontal') {
	            if (this.direction === 'right') {
	                this.moveRight();
	            } else {
	                this.moveLeft();
	            }
	            if (this.fullBounds().left() < this.parent.left() &&
	                    this.direction === 'left') {
	                this.direction = 'right';
	            }
	            if (this.fullBounds().right() > this.parent.right() &&
	                    this.direction === 'right') {
	                this.direction = 'left';
	            }
	        }
	    }
	},

})

BouncerMorph.uber = Morph.prototype;
BouncerMorph.className = 'BouncerMorph';

module.exports = BouncerMorph;


},{"./Morph":18,"./Point":22}],3:[function(require,module,exports){
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
    },

})

BoxMorph.uber = Morph.prototype;
BoxMorph.className = 'BoxMorph';

module.exports = BoxMorph;


    
},{"./Color":6,"./Morph":18}],4:[function(require,module,exports){
var Morph = require('./Morph');
var Point = require('./Point');
var Rectangle = require('./Rectangle');

var CircleBoxMorph = Class.create(Morph, {

	// CircleBoxMorph //////////////////////////////////////////////////////

	// I can be used for sliders
	
	initialize: function(orientation) {
	    this.init(orientation || 'vertical');
	},


	init: function ($super, orientation) {
	    $super();
	    this.orientation = orientation;
	    this.autoOrient = true;
	    this.setExtent(new Point(20, 100));
	},

	autoOrientation: function () {
	    if (this.height() > this.width()) {
	        this.orientation = 'vertical';
	    } else {
	        this.orientation = 'horizontal';
	    }
	},

	drawNew: function () {
	    var radius, center1, center2, rect, points, x, y,
	        context, ext,
	        myself = this;

	    if (this.autoOrient) {
	        this.autoOrientation();
	    }
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');

	    if (this.orientation === 'vertical') {
	        radius = this.width() / 2;
	        x = this.center().x;
	        center1 = new Point(x, this.top() + radius);
	        center2 = new Point(x, this.bottom() - radius);
	        rect = new Rectangle(0,0,0,0);
	        rect = this.bounds.origin.add(new Point(0, radius)).corner(
	            rect, 
	            this.bounds.corner.subtract(new Point(0, radius))
	        );
	    } else {
	        radius = this.height() / 2;
	        y = this.center().y;
	        center1 = new Point(this.left() + radius, y);
	        center2 = new Point(this.right() - radius, y);
	        rect = new Rectangle(0,0,0,0);
	        rect = this.bounds.origin.add(new Point(radius, 0)).corner(
	            rect, 
	            this.bounds.corner.subtract(new Point(radius, 0))
	        );
	    }
	    points = [ center1.subtract(this.bounds.origin),
	        center2.subtract(this.bounds.origin)];
	    points.forEach(function (center) {
	        context.fillStyle = myself.color.toString();
	        context.beginPath();
	        context.arc(
	            center.x,
	            center.y,
	            radius,
	            0,
	            2 * Math.PI,
	            false
	        );
	        context.closePath();
	        context.fill();
	    });
	    rect = rect.translateBy(this.bounds.origin.neg());
	    ext = rect.extent();
	    if (ext.x > 0 && ext.y > 0) {
	        context.fillRect(
	            rect.origin.x,
	            rect.origin.y,
	            rect.width(),
	            rect.height()
	        );
	    }
	},

	// CircleBoxMorph menu:

	developersMenu: function ($super) {
		
	    var menu = $super();
	    menu.addLine();
	    if (this.orientation === 'vertical') {
	        menu.addItem(
	            "horizontal...",
	            'toggleOrientation',
	            'toggle the\norientation'
	        );
	    } else {
	        menu.addItem(
	            "vertical...",
	            'toggleOrientation',
	            'toggle the\norientation'
	        );
	    }
	    return menu;
	},

	toggleOrientation: function () {
	    var center = this.center();
	    this.changed();
	    if (this.orientation === 'vertical') {
	        this.orientation = 'horizontal';
	    } else {
	        this.orientation = 'vertical';
	    }
	    this.silentSetExtent(new Point(this.height(), this.width()));
	    this.setCenter(center);
	    this.drawNew();
	    this.changed();
	},

})

CircleBoxMorph.uber = Morph.prototype;
CircleBoxMorph.className = 'CircleBoxMorph';

module.exports = CircleBoxMorph;



},{"./Morph":18,"./Point":22,"./Rectangle":23}],5:[function(require,module,exports){
var Cloud = Class.create({

	// Cloud /////////////////////////////////////////////////////////////

	initialize: function(url){
		this.username = null;
	    this.password = null; // hex_sha512 hashed
	    this.url = url;
	    this.session = null;
	    this.api = {};
	},

	clear: function () {
	    this.username = null;
	    this.password = null;
	    this.session = null;
	    this.api = {};
	},

	hasProtocol: function () {
	    return this.url.toLowerCase().indexOf('http') === 0;
	},

	// Cloud: Snap! API

	createSharebox: function(
	    creatorId,
	    callBack
	) {
	    console.log(this.url)
	    var shareWith = eval("[" + prompt("Who you want to share with", "1, 2, 3") + "]");
	    var data = {
	        creator_id: creatorId,
	        share_with: shareWith
	    }
	    var success = function(data){
	        callBack.call(null, data);
	    }
	    var url = this.url + 'sharebox'
	    console.log(url)
	    console.log(data)
	    console.log(success)
	    console.log($.post)
	    $.ajax({
	        type: "POST",
	        url: url,
	        data: data,
	        success: success,
	        dataType: 'json'
	    });
	},

	signup: function (
	    username,
	    email,
	    callBack,
	    errorCall
	) {
	    // both callBack and errorCall are two-argument functions
	    var request = new XMLHttpRequest(),
	        myself = this;
	    try {
	        request.open(
	            "GET",
	            (this.hasProtocol() ? '' : 'http://')
	                + this.url + 'SignUp'
	                + '&Username='
	                + encodeURIComponent(username)
	                + '&Email='
	                + encodeURIComponent(email),
	            true
	        );
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.withCredentials = true;
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                if (request.responseText) {
	                    if (request.responseText.indexOf('ERROR') === 0) {
	                        errorCall.call(
	                            this,
	                            request.responseText,
	                            'Signup'
	                        );
	                    } else {
	                        callBack.call(
	                            null,
	                            request.responseText,
	                            'Signup'
	                        );
	                    }
	                } else {
	                    errorCall.call(
	                        null,
	                        myself.url + 'SignUp',
	                        localize('could not connect to:')
	                    );
	                }
	            }
	        };
	        request.send(null);
	    } catch (err) {
	        errorCall.call(this, err.toString(), 'Snap!Cloud');
	    }
	},

	getPublicProject: function (
	    id,
	    callBack,
	    errorCall
	) {
	    // id is Username=username&projectName=projectname,
	    // where the values are url-component encoded
	    // callBack is a single argument function, errorCall take two args
	    var request = new XMLHttpRequest(),
	        responseList,
	        myself = this;
	    try {
	        request.open(
	            "GET",
	            (this.hasProtocol() ? '' : 'http://')
	                + this.url + 'Public'
	                + '&'
	                + id,
	            true
	        );
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.withCredentials = true;
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                if (request.responseText) {
	                    if (request.responseText.indexOf('ERROR') === 0) {
	                        errorCall.call(
	                            this,
	                            request.responseText
	                        );
	                    } else {
	                        responseList = myself.parseResponse(
	                            request.responseText
	                        );
	                        callBack.call(
	                            null,
	                            responseList[0].SourceCode
	                        );
	                    }
	                } else {
	                    errorCall.call(
	                        null,
	                        myself.url + 'Public',
	                        localize('could not connect to:')
	                    );
	                }
	            }
	        };
	        request.send(null);
	    } catch (err) {
	        errorCall.call(this, err.toString(), 'Snap!Cloud');
	    }
	},

	resetPassword: function (
	    username,
	    callBack,
	    errorCall
	) {
	    // both callBack and errorCall are two-argument functions
	    var request = new XMLHttpRequest(),
	        myself = this;
	    try {
	        request.open(
	            "GET",
	            (this.hasProtocol() ? '' : 'http://')
	                + this.url + 'ResetPW'
	                + '&Username='
	                + encodeURIComponent(username),
	            true
	        );
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.withCredentials = true;
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                if (request.responseText) {
	                    if (request.responseText.indexOf('ERROR') === 0) {
	                        errorCall.call(
	                            this,
	                            request.responseText,
	                            'Reset Password'
	                        );
	                    } else {
	                        callBack.call(
	                            null,
	                            request.responseText,
	                            'Reset Password'
	                        );
	                    }
	                } else {
	                    errorCall.call(
	                        null,
	                        myself.url + 'ResetPW',
	                        localize('could not connect to:')
	                    );
	                }
	            }
	        };
	        request.send(null);
	    } catch (err) {
	        errorCall.call(this, err.toString(), 'Snap!Cloud');
	    }
	},

	connect: function (
	    callBack,
	    errorCall
	) {
	    // both callBack and errorCall are two-argument functions
	    var request = new XMLHttpRequest(),
	        myself = this;
	    try {
	        request.open(
	            "GET",
	            (this.hasProtocol() ? '' : 'http://') + this.url,
	            true
	        );
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.withCredentials = true;
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                if (request.responseText) {
	                    myself.api = myself.parseAPI(request.responseText);
	                    myself.session = request.getResponseHeader('MioCracker')
	                        .split(';')[0];
	                    if (myself.api.login) {
	                        callBack.call(null, myself.api, 'Snap!Cloud');
	                    } else {
	                        errorCall.call(
	                            null,
	                            'connection failed'
	                        );
	                    }
	                } else {
	                    errorCall.call(
	                        null,
	                        myself.url,
	                        localize('could not connect to:')
	                    );
	                }
	            }
	        };
	        request.send(null);
	    } catch (err) {
	        errorCall.call(this, err.toString(), 'Snap!Cloud');
	    }
	},


	login: function (
	    username,
	    password,
	    callBack,
	    errorCall
	) {
	    var myself = this;
	    this.connect(
	        function () {
	            myself.rawLogin(username, password, callBack, errorCall);
	            myself.disconnect();
	        },
	        errorCall
	    );
	},

	rawLogin: function (
	    username,
	    password,
	    callBack,
	    errorCall
	) {
	    // both callBack and errorCall are two-argument functions
	    var myself = this,
	        pwHash = hex_sha512("miosoft%20miocon,"
	            + this.session.split('=')[1] + ","
	            + encodeURIComponent(username.toLowerCase()) + ","
	            + password // alreadey hex_sha512 hashed
	            );
	    this.callService(
	        'login',
	        function (response, url) {
	            if (myself.api.logout) {
	                myself.username = username;
	                myself.password = password;
	                callBack.call(null, response, url);
	            } else {
	                errorCall.call(
	                    null,
	                    'Service catalog is not available,\nplease retry',
	                    'Connection Error:'
	                );
	            }
	        },
	        errorCall,
	        [username, pwHash]
	    );
	},

	reconnect: function (
	    callBack,
	    errorCall
	) {
	    if (!(this.username && this.password)) {
	        this.message('You are not logged in');
	        return;
	    }
	    this.login(
	        this.username,
	        this.password,
	        callBack,
	        errorCall
	    );
	},

	saveProject: function (ide, callBack, errorCall) {
	    var myself = this,
	        pdata,
	        media;

	    ide.serializer.isCollectingMedia = true;
	    pdata = ide.serializer.serialize(ide.stage);
	    media = ide.hasChangedMedia ?
	            ide.serializer.mediaXML(ide.projectName) : null;
	    ide.serializer.isCollectingMedia = false;
	    ide.serializer.flushMedia();

	    // check if serialized data can be parsed back again
	    try {
	        ide.serializer.parse(pdata);
	    } catch (err) {
	        ide.showMessage('Serialization of program data failed:\n' + err);
	        throw new Error('Serialization of program data failed:\n' + err);
	    }
	    if (media !== null) {
	        try {
	            ide.serializer.parse(media);
	        } catch (err) {
	            ide.showMessage('Serialization of media failed:\n' + err);
	            throw new Error('Serialization of media failed:\n' + err);
	        }
	    }
	    ide.serializer.isCollectingMedia = false;
	    ide.serializer.flushMedia();

	    myself.reconnect(
	        function () {
	            myself.callService(
	                'saveProject',
	                function (response, url) {
	                    callBack.call(null, response, url);
	                    myself.disconnect();
	                    ide.hasChangedMedia = false;
	                },
	                errorCall,
	                [
	                    ide.projectName,
	                    pdata,
	                    media,
	                    pdata.length,
	                    media ? media.length : 0
	                ]
	            );
	        },
	        errorCall
	    );
	},

	getProjectList: function (callBack, errorCall) {
	    var myself = this;
	    this.reconnect(
	        function () {
	            myself.callService(
	                'getProjectList',
	                function (response, url) {
	                    callBack.call(null, response, url);
	                    myself.disconnect();
	                },
	                errorCall
	            );
	        },
	        errorCall
	    );
	},

	changePassword: function (
	    oldPW,
	    newPW,
	    callBack,
	    errorCall
	) {
	    var myself = this;
	    this.reconnect(
	        function () {
	            myself.callService(
	                'changePassword',
	                function (response, url) {
	                    callBack.call(null, response, url);
	                    myself.disconnect();
	                },
	                errorCall,
	                [oldPW, newPW]
	            );
	        },
	        errorCall
	    );
	},

	logout: function (callBack, errorCall) {
	    this.clear();
	    this.callService(
	        'logout',
	        callBack,
	        errorCall
	    );
	},

	disconnect: function () {
	    this.callService(
	        'logout',
	        nop,
	        nop
	    );
	},

	// Cloud: backend communication

	callURL: function (url, callBack, errorCall) {
	    // both callBack and errorCall are optional two-argument functions
	    var request = new XMLHttpRequest(),
	        myself = this;
	    try {
	        request.open('GET', url, true);
	        request.withCredentials = true;
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.setRequestHeader('MioCracker', this.session);
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                if (request.responseText) {
	                    var responseList = myself.parseResponse(
	                        request.responseText
	                    );
	                    callBack.call(null, responseList, url);
	                } else {
	                    errorCall.call(
	                        null,
	                        url,
	                        'no response from:'
	                    );
	                }
	            }
	        };
	        request.send(null);
	    } catch (err) {
	        errorCall.call(this, err.toString(), url);
	    }
	},

	callService: function (
	    serviceName,
	    callBack,
	    errorCall,
	    args
	) {
	    // both callBack and errorCall are optional two-argument functions
	    var request = new XMLHttpRequest(),
	        service = this.api[serviceName],
	        myself = this,
	        postDict;

	    if (!this.session) {
	        errorCall.call(null, 'You are not connected', 'Cloud');
	        return;
	    }
	    if (!service) {
	        errorCall.call(
	            null,
	            'service ' + serviceName + ' is not available',
	            'API'
	        );
	        return;
	    }
	    if (args && args.length > 0) {
	        postDict = {};
	        service.parameters.forEach(function (parm, idx) {
	            postDict[parm] = args[idx];
	        });
	    }
	    try {
	        request.open(service.method, service.url, true);
	        request.withCredentials = true;
	        request.setRequestHeader(
	            "Content-Type",
	            "application/x-www-form-urlencoded"
	        );
	        request.setRequestHeader('MioCracker', this.session);
	        request.onreadystatechange = function () {
	            if (request.readyState === 4) {
	                var responseList = [];
	                if (request.responseText &&
	                        request.responseText.indexOf('ERROR') === 0) {
	                    errorCall.call(
	                        this,
	                        request.responseText,
	                        localize('Service:') + ' ' + localize(serviceName)
	                    );
	                    return;
	                }
	                if (serviceName === 'login') {
	                    myself.api = myself.parseAPI(request.responseText);
	                }
	                responseList = myself.parseResponse(
	                    request.responseText
	                );
	                callBack.call(null, responseList, service.url);
	            }
	        };
	        request.send(this.encodeDict(postDict));
	    } catch (err) {
	        errorCall.call(this, err.toString(), service.url);
	    }
	},

	// Cloud: payload transformation

	parseAPI: function (src) {
	    var api = {},
	        services;
	    services = src.split(" ");
	    services.forEach(function (service) {
	        var entries = service.split("&"),
	            serviceDescription = {},
	            parms;
	        entries.forEach(function (entry) {
	            var pair = entry.split("="),
	                key = decodeURIComponent(pair[0]).toLowerCase(),
	                val = decodeURIComponent(pair[1]);
	            if (key === "service") {
	                api[val] = serviceDescription;
	            } else if (key === "parameters") {
	                parms = val.split(",");
	                if (!(parms.length === 1 && !parms[0])) {
	                    serviceDescription.parameters = parms;
	                }
	            } else {
	                serviceDescription[key] = val;
	            }
	        });
	    });
	    return api;
	},

	parseResponse: function (src) {
	    var ans = [],
	        lines;
	    if (!src) {return ans; }
	    lines = src.split(" ");
	    lines.forEach(function (service) {
	        var entries = service.split("&"),
	            dict = {};
	        entries.forEach(function (entry) {
	            var pair = entry.split("="),
	                key = decodeURIComponent(pair[0]),
	                val = decodeURIComponent(pair[1]);
	            dict[key] = val;
	        });
	        ans.push(dict);
	    });
	    return ans;
	},

	parseDict: function (src) {
	    var dict = {};
	    if (!src) {return dict; }
	    src.split("&").forEach(function (entry) {
	        var pair = entry.split("="),
	            key = decodeURIComponent(pair[0]),
	            val = decodeURIComponent(pair[1]);
	        dict[key] = val;
	    });
	    return dict;
	},

	encodeDict: function (dict) {
	    var str = '',
	        pair,
	        key;
	    if (!dict) {return null; }
	    for (key in dict) {
	        if (dict.hasOwnProperty(key)) {
	            pair = encodeURIComponent(key)
	                + '='
	                + encodeURIComponent(dict[key]);
	            if (str.length > 0) {
	                str += '&';
	            }
	            str += pair;
	        }
	    }
	    return str;
	},

	// Cloud: user messages (to be overridden)

	message: function (string) {
	    alert(string);
	},

})

Cloud.className = 'Cloud';

module.exports = Cloud;

},{}],6:[function(require,module,exports){
var Color = Class.create({
	
	initialize: function(r, g, b, a){
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || ((a === 0) ? 0 : 1);
	},
	
	toString: function () {
		return 'rgba(' +
			Math.round(this.r) + ',' +
			Math.round(this.g) + ',' +
			Math.round(this.b) + ',' +
			this.a + ')';
	},

	copy: function () {
		return new Color(
			this.r,
			this.g,
			this.b,
			this.a
		);
	},

	// Color comparison:

	eq: function (aColor) {
	    // ==
	    return aColor &&
	        this.r === aColor.r &&
	        this.g === aColor.g &&
	        this.b === aColor.b;
	},

	// Color conversion (hsv):

	hsv: function () {
	    // ignore alpha
	    var max, min, h, s, v, d,
	        rr = this.r / 255,
	        gg = this.g / 255,
	        bb = this.b / 255;
	    max = Math.max(rr, gg, bb);
	    min = Math.min(rr, gg, bb);
	    h = max;
	    s = max;
	    v = max;
	    d = max - min;
	    s = max === 0 ? 0 : d / max;
	    if (max === min) {
	        h = 0;
	    } else {
	        switch (max) {
	        case rr:
	            h = (gg - bb) / d + (gg < bb ? 6 : 0);
	            break;
	        case gg:
	            h = (bb - rr) / d + 2;
	            break;
	        case bb:
	            h = (rr - gg) / d + 4;
	            break;
	        }
	        h /= 6;
	    }
	    return [h, s, v];
	},

	set_hsv: function (h, s, v) {
	    // ignore alpha, h, s and v are to be within [0, 1]
	    var i, f, p, q, t;
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	    case 0:
	        this.r = v;
	        this.g = t;
	        this.b = p;
	        break;
	    case 1:
	        this.r = q;
	        this.g = v;
	        this.b = p;
	        break;
	    case 2:
	        this.r = p;
	        this.g = v;
	        this.b = t;
	        break;
	    case 3:
	        this.r = p;
	        this.g = q;
	        this.b = v;
	        break;
	    case 4:
	        this.r = t;
	        this.g = p;
	        this.b = v;
	        break;
	    case 5:
	        this.r = v;
	        this.g = p;
	        this.b = q;
	        break;
	    }

	    this.r *= 255;
	    this.g *= 255;
	    this.b *= 255;

	},

	// Color mixing:

	mixed: function (proportion, otherColor) {
	    // answer a copy of this color mixed with another color, ignore alpha
	    var frac1 = Math.min(Math.max(proportion, 0), 1),
	        frac2 = 1 - frac1;
	    return new Color(
	        this.r * frac1 + otherColor.r * frac2,
	        this.g * frac1 + otherColor.g * frac2,
	        this.b * frac1 + otherColor.b * frac2
	    );
	},

	darker: function (percent) {
	    // return an rgb-interpolated darker copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(0, 0, 0));
	},

	lighter: function (percent) {
	    // return an rgb-interpolated lighter copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(255, 255, 255));
	},

	dansDarker: function () {
	    // return an hsv-interpolated darker copy of me, ignore alpha
	    var hsv = this.hsv(),
	        result = new Color(),
	        vv = Math.max(hsv[2] - 0.16, 0);
	    result.set_hsv(hsv[0], hsv[1], vv);
	    return result;
	}

})

Color.className = 'Color';

module.exports = Color;
},{}],7:[function(require,module,exports){
var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');

var ColorPaletteMorph = Class.create(Morph, {

	// ColorPaletteMorph ///////////////////////////////////////////////////
	
	initialize: function(target, sizePoint){
		this.init(
	        target || null,
	        sizePoint || new Point(80, 50)
    	);
	},

	// ColorPaletteMorph inherits from Morph:

	init: function ($super, target, size) {
	    $super();
	    this.target = target;
	    this.targetSetter = 'color';
	    this.silentSetExtent(size);
	    this.choice = null;
	    this.drawNew();
	},

	drawNew: function () {
	    var context, ext, x, y, h, l;

	    ext = this.extent();
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');
	    this.choice = new Color();
	    for (x = 0; x <= ext.x; x += 1) {
	        h = 360 * x / ext.x;
	        for (y = 0; y <= ext.y; y += 1) {
	            l = 100 - (y / ext.y * 100);
	            context.fillStyle = 'hsl(' + h + ',100%,' + l + '%)';
	            context.fillRect(x, y, 1, 1);
	        }
	    }
	},

	mouseMove: function (pos) {
	    this.choice = this.getPixelColor(pos);
	    this.updateTarget();
	},

	mouseDownLeft: function (pos) {
	    this.choice = this.getPixelColor(pos);
	    this.updateTarget();
	},

	updateTarget: function () {
	    if (this.target instanceof Morph && this.choice !== null) {
	        if (this.target[this.targetSetter] instanceof Function) {
	            this.target[this.targetSetter](this.choice);
	        } else {
	            this.target[this.targetSetter] = this.choice;
	            this.target.drawNew();
	            this.target.changed();
	        }
	    }
	},

	// ColorPaletteMorph duplicating:

	copyRecordingReferences: function (dict) {
	    // inherited, see comment in Morph
	    var c = ColorPaletteMorph.uber.copyRecordingReferences.call(
	        this,
	        dict
	    );
	    if (c.target && dict[this.target]) {
	        c.target = (dict[this.target]);
	    }
	    return c;
	},

	// ColorPaletteMorph menu:

	developersMenu: function () {
	    var menu = ColorPaletteMorph.uber.developersMenu.call(this);
	    menu.addLine();
	    menu.addItem(
	        'set target',
	        "setTarget",
	        'choose another morph\nwhose color property\n will be' +
	            ' controlled by this one'
	    );
	    return menu;
	},

	setTarget: function (targetMenu, propertyMenu) {
	    var choices = this.overlappedMorphs(),
	        // targetMenu = new MenuMorph(this, 'choose target:'),
	        // propertyMenu = new MenuMorph(this, 'choose target property:'),
	        myself = this;

	    choices.push(this.world());
	    choices.forEach(function (each) {
	        targetMenu.addItem(each.toString().slice(0, 50), function () {
	            myself.target = each;
	            myself.setTargetSetter(propertyMenu);
	        });
	    });
	    if (choices.length === 1) {
	        this.target = choices[0];
	        this.setTargetSetter(propertyMenu);
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

	setTargetSetter: function (menu) {
	    var choices = this.target.colorSetters(),
	        // menu = new MenuMorph(this, 'choose target property:'),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each, function () {
	            myself.targetSetter = each;
	        });
	    });
	    if (choices.length === 1) {
	        this.targetSetter = choices[0];
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},


})

ColorPaletteMorph.uber = Morph.prototype;
ColorPaletteMorph.className = 'ColorPaletteMorph';

module.exports = ColorPaletteMorph;




	
},{"./Color":6,"./Morph":18,"./Point":22}],8:[function(require,module,exports){
var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');
var ColorPaletteMorph = require('./ColorPaletteMorph');
var GrayPaletteMorph = require('./GrayPaletteMorph');

var ColorPickerMorph = Class.create(Morph, {

	// ColorPickerMorph ///////////////////////////////////////////////////
	
	initialize: function(defaultColor){
	    this.init(defaultColor || new Color(255, 255, 255));
	},

	init: function ($super, defaultColor) {
	    this.choice = defaultColor;
	    $super();
	    this.color = new Color(255, 255, 255);
	    this.silentSetExtent(new Point(80, 80));
	    this.drawNew();
	},

	drawNew: function () {
	    ColorPickerMorph.uber.drawNew.call(this);
	    this.buildSubmorphs();
	},

	buildSubmorphs: function () {
	    var cpal, gpal, x, y;

	    this.children.forEach(function (child) {
	        child.destroy();
	    });
	    this.children = [];
	    this.feedback = new Morph();
	    this.feedback.color = this.choice;
	    this.feedback.setExtent(new Point(20, 20));
	    cpal = new ColorPaletteMorph(
	        this.feedback,
	        new Point(this.width(), 50)
	    );
	    gpal = new GrayPaletteMorph(
	        this.feedback,
	        new Point(this.width(), 5)
	    );
	    cpal.setPosition(this.bounds.origin);
	    this.add(cpal);
	    gpal.setPosition(cpal.bottomLeft());
	    this.add(gpal);
	    x = (gpal.left() +
	        Math.floor((gpal.width() - this.feedback.width()) / 2));
	    y = gpal.bottom() + Math.floor((this.bottom() -
	        gpal.bottom() - this.feedback.height()) / 2);
	    this.feedback.setPosition(new Point(x, y));
	    this.add(this.feedback);
	},

	getChoice: function () {
	    return this.feedback.color;
	},

	rootForGrab: function () {
	    return this;
	},

})

ColorPickerMorph.uber = Morph.prototype;
ColorPickerMorph.className = 'ColorPickerMorph';

module.exports = ColorPickerMorph;


},{"./Color":6,"./ColorPaletteMorph":7,"./GrayPaletteMorph":11,"./Morph":18,"./Point":22}],9:[function(require,module,exports){

var BlinkerMorph = require('./BlinkerMorph');
var InspectorMorph = require('./InspectorMorph');
var Point = require('./Point');


var CursorMorph = Class.create(BlinkerMorph, {

    // CursorMorph /////////////////////////////////////////////////////////

    // I am a String/Text editing widget

    initialize: function(aStringOrTextMorph){
        this.init(aStringOrTextMorph);
    },

    init: function (aStringOrTextMorph) {
        var ls;

        // additional properties:
        this.keyDownEventUsed = false;
        this.target = aStringOrTextMorph;
        this.originalContents = this.target.text;
        this.originalAlignment = this.target.alignment;
        this.slot = this.target.text.length;
        CursorMorph.uber.init.call(this);
        ls = fontHeight(this.target.fontSize);
        this.setExtent(new Point(Math.max(Math.floor(ls / 20), 1), ls));
        this.drawNew();
        this.image.getContext('2d').font = this.target.font();
        if (this.target.className == 'TextMorph' &&
                (this.target.alignment !== 'left')) {
            this.target.setAlignmentToLeft();
        }
        this.gotoSlot(this.slot);
    },

    // CursorMorph event processing:

    processKeyPress: function (event) {
        // this.inspectKeyEvent(event);
        if (this.keyDownEventUsed) {
            this.keyDownEventUsed = false;
            return null;
        }
        if ((event.keyCode === 40) || event.charCode === 40) {
            this.insert('(');
            return null;
        }
        if ((event.keyCode === 37) || event.charCode === 37) {
            this.insert('%');
            return null;
        }
        if (event.keyCode) { // Opera doesn't support charCode
            if (event.ctrlKey) {
                this.ctrl(event.keyCode, event.shiftKey);
            } else if (event.metaKey) {
                this.cmd(event.keyCode, event.shiftKey);
            } else {
                this.insert(
                    String.fromCharCode(event.keyCode),
                    event.shiftKey
                );
            }
        } else if (event.charCode) { // all other browsers
            if (event.ctrlKey) {
                this.ctrl(event.charCode, event.shiftKey);
            } else if (event.metaKey) {
                this.cmd(event.charCode, event.shiftKey);
            } else {
                this.insert(
                    String.fromCharCode(event.charCode),
                    event.shiftKey
                );
            }
        }
        // notify target's parent of key event
        this.target.escalateEvent('reactToKeystroke', event);
    },

    processKeyDown: function (event) {
        // this.inspectKeyEvent(event);
        var shift = event.shiftKey;
        this.keyDownEventUsed = false;
        if (event.ctrlKey) {
            this.ctrl(event.keyCode, event.shiftKey);
            // notify target's parent of key event
            this.target.escalateEvent('reactToKeystroke', event);
            return;
        }
        if (event.metaKey) {
            this.cmd(event.keyCode, event.shiftKey);
            // notify target's parent of key event
            this.target.escalateEvent('reactToKeystroke', event);
            return;
        }

        switch (event.keyCode) {
        case 37:
            this.goLeft(shift);
            this.keyDownEventUsed = true;
            break;
        case 39:
            this.goRight(shift);
            this.keyDownEventUsed = true;
            break;
        case 38:
            this.goUp(shift);
            this.keyDownEventUsed = true;
            break;
        case 40:
            this.goDown(shift);
            this.keyDownEventUsed = true;
            break;
        case 36:
            this.goHome(shift);
            this.keyDownEventUsed = true;
            break;
        case 35:
            this.goEnd(shift);
            this.keyDownEventUsed = true;
            break;
        case 46:
            this.deleteRight();
            this.keyDownEventUsed = true;
            break;
        case 8:
            this.deleteLeft();
            this.keyDownEventUsed = true;
            break;
        case 13:
            if (this.target.className == 'StringMorph') {
                this.accept();
            } else {
                this.insert('\n');
            }
            this.keyDownEventUsed = true;
            break;
        case 27:
            this.cancel();
            this.keyDownEventUsed = true;
            break;
        default:
            nop();
            // this.inspectKeyEvent(event);
        }
        // notify target's parent of key event
        this.target.escalateEvent('reactToKeystroke', event);
    },

    // CursorMorph navigation:

    /*
    // original non-scrolling code, commented out in case we need to fall back:

    gotoSlot: function (newSlot) {
        this.setPosition(this.target.slotPosition(newSlot));
        this.slot = Math.max(newSlot, 0);
    },
    */

    gotoSlot: function (slot) {
        var length = this.target.text.length,
            pos = this.target.slotPosition(slot),
            right,
            left;
        this.slot = slot < 0 ? 0 : slot > length ? length : slot;
        if (this.parent && this.target.isScrollable) {
            right = this.parent.right() - this.viewPadding;
            left = this.parent.left() + this.viewPadding;
            if (pos.x > right) {
                this.target.setLeft(this.target.left() + right - pos.x);
                pos.x = right;
            }
            if (pos.x < left) {
                left = Math.min(this.parent.left(), left);
                this.target.setLeft(this.target.left() + left - pos.x);
                pos.x = left;
            }
            if (this.target.right() < right &&
                    right - this.target.width() < left) {
                pos.x += right - this.target.right();
                this.target.setRight(right);
            }
        }
        this.show();
        this.setPosition(pos);
        if (this.parent
                && this.parent.parent.className == 'ScrollFrameMorph'
                && this.target.isScrollable) {
            this.parent.parent.scrollCursorIntoView(this);
        }
    },

    goLeft: function (shift) {
        this.updateSelection(shift);
        this.gotoSlot(this.slot - 1);
        this.updateSelection(shift);
    },

    goRight: function (shift, howMany) {
        this.updateSelection(shift);
        this.gotoSlot(this.slot + (howMany || 1));
        this.updateSelection(shift);
    },

    goUp: function (shift) {
        this.updateSelection(shift);
        this.gotoSlot(this.target.upFrom(this.slot));
        this.updateSelection(shift);
    },

    goDown: function (shift) {
        this.updateSelection(shift);
        this.gotoSlot(this.target.downFrom(this.slot));
        this.updateSelection(shift);
    },

    goHome: function (shift) {
        this.updateSelection(shift);
        this.gotoSlot(this.target.startOfLine(this.slot));
        this.updateSelection(shift);
    },

    goEnd: function (shift) {
        this.updateSelection(shift);
        this.gotoSlot(this.target.endOfLine(this.slot));
        this.updateSelection(shift);
    },

    gotoPos: function (aPoint) {
        this.gotoSlot(this.target.slotAt(aPoint));
        this.show();
    },

    // CursorMorph selecting:

    updateSelection: function (shift) {
        if (shift) {
            if (!this.target.endMark && !this.target.startMark) {
                this.target.startMark = this.slot;
                this.target.endMark = this.slot;
            } else if (this.target.endMark !== this.slot) {
                this.target.endMark = this.slot;
                this.target.drawNew();
                this.target.changed();
            }
        } else {
            this.target.clearSelection();
        }
    },

    // CursorMorph editing:

    accept: function () {
        var world = this.root();
        if (world) {
            world.stopEditing();
        }
        this.escalateEvent('accept', null);
    },

    cancel: function () {
        var world = this.root();
        this.undo();
        if (world) {
            world.stopEditing();
        }
        this.escalateEvent('cancel', null);
    },

    undo: function () {
        this.target.text = this.originalContents;
        this.target.changed();
        this.target.drawNew();
        this.target.changed();
        this.gotoSlot(0);
    },

    insert: function (aChar, shiftKey) {
        var text;
        if (aChar === '\u0009') {
            this.target.escalateEvent('reactToEdit', this.target);
            if (shiftKey) {
                return this.target.backTab(this.target);
            }
            return this.target.tab(this.target);
        }
        if (!this.target.isNumeric ||
                !isNaN(parseFloat(aChar)) ||
                contains(['-', '.'], aChar)) {
            if (this.target.selection() !== '') {
                this.gotoSlot(this.target.selectionStartSlot());
                this.target.deleteSelection();
            }
            text = this.target.text;
            text = text.slice(0, this.slot) +
                aChar +
                text.slice(this.slot);
            this.target.text = text;
            this.target.drawNew();
            this.target.changed();
            this.goRight(false, aChar.length);
        }
    },

    ctrl: function (aChar, shiftKey) {
        var text, result;

        if (aChar === 64 || (aChar === 65 && shiftKey)) {
            this.insert('@');
        } else if (aChar === 65) {
            this.target.selectAll();
        } else if (aChar === 90) {
            this.undo();
        } else if (aChar === 123) {
            this.insert('{');
        } else if (aChar === 125) {
            this.insert('}');
        } else if (aChar === 91) {
            this.insert('[');
        } else if (aChar === 93) {
            this.insert(']');
        } else if (!isNil(this.target.receiver)) {
            if (aChar === 68) {
                this.target.doIt();
            } else if (aChar === 73) {
                text = this.target;
                result = text.receiver.evaluateString(text.selection());
                this.target.inspectIt(result, new InspectorMorph(result));
            } else if (aChar === 80) {
                this.target.showIt();
            }
        }


    },

    cmd: function (aChar, shiftKey) {
        var text, result;
        if (aChar === 64 || (aChar === 65 && shiftKey)) {
            this.insert('@');
        } else if (aChar === 65) {
            this.target.selectAll();
        } else if (aChar === 90) {
            this.undo();
        } else if (!isNil(this.target.receiver)) {
            if (aChar === 68) {
                this.target.doIt();
            } else if (aChar === 73) {
                text = this.target;
                result = text.receiver.evaluateString(text.selection());
                this.target.inspectIt(result, new InspectorMorph(result));
            } else if (aChar === 80) {
                this.target.showIt();
            }
        }
    },

    deleteRight: function () {
        var text;
        if (this.target.selection() !== '') {
            this.gotoSlot(this.target.selectionStartSlot());
            this.target.deleteSelection();
        } else {
            text = this.target.text;
            this.target.changed();
            text = text.slice(0, this.slot) + text.slice(this.slot + 1);
            this.target.text = text;
            this.target.drawNew();
        }
    },

    deleteLeft: function () {
        var text;
        if (this.target.selection()) {
            this.gotoSlot(this.target.selectionStartSlot());
            return this.target.deleteSelection();
        }
        text = this.target.text;
        this.target.changed();
        this.target.text = text.substring(0, this.slot - 1) +
            text.substr(this.slot);
        this.target.drawNew();
        this.goLeft();
    },

    // CursorMorph destroying:

    destroy: function () {
        if (this.target.alignment !== this.originalAlignment) {
            this.target.alignment = this.originalAlignment;
            this.target.drawNew();
            this.target.changed();
        }
        CursorMorph.uber.destroy.call(this);
    },

    // CursorMorph utilities:

    inspectKeyEvent: function (event) {
        // private
        this.inform(
            'Key pressed: ' +
                String.fromCharCode(event.charCode) +
                '\n------------------------' +
                '\ncharCode: ' +
                event.charCode.toString() +
                '\nkeyCode: ' +
                event.keyCode.toString() +
                '\nshiftKey: ' +
                event.shiftKey.toString() +
                '\naltKey: ' +
                event.altKey.toString() +
                '\nctrlKey: ' +
                event.ctrlKey.toString() +
                '\ncmdKey: ' +
                event.metaKey.toString()
        );
    },
    viewPadding: 1,

})

CursorMorph.uber = BlinkerMorph.prototype;
CursorMorph.className = 'CursorMorph';

module.exports = CursorMorph;



},{"./BlinkerMorph":1,"./InspectorMorph":14,"./Point":22}],10:[function(require,module,exports){
var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');

var FrameMorph = Class.create(Morph, {

    // FrameMorph //////////////////////////////////////////////////////////

    // I clip my submorphs at my bounds
    
    initialize: function(aScrollFrame) {
        this.init(aScrollFrame);
    },

    init: function ($super, aScrollFrame) {
        this.scrollFrame = aScrollFrame || null;

        $super();
        this.color = new Color(255, 250, 245);
        this.drawNew();
        this.acceptsDrops = true;

        if (this.scrollFrame) {
            this.isDraggable = false;
            this.noticesTransparentClick = false;
            this.alpha = 0;
        }
    },

    fullBounds: function () {
        var shadow = this.getShadow();
        if (shadow !== null) {
            return this.bounds.merge(shadow.bounds);
        }
        return this.bounds;
    },

    fullImage: function () {
        // use only for shadows
        return this.image;
    },

    fullDrawOn: function (aCanvas, aRect) {
        var rectangle, dirty;
        if (!this.isVisible) {
            return null;
        }
        rectangle = aRect || this.fullBounds();
        dirty = this.bounds.intersect(rectangle);
        if (!dirty.extent().gt(new Point(0, 0))) {
            return null;
        }
        this.drawOn(aCanvas, dirty);
        this.children.forEach(function (child) {
            if (child.instanceOf('ShadowMorph')) {
                child.fullDrawOn(aCanvas, rectangle);
            } else {
                child.fullDrawOn(aCanvas, dirty);
            }
        });
    },

    // FrameMorph scrolling optimization:

    moveBy: function (delta) {
        this.changed();
        this.bounds = this.bounds.translateBy(delta);
        this.children.forEach(function (child) {
            child.silentMoveBy(delta);
        });
        this.changed();
    },

    // FrameMorph scrolling support:

    submorphBounds: function () {
        var result = null;

        if (this.children.length > 0) {
            result = this.children[0].bounds;
            this.children.forEach(function (child) {
                result = result.merge(child.fullBounds());
            });
        }
        return result;
    },

    keepInScrollFrame: function () {
        if (this.scrollFrame === null) {
            return null;
        }
        if (this.left() > this.scrollFrame.left()) {
            this.moveBy(
                new Point(this.scrollFrame.left() - this.left(), 0)
            );
        }
        if (this.right() < this.scrollFrame.right()) {
            this.moveBy(
                new Point(this.scrollFrame.right() - this.right(), 0)
            );
        }
        if (this.top() > this.scrollFrame.top()) {
            this.moveBy(
                new Point(0, this.scrollFrame.top() - this.top())
            );
        }
        if (this.bottom() < this.scrollFrame.bottom()) {
            this.moveBy(
                0,
                new Point(this.scrollFrame.bottom() - this.bottom(), 0)
            );
        }
    },

    adjustBounds: function () {
        var subBounds,
            newBounds,
            myself = this;

        if (this.scrollFrame === null) {
            return null;
        }

        subBounds = this.submorphBounds();
        if (subBounds && (!this.scrollFrame.isTextLineWrapping)) {
            newBounds = subBounds
                .expandBy(this.scrollFrame.padding)
                .growBy(this.scrollFrame.growth)
                .merge(this.scrollFrame.bounds);
        } else {
            newBounds = this.scrollFrame.bounds.copy();
        }
        if (!this.bounds.eq(newBounds)) {
            this.bounds = newBounds;
            this.drawNew();
            this.keepInScrollFrame();
        }

        if (this.scrollFrame.isTextLineWrapping) {
            this.children.forEach(function (morph) {
                if (morph.instanceOf('TextMorph')) {
                    morph.setWidth(myself.width());
                    myself.setHeight(
                        Math.max(morph.height(), myself.scrollFrame.height())
                    );
                }
            });
        }

        this.scrollFrame.adjustScrollBars();
    },

    // FrameMorph dragging & dropping of contents:

    reactToDropOf: function () {
        this.adjustBounds();
    },

    reactToGrabOf: function () {
        this.adjustBounds();
    },

    // FrameMorph duplicating:

    copyRecordingReferences: function ($super, dict) {
        // inherited, see comment in Morph
        var c = $super(dict);
        if (c.frame && dict[this.scrollFrame]) {
            c.frame = (dict[this.scrollFrame]);
        }
        return c;
    },

    // FrameMorph menus:

    developersMenu: function ($super) {
        var menu = $super();
        if (this.children.length > 0) {
            menu.addLine();
            menu.addItem(
                "move all inside...",
                'keepAllSubmorphsWithin',
                'keep all submorphs\nwithin and visible'
            );
        }
        return menu;
    },

    keepAllSubmorphsWithin: function () {
        var myself = this;
        this.children.forEach(function (m) {
            m.keepWithin(myself);
        });
    },



})

FrameMorph.uber = Morph.prototype;
FrameMorph.className = 'FrameMorph';

module.exports = FrameMorph;

    
},{"./Color":6,"./Morph":18,"./Point":22}],11:[function(require,module,exports){
var Color = require('./Color');
var Point = require('./Point');
var ColorPaletteMorph = require('./ColorPaletteMorph');

var GrayPaletteMorph = Class.create(ColorPaletteMorph, {
	
	initialize: function(target, sizePoint){
		this.init(
        	target || null,
        	sizePoint || new Point(80, 10)
    	);
	},

	drawNew: function () {
	    var context, ext, gradient;

	    ext = this.extent();
	    this.image = newCanvas(this.extent());
	    context = this.image.getContext('2d');dd
	    this.choice = new Color();
	    gradient = context.createLinearGradient(0, 0, ext.x, ext.y);
	    gradient.addColorStop(0, 'black');
	    gradient.addColorStop(1, 'white');
	    context.fillStyle = gradient;
	    context.fillRect(0, 0, ext.x, ext.y);
	},

})

GrayPaletteMorph.uber = ColorPaletteMorph.prototype;
GrayPaletteMorph.className = 'GrayPaletteMorph';

module.exports = GrayPaletteMorph;


},{"./Color":6,"./ColorPaletteMorph":7,"./Point":22}],12:[function(require,module,exports){
var Morph = require('./Morph');
var Point = require('./Point');
var Rectangle = require('./Rectangle');

var HandMorph = Class.create(Morph, {
	
	// HandMorph ///////////////////////////////////////////////////////////

	// I represent the Mouse cursor

	initialize: function(aWorld) {
	    this.init(aWorld);
	},

	init: function ($super, aWorld) {
	    $super();
	    this.bounds = new Rectangle();

	    // additional properties:
	    this.world = aWorld;
	    this.mouseButton = null;
	    this.mouseOverList = [];
	    this.mouseDownMorph = null;
	    this.morphToGrab = null;
	    this.grabOrigin = null;
	    this.temporaries = [];
	    this.touchHoldTimeout = null;
	},

	changed: function () {
	    var b;
	    if (this.world !== null) {
	        b = this.fullBounds();
	        if (!b.extent().eq(new Point())) {
	            this.world.broken.push(this.fullBounds().spread());
	        }
	    }

	},

	// HandMorph navigation:

	morphAtPointer: function () {
	    var morphs = this.world.allChildren().slice(0).reverse(),
	        myself = this,
	        result = null;

	    morphs.forEach(function (m) {
	        if (m.visibleBounds().containsPoint(myself.bounds.origin) &&
	                result === null &&
	                m.isVisible &&
	                (m.noticesTransparentClick ||
	                    (!m.isTransparentAt(myself.bounds.origin))) &&
	                (!(m.instanceOf('ShadowMorph'))) &&
	                m.allParents().every(function (each) {
	                    return each.isVisible;
	                })) {
	            result = m;
	        }
	    });
	    if (result !== null) {
	        return result;
	    }
	    return this.world;
	},

	/*
	    alternative -  more elegant and possibly more
	    performant - solution for morphAtPointer.
	    Has some issues, commented out for now

	morphAtPointer: function () {
	    var myself = this;
	    return this.world.topMorphSuchThat(function (m) {
	        return m.visibleBounds().containsPoint(myself.bounds.origin) &&
	            m.isVisible &&
	            (m.noticesTransparentClick ||
	                (! m.isTransparentAt(myself.bounds.origin))) &&
	            (! (m instanceof ShadowMorph));
	    });
	},
	*/

	allMorphsAtPointer: function () {
	    var morphs = this.world.allChildren(),
	        myself = this;
	    return morphs.filter(function (m) {
	        return m.isVisible &&
	            m.visibleBounds().containsPoint(myself.bounds.origin);
	    });
	},

	// HandMorph dragging and dropping:
	/*
	    drag 'n' drop events, method(arg) -> receiver:

	        prepareToBeGrabbed(handMorph) -> grabTarget
	        reactToGrabOf(grabbedMorph) -> oldParent
	        wantsDropOf(morphToDrop) ->  newParent
	        justDropped(handMorph) -> droppedMorph
	        reactToDropOf(droppedMorph, handMorph) -> newParent
	*/

	dropTargetFor: function (aMorph) {
	    var target = this.morphAtPointer();
	    while (!target.wantsDropOf(aMorph)) {
	        target = target.parent;
	    }
	    return target;
	},

	grab: function (aMorph) {
	    var oldParent = aMorph.parent;
	    if (aMorph.instanceOf('WorldMorph')) {
	        return null;
	    }
	    if (this.children.length === 0) {
	        this.world.stopEditing();
	        this.grabOrigin = aMorph.situation();
	        aMorph.addShadow();
	        if (aMorph.prepareToBeGrabbed) {
	            aMorph.prepareToBeGrabbed(this);
	        }
	        this.add(aMorph);
	        this.changed();
	        if (oldParent && oldParent.reactToGrabOf) {
	            oldParent.reactToGrabOf(aMorph);
	        }
	    }
	},

	drop: function () {
	    var target, morphToDrop;
	    if (this.children.length !== 0) {
	        morphToDrop = this.children[0];
	        target = this.dropTargetFor(morphToDrop);
	        this.changed();
	        target.add(morphToDrop);
	        morphToDrop.changed();
	        morphToDrop.removeShadow();
	        this.children = [];
	        this.setExtent(new Point());
	        if (morphToDrop.justDropped) {
	            morphToDrop.justDropped(this);
	        }
	        if (target.reactToDropOf) {
	            target.reactToDropOf(morphToDrop, this);
	        }
	        this.dragOrigin = null;
	    }
	},

	// HandMorph event dispatching:
	/*
	    mouse events:

	        mouseDownLeft
	        mouseDownRight
	        mouseClickLeft
	        mouseClickRight
	        mouseDoubleClick
	        mouseEnter
	        mouseLeave
	        mouseEnterDragging
	        mouseLeaveDragging
	        mouseMove
	        mouseScroll
	*/

	processMouseDown: function (event) {
	    var morph, expectedClick, actualClick;

	    this.destroyTemporaries();
	    this.morphToGrab = null;
	    if (this.children.length !== 0) {
	        this.drop();
	        this.mouseButton = null;
	    } else {
	        morph = this.morphAtPointer();
	        if (this.world.activeMenu) {
	            if (!contains(
	                    morph.allParents(),
	                    this.world.activeMenu
	                )) {
	                this.world.activeMenu.destroy();
	            } else {
	                clearInterval(this.touchHoldTimeout);
	            }
	        }
	        if (this.world.activeHandle) {
	            if (morph !== this.world.activeHandle) {
	                this.world.activeHandle.destroy();
	            }
	        }
	        if (this.world.cursor) {
	            if (morph !== this.world.cursor.target) {
	                this.world.stopEditing();
	            }
	        }
	        if (!morph.mouseMove) {
	            this.morphToGrab = morph.rootForGrab();
	        }
	        if (event.button === 2 || event.ctrlKey) {
	            this.mouseButton = 'right';
	            actualClick = 'mouseDownRight';
	            expectedClick = 'mouseClickRight';
	        } else {
	            this.mouseButton = 'left';
	            actualClick = 'mouseDownLeft';
	            expectedClick = 'mouseClickLeft';
	        }
	        this.mouseDownMorph = morph;
	        while (!this.mouseDownMorph[expectedClick]) {
	            this.mouseDownMorph = this.mouseDownMorph.parent;
	        }
	        while (!morph[actualClick]) {
	            morph = morph.parent;
	        }
	        morph[actualClick](this.bounds.origin);
	    }
	},

	processTouchStart: function (event) {
	    var myself = this;
	    MorphicPreferences.isTouchDevice = true;
	    clearInterval(this.touchHoldTimeout);
	    if (event.touches.length === 1) {
	        this.touchHoldTimeout = setInterval( // simulate mouseRightClick
	            function () {
	                myself.processMouseDown({button: 2});
	                myself.processMouseUp({button: 2});
	                event.preventDefault();
	                clearInterval(myself.touchHoldTimeout);
	            },
	            400
	        );
	        this.processMouseMove(event.touches[0]); // update my position
	        this.processMouseDown({button: 0});
	        event.preventDefault();
	    }
	},

	processTouchMove: function (event) {
	    MorphicPreferences.isTouchDevice = true;
	    if (event.touches.length === 1) {
	        var touch = event.touches[0];
	        this.processMouseMove(touch);
	        clearInterval(this.touchHoldTimeout);
	    }
	},

	processTouchEnd: function (event) {
	    MorphicPreferences.isTouchDevice = true;
	    clearInterval(this.touchHoldTimeout);
	    nop(event);
	    this.processMouseUp({button: 0});
	},

	processMouseUp: function () {
	    var morph = this.morphAtPointer(),
	        context,
	        contextMenu,
	        expectedClick;

	    this.destroyTemporaries();
	    if (this.children.length !== 0) {
	        this.drop();
	    } else {
	        if (this.mouseButton === 'left') {
	            expectedClick = 'mouseClickLeft';
	        } else {
	            expectedClick = 'mouseClickRight';
	            if (this.mouseButton) {
	                context = morph;
	                contextMenu = context.contextMenu();
	                while ((!contextMenu) &&
	                        context.parent) {
	                    context = context.parent;
	                    contextMenu = context.contextMenu();
	                }
	                if (contextMenu) {
	                    contextMenu.popUpAtHand(this.world);
	                }
	            }
	        }
	        while (!morph[expectedClick]) {
	            morph = morph.parent;
	        }
	        morph[expectedClick](this.bounds.origin);
	    }
	    this.mouseButton = null;
	},

	processDoubleClick: function () {
	    var morph = this.morphAtPointer();

	    this.destroyTemporaries();
	    if (this.children.length !== 0) {
	        this.drop();
	    } else {
	        while (morph && !morph.mouseDoubleClick) {
	            morph = morph.parent;
	        }
	        if (morph) {
	            morph.mouseDoubleClick(this.bounds.origin);
	        }
	    }
	    this.mouseButton = null;
	},

	processMouseMove: function (event) {
	    var pos,
	        posInDocument = getDocumentPositionOf(this.world.worldCanvas),
	        mouseOverNew,
	        myself = this,
	        morph,
	        topMorph,
	        fb;

	    pos = new Point(
	        event.pageX - posInDocument.x,
	        event.pageY - posInDocument.y
	    );

	    this.setPosition(pos);

	    // determine the new mouse-over-list:
	    // mouseOverNew = this.allMorphsAtPointer();
	    mouseOverNew = this.morphAtPointer().allParents();

	    if ((this.children.length === 0) &&
	            (this.mouseButton === 'left')) {
	        topMorph = this.morphAtPointer();
	        morph = topMorph.rootForGrab();
	        if (topMorph.mouseMove) {
	            topMorph.mouseMove(pos);
	        }

	        // if a morph is marked for grabbing, just grab it
	        if (this.morphToGrab) {
	            if (this.morphToGrab.isDraggable) {
	                morph = this.morphToGrab;
	                this.grab(morph);
	            } else if (this.morphToGrab.isTemplate) {
	                morph = this.morphToGrab.fullCopy();
	                morph.isTemplate = false;
	                morph.isDraggable = true;
	                this.grab(morph);
	                this.grabOrigin = this.morphToGrab.situation();
	            }
	            if (morph) {
	                // if the mouse has left its fullBounds, center it
	                fb = morph.fullBounds();
	                if (!fb.containsPoint(pos)) {
	                    this.bounds.origin = fb.center();
	                    this.grab(morph);
	                    this.setPosition(pos);
	                }
	            }
	        }

	/*
	    original, more cautious code for grabbing Morphs,
	    retained in case of needing to fall back:

	        if (morph === this.morphToGrab) {
	            if (morph.isDraggable) {
	                this.grab(morph);
	            } else if (morph.isTemplate) {
	                morph = morph.fullCopy();
	                morph.isTemplate = false;
	                morph.isDraggable = true;
	                this.grab(morph);
	            }
	        }
	*/

	    }

	    this.mouseOverList.forEach(function (old) {
	        if (!contains(mouseOverNew, old)) {
	            if (old.mouseLeave) {
	                old.mouseLeave();
	            }
	            if (old.mouseLeaveDragging && myself.mouseButton) {
	                old.mouseLeaveDragging();
	            }
	        }
	    });
	    mouseOverNew.forEach(function (newMorph) {
	        if (!contains(myself.mouseOverList, newMorph)) {
	            if (newMorph.mouseEnter) {
	                newMorph.mouseEnter();
	            }
	            if (newMorph.mouseEnterDragging && myself.mouseButton) {
	                newMorph.mouseEnterDragging();
	            }
	        }

	        // autoScrolling support:
	        if (myself.children.length > 0) {
	            if (newMorph.instanceOf('ScrollFrameMorph')) {
	                if (!newMorph.bounds.insetBy(
	                        MorphicPreferences.scrollBarSize * 3
	                    ).containsPoint(myself.bounds.origin)) {
	                    newMorph.startAutoScrolling();
	                }
	            }
	        }
	    });
	    this.mouseOverList = mouseOverNew;
	},

	processMouseScroll: function (event) {
	    var morph = this.morphAtPointer();
	    while (morph && !morph.mouseScroll) {
	        morph = morph.parent;
	    }
	    if (morph) {
	        morph.mouseScroll(
	            (event.detail / -3) || (
	                Object.prototype.hasOwnProperty.call(
	                    event,
	                    'wheelDeltaY'
	                ) ?
	                        event.wheelDeltaY / 120 :
	                        event.wheelDelta / 120
	            ),
	            event.wheelDeltaX / 120 || 0
	        );
	    }
	},

	/*
	    drop event:

	        droppedImage
	        droppedSVG
	        droppedAudio
	        droppedText
	*/

	processDrop: function (event) {
	/*
	    find out whether an external image or audio file was dropped
	    onto the world canvas, turn it into an offscreen canvas or audio
	    element and dispatch the

	        droppedImage(canvas, name)
	        droppedSVG(image, name)
	        droppedAudio(audio, name)

	    events to interested Morphs at the mouse pointer
	*/
	    var files = event instanceof FileList ? event
	                : event.target.files || event.dataTransfer.files,
	        file,
	        url = event.dataTransfer ?
	                event.dataTransfer.getData('URL') : null,
	        txt = event.dataTransfer ?
	                event.dataTransfer.getData('Text/HTML') : null,
	        src,
	        target = this.morphAtPointer(),
	        img = new Image(),
	        canvas,
	        i;

	    function readSVG(aFile) {
	        var pic = new Image(),
	            frd = new FileReader();
	        while (!target.droppedSVG) {
	            target = target.parent;
	        }
	        pic.onload = function () {
	            target.droppedSVG(pic, aFile.name);
	        };
	        frd = new FileReader();
	        frd.onloadend = function (e) {
	            pic.src = e.target.result;
	        };
	        frd.readAsDataURL(aFile);
	    }

	    function readImage(aFile) {
	        var pic = new Image(),
	            frd = new FileReader();
	        while (!target.droppedImage) {
	            target = target.parent;
	        }
	        pic.onload = function () {
	            canvas = newCanvas(new Point(pic.width, pic.height));
	            canvas.getContext('2d').drawImage(pic, 0, 0);
	            target.droppedImage(canvas, aFile.name);
	        };
	        frd = new FileReader();
	        frd.onloadend = function (e) {
	            pic.src = e.target.result;
	        };
	        frd.readAsDataURL(aFile);
	    }

	    function readAudio(aFile) {
	        var snd = new Audio(),
	            frd = new FileReader();
	        while (!target.droppedAudio) {
	            target = target.parent;
	        }
	        frd.onloadend = function (e) {
	            snd.src = e.target.result;
	            target.droppedAudio(snd, aFile.name);
	        };
	        frd.readAsDataURL(aFile);
	    }

	    function readText(aFile) {
	        var frd = new FileReader();
	        while (!target.droppedText) {
	            target = target.parent;
	        }
	        frd.onloadend = function (e) {
	            target.droppedText(e.target.result, aFile.name);
	        };
	        frd.readAsText(aFile);
	    }

	    function readBinary(aFile) {
	        var frd = new FileReader();
	        while (!target.droppedBinary) {
	            target = target.parent;
	        }
	        frd.onloadend = function (e) {
	            target.droppedBinary(e.target.result, aFile.name);
	        };
	        frd.readAsArrayBuffer(aFile);
	    }

	    function parseImgURL(html) {
	        var iurl = '',
	            idx,
	            c,
	            start = html.indexOf('<img src="');
	        if (start === -1) {return null; }
	        start += 10;
	        for (idx = start; idx < html.length; idx += 1) {
	            c = html[idx];
	            if (c === '"') {
	                return iurl;
	            }
	            iurl = iurl.concat(c);
	        }
	        return null;
	    }

	    if (files.length > 0) {
	        for (i = 0; i < files.length; i += 1) {
	            file = files[i];
	            if (file.type.indexOf("svg") !== -1
	                    && !MorphicPreferences.rasterizeSVGs) {
	                readSVG(file);
	            } else if (file.type.indexOf("image") === 0) {
	                readImage(file);
	            } else if (file.type.indexOf("audio") === 0) {
	                readAudio(file);
	            } else if (file.type.indexOf("text") === 0) {
	                readText(file);
	            } else { // assume it's meant to be binary
	                readBinary(file);
	            }
	        }
	    } else if (url) {
	        if (
	            contains(
	                ['gif', 'png', 'jpg', 'jpeg', 'bmp'],
	                url.slice(url.lastIndexOf('.') + 1).toLowerCase()
	            )
	        ) {
	            while (!target.droppedImage) {
	                target = target.parent;
	            }
	            img = new Image();
	            img.onload = function () {
	                canvas = newCanvas(new Point(img.width, img.height));
	                canvas.getContext('2d').drawImage(img, 0, 0);
	                target.droppedImage(canvas);
	            };
	            img.src = url;
	        }
	    } else if (txt) {
	        while (!target.droppedImage) {
	            target = target.parent;
	        }
	        img = new Image();
	        img.onload = function () {
	            canvas = newCanvas(new Point(img.width, img.height));
	            canvas.getContext('2d').drawImage(img, 0, 0);
	            target.droppedImage(canvas);
	        };
	        src = parseImgURL(txt);
	        if (src) {img.src = src; }
	    }
	},

	// HandMorph tools

	destroyTemporaries: function () {
	/*
	    temporaries are just an array of morphs which will be deleted upon
	    the next mouse click, or whenever another temporary Morph decides
	    that it needs to remove them. The primary purpose of temporaries is
	    to display tools tips of speech bubble help.
	*/
	    var myself = this;
	    this.temporaries.forEach(function (morph) {
	        if (!(morph.isClickable
	                && morph.bounds.containsPoint(myself.position()))) {
	            morph.destroy();
	            myself.temporaries.splice(myself.temporaries.indexOf(morph), 1);
	        }
	    });
	},

	// HandMorph dragging optimization

	moveBy: function ($super, delta) {
	    Morph.prototype.trackChanges = false;
	    $super(delta);
	    Morph.prototype.trackChanges = true;
	    this.fullChanged();
	},

})

HandMorph.uber = Morph.prototype;
HandMorph.className = 'HandMorph';

module.exports = HandMorph;





},{"./Morph":18,"./Point":22,"./Rectangle":23}],13:[function(require,module,exports){
var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');

var HandleMorph = Class.create(Morph, {

	// HandleMorph ////////////////////////////////////////////////////////

	// I am a resize / move handle that can be attached to any Morph

	initialize: function(target, minX, minY, insetX, insetY, type){
		this.init(target, minX, minY, insetX, insetY, type);
	},

	init: function($super, target, minX, minY, insetX, insetY, type){
		var size = MorphicPreferences.handleSize;
	    this.target = target || null;
	    this.minExtent = new Point(minX || 0, minY || 0);
	    this.inset = new Point(insetX || 0, insetY || insetX || 0);
	    this.type =  type || 'resize'; // can also be 'move'
	    $super();
	    this.color = new Color(255, 255, 255);
	    this.isDraggable = false;
	    this.noticesTransparentClick = true;
	    this.setExtent(new Point(size, size));
	},

	// HandleMorph drawing:

	drawNew: function () {
	    this.normalImage = newCanvas(this.extent());
	    this.highlightImage = newCanvas(this.extent());
	    this.drawOnCanvas(
	        this.normalImage,
	        this.color,
	        new Color(100, 100, 100)
	    );
	    this.drawOnCanvas(
	        this.highlightImage,
	        new Color(100, 100, 255),
	        new Color(255, 255, 255)
	    );
	    this.image = this.normalImage;
	    if (this.target) {
	        this.setPosition(
	            this.target.bottomRight().subtract(
	                this.extent().add(this.inset)
	            )
	        );
	        this.target.add(this);
	        this.target.changed();
	    }
	},

	drawOnCanvas: function (
	    aCanvas,
	    color,
	    shadowColor
	) {
	    var context = aCanvas.getContext('2d'),
	        p1,
	        p11,
	        p2,
	        p22,
	        i;

	    context.lineWidth = 1;
	    context.lineCap = 'round';

	    context.strokeStyle = color.toString();

	    if (this.type === 'move') {

	        p1 = this.bottomLeft().subtract(this.position());
	        p11 = p1.copy();
	        p2 = this.topRight().subtract(this.position());
	        p22 = p2.copy();

	        for (i = 0; i <= this.height(); i = i + 6) {
	            p11.y = p1.y - i;
	            p22.y = p2.y - i;

	            context.beginPath();
	            context.moveTo(p11.x, p11.y);
	            context.lineTo(p22.x, p22.y);
	            context.closePath();
	            context.stroke();
	        }
	    }

	    p1 = this.bottomLeft().subtract(this.position());
	    p11 = p1.copy();
	    p2 = this.topRight().subtract(this.position());
	    p22 = p2.copy();

	    for (i = 0; i <= this.width(); i = i + 6) {
	        p11.x = p1.x + i;
	        p22.x = p2.x + i;

	        context.beginPath();
	        context.moveTo(p11.x, p11.y);
	        context.lineTo(p22.x, p22.y);
	        context.closePath();
	        context.stroke();
	    }

	    context.strokeStyle = shadowColor.toString();

	    if (this.type === 'move') {

	        p1 = this.bottomLeft().subtract(this.position());
	        p11 = p1.copy();
	        p2 = this.topRight().subtract(this.position());
	        p22 = p2.copy();

	        for (i = -2; i <= this.height(); i = i + 6) {
	            p11.y = p1.y - i;
	            p22.y = p2.y - i;

	            context.beginPath();
	            context.moveTo(p11.x, p11.y);
	            context.lineTo(p22.x, p22.y);
	            context.closePath();
	            context.stroke();
	        }
	    }

	    p1 = this.bottomLeft().subtract(this.position());
	    p11 = p1.copy();
	    p2 = this.topRight().subtract(this.position());
	    p22 = p2.copy();

	    for (i = 2; i <= this.width(); i = i + 6) {
	        p11.x = p1.x + i;
	        p22.x = p2.x + i;

	        context.beginPath();
	        context.moveTo(p11.x, p11.y);
	        context.lineTo(p22.x, p22.y);
	        context.closePath();
	        context.stroke();
	    }
	},

	// HandleMorph stepping:

	step: null,

	mouseDownLeft: function (pos) {
	    var world = this.root(),
	        offset = pos.subtract(this.bounds.origin),
	        myself = this;

	    if (!this.target) {
	        return null;
	    }
	    this.step = function () {
	        var newPos, newExt;
	        if (world.hand.mouseButton) {
	            newPos = world.hand.bounds.origin.copy().subtract(offset);
	            if (this.type === 'resize') {
	                newExt = newPos.add(
	                    myself.extent().add(myself.inset)
	                ).subtract(myself.target.bounds.origin);
	                newExt = newExt.max(myself.minExtent);
	                myself.target.setExtent(newExt);

	                myself.setPosition(
	                    myself.target.bottomRight().subtract(
	                        myself.extent().add(myself.inset)
	                    )
	                );
	            } else { // type === 'move'
	                myself.target.setPosition(
	                    newPos.subtract(this.target.extent())
	                        .add(this.extent())
	                );
	            }
	        } else {
	            this.step = null;
	        }
	    };
	    if (!this.target.step) {
	        this.target.step = function () {
	            nop();
	        };
	    }
	},

	// HandleMorph dragging and dropping:

	rootForGrab: function () {
	    return this;
	},

	// HandleMorph events:

	mouseEnter: function () {
	    this.image = this.highlightImage;
	    this.changed();
	},

	mouseLeave: function () {
	    this.image = this.normalImage;
	    this.changed();
	},

	// HandleMorph duplicating:

	copyRecordingReferences: function (dict) {
	    // inherited, see comment in Morph
	    var c = HandleMorph.uber.copyRecordingReferences.call(
	        this,
	        dict
	    );
	    if (c.target && dict[this.target]) {
	        c.target = (dict[this.target]);
	    }
	    return c;
	},

	// HandleMorph menu:

	attach: function (menu) {
		// menu is a instance of MenuMorph;
	    var choices = this.overlappedMorphs(),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each.toString().slice(0, 50), function () {
	            myself.isDraggable = false;
	            myself.target = each;
	            myself.drawNew();
	            myself.noticesTransparentClick = true;
	        });
	    });
	    if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

})

HandleMorph.uber = Morph.prototype;
HandleMorph.className = 'HandleMorph';

module.exports = HandleMorph;


	
},{"./Color":6,"./Morph":18,"./Point":22}],14:[function(require,module,exports){
var BoxMorph = require('./BoxMorph');
var Point = require('./Point');
var Color = require('./Color');
var TextMorph = require('./TextMorph');
var CursorMorph = require('./CursorMorph');
var MenuMorph = require('./MenuMorph');
var ListMorph = require('./ListMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var TriggerMorph = require('./TriggerMorph');
var HandleMorph = require('./HandleMorph');
var Morph = require('./Morph');

var InspectorMorph = Class.create(BoxMorph, {
    // InspectorMorph //////////////////////////////////////////////////////

    initialize: function(target) {
        this.init(target);
    },

    init: function (target) {
        // additional properties:
        this.target = target;
        this.currentProperty = null;
        this.showing = 'attributes';
        this.markOwnProperties = false;
        this.hasUserEditedDetails = false;

        // initialize inherited properties:
        InspectorMorph.uber.init.call(this);

        // override inherited properties:
        this.silentSetExtent(
            new Point(
                MorphicPreferences.handleSize * 20,
                MorphicPreferences.handleSize * 20 * 2 / 3
            )
        );
        this.isDraggable = true;
        this.border = 1;
        this.edge = MorphicPreferences.isFlat ? 1 : 5;
        this.color = new Color(60, 60, 60);
        this.borderColor = new Color(95, 95, 95);
        this.fps = 25;
        this.drawNew();

        // panes:
        this.label = null;
        this.list = null;
        this.detail = null;
        this.work = null;
        this.buttonInspect = null;
        this.buttonClose = null;
        this.buttonSubset = null;
        this.buttonEdit = null;
        this.resizer = null;

        if (this.target) {
            this.buildPanes();
        }
    },

    setTarget: function (target) {
        this.target = target;
        this.currentProperty = null;
        this.buildPanes();
    },

    updateCurrentSelection: function () {
        var val, txt, cnts,
            sel = this.list.selected,
            currentTxt = this.detail.contents.children[0],
            root = this.root();

        if (root &&
                (root.keyboardReceiver instanceof CursorMorph) &&
                (root.keyboardReceiver.target === currentTxt)) {
            this.hasUserEditedDetails = true;
            return;
        }
        if (isNil(sel) || this.hasUserEditedDetails) {return; }
        val = this.target[sel];
        this.currentProperty = val;
        if (isNil(val)) {
            txt = 'NULL';
        } else if (isString(val)) {
            txt = val;
        } else {
            txt = val.toString();
        }
        if (currentTxt.text === txt) {return; }
        cnts = new TextMorph(txt);
        cnts.isEditable = true;
        cnts.enableSelecting();
        cnts.setReceiver(this.target, new MenuMorph(cnts, null));   // REMOVE CIRCULAR DEPENDENCY
        this.detail.setContents(cnts);
    },

    buildPanes: function () {
        var attribs = [], property, myself = this, ctrl, ev, doubleClickAction;

        // remove existing panes
        this.children.forEach(function (m) {
            if (m !== this.work) { // keep work pane around
                m.destroy();
            }
        });
        this.children = [];

        // label
        this.label = new TextMorph(this.target.toString());
        this.label.fontSize = MorphicPreferences.menuFontSize;
        this.label.isBold = true;
        this.label.color = new Color(255, 255, 255);
        this.label.drawNew();
        this.add(this.label);

        // properties list
        for (property in this.target) {
            if (property) { // dummy condition, to be refined
                attribs.push(property);
            }
        }
        if (this.showing === 'attributes') {
            attribs = attribs.filter(function (prop) {
                return typeof myself.target[prop] !== 'function';
            });
        } else if (this.showing === 'methods') {
            attribs = attribs.filter(function (prop) {
                return typeof myself.target[prop] === 'function';
            });
        } // otherwise show all properties

        doubleClickAction = function () {
            var world, inspector;
            if (!isObject(myself.currentProperty)) {return; }
            world = myself.world();
            inspector = new InspectorMorph(
                myself.currentProperty
            );
            inspector.setPosition(world.hand.position());
            inspector.keepWithin(world);
            world.add(inspector);
            inspector.changed();
        };

        this.list = new ListMorph(
            this.target instanceof Array ? attribs : attribs.sort(),
            null, // label getter
            this.markOwnProperties ?
                    [ // format list
                        [ // format element: [color, predicate(element]
                            new Color(0, 0, 180),
                            function (element) {
                                return Object.prototype.hasOwnProperty.call(
                                    myself.target,
                                    element
                                );
                            }
                        ]
                    ]
                    : null,
            doubleClickAction
        );

        this.list.action = function () {
            myself.hasUserEditedDetails = false;
            myself.updateCurrentSelection();
        };

        this.list.hBar.alpha = 0.6;
        this.list.vBar.alpha = 0.6;
        this.list.contents.step = null;
        this.add(this.list);

        // details pane
        this.detail = new ScrollFrameMorph();
        this.detail.acceptsDrops = false;
        this.detail.contents.acceptsDrops = false;
        this.detail.isTextLineWrapping = true;
        this.detail.color = new Color(255, 255, 255);
        this.detail.hBar.alpha = 0.6;
        this.detail.vBar.alpha = 0.6;
        ctrl = new TextMorph('');
        ctrl.isEditable = true;
        ctrl.enableSelecting();
        ctrl.setReceiver(this.target, new MenuMorph(ctrl, null));
        this.detail.setContents(ctrl);
        this.add(this.detail);

        // work ('evaluation') pane
        // don't refresh the work pane if it already exists
        if (this.work === null) {
            this.work = new ScrollFrameMorph();
            this.work.acceptsDrops = false;
            this.work.contents.acceptsDrops = false;
            this.work.isTextLineWrapping = true;
            this.work.color = new Color(255, 255, 255);
            this.work.hBar.alpha = 0.6;
            this.work.vBar.alpha = 0.6;
            ev = new TextMorph('');
            ev.isEditable = true;
            ev.enableSelecting();
            ev.setReceiver(this.target, new MenuMorph(ev, null));
            this.work.setContents(ev);
        }
        this.add(this.work);

        // properties button
        this.buttonSubset = new TriggerMorph();
        this.buttonSubset.labelString = 'show...';
        this.buttonSubset.action = function () {
            var menu;
            menu = new MenuMorph();
            menu.addItem(
                'attributes',
                function () {
                    myself.showing = 'attributes';
                    myself.buildPanes();
                }
            );
            menu.addItem(
                'methods',
                function () {
                    myself.showing = 'methods';
                    myself.buildPanes();
                }
            );
            menu.addItem(
                'all',
                function () {
                    myself.showing = 'all';
                    myself.buildPanes();
                }
            );
            menu.addLine();
            menu.addItem(
                (myself.markOwnProperties ?
                        'un-mark own' : 'mark own'),
                function () {
                    myself.markOwnProperties = !myself.markOwnProperties;
                    myself.buildPanes();
                },
                'highlight\n\'own\' properties'
            );
            menu.popUpAtHand(myself.world());
        };
        this.add(this.buttonSubset);

        // inspect button
        this.buttonInspect = new TriggerMorph();
        this.buttonInspect.labelString = 'inspect...';
        this.buttonInspect.action = function () {
            var menu, world, inspector;
            if (isObject(myself.currentProperty)) {
                menu = new MenuMorph();
                menu.addItem(
                    'in new inspector...',
                    function () {
                        world = myself.world();
                        inspector = new InspectorMorph(
                            myself.currentProperty
                        );
                        inspector.setPosition(world.hand.position());
                        inspector.keepWithin(world);
                        world.add(inspector);
                        inspector.changed();
                    }
                );
                menu.addItem(
                    'here...',
                    function () {
                        myself.setTarget(myself.currentProperty);
                    }
                );
                menu.popUpAtHand(myself.world());
            } else {
                myself.inform(
                    (myself.currentProperty === null ?
                            'null' : typeof myself.currentProperty) +
                                '\nis not inspectable'
                );
            }
        };
        this.add(this.buttonInspect);

        // edit button

        this.buttonEdit = new TriggerMorph();
        this.buttonEdit.labelString = 'edit...';
        this.buttonEdit.action = function () {
            var menu;
            menu = new MenuMorph(myself);
            menu.addItem("save", 'save', 'accept changes');
            menu.addLine();
            menu.addItem("add property...", 'addProperty');
            menu.addItem("rename...", 'renameProperty');
            menu.addItem("remove...", 'removeProperty');
            menu.popUpAtHand(myself.world());
        };
        this.add(this.buttonEdit);

        // close button
        this.buttonClose = new TriggerMorph();
        this.buttonClose.labelString = 'close';
        this.buttonClose.action = function () {
            myself.destroy();
        };
        this.add(this.buttonClose);

        // resizer
        this.resizer = new HandleMorph(
            this,
            150,
            100,
            this.edge,
            this.edge
        );

        // update layout
        this.fixLayout();
    },

    fixLayout: function () {
        var x, y, r, b, w, h;

        Morph.prototype.trackChanges = false;

        // label
        x = this.left() + this.edge;
        y = this.top() + this.edge;
        r = this.right() - this.edge;
        w = r - x;
        this.label.setPosition(new Point(x, y));
        this.label.setWidth(w);
        if (this.label.height() > (this.height() - 50)) {
            this.silentSetHeight(this.label.height() + 50);
            this.drawNew();
            this.changed();
            this.resizer.drawNew();
        }

        // list
        y = this.label.bottom() + 2;
        w = Math.min(
            Math.floor(this.width() / 3),
            this.list.listContents.width()
        );

        w -= this.edge;
        b = this.bottom() - (2 * this.edge) -
            MorphicPreferences.handleSize;
        h = b - y;
        this.list.setPosition(new Point(x, y));
        this.list.setExtent(new Point(w, h));

        // detail
        x = this.list.right() + this.edge;
        r = this.right() - this.edge;
        w = r - x;
        this.detail.setPosition(new Point(x, y));
        this.detail.setExtent(new Point(w, (h * 2 / 3) - this.edge));

        // work
        y = this.detail.bottom() + this.edge;
        this.work.setPosition(new Point(x, y));
        this.work.setExtent(new Point(w, h / 3));

        // properties button
        x = this.list.left();
        y = this.list.bottom() + this.edge;
        w = this.list.width();
        h = MorphicPreferences.handleSize;
        this.buttonSubset.setPosition(new Point(x, y));
        this.buttonSubset.setExtent(new Point(w, h));

        // inspect button
        x = this.detail.left();
        w = this.detail.width() - this.edge -
            MorphicPreferences.handleSize;
        w = w / 3 - this.edge / 3;
        this.buttonInspect.setPosition(new Point(x, y));
        this.buttonInspect.setExtent(new Point(w, h));

        // edit button
        x = this.buttonInspect.right() + this.edge;
        this.buttonEdit.setPosition(new Point(x, y));
        this.buttonEdit.setExtent(new Point(w, h));

        // close button
        x = this.buttonEdit.right() + this.edge;
        r = this.detail.right() - this.edge -
            MorphicPreferences.handleSize;
        w = r - x;
        this.buttonClose.setPosition(new Point(x, y));
        this.buttonClose.setExtent(new Point(w, h));

        Morph.prototype.trackChanges = true;
        this.changed();

    },

    setExtent: function (aPoint) {
        InspectorMorph.uber.setExtent.call(this, aPoint);
        this.fixLayout();
    },

    //InspectorMorph editing ops:

    save: function () {
        var txt = this.detail.contents.children[0].text.toString(),
            prop = this.list.selected;
        try {
            // this.target[prop] = evaluate(txt);
            this.target.evaluateString('this.' + prop + ' = ' + txt);
            this.hasUserEditedDetails = false;
            if (this.target.drawNew) {
                this.target.changed();
                this.target.drawNew();
                this.target.changed();
            }
        } catch (err) {
            this.inform(err);
        }
    },

    addProperty: function () {
        var myself = this;
        this.prompt(
            'new property name:',
            function (prop) {
                if (prop) {
                    myself.target[prop] = null;
                    myself.buildPanes();
                    if (myself.target.drawNew) {
                        myself.target.changed();
                        myself.target.drawNew();
                        myself.target.changed();
                    }
                }
            },
            this,
            'property' // Chrome cannot handle empty strings (others do)
        );
    },

    renameProperty: function () {
        var myself = this,
            propertyName = this.list.selected;
        this.prompt(
            'property name:',
            function (prop) {
                try {
                    delete (myself.target[propertyName]);
                    myself.target[prop] = myself.currentProperty;
                } catch (err) {
                    myself.inform(err);
                }
                myself.buildPanes();
                if (myself.target.drawNew) {
                    myself.target.changed();
                    myself.target.drawNew();
                    myself.target.changed();
                }
            },
            this,
            propertyName
        );
    },

    removeProperty: function () {
        var prop = this.list.selected;
        try {
            delete (this.target[prop]);
            this.currentProperty = null;
            this.buildPanes();
            if (this.target.drawNew) {
                this.target.changed();
                this.target.drawNew();
                this.target.changed();
            }
        } catch (err) {
            this.inform(err);
        }
    },

    // InspectorMorph stepping

    step: function () {
        this.updateCurrentSelection();
        var lbl = this.target.toString();
        if (this.label.text === lbl) {return; }
        this.label.text = lbl;
        this.label.drawNew();
        this.fixLayout();
    },


})

InspectorMorph.uber = BoxMorph.prototype;
InspectorMorph.className = 'InspectorMorph';

module.exports = InspectorMorph;

},{"./BoxMorph":3,"./Color":6,"./CursorMorph":9,"./HandleMorph":13,"./ListMorph":15,"./MenuMorph":17,"./Morph":18,"./Point":22,"./ScrollFrameMorph":24,"./TextMorph":31,"./TriggerMorph":32}],15:[function(require,module,exports){
var ScrollFrameMorph = require('./ScrollFrameMorph');
var Color = require('./Color');
var MenuMorph = require('./MenuMorph');

var ListMorph = Class.create(ScrollFrameMorph, {

    // ListMorph ///////////////////////////////////////////////////////////

    initialize: function(elements, labelGetter, format, doubleClickAction){
        /*
            passing a format is optional. If the format parameter is specified
            it has to be of the following pattern:

                [
                    [<color>, <single-argument predicate>],
                    ['bold', <single-argument predicate>],
                    ['italic', <single-argument predicate>],
                    ...
                ]

            multiple conditions can be passed in such a format list, the
            last predicate to evaluate true when given the list element sets
            the given format category (color, bold, italic).
            If no condition is met, the default format (color black, non-bold,
            non-italic) will be assigned.

            An example of how to use fomats can be found in the InspectorMorph's
            "markOwnProperties" mechanism.
        */
        this.init(
            elements || [],
            labelGetter || function (element) {
                if (isString(element)) {
                    return element;
                }
                if (element.toSource) {
                    return element.toSource();
                }
                return element.toString();
            },
            format || [],
            doubleClickAction // optional callback
        );
    },

    init: function (
        $super, 
        elements,
        labelGetter,
        format,
        doubleClickAction
    ) {
        $super();

        this.contents.acceptsDrops = false;
        this.color = new Color(255, 255, 255);
        this.hBar.alpha = 0.6;
        this.vBar.alpha = 0.6;
        this.elements = elements || [];
        this.labelGetter = labelGetter;
        this.format = format;
        this.listContents = null;
        this.selected = null; // actual element currently selected
        this.active = null; // menu item representing the selected element
        this.action = null;
        this.doubleClickAction = doubleClickAction || null;
        this.acceptsDrops = false;
        this.buildListContents();
    },

    buildListContents: function () {
        var myself = this;
        if (this.listContents) {
            this.listContents.destroy();
        }
        this.listContents = new MenuMorph(
            this.select,
            null,
            this
        );
        if (this.elements.length === 0) {
            this.elements = ['(empty)'];
        }
        this.elements.forEach(function (element) {
            var color = null,
                bold = false,
                italic = false;

            myself.format.forEach(function (pair) {
                if (pair[1].call(null, element)) {
                    if (pair[0] === 'bold') {
                        bold = true;
                    } else if (pair[0] === 'italic') {
                        italic = true;
                    } else { // assume it's a color
                        color = pair[0];
                    }
                }
            });
            myself.listContents.addItem(
                myself.labelGetter(element), // label string
                element, // action
                null, // hint
                color,
                bold,
                italic,
                myself.doubleClickAction
            );
        });
        this.listContents.setPosition(this.contents.position());
        this.listContents.isListContents = true;
        this.listContents.drawNew();
        this.addContents(this.listContents);
    },

    select: function (item, trigger) {
        if (isNil(item)) {return; }
        this.selected = item;
        this.active = trigger;
        if (this.action) {
            this.action.call(null, item);
        }
    },

    setExtent: function ($super, aPoint) {
        var lb = this.listContents.bounds,
            rect = new Rectangle(0, 0, 0, 0),
            nb = this.bounds.origin.copy().corner(
                rect,
                this.bounds.origin.add(aPoint)
            );

        if (nb.right() > lb.right() && nb.width() <= lb.width()) {
            this.listContents.setRight(nb.right());
        }
        if (nb.bottom() > lb.bottom() && nb.height() <= lb.height()) {
            this.listContents.setBottom(nb.bottom());
        }
        $super(aPoint);
    },


})

ListMorph.uber = ScrollFrameMorph.prototype;
ListMorph.className = 'ListMorph';

module.exports = ListMorph;




    
},{"./Color":6,"./MenuMorph":17,"./ScrollFrameMorph":24}],16:[function(require,module,exports){
var Morph = require('./Morph');
var TriggerMorph = require('./TriggerMorph');
var TextMorph = require('./TextMorph');
var Point = require('./Point');
var Rectangle = require('./Rectangle');


var MenuItemMorph = Class.create(TriggerMorph, {

	// MenuItemMorph ///////////////////////////////////////////////////////
	
	initialize: function(
	    target,
	    action,
	    labelString, // can also be a Morph or a Canvas or a tuple: [icon, string]
	    fontSize,
	    fontStyle,
	    environment,
	    hint,
	    color,
	    bold,
	    italic,
	    doubleClickAction // optional when used as list morph item
	) {
	    this.init(
	        target,
	        action,
	        labelString,
	        fontSize,
	        fontStyle,
	        environment,
	        hint,
	        color,
	        bold,
	        italic,
	        doubleClickAction
	    );
	},

	createLabel: function () {
	    var icon, lbl, np, rect;
	    if (this.label !== null) {
	        this.label.destroy();
	    }
	    if (isString(this.labelString)) {
	        this.label = this.createLabelString(this.labelString);
	    } else if (this.labelString instanceof Array) {
	        // assume its pattern is: [icon, string]
	        this.label = new Morph();
	        this.label.alpha = 0; // transparent
	        icon = this.createIcon(this.labelString[0]);
	        this.label.add(icon);
	        lbl = this.createLabelString(this.labelString[1]);
	        this.label.add(lbl);
	        lbl.setCenter(icon.center());
	        lbl.setLeft(icon.right() + 4);
	        this.label.bounds = (icon.bounds.merge(lbl.bounds));
	        this.label.drawNew();
	    } else { // assume it's either a Morph or a Canvas
	        this.label = this.createIcon(this.labelString);
	    }
	    this.silentSetExtent(this.label.extent().add(new Point(8, 0)));
	    np = this.position().add(new Point(4, 0));
	    rect = new Rectangle(0, 0, 0, 0);
	    this.label.bounds = np.extent(rect, this.label.extent());
	    this.add(this.label);
	},

	createIcon: function (source) {
	    // source can be either a Morph or an HTMLCanvasElement
	    var icon = new Morph(),
	        src;
	    icon.image = source instanceof Morph ? source.fullImage() : source;
	    // adjust shadow dimensions
	    if (source instanceof Morph && source.getShadow()) {
	        src = icon.image;
	        icon.image = newCanvas(
	            source.fullBounds().extent().subtract(
	                this.shadowBlur * (useBlurredShadows ? 1 : 2)
	            )
	        );
	        icon.image.getContext('2d').drawImage(src, 0, 0);
	    }
	    icon.silentSetWidth(icon.image.width);
	    icon.silentSetHeight(icon.image.height);
	    return icon;
	},

	createLabelString: function (string) {
	    var lbl = new TextMorph(
	        string,
	        this.fontSize,
	        this.fontStyle,
	        this.labelBold,
	        this.labelItalic
	    );
	    lbl.setColor(this.labelColor);
	    return lbl;
	},

	// MenuItemMorph events:

	mouseEnter: function () {
	    if (!this.isListItem()) {
	        this.image = this.highlightImage;
	        this.changed();
	    }
	    if (this.hint) {
	        this.bubbleHelp(this.hint);
	    }
	},

	mouseLeave: function () {
	    if (!this.isListItem()) {
	        this.image = this.normalImage;
	        this.changed();
	    }
	    if (this.hint) {
	        this.world().hand.destroyTemporaries();
	    }
	},

	mouseDownLeft: function (pos) {
	    if (this.isListItem()) {
	        this.parent.unselectAllItems();
	        this.escalateEvent('mouseDownLeft', pos);
	    }
	    this.image = this.pressImage;
	    this.changed();
	},

	mouseMove: function () {
	    if (this.isListItem()) {
	        this.escalateEvent('mouseMove');
	    }
	},

	mouseClickLeft: function () {
	    if (!this.isListItem()) {
	        this.parent.destroy();
	        this.root().activeMenu = null;
	    }
	    this.trigger();
	},

	isListItem: function () {
	    if (this.parent) {
	        return this.parent.isListContents;
	    }
	    return false;
	},

	isSelectedListItem: function () {
	    if (this.isListItem()) {
	        return this.image === this.pressImage;
	    }
	    return false;
	},




})

MenuItemMorph.uber = TriggerMorph.prototype;
MenuItemMorph.className = 'MenuItemMorph';

module.exports = MenuItemMorph;



},{"./Morph":18,"./Point":22,"./Rectangle":23,"./TextMorph":31,"./TriggerMorph":32}],17:[function(require,module,exports){
var BoxMorph = require('./BoxMorph');
var MenuItemMorph = require('./MenuItemMorph');
var FrameMorph = require('./FrameMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var StringFieldMorph = require('./StringFieldMorph');
var ColorPickerMorph = require('./ColorPickerMorph');
var SliderMorph = require('./SliderMorph');
var Color = require('./Color');
var Point = require('./Point');
var TextMorph = require('./TextMorph');

var MenuMorph = Class.create(BoxMorph, {

	// MenuMorph ///////////////////////////////////////////////////////////
	
	initialize: function(target, title, environment, fontSize) {
	    this.init(target, title, environment, fontSize);

	    /*
	    if target is a function, use it as callback:
	    execute target as callback function with the action property
	    of the triggered MenuItem as argument.
	    Use the environment, if it is specified.
	    Note: if action is also a function, instead of becoming
	    the argument itself it will be called to answer the argument.
	    For selections, Yes/No Choices etc.

	    else (if target is not a function):

	        if action is a function:
	        execute the action with target as environment (can be null)
	        for lambdafied (inline) actions

	        else if action is a String:
	        treat it as function property of target and execute it
	        for selector-like actions
	    */
	},



	init: function ($super, target, title, environment, fontSize) {
	    // additional properties:
	    this.target = target;
	    this.title = title || null;
	    this.environment = environment || null;
	    this.fontSize = fontSize || null;
	    this.items = [];
	    this.label = null;
	    this.world = null;
	    this.isListContents = false;

	    // initialize inherited properties:
	    $super();

	    // override inherited properties:
	    this.isDraggable = false;

	    // immutable properties:
	    this.border = null;
	    this.edge = null;
	},

	addItem: function (
	    labelString,
	    action,
	    hint,
	    color,
	    bold, // bool
	    italic, // bool
	    doubleClickAction // optional, when used as list contents
	) {
	    /*
	    labelString is normally a single-line string. But it can also be one
	    of the following:

	        * a multi-line string (containing line breaks)
	        * an icon (either a Morph or a Canvas)
	        * a tuple of format: [icon, string]
	    */
	    this.items.push([
	        localize(labelString || 'close'),
	        action || nop,
	        hint,
	        color,
	        bold || false,
	        italic || false,
	        doubleClickAction]);
	},

	addLine: function (width) {
	    this.items.push([0, width || 1]);
	},

	createLabel: function () {
	    var text;
	    if (this.label !== null) {
	        this.label.destroy();
	    }
	    text = new TextMorph(
	        localize(this.title),
	        this.fontSize || MorphicPreferences.menuFontSize,
	        MorphicPreferences.menuFontName,
	        true,
	        false,
	        'center'
	    );
	    text.alignment = 'center';
	    text.color = new Color(255, 255, 255);
	    text.backgroundColor = this.borderColor;
	    text.drawNew();
	    this.label = new BoxMorph(3, 0);
	    if (MorphicPreferences.isFlat) {
	        this.label.edge = 0;
	    }
	    this.label.color = this.borderColor;
	    this.label.borderColor = this.borderColor;
	    this.label.setExtent(text.extent().add(4));
	    this.label.drawNew();
	    this.label.add(text);
	    this.label.text = text;
	},

	drawNew: function ($super) {
	    var myself = this,
	        item,
	        fb,
	        x,
	        y,
	        isLine = false;

	    this.children.forEach(function (m) {
	        m.destroy();
	    });
	    this.children = [];
	    if (!this.isListContents) {
	        this.edge = MorphicPreferences.isFlat ? 0 : 5;
	        this.border = MorphicPreferences.isFlat ? 1 : 2;
	    }
	    this.color = new Color(255, 255, 255);
	    this.borderColor = new Color(60, 60, 60);
	    this.silentSetExtent(new Point(0, 0));

	    y = 2;
	    x = this.left() + 4;
	    if (!this.isListContents) {
	        if (this.title) {
	            this.createLabel();
	            this.label.setPosition(this.bounds.origin.add(4));
	            this.add(this.label);
	            y = this.label.bottom();
	        } else {
	            y = this.top() + 4;
	        }
	    }
	    y += 1;
	    this.items.forEach(function (tuple) {
	        isLine = false;
	        if (tuple instanceof StringFieldMorph ||
	                tuple instanceof ColorPickerMorph ||
	                tuple instanceof SliderMorph) {
	            item = tuple;
	        } else if (tuple[0] === 0) {
	            isLine = true;
	            item = new Morph();
	            item.color = myself.borderColor;
	            item.setHeight(tuple[1]);
	        } else {
	            item = new MenuItemMorph(
	                myself.target,
	                tuple[1],
	                tuple[0],
	                myself.fontSize || MorphicPreferences.menuFontSize,
	                MorphicPreferences.menuFontName,
	                myself.environment,
	                tuple[2], // bubble help hint
	                tuple[3], // color
	                tuple[4], // bold
	                tuple[5], // italic
	                tuple[6] // doubleclick action
	            );
	        }
	        if (isLine) {
	            y += 1;
	        }
	        item.setPosition(new Point(x, y));
	        myself.add(item);
	        y = y + item.height();
	        if (isLine) {
	            y += 1;
	        }
	    });

	    fb = this.fullBounds();
	    this.silentSetExtent(fb.extent().add(4));
	    this.adjustWidths();
	    $super();
	},

	maxWidth: function () {
	    var w = 0;

	    if (this.parent instanceof FrameMorph) {
	        if (this.parent.scrollFrame instanceof ScrollFrameMorph) {
	            w = this.parent.scrollFrame.width();
	        }
	    }
	    this.children.forEach(function (item) {

	        if (item instanceof MenuItemMorph) {
	            w = Math.max(w, item.children[0].width() + 8);
	        } else if ((item instanceof StringFieldMorph) ||
	                (item instanceof ColorPickerMorph) ||
	                (item instanceof SliderMorph)) {
	            w = Math.max(w, item.width());
	        }
	    });
	    if (this.label) {
	        w = Math.max(w, this.label.width());
	    }
	    return w;
	},

	adjustWidths: function () {
	    var w = this.maxWidth(),
	        isSelected,
	        myself = this;
	    this.children.forEach(function (item) {
	        item.silentSetWidth(w);
	        if (item instanceof MenuItemMorph) {
	            isSelected = (item.image === item.pressImage);
	            item.createBackgrounds();
	            if (isSelected) {
	                item.image = item.pressImage;
	            }
	        } else {
	            item.drawNew();
	            if (item === myself.label) {
	                item.text.setPosition(
	                    item.center().subtract(
	                        item.text.extent().floorDivideBy(2)
	                    )
	                );
	            }
	        }
	    });
	},

	unselectAllItems: function () {
	    this.children.forEach(function (item) {
	        if (item instanceof MenuItemMorph) {
	            item.image = item.normalImage;
	        }
	    });
	    this.changed();
	},

	popup: function (world, pos) {
	    this.drawNew();
	    this.setPosition(pos);
	    this.addShadow(new Point(2, 2), 80);
	    this.keepWithin(world);
	    if (world.activeMenu) {
	        world.activeMenu.destroy();
	    }
	    if (this.items.length < 1 && !this.title) { // don't show empty menus
	        return;
	    }
	    world.add(this);
	    world.activeMenu = this;
	    this.fullChanged();
	},

	popUpAtHand: function (world) {
	    var wrrld = world || this.world;
	    this.popup(wrrld, wrrld.hand.position());
	},

	popUpCenteredAtHand: function (world) {
	    var wrrld = world || this.world;
	    this.drawNew();
	    this.popup(
	        wrrld,
	        wrrld.hand.position().subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	},

	popUpCenteredInWorld: function (world) {
	    var wrrld = world || this.world;
	    this.drawNew();
	    this.popup(
	        wrrld,
	        wrrld.center().subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	},



})

MenuMorph.uber = BoxMorph.prototype;
MenuMorph.className = 'MenuMorph';

module.exports = MenuMorph;


},{"./BoxMorph":3,"./Color":6,"./ColorPickerMorph":8,"./FrameMorph":10,"./MenuItemMorph":16,"./Point":22,"./ScrollFrameMorph":24,"./SliderMorph":27,"./StringFieldMorph":29,"./TextMorph":31}],18:[function(require,module,exports){
var Node = require('./Node');
var Rectangle = require('./Rectangle');
var Color = require('./Color');

var Morph = Class.create(Node, {

	// Morph settings:

	/*
	    damage list housekeeping

	    the trackChanges property of the Morph prototype is a Boolean switch
	    that determines whether the World's damage list ('broken' rectangles)
	    tracks changes. By default the switch is always on. If set to false
	    changes are not stored. This can be very useful for housekeeping of
	    the damage list in situations where a large number of (sub-) morphs
	    are changed more or less at once. Instead of keeping track of every
	    single submorph's changes tremendous performance improvements can be
	    achieved by setting the trackChanges flag to false before propagating
	    the layout changes, setting it to true again and then storing the full
	    bounds of the surrounding morph. An an example refer to the

	        fixLayout()

	    method of InspectorMorph, or the

	        startLayout()
	        endLayout()

	    methods of SyntaxElementMorph in the Snap application.
	*/


	trackChanges: true,
	shadowBlur: 4,

	initialize: function(){
		this.init();
	},

	init: function($super){
		$super(null, []);
		this.isMorph = true;
	    this.bounds = new Rectangle(0, 0, 50, 40);
	    this.color = new Color(80, 80, 80);
	    this.texture = null; // optional url of a fill-image
	    this.cachedTexture = null; // internal cache of actual bg image
	    this.alpha = 1;
	    this.isVisible = true;
	    this.isDraggable = false;
	    this.isTemplate = false;
	    this.acceptsDrops = false;
	    this.noticesTransparentClick = false;
	    this.drawNew();
	    this.fps = 0;
	    this.customContextMenu = null;
	    this.lastTime = Date.now();
	    this.onNextStep = null;
	},

	// Morph string representation: e.g. 'a Morph 2 [20@45 | 130@250]'

	toString: function () {
	    return 'a ' +
	        (this.constructor.name ||
	            this.constructor.toString().split(' ')[1].split('(')[0]) +
	        ' ' +
	        this.children.length.toString() + ' ' +
	        this.bounds;
	},

	// Morph deleting:

	destroy: function () {
	    if (this.parent !== null) {
	        this.fullChanged();
	        this.parent.removeChild(this);
	    }
	},

	// Morph stepping:

	stepFrame: function () {
	    if (!this.step) {
	        return null;
	    }
	    var current, elapsed, leftover, nxt;
	    current = Date.now();
	    elapsed = current - this.lastTime;
	    if (this.fps > 0) {
	        leftover = (1000 / this.fps) - elapsed;
	    } else {
	        leftover = 0;
	    }
	    if (leftover < 1) {
	        this.lastTime = current;
	        if (this.onNextStep) {
	            nxt = this.onNextStep;
	            this.onNextStep = null;
	            nxt.call(this);
	        }
	        this.step();
	        this.children.forEach(function (child) {
	            child.stepFrame();
	        });
	    }
	},

	nextSteps: function (arrayOfFunctions) {
	    var lst = arrayOfFunctions || [],
	        nxt = lst.shift(),
	        myself = this;
	    if (nxt) {
	        this.onNextStep = function () {
	            nxt.call(myself);
	            myself.nextSteps(lst);
	        };
	    }
	},

	step: function () {
	    nop();
	},

	// Morph accessing - geometry getting:

	left: function () {
	    return this.bounds.left();
	},

	right: function () {
	    return this.bounds.right();
	},

	top: function () {
	    return this.bounds.top();
	},

	bottom: function () {
	    return this.bounds.bottom();
	},

	center: function () {
	    return this.bounds.center();
	},

	bottomCenter: function () {
	    return this.bounds.bottomCenter();
	},

	bottomLeft: function () {
	    return this.bounds.bottomLeft();
	},

	bottomRight: function () {
	    return this.bounds.bottomRight();
	},

	boundingBox: function () {
	    return this.bounds;
	},

	corners: function () {
	    return this.bounds.corners();
	},

	leftCenter: function () {
	    return this.bounds.leftCenter();
	},

	rightCenter: function () {
	    return this.bounds.rightCenter();
	},

	topCenter: function () {
	    return this.bounds.topCenter();
	},

	topLeft: function () {
	    return this.bounds.topLeft();
	},

	topRight: function () {
	    return this.bounds.topRight();
	},

	position: function () {
	    return this.bounds.origin;
	},

	extent: function () {
	    return this.bounds.extent();
	},

	width: function () {
	    return this.bounds.width();
	},

	height: function () {
	    return this.bounds.height();
	},

	fullBounds: function () {
	    var result;
	    result = this.bounds;
	    this.children.forEach(function (child) {
	        if (child.isVisible) {
	            result = result.merge(child.fullBounds());
	        }
	    });
	    return result;
	},

	fullBoundsNoShadow: function () {
	    // answer my full bounds but ignore any shadow
	    var result;
	    result = this.bounds;
	    this.children.forEach(function (child) {
	        if (!(child.instanceOf('ShadowMorph')) && (child.isVisible)) {
	            result = result.merge(child.fullBounds());
	        }
	    });
	    return result;
	},

	visibleBounds: function () {
	    // answer which part of me is not clipped by a Frame
	    var visible = this.bounds,
	        frames = this.allParents().filter(function (p) {
	            return p.instanceOf('FrameMorph');
	        });
	    frames.forEach(function (f) {
	        visible = visible.intersect(f.bounds);
	    });
	    return visible;
	},

	// Morph accessing - simple changes:

	moveBy: function (delta) {
	    this.changed();
	    this.bounds = this.bounds.translateBy(delta);
	    this.children.forEach(function (child) {
	        child.moveBy(delta);
	    });
	    this.changed();
	},

	silentMoveBy: function (delta) {
	    this.bounds = this.bounds.translateBy(delta);
	    this.children.forEach(function (child) {
	        child.silentMoveBy(delta);
	    });
	},

	setPosition: function (aPoint) {
	    var delta = aPoint.subtract(this.topLeft());
	    if ((delta.x !== 0) || (delta.y !== 0)) {
	        this.moveBy(delta);
	    }
	},

	silentSetPosition: function (aPoint) {
	    var delta = aPoint.subtract(this.topLeft());
	    if ((delta.x !== 0) || (delta.y !== 0)) {
	        this.silentMoveBy(delta);
	    }
	},

	setLeft: function (x) {
	    this.setPosition(
	        new Point(
	            x,
	            this.top()
	        )
	    );
	},

	setRight: function (x) {
	    this.setPosition(
	        new Point(
	            x - this.width(),
	            this.top()
	        )
	    );
	},

	setTop: function (y) {
	    this.setPosition(
	        new Point(
	            this.left(),
	            y
	        )
	    );
	},

	setBottom: function (y) {
	    this.setPosition(
	        new Point(
	            this.left(),
	            y - this.height()
	        )
	    );
	},

	setCenter: function (aPoint) {
	    this.setPosition(
	        aPoint.subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	},

	setFullCenter: function (aPoint) {
	    this.setPosition(
	        aPoint.subtract(
	            this.fullBounds().extent().floorDivideBy(2)
	        )
	    );
	},

	keepWithin: function (aMorph) {
	    // make sure I am completely within another Morph's bounds
	    var leftOff, rightOff, topOff, bottomOff;
	    leftOff = this.fullBounds().left() - aMorph.left();
	    if (leftOff < 0) {
	        this.moveBy(new Point(-leftOff, 0));
	    }
	    rightOff = this.fullBounds().right() - aMorph.right();
	    if (rightOff > 0) {
	        this.moveBy(new Point(-rightOff, 0));
	    }
	    topOff = this.fullBounds().top() - aMorph.top();
	    if (topOff < 0) {
	        this.moveBy(new Point(0, -topOff));
	    }
	    bottomOff = this.fullBounds().bottom() - aMorph.bottom();
	    if (bottomOff > 0) {
	        this.moveBy(new Point(0, -bottomOff));
	    }
	},

	// Morph accessing - dimensional changes requiring a complete redraw

	setExtent: function (aPoint) {
	    if (!aPoint.eq(this.extent())) {
	        this.changed();
	        this.silentSetExtent(aPoint);
	        this.changed();
	        this.drawNew();
	    }
	},

	silentSetExtent: function (aPoint) {
	    var ext, newWidth, newHeight;
	    ext = aPoint.round();
	    newWidth = Math.max(ext.x, 0);
	    newHeight = Math.max(ext.y, 0);
	    this.bounds.corner = new Point(
	        this.bounds.origin.x + newWidth,
	        this.bounds.origin.y + newHeight
	    );
	},

	setWidth: function (width) {
	    this.setExtent(new Point(width || 0, this.height()));
	},

	silentSetWidth: function (width) {
	    // do not drawNew() just yet
	    var w = Math.max(Math.round(width || 0), 0);
	    this.bounds.corner = new Point(
	        this.bounds.origin.x + w,
	        this.bounds.corner.y
	    );
	},

	setHeight: function (height) {
	    this.setExtent(new Point(this.width(), height || 0));
	},

	silentSetHeight: function (height) {
	    // do not drawNew() just yet
	    var h = Math.max(Math.round(height || 0), 0);
	    this.bounds.corner = new Point(
	        this.bounds.corner.x,
	        this.bounds.origin.y + h
	    );
	},

	setColor: function (aColor) {
	    if (aColor) {
	        if (!this.color.eq(aColor)) {
	            this.color = aColor;
	            this.changed();
	            this.drawNew();
	        }
	    }
	},

	// Morph displaying:

	drawNew: function () {
	    // initialize my surface property
	    this.image = newCanvas(this.extent());
	    var context = this.image.getContext('2d');
	    context.fillStyle = this.color.toString();
	    context.fillRect(0, 0, this.width(), this.height());
	    if (this.cachedTexture) {
	        this.drawCachedTexture();
	    } else if (this.texture) {
	        this.drawTexture(this.texture);
	    }
	},

	drawTexture: function (url) {
	    var myself = this;
	    this.cachedTexture = new Image();
	    this.cachedTexture.onload = function () {
	        myself.drawCachedTexture();
	    };
	    this.cachedTexture.src = this.texture = url; // make absolute
	},

	drawCachedTexture: function () {
	    var bg = this.cachedTexture,
	        cols = Math.floor(this.image.width / bg.width),
	        lines = Math.floor(this.image.height / bg.height),
	        x,
	        y,
	        context = this.image.getContext('2d');

	    for (y = 0; y <= lines; y += 1) {
	        for (x = 0; x <= cols; x += 1) {
	            context.drawImage(bg, x * bg.width, y * bg.height);
	        }
	    }
	    this.changed();
	},

	/*
	drawCachedTexture: function () {
	    var context = this.image.getContext('2d'),
	        pattern = context.createPattern(this.cachedTexture, 'repeat');
	    context.fillStyle = pattern;
	    context.fillRect(0, 0, this.image.width, this.image.height);
	    this.changed();
	};
	*/

	drawOn: function (aCanvas, aRect) {
	    var rectangle, area, delta, src, context, w, h, sl, st;
	    if (!this.isVisible) {
	        return null;
	    }
	    rectangle = aRect || this.bounds();
	    area = rectangle.intersect(this.bounds).round();
	    if (area.extent().gt(new Point(0, 0))) {
	        delta = this.position().neg();
	        src = area.copy().translateBy(delta).round();
	        context = aCanvas.getContext('2d');
	        context.globalAlpha = this.alpha;

	        sl = src.left();
	        st = src.top();
	        w = Math.min(src.width(), this.image.width - sl);
	        h = Math.min(src.height(), this.image.height - st);

	        if (w < 1 || h < 1) {
	            return null;
	        }

	        context.drawImage(
	            this.image,
	            src.left(),
	            src.top(),
	            w,
	            h,
	            area.left(),
	            area.top(),
	            w,
	            h
	        );

	    /* "for debugging purposes:"

	        try {
	            context.drawImage(
	                this.image,
	                src.left(),
	                src.top(),
	                w,
	                h,
	                area.left(),
	                area.top(),
	                w,
	                h
	            );
	        } catch (err) {
	            alert('internal error\n\n' + err
	                + '\n ---'
	                + '\n canvas: ' + aCanvas
	                + '\n canvas.width: ' + aCanvas.width
	                + '\n canvas.height: ' + aCanvas.height
	                + '\n ---'
	                + '\n image: ' + this.image
	                + '\n image.width: ' + this.image.width
	                + '\n image.height: ' + this.image.height
	                + '\n ---'
	                + '\n w: ' + w
	                + '\n h: ' + h
	                + '\n sl: ' + sl
	                + '\n st: ' + st
	                + '\n area.left: ' + area.left()
	                + '\n area.top ' + area.top()
	                );
	        }
	    */

	    }
	},

	fullDrawOn: function (aCanvas, aRect) {
	    var rectangle;
	    if (!this.isVisible) {
	        return null;
	    }
	    rectangle = aRect || this.fullBounds();
	    this.drawOn(aCanvas, rectangle);
	    this.children.forEach(function (child) {
	        child.fullDrawOn(aCanvas, rectangle);
	    });
	},

	hide: function () {
	    this.isVisible = false;
	    this.changed();
	    this.children.forEach(function (child) {
	        child.hide();
	    });
	},

	show: function () {
	    this.isVisible = true;
	    this.changed();
	    this.children.forEach(function (child) {
	        child.show();
	    });
	},

	toggleVisibility: function () {
	    this.isVisible = (!this.isVisible);
	    this.changed();
	    this.children.forEach(function (child) {
	        child.toggleVisibility();
	    });
	},

	// Morph full image:

	fullImageClassic: function () {
	    // why doesn't this work for all Morphs?
	    var fb = this.fullBounds(),
	        img = newCanvas(fb.extent()),
	        ctx = img.getContext('2d');
	    ctx.translate(-this.bounds.origin.x, -this.bounds.origin.y);
	    this.fullDrawOn(img, fb);
	    img.globalAlpha = this.alpha;
	    return img;
	},

	fullImage: function () {
	    var img, ctx, fb;
	    img = newCanvas(this.fullBounds().extent());
	    ctx = img.getContext('2d');
	    fb = this.fullBounds();
	    this.allChildren().forEach(function (morph) {
	        if (morph.isVisible) {
	            ctx.globalAlpha = morph.alpha;
	            if (morph.image.width && morph.image.height) {
	                ctx.drawImage(
	                    morph.image,
	                    morph.bounds.origin.x - fb.origin.x,
	                    morph.bounds.origin.y - fb.origin.y
	                );
	            }
	        }
	    });
	    return img;
	},

	// Morph shadow:

	shadowImage: function (off, color) {
	    // fallback for Windows Chrome-Shadow bug
	    var fb, img, outline, sha, ctx,
	        offset = off || new Point(7, 7),
	        clr = color || new Color(0, 0, 0);
	    fb = this.fullBounds().extent();
	    img = this.fullImage();
	    outline = newCanvas(fb);
	    ctx = outline.getContext('2d');
	    ctx.drawImage(img, 0, 0);
	    ctx.globalCompositeOperation = 'destination-out';
	    ctx.drawImage(
	        img,
	        -offset.x,
	        -offset.y
	    );
	    sha = newCanvas(fb);
	    ctx = sha.getContext('2d');
	    ctx.drawImage(outline, 0, 0);
	    ctx.globalCompositeOperation = 'source-atop';
	    ctx.fillStyle = clr.toString();
	    ctx.fillRect(0, 0, fb.x, fb.y);
	    return sha;
	},

	shadowImageBlurred: function (off, color) {
	    var fb, img, sha, ctx,
	        offset = off || new Point(7, 7),
	        blur = this.shadowBlur,
	        clr = color || new Color(0, 0, 0);
	    fb = this.fullBounds().extent().add(blur * 2);
	    img = this.fullImage();
	    sha = newCanvas(fb);
	    ctx = sha.getContext('2d');
	    ctx.shadowOffsetX = offset.x;
	    ctx.shadowOffsetY = offset.y;
	    ctx.shadowBlur = blur;
	    ctx.shadowColor = clr.toString();
	    ctx.drawImage(
	        img,
	        blur - offset.x,
	        blur - offset.y
	    );
	    ctx.shadowOffsetX = 0;
	    ctx.shadowOffsetY = 0;
	    ctx.shadowBlur = 0;
	    ctx.globalCompositeOperation = 'destination-out';
	    ctx.drawImage(
	        img,
	        blur - offset.x,
	        blur - offset.y
	    );
	    return sha;
	},

	shadow: function (off, a, color) {
	    var shadow = new ShadowMorph(),
	        offset = off || new Point(7, 7),
	        alpha = a || ((a === 0) ? 0 : 0.2),
	        fb = this.fullBounds();
	    shadow.setExtent(fb.extent().add(this.shadowBlur * 2));
	    if (useBlurredShadows && !MorphicPreferences.isFlat) {
	        shadow.image = this.shadowImageBlurred(offset, color);
	        shadow.alpha = alpha;
	        shadow.setPosition(fb.origin.add(offset).subtract(this.shadowBlur));
	    } else {
	        shadow.image = this.shadowImage(offset, color);
	        shadow.alpha = alpha;
	        shadow.setPosition(fb.origin.add(offset));
	    }
	    return shadow;
	},

	addShadow: function (off, a, color) {
	    var shadow,
	        offset = off || new Point(7, 7),
	        alpha = a || ((a === 0) ? 0 : 0.2);
	    shadow = this.shadow(offset, alpha, color);
	    this.addBack(shadow);
	    this.fullChanged();
	    return shadow;
	},

	getShadow: function () {
	    var shadows;
	    shadows = this.children.slice(0).reverse().filter(
	        function (child) {
	            return child.instanceOf('ShadowMorph');
	        }
	    );
	    if (shadows.length !== 0) {
	        return shadows[0];
	    }
	    return null;
	},

	removeShadow: function () {
	    var shadow = this.getShadow();
	    if (shadow !== null) {
	        this.fullChanged();
	        this.removeChild(shadow);
	    }
	},

	// Morph pen trails:

	penTrails: function () {
	    // answer my pen trails canvas. default is to answer my image
	    return this.image;
	},

	// Morph updating:

	changed: function () {
	    if (this.trackChanges) {
	        var w = this.root();
	        if (w.instanceOf('WorldMorph')) {
	            w.broken.push(this.visibleBounds().spread());
	        }
	    }
	    if (this.parent) {
	        this.parent.childChanged(this);
	    }
	},

	fullChanged: function () {
	    if (this.trackChanges) {
	        var w = this.root();
	        if (w.instanceOf('WorldMorph')) {
	            w.broken.push(this.fullBounds().spread());
	        }
	    }
	},

	childChanged: function () {
	    // react to a  change in one of my children,
	    // default is to just pass this message on upwards
	    // override this method for Morphs that need to adjust accordingly
	    if (this.parent) {
	        this.parent.childChanged(this);
	    }
	},

	// Morph accessing - structure:

	world: function () {
	    var root = this.root();
	    if (root.instanceOf('WorldMorph')) {
	        return root;
	    }
	    if (root.instanceOf('HandMorph')) {
	        return root.world;
	    }
	    return null;
	},

	add: function (aMorph) {
	    var owner = aMorph.parent;
	    if (owner !== null) {
	        owner.removeChild(aMorph);
	    }
	    this.addChild(aMorph);
	},

	addBack: function (aMorph) {
	    var owner = aMorph.parent;
	    if (owner !== null) {
	        owner.removeChild(aMorph);
	    }
	    this.addChildFirst(aMorph);
	},

	topMorphSuchThat: function (predicate) {
	    var next;
	    if (predicate.call(null, this)) {
	        next = detect(
	            this.children.slice(0).reverse(),
	            predicate
	        );
	        if (next) {
	            return next.topMorphSuchThat(predicate);
	        }
	        return this;
	    }
	    return null;
	},

	morphAt: function (aPoint) {
	    var morphs = this.allChildren().slice(0).reverse(),
	        result = null;
	    morphs.forEach(function (m) {
	        if (m.fullBounds().containsPoint(aPoint) &&
	                (result === null)) {
	            result = m;
	        }
	    });
	    return result;
	},

	/*
	    alternative -  more elegant and possibly more
	    performant - solution for morphAt.
	    Has some issues, commented out for now

	morphAt: function (aPoint) {
	    return this.topMorphSuchThat(function (m) {
	        return m.fullBounds().containsPoint(aPoint);
	    });
	};
	*/

	overlappedMorphs: function () {
	    //exclude the World
	    var world = this.world(),
	        fb = this.fullBounds(),
	        myself = this,
	        allParents = this.allParents(),
	        allChildren = this.allChildren(),
	        morphs;

	    morphs = world.allChildren();
	    return morphs.filter(function (m) {
	        return m.isVisible &&
	            m !== myself &&
	            m !== world &&
	            !contains(allParents, m) &&
	            !contains(allChildren, m) &&
	            m.fullBounds().intersects(fb);
	    });
	},

	// Morph pixel access:

	getPixelColor: function (aPoint) {
	    var point, context, data;
	    point = aPoint.subtract(this.bounds.origin);
	    context = this.image.getContext('2d');
	    data = context.getImageData(point.x, point.y, 1, 1);
	    return new Color(
	        data.data[0],
	        data.data[1],
	        data.data[2],
	        data.data[3]
	    );
	},

	isTransparentAt: function (aPoint) {
	    var point, context, data;
	    if (this.bounds.containsPoint(aPoint)) {
	        if (this.texture) {
	            return false;
	        }
	        point = aPoint.subtract(this.bounds.origin);
	        context = this.image.getContext('2d');
	        data = context.getImageData(
	            Math.floor(point.x),
	            Math.floor(point.y),
	            1,
	            1
	        );
	        return data.data[3] === 0;
	    }
	    return false;
	},

	// Morph duplicating:

	copy: function () {
	    var c = copy(this);
	    c.parent = null;
	    c.children = [];
	    c.bounds = this.bounds.copy();
	    return c;
	},

	fullCopy: function () {
	    /*
	    Produce a copy of me with my entire tree of submorphs. Morphs
	    mentioned more than once are all directed to a single new copy.
	    Other properties are also *shallow* copied, so you must override
	    to deep copy Arrays and (complex) Objects
	    */
	    var dict = {}, c;
	    c = this.copyRecordingReferences(dict);
	    c.forAllChildren(function (m) {
	        m.updateReferences(dict);
	    });
	    return c;
	},

	copyRecordingReferences: function (dict) {
	    /*
	    Recursively copy this entire composite morph, recording the
	    correspondence between old and new morphs in the given dictionary.
	    This dictionary will be used to update intra-composite references
	    in the copy. See updateReferences().
	    Note: This default implementation copies ONLY morphs in the
	    submorph hierarchy. If a morph stores morphs in other properties
	    that it wants to copy, then it should override this method to do so.
	    The same goes for morphs that contain other complex data that
	    should be copied when the morph is duplicated.
	    */
	    var c = this.copy();
	    dict[this] = c;
	    this.children.forEach(function (m) {
	        c.add(m.copyRecordingReferences(dict));
	    });
	    return c;
	},

	updateReferences: function (dict) {
	    /*
	    Update intra-morph references within a composite morph that has
	    been copied. For example, if a button refers to morph X in the
	    orginal composite then the copy of that button in the new composite
	    should refer to the copy of X in new composite, not the original X.
	    */
	    var property;
	    for (property in this) {
	        if (this[property] && this[property].isMorph && dict[property]) {
	            this[property] = dict[property];
	        }
	    }
	},

	// Morph dragging and dropping:

	rootForGrab: function () {
	    if (this.instanceOf('ShadowMorph')) {
	        return this.parent.rootForGrab();
	    }
	    if (this.parent.instanceOf('ScrollFrameMorph')) {
	        return this.parent;
	    }
	    if (this.parent === null ||
	            this.parent.instanceOf('WorldMorph') ||
	            this.parent.instanceOf('FrameMorph') ||
	            this.isDraggable === true) {
	        return this;
	    }
	    return this.parent.rootForGrab();
	},

	wantsDropOf: function (aMorph) {
	    // default is to answer the general flag - change for my heirs
	    if ((aMorph.instanceOf('HandleMorph')) ||
	            (aMorph.instanceOf('MenuMorph')) ||
	            (aMorph.instanceOf('InspectorMorph'))) {
	        return false;
	    }
	    return this.acceptsDrops;
	},

	pickUp: function (wrrld) {
	    var world = wrrld || this.world();
	    this.setPosition(
	        world.hand.position().subtract(
	            this.extent().floorDivideBy(2)
	        )
	    );
	    world.hand.grab(this);
	},

	isPickedUp: function () {
	    return this.parentThatIsA('HandMorph') !== null;
	},

	situation: function () {
	    // answer a dictionary specifying where I am right now, so
	    // I can slide back to it if I'm dropped somewhere else
	    if (this.parent) {
	        return {
	            origin: this.parent,
	            position: this.position().subtract(this.parent.position())
	        };
	    }
	    return null;
	},

	slideBackTo: function (situation, inSteps) {
	    var steps = inSteps || 5,
	        pos = situation.origin.position().add(situation.position),
	        xStep = -(this.left() - pos.x) / steps,
	        yStep = -(this.top() - pos.y) / steps,
	        stepCount = 0,
	        oldStep = this.step,
	        oldFps = this.fps,
	        myself = this;

	    this.fps = 0;
	    this.step = function () {
	        myself.fullChanged();
	        myself.silentMoveBy(new Point(xStep, yStep));
	        myself.fullChanged();
	        stepCount += 1;
	        if (stepCount === steps) {
	            situation.origin.add(myself);
	            if (situation.origin.reactToDropOf) {
	                situation.origin.reactToDropOf(myself);
	            }
	            myself.step = oldStep;
	            myself.fps = oldFps;
	        }
	    };
	},

	// Morph utilities:

	nop: function () {
	    nop();
	},

	resize: function () {
	    this.world().activeHandle = new HandleMorph(this);
	},

	move: function () {
	    this.world().activeHandle = new HandleMorph(
	        this,
	        null,
	        null,
	        null,
	        null,
	        'move'
	    );
	},

	hint: function (msg) {
	    var m, text;
	    text = msg;
	    if (msg) {
	        if (msg.toString) {
	            text = msg.toString();
	        }
	    } else {
	        text = 'NULL';
	    }
	    m = new MenuMorph(this, text);
	    m.isDraggable = true;
	    m.popUpCenteredAtHand(this.world());
	},

	inform: function (msg) {
	    var m, text;
	    text = msg;
	    if (msg) {
	        if (msg.toString) {
	            text = msg.toString();
	        }
	    } else {
	        text = 'NULL';
	    }
	    m = new MenuMorph(this, text);
	    m.addItem("Ok");
	    m.isDraggable = true;
	    m.popUpCenteredAtHand(this.world());
	},

	prompt: function (
	    msg,
	    callback,
	    environment,
	    defaultContents,
	    width,
	    floorNum,
	    ceilingNum,
	    isRounded
	) {
	    var menu, entryField, slider, isNumeric;
	    if (ceilingNum) {
	        isNumeric = true;
	    }
	    menu = new MenuMorph(
	        callback || null,
	        msg || '',
	        environment || null
	    );
	    entryField = new StringFieldMorph(
	        defaultContents || '',
	        width || 100,
	        MorphicPreferences.prompterFontSize,
	        MorphicPreferences.prompterFontName,
	        false,
	        false,
	        isNumeric
	    );
	    menu.items.push(entryField);
	    if (ceilingNum || MorphicPreferences.useSliderForInput) {
	        slider = new SliderMorph(
	            floorNum || 0,
	            ceilingNum,
	            parseFloat(defaultContents),
	            Math.floor((ceilingNum - floorNum) / 4),
	            'horizontal'
	        );
	        slider.alpha = 1;
	        slider.color = new Color(225, 225, 225);
	        slider.button.color = menu.borderColor;
	        slider.button.highlightColor = slider.button.color.copy();
	        slider.button.highlightColor.b += 100;
	        slider.button.pressColor = slider.button.color.copy();
	        slider.button.pressColor.b += 150;
	        slider.setHeight(MorphicPreferences.prompterSliderSize);
	        if (isRounded) {
	            slider.action = function (num) {
	                entryField.changed();
	                entryField.text.text = Math.round(num).toString();
	                entryField.text.drawNew();
	                entryField.text.changed();
	                entryField.text.edit();
	            };
	        } else {
	            slider.action = function (num) {
	                entryField.changed();
	                entryField.text.text = num.toString();
	                entryField.text.drawNew();
	                entryField.text.changed();
	            };
	        }
	        menu.items.push(slider);
	    }

	    menu.addLine(2);
	    menu.addItem('Ok', function () {
	        return entryField.string();
	    });
	    menu.addItem('Cancel', function () {
	        return null;
	    });
	    menu.isDraggable = true;
	    menu.popUpAtHand(this.world());
	    entryField.text.edit();
	},

	createCategory: function (){	
	  for (var i = 0; i < 10; i++) {
	               var label = document.createElement('label');
	               var br = document.createElement('br');
	               //var alabel = document.getElementById("<%=Label3.ClientID %>");
				   var alabel = document.getElementById('div1');
	               var last = alabel[alabel.length - 1];
	               label.htmlFor = "lbl"+i;
	               label.appendChild(Createcheckbox('test' + i));
	               label.appendChild(document.createTextNode('kings' + i));
	               label.appendChild(br);
	               //document.getElementById("<%=Label3.ClientID %>").appendChild(label);
				   document.getElementById('div1').appendChild(label);
	  }
	},

	pickColor: function (
	    msg,
	    callback,
	    environment,
	    defaultContents
	) {
	    var menu, colorPicker;
	    menu = new MenuMorph(
	        callback || null,
	        msg || '',
	        environment || null
	    );
	    colorPicker = new ColorPickerMorph(defaultContents);
	    menu.items.push(colorPicker);
	    menu.addLine(2);
	    menu.addItem('Ok', function () {
	        return colorPicker.getChoice();
	    });
	    menu.addItem('Cancel', function () {
	        return null;
	    });
	    menu.isDraggable = true;
	    menu.popUpAtHand(this.world());
	},

	inspect: function (anotherObject) {
	    var world = this.world instanceof Function ?
	            this.world() : this.root() || this.world,
	        inspector,
	        inspectee = this;

	    if (anotherObject) {
	        inspectee = anotherObject;
	    }
	    inspector = new InspectorMorph(inspectee);
	    inspector.setPosition(world.hand.position());
	    inspector.keepWithin(world);
	    world.add(inspector);
	    inspector.changed();
	},

	// Morph menus:

	contextMenu: function () {
	    var world;

	    if (this.customContextMenu) {
	        return this.customContextMenu;
	    }
	    world = this.world instanceof Function ? this.world() : this.world;
	    if (world && world.isDevMode) {
	        if (this.parent === world) {
	            return this.developersMenu();
	        }
	        return this.hierarchyMenu();
	    }
	    return this.userMenu() ||
	        (this.parent && this.parent.userMenu());
	},

	hierarchyMenu: function () {
	    var parents = this.allParents(),
	        world = this.world instanceof Function ? this.world() : this.world,
	        menu = new MenuMorph(this, null);

	    parents.forEach(function (each) {
	        if (each.developersMenu && (each !== world)) {
	            menu.addItem(each.toString().slice(0, 50), function () {
	                each.developersMenu().popUpAtHand(world);
	            });
	        }
	    });
	    return menu;
	},

	developersMenu: function () {
	    // 'name' is not an official property of a function, hence:
	    var world = this.world instanceof Function ? this.world() : this.world,
	        userMenu = this.userMenu() ||
	            (this.parent && this.parent.userMenu()),
	        menu = new MenuMorph(this, this.constructor.name ||
	            this.constructor.toString().split(' ')[1].split('(')[0]);
	    if (userMenu) {
	        menu.addItem(
	            'user features...',
	            function () {
	                userMenu.popUpAtHand(world);
	            }
	        );
	        menu.addLine();
	    }
	    menu.addItem(
	        "color...",
	        function () {
	            this.pickColor(
	                menu.title + '\ncolor:',
	                this.setColor,
	                this,
	                this.color
	            );
	        },
	        'choose another color \nfor this morph'
	    );
	    menu.addItem(
	        "transparency...",
	        function () {
	            this.prompt(
	                menu.title + '\nalpha\nvalue:',
	                this.setAlphaScaled,
	                this,
	                (this.alpha * 100).toString(),
	                null,
	                1,
	                100,
	                true
	            );
	        },
	        'set this morph\'s\nalpha value'
	    );
	    menu.addItem(
	        "resize...",
	        'resize',
	        'show a handle\nwhich can be dragged\nto change this morph\'s' +
	            ' extent'
	    );
	    menu.addLine();
	    menu.addItem(
	        "duplicate",
	        function () {
	            this.fullCopy().pickUp(this.world());
	        },
	        'make a copy\nand pick it up'
	    );
	    menu.addItem(
	        "pick up",
	        'pickUp',
	        'disattach and put \ninto the hand'
	    );
	    menu.addItem(
	        "attach...",
	        'attach',
	        'stick this morph\nto another one'
	    );
	    menu.addItem(
	        "move...",
	        'move',
	        'show a handle\nwhich can be dragged\nto move this morph'
	    );
	    menu.addItem(
	        "inspect...",
	        'inspect',
	        'open a window\non all properties'
	    );
	    menu.addItem(
	        "pic...",
	        function () {
	            window.open(this.fullImageClassic().toDataURL());
	        },
	        'open a new window\nwith a picture of this morph'
	    );
	    menu.addLine();
	    if (this.isDraggable) {
	        menu.addItem(
	            "lock",
	            'toggleIsDraggable',
	            'make this morph\nunmovable'
	        );
	    } else {
	        menu.addItem(
	            "unlock",
	            'toggleIsDraggable',
	            'make this morph\nmovable'
	        );
	    }
	    menu.addItem("hide", 'hide');
	    menu.addItem("delete", 'destroy');
	    if (!(this.instanceOf('WorldMorph'))) {
	        menu.addLine();
	        menu.addItem(
	            "World...",
	            function () {
	                world.contextMenu().popUpAtHand(world);
	            },
	            'show the\nWorld\'s menu'
	        );
	    }
	    return menu;
	},

	userMenu: function () {
	    return null;
	},

	// Morph menu actions

	setAlphaScaled: function (alpha) {
	    // for context menu demo purposes
	    var newAlpha, unscaled;
	    if (typeof alpha === 'number') {
	        unscaled = alpha / 100;
	        this.alpha = Math.min(Math.max(unscaled, 0.1), 1);
	    } else {
	        newAlpha = parseFloat(alpha);
	        if (!isNaN(newAlpha)) {
	            unscaled = newAlpha / 100;
	            this.alpha = Math.min(Math.max(unscaled, 0.1), 1);
	        }
	    }
	    this.changed();
	},

	attach: function () {
	    var choices = this.overlappedMorphs(),
	        menu = new MenuMorph(this, 'choose new parent:'),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each.toString().slice(0, 50), function () {
	            each.add(myself);
	            myself.isDraggable = false;
	        });
	    });
	    if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

	toggleIsDraggable: function () {
	    // for context menu demo purposes
	    this.isDraggable = !this.isDraggable;
	},

	colorSetters: function () {
	    // for context menu demo purposes
	    return ['color'];
	},

	numericalSetters: function () {
	    // for context menu demo purposes
	    return [
	        'setLeft',
	        'setTop',
	        'setWidth',
	        'setHeight',
	        'setAlphaScaled'
	    ];
	},

	// Morph entry field tabbing:

	allEntryFields: function () {
	    return this.allChildren().filter(function (each) {
	        return each.isEditable &&
	            (each.instanceOf('StringMorph') ||
	                each.instanceOf('TextMorph'));
	    });
	},

	nextEntryField: function (current) {
	    var fields = this.allEntryFields(),
	        idx = fields.indexOf(current);
	    if (idx !== -1) {
	        if (fields.length > idx + 1) {
	            return fields[idx + 1];
	        }
	    }
	    return fields[0];
	},

	previousEntryField: function (current) {
	    var fields = this.allEntryFields(),
	        idx = fields.indexOf(current);
	    if (idx !== -1) {
	        if (idx > 0) {
	            return fields[idx - 1];
	        }
	        return fields[fields.length - 1];
	    }
	    return fields[0];
	},

	tab: function (editField) {
	/*
	    the <tab> key was pressed in one of my edit fields.
	    invoke my "nextTab()" function if it exists, else
	    propagate it up my owner chain.
	*/
	    if (this.nextTab) {
	        this.nextTab(editField);
	    } else if (this.parent) {
	        this.parent.tab(editField);
	    }
	},

	backTab: function (editField) {
	/*
	    the <back tab> key was pressed in one of my edit fields.
	    invoke my "previousTab()" function if it exists, else
	    propagate it up my owner chain.
	*/
	    if (this.previousTab) {
	        this.previousTab(editField);
	    } else if (this.parent) {
	        this.parent.backTab(editField);
	    }
	},

	/*
	    the following are examples of what the navigation methods should
	    look like. Insert these at the World level for fallback, and at lower
	    levels in the Morphic tree (e.g. dialog boxes) for a more fine-grained
	    control over the tabbing cycle.

	nextTab: function (editField) {
	    var next = this.nextEntryField(editField);
	    editField.clearSelection();
	    next.selectAll();
	    next.edit();
	},

	previousTab: function (editField) {
	    var prev = this.previousEntryField(editField);
	    editField.clearSelection();
	    prev.selectAll();
	    prev.edit();
	},

	*/

	// Morph events:

	escalateEvent: function (functionName, arg) {
	    var handler = this.parent;
	    while (!handler[functionName] && handler.parent !== null) {
	        handler = handler.parent;
	    }
	    if (handler[functionName]) {
	        handler[functionName](arg);
	    }
	},

	// Morph eval:

	evaluateString: function (code) {
	    var result;

	    try {
	        result = eval(code);
	        this.drawNew();
	        this.changed();
	    } catch (err) {
	        this.inform(err);
	    }
	    return result;
	},

	// Morph collision detection:

	isTouching: function (otherMorph) {
	    var oImg = this.overlappingImage(otherMorph),
	        data = oImg.getContext('2d')
	            .getImageData(1, 1, oImg.width, oImg.height)
	            .data;
	    return detect(
	        data,
	        function (each) {
	            return each !== 0;
	        }
	    ) !== null;
	},

	overlappingImage: function (otherMorph) {
	    var fb = this.fullBounds(),
	        otherFb = otherMorph.fullBounds(),
	        oRect = fb.intersect(otherFb),
	        oImg = newCanvas(oRect.extent()),
	        ctx = oImg.getContext('2d');
	    if (oRect.width() < 1 || oRect.height() < 1) {
	        return newCanvas(new Point(1, 1));
	    }
	    ctx.drawImage(
	        this.fullImage(),
	        oRect.origin.x - fb.origin.x,
	        oRect.origin.y - fb.origin.y
	    );
	    ctx.globalCompositeOperation = 'source-in';
	    ctx.drawImage(
	        otherMorph.fullImage(),
	        otherFb.origin.x - oRect.origin.x,
	        otherFb.origin.y - oRect.origin.y
	    );
	    return oImg;
	}

})

Morph.uber = Node.prototype;
Morph.className = 'Morph';


module.exports = Morph;
},{"./Color":6,"./Node":20,"./Rectangle":23}],19:[function(require,module,exports){
var BoxMorph = require('./BoxMorph');
var Color = require('./Color');

var MouseSensorMorph = Class.create(BoxMorph, {
	
	initialize: function(edge, border, borderColor) {
	    this.init(edge, border, borderColor);
	},

	init: function ($super, edge, border, borderColor) {
	    $super();
	    this.edge = edge || 4;
	    this.border = border || 2;
	    this.color = new Color(255, 255, 255);
	    this.borderColor = borderColor || new Color();
	    this.isTouched = false;
	    this.upStep = 0.05;
	    this.downStep = 0.02;
	    this.noticesTransparentClick = false;
	    this.drawNew();
	},

	touch: function () {
	    var myself = this;
	    if (!this.isTouched) {
	        this.isTouched = true;
	        this.alpha = 0.6;

	        this.step = function () {
	            if (myself.isTouched) {
	                if (myself.alpha < 1) {
	                    myself.alpha = myself.alpha + myself.upStep;
	                }
	            } else if (myself.alpha > (myself.downStep)) {
	                myself.alpha = myself.alpha - myself.downStep;
	            } else {
	                myself.alpha = 0;
	                myself.step = null;
	            }
	            myself.changed();
	        };
	    }
	},

	unTouch: function () {
	    this.isTouched = false;
	},

	mouseEnter: function () {
	    this.touch();
	},

	mouseLeave: function () {
	    this.unTouch();
	},

	mouseDownLeft: function () {
	    this.touch();
	},

	mouseClickLeft: function () {
	    this.unTouch();
	},


})

MouseSensorMorph.uber = BoxMorph.prototype;
MouseSensorMorph.className = 'MouseSensorMorph';

module.exports = MouseSensorMorph;


},{"./BoxMorph":3,"./Color":6}],20:[function(require,module,exports){
// Nodes ///////////////////////////////////////////////////////////////

var Node = Class.create({

    initialize: function(parent, childrenArray){
        this.init(parent || null, childrenArray || []);
    },

    init: function (parent, childrenArray) {
	    this.parent = parent || null;
	    this.children = childrenArray || [];
	},

	// Node string representation: e.g. 'a Node[3]'

	toString: function () {
	    return 'a Node' + '[' + this.children.length.toString() + ']';
	},

	// Node accessing:

	addChild: function (aNode) {
	    this.children.push(aNode);
	    aNode.parent = this;
	},

	addChildFirst: function (aNode) {
	    this.children.splice(0, null, aNode);
	    aNode.parent = this;
	},

	removeChild: function (aNode) {
	    var idx = this.children.indexOf(aNode);
	    if (idx !== -1) {
	        this.children.splice(idx, 1);
	    }
	},

	// Node functions:

	root: function () {
	    if (this.parent === null) {
	        return this;
	    }
	    return this.parent.root();
	},

	depth: function () {
	    if (this.parent === null) {
	        return 0;
	    }
	    return this.parent.depth() + 1;
	},

	allChildren: function () {
	    // includes myself
	    var result = [this];
	    this.children.forEach(function (child) {
	        result = result.concat(child.allChildren());
	    });
	    return result;
	},

	forAllChildren: function (aFunction) {
	    if (this.children.length > 0) {
	        this.children.forEach(function (child) {
	            child.forAllChildren(aFunction);
	        });
	    }
	    aFunction.call(null, this);
	},

	allLeafs: function () {
	    var result = [];
	    this.allChildren().forEach(function (element) {
	        if (element.children.length === 0) {
	            result.push(element);
	        }
	    });
	    return result;
	},

	allParents: function () {
	    // includes myself
	    var result = [this];
	    if (this.parent !== null) {
	        result = result.concat(this.parent.allParents());
	    }
	    return result;
	},

	siblings: function () {
	    var myself = this;
	    if (this.parent === null) {
	        return [];
	    }
	    return this.parent.children.filter(function (child) {
	        return child !== myself;
	    });
	},

	parentThatIsA: function (constructorName) {
	    // including myself
	    if (this.instanceOf(constructorName)) {
	        return this;
	    }

	    if (!this.parent){
	    	return null;
	    }
		return this.parent.parentThatIsA(constructorName);
	},

	parentThatIsAnyOf: function (constructorNames) {
	    // including myself
	    var yup = false,
	        myself = this;
	    constructorNames.forEach(function (each) {
	        if (myself.instanceOf(each)) {
	            yup = true;
	            return;
	        }
	    });
	    if (yup) {
	        return this;
	    }
	    if (!this.parent) {
	    	return null;
	    }
	    return this.parent.parentThatIsAnyOf(constructorNames);
	}

});

Node.className = 'Node';

module.exports = Node;

},{}],21:[function(require,module,exports){
var Point = require('./Point');
var Morph = require('./Morph');
var Rectangle = require('./Rectangle');

var PenMorph = Class.create(Morph, {

    // PenMorph ////////////////////////////////////////////////////////////

    // I am a simple LOGO-wise turtle.
    
    initialize: function(){
        this.init();
    },

    init: function ($super) {
        var size = MorphicPreferences.handleSize * 4;

        // additional properties:
        this.isWarped = false; // internal optimization
        this.heading = 0;
        this.isDown = true;
        this.size = 1;
        this.wantsRedraw = false;
        this.penPoint = 'tip'; // or 'center"

        $super();
        this.setExtent(new Point(size, size));
    },

    // PenMorph updating - optimized for warping, i.e atomic recursion

    changed: function () {
        if (this.isWarped === false) {
            var w = this.root();
            if (w.instanceOf('WorldMorph')) {
                w.broken.push(this.visibleBounds().spread());
            }
            if (this.parent) {
                this.parent.childChanged(this);
            }
        }
    },

    // PenMorph display:

    drawNew: function (facing) {
    /*
        my orientation can be overridden with the "facing" parameter to
        implement Scratch-style rotation styles

    */
        var context, start, dest, left, right, len,
            direction = facing || this.heading;

        if (this.isWarped) {
            this.wantsRedraw = true;
            return;
        }
        this.image = newCanvas(this.extent());
        context = this.image.getContext('2d');
        len = this.width() / 2;
        start = this.center().subtract(this.bounds.origin);

        if (this.penPoint === 'tip') {
            dest = start.distanceAngle(len * 0.75, direction - 180);
            left = start.distanceAngle(len, direction + 195);
            right = start.distanceAngle(len, direction - 195);
        } else { // 'middle'
            dest = start.distanceAngle(len * 0.75, direction);
            left = start.distanceAngle(len * 0.33, direction + 230);
            right = start.distanceAngle(len * 0.33, direction - 230);
        }

        context.fillStyle = this.color.toString();
        context.beginPath();

        context.moveTo(start.x, start.y);
        context.lineTo(left.x, left.y);
        context.lineTo(dest.x, dest.y);
        context.lineTo(right.x, right.y);

        context.closePath();
        context.strokeStyle = 'white';
        context.lineWidth = 3;
        context.stroke();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.stroke();
        context.fill();

    },

    // PenMorph access:

    setHeading: function (degrees) {
        this.heading = parseFloat(degrees) % 360;
        this.drawNew();
        this.changed();
    },

    // PenMorph drawing:

    drawLine: function (start, dest) {
        var context = this.parent.penTrails().getContext('2d'),
            from = start.subtract(this.parent.bounds.origin),
            to = dest.subtract(this.parent.bounds.origin);
        if (this.isDown) {
            context.lineWidth = this.size;
            context.strokeStyle = this.color.toString();
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.stroke();
            if (this.isWarped === false) {
                rect = new Rectangle(0, 0, 0, 0);
                this.world().broken.push(
                    start.rectangle(rect, dest).expandBy(
                        Math.max(this.size / 2, 1)
                    ).intersect(this.parent.visibleBounds()).spread()
                );
            }
        }
    },

    // PenMorph turtle ops:

    turn: function (degrees) {
        this.setHeading(this.heading + parseFloat(degrees));
    },

    forward: function (steps) {
        var start = this.center(),
            dest,
            dist = parseFloat(steps);
        if (dist >= 0) {
            dest = this.position().distanceAngle(dist, this.heading);
        } else {
            dest = this.position().distanceAngle(
                Math.abs(dist),
                (this.heading - 180)
            );
        }
        this.setPosition(dest);
        this.drawLine(start, this.center());
    },

    down: function () {
        this.isDown = true;
    },

    up: function () {
        this.isDown = false;
    },

    clear: function () {
        this.parent.drawNew();
        this.parent.changed();
    },

    // PenMorph optimization for atomic recursion:

    startWarp: function () {
        this.wantsRedraw = false;
        this.isWarped = true;
    },

    endWarp: function () {
        this.isWarped = false;
        if (this.wantsRedraw) {
            this.drawNew();
            this.wantsRedraw = false;
        }
        this.parent.changed();
    },

    warp: function (fun) {
        this.startWarp();
        fun.call(this);
        this.endWarp();
    },

    warpOp: function (selector, argsArray) {
        this.startWarp();
        this[selector].apply(this, argsArray);
        this.endWarp();
    },

    // PenMorph demo ops:
    // try these with WARP eg.: this.warp(function () {tree(12, 120, 20)})

    warpSierpinski: function (length, min) {
        this.warpOp('sierpinski', [length, min]);
    },

    sierpinski: function (length, min) {
        var i;
        if (length > min) {
            for (i = 0; i < 3; i += 1) {
                this.sierpinski(length * 0.5, min);
                this.turn(120);
                this.forward(length);
            }
        }
    },

    warpTree: function (level, length, angle) {
        this.warpOp('tree', [level, length, angle]);
    },

    tree: function (level, length, angle) {
        if (level > 0) {
            this.size = level;
            this.forward(length);
            this.turn(angle);
            this.tree(level - 1, length * 0.75, angle);
            this.turn(angle * -2);
            this.tree(level - 1, length * 0.75, angle);
            this.turn(angle);
            this.forward(-length);
        }
    },




})

PenMorph.uber = Morph.prototype;
PenMorph.className = 'PenMorph';

module.exports = PenMorph;


    
},{"./Morph":18,"./Point":22,"./Rectangle":23}],22:[function(require,module,exports){
// Points //////////////////////////////////////////////////////////////

var Point = Class.create({
    
    initialize: function(x, y){
        this.x = x || 0;
        this.y = y || 0;
    },

    // Point string representation: e.g. '12@68'

    toString: function () {
        return Math.round(this.x.toString()) +
            '@' + Math.round(this.y.toString());
    },

    // Point copying:

    copy: function () {
        return new Point(this.x, this.y);
    },

    // Point comparison:

    eq: function (aPoint) {
        // ==
        return this.x === aPoint.x && this.y === aPoint.y;
    },

    lt: function (aPoint) {
        // <
        return this.x < aPoint.x && this.y < aPoint.y;
    },

    gt: function (aPoint) {
        // >
        return this.x > aPoint.x && this.y > aPoint.y;
    },

    ge: function (aPoint) {
        // >=
        return this.x >= aPoint.x && this.y >= aPoint.y;
    },

    le: function (aPoint) {
        // <=
        return this.x <= aPoint.x && this.y <= aPoint.y;
    },

    max: function (aPoint) {
        return new Point(Math.max(this.x, aPoint.x),
            Math.max(this.y, aPoint.y));
    },

    min: function (aPoint) {
        return new Point(Math.min(this.x, aPoint.x),
            Math.min(this.y, aPoint.y));
    },

    // Point conversion:

    round: function () {
        return new Point(Math.round(this.x), Math.round(this.y));
    },

    abs: function () {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    },

    neg: function () {
        return new Point(-this.x, -this.y);
    },

    mirror: function () {
        return new Point(this.y, this.x);
    },

    floor: function () {
        return new Point(
            Math.max(Math.floor(this.x), 0),
            Math.max(Math.floor(this.y), 0)
        );
    },

    ceil: function () {
        return new Point(Math.ceil(this.x), Math.ceil(this.y));
    },

    // Point arithmetic:

    add: function (other) {
        if (other instanceof Point) {
            return new Point(this.x + other.x, this.y + other.y);
        }
        return new Point(this.x + other, this.y + other);
    },

    subtract: function (other) {
        if (other instanceof Point) {
            return new Point(this.x - other.x, this.y - other.y);
        }
        return new Point(this.x - other, this.y - other);
    },

    multiplyBy: function (other) {
        if (other instanceof Point) {
            return new Point(this.x * other.x, this.y * other.y);
        }
        return new Point(this.x * other, this.y * other);
    },

    divideBy: function (other) {
        if (other instanceof Point) {
            return new Point(this.x / other.x, this.y / other.y);
        }
        return new Point(this.x / other, this.y / other);
    },

    floorDivideBy: function (other) {
        if (other instanceof Point) {
            return new Point(Math.floor(this.x / other.x),
                Math.floor(this.y / other.y));
        }
        return new Point(Math.floor(this.x / other),
            Math.floor(this.y / other));
    },

    // Point polar coordinates:

    r: function () {
        var t = (this.multiplyBy(this));
        return Math.sqrt(t.x + t.y);
    },

    degrees: function () {
    /*
        answer the angle I make with origin in degrees.
        Right is 0, down is 90
    */
        var tan, theta;

        if (this.x === 0) {
            if (this.y >= 0) {
                return 90;
            }
            return 270;
        }
        tan = this.y / this.x;
        theta = Math.atan(tan);
        if (this.x >= 0) {
            if (this.y >= 0) {
                return degrees(theta);
            }
            return 360 + (degrees(theta));
        }
        return 180 + degrees(theta);
    },

    theta: function () {
    /*
        answer the angle I make with origin in radians.
        Right is 0, down is 90
    */
        var tan, theta;

        if (this.x === 0) {
            if (this.y >= 0) {
                return radians(90);
            }
            return radians(270);
        }
        tan = this.y / this.x;
        theta = Math.atan(tan);
        if (this.x >= 0) {
            if (this.y >= 0) {
                return theta;
            }
            return radians(360) + theta;
        }
        return radians(180) + theta;
    },

    // Point functions:

    crossProduct: function (aPoint) {
        return this.multiplyBy(aPoint.mirror());
    },

    distanceTo: function (aPoint) {
        return (aPoint.subtract(this)).r();
    },

    rotate: function (direction, center) {
        // direction must be 'right', 'left' or 'pi'
        var offset = this.subtract(center);
        if (direction === 'right') {
            return new Point(-offset.y, offset.y).add(center);
        }
        if (direction === 'left') {
            return new Point(offset.y, -offset.y).add(center);
        }
        // direction === 'pi'
        return center.subtract(offset);
    },

    flip: function (direction, center) {
        // direction must be 'vertical' or 'horizontal'
        if (direction === 'vertical') {
            return new Point(this.x, center.y * 2 - this.y);
        }
        // direction === 'horizontal'
        return new Point(center.x * 2 - this.x, this.y);
    },

    distanceAngle: function (dist, angle) {
        var deg = angle, x, y;
        if (deg > 270) {
            deg = deg - 360;
        } else if (deg < -270) {
            deg = deg + 360;
        }
        if (-90 <= deg && deg <= 90) {
            x = Math.sin(radians(deg)) * dist;
            y = Math.sqrt((dist * dist) - (x * x));
            return new Point(x + this.x, this.y - y);
        }
        x = Math.sin(radians(180 - deg)) * dist;
        y = Math.sqrt((dist * dist) - (x * x));
        return new Point(x + this.x, this.y + y);
    },

    // Point transforming:

    scaleBy: function (scalePoint) {
        return this.multiplyBy(scalePoint);
    },

    translateBy: function (deltaPoint) {
        return this.add(deltaPoint);
    },

    rotateBy: function (angle, centerPoint) {
        var center = centerPoint || new Point(0, 0),
            p = this.subtract(center),
            r = p.r(),
            theta = angle - p.theta();
        return new Point(
            center.x + (r * Math.cos(theta)),
            center.y - (r * Math.sin(theta))
        );
    },

    // Point conversion:

    asArray: function () {
        return [this.x, this.y];
    },

    corner: function (rectangle, cornerPoint) {
    // answer a new Rectangle
        if(rectangle.instanceOf("Rectangle")){
            rectangle.setTo(this.x, this.y, cornerPoint.x, cornerPoint.y);
            return rectangle;
        } else {
            return this;
        }
    },

    rectangle: function (rectangle, aPoint) {
        // answer a new Rectangle
        if(rectangle.instanceOf("Rectangle")){
            var org, crn;
            org = this.min(aPoint);
            crn = this.max(aPoint);
            rectangle.setTo(org.x, org.y, crn.x, crn.y);
            return rectangle;
        } else {
            return this;
        }
    },

    extent: function (rectangle, aPoint) {
        //answer a new Rectangle
        if(rectangle.instanceOf("Rectangle")){
            var crn = this.add(aPoint);
            rectangle.setTo(this.x, this.y, crn.x, crn.y);
            return rectangle;
        } else {
            return this;
        }
    }

})

Point.className = 'Point';

module.exports = Point;
},{}],23:[function(require,module,exports){
Point = require('./Point');

// Rectangles //////////////////////////////////////////////////////////

// Rectangle instance creation:

var Rectangle = Class.create({

    initialize: function(left, top, right, bottom) {
        this.init(new Point((left || 0), (top || 0)),
        new Point((right || 0), (bottom || 0)));
    },

    init: function (originPoint, cornerPoint) {
        this.origin = originPoint;
        this.corner = cornerPoint;
    },

    // Rectangle string representation: e.g. '[0@0 | 160@80]'

    toString: function () {
        return '[' + this.origin.toString() + ' | ' +
            this.extent().toString() + ']';
    },

    // Rectangle copying:

    copy: function () {
        return new Rectangle(
            this.left(),
            this.top(),
            this.right(),
            this.bottom()
        );
    },


    // Rectangle accessing - setting:

    setTo: function (left, top, right, bottom) {
        // note: all inputs are optional and can be omitted

        this.origin = new Point(
            left || ((left === 0) ? 0 : this.left()),
            top || ((top === 0) ? 0 : this.top())
        );

        this.corner = new Point(
            right || ((right === 0) ? 0 : this.right()),
            bottom || ((bottom === 0) ? 0 : this.bottom())
        );
    },

    // Rectangle accessing - getting:

    area: function () {
        //requires width() and height() to be defined
        var w = this.width();
        if (w < 0) {
            return 0;
        }
        return Math.max(w * this.height(), 0);
    },

    bottom: function () {
        return this.corner.y;
    },

    bottomCenter: function () {
        return new Point(this.center().x, this.bottom());
    },

    bottomLeft: function () {
        return new Point(this.origin.x, this.corner.y);
    },

    bottomRight: function () {
        return this.corner.copy();
    },

    boundingBox: function () {
        return this;
    },

    center: function () {
        return this.origin.add(
            this.corner.subtract(this.origin).floorDivideBy(2)
        );
    },

    corners: function () {
        return [this.origin,
            this.bottomLeft(),
            this.corner,
            this.topRight()];
    },

    extent: function () {
        return this.corner.subtract(this.origin);
    },

    height: function () {
        return this.corner.y - this.origin.y;
    },

    left: function () {
        return this.origin.x;
    },

    leftCenter: function () {
        return new Point(this.left(), this.center().y);
    },

    right: function () {
        return this.corner.x;
    },

    rightCenter: function () {
        return new Point(this.right(), this.center().y);
    },

    top: function () {
        return this.origin.y;
    },

    topCenter: function () {
        return new Point(this.center().x, this.top());
    },

    topLeft: function () {
        return this.origin;
    },

    topRight: function () {
        return new Point(this.corner.x, this.origin.y);
    },

    width: function () {
        return this.corner.x - this.origin.x;
    },

    position: function () {
        return this.origin;
    },

    // Rectangle comparison:

    eq: function (aRect) {
        return this.origin.eq(aRect.origin) &&
            this.corner.eq(aRect.corner);
    },

    abs: function () {
        var newOrigin, newCorner, rect;
        rect = new Rectangle(0,0,0,0);
        newOrigin = this.origin.abs();
        newCorner = this.corner.max(newOrigin);
        return newOrigin.corner(rect, newCorner);
    },

    // Rectangle functions:

    insetBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.add(delta);
        result.corner = this.corner.subtract(delta);
        return result;
    },

    expandBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.subtract(delta);
        result.corner = this.corner.add(delta);
        return result;
    },

    growBy: function (delta) {
        // delta can be either a Point or a Number
        var result = new Rectangle();
        result.origin = this.origin.copy();
        result.corner = this.corner.add(delta);
        return result;
    },

    intersect: function (aRect) {
        var result = new Rectangle();
        result.origin = this.origin.max(aRect.origin);
        result.corner = this.corner.min(aRect.corner);
        return result;
    },

    merge: function (aRect) {
        var result = new Rectangle();
        result.origin = this.origin.min(aRect.origin);
        result.corner = this.corner.max(aRect.corner);
        return result;
    },

    mergeWith: function (aRect) {
        // mutates myself
        this.origin = this.origin.min(aRect.origin);
        this.corner = this.corner.max(aRect.corner);
    },

    round: function () {
        rect = new Rectangle(0,0,0,0);
        return this.origin.round().corner(rect, this.corner.round());
    },

    spread: function () {
        // round me by applying floor() to my origin and ceil() to my corner
        rect = new Rectangle(0,0,0,0);
        return this.origin.floor().corner(rect, this.corner.ceil());
    },

    amountToTranslateWithin: function (aRect) {
    /*
        Answer a Point, delta, such that self + delta is forced within
        aRectangle. when all of me cannot be made to fit, prefer to keep
        my topLeft inside. Taken from Squeak.
    */
        var dx = 0, dy = 0;

        if (this.right() > aRect.right()) {
            dx = aRect.right() - this.right();
        }
        if (this.bottom() > aRect.bottom()) {
            dy = aRect.bottom() - this.bottom();
        }
        if ((this.left() + dx) < aRect.left()) {
            dx = aRect.left() - this.left();
        }
        if ((this.top() + dy) < aRect.top()) {
            dy = aRect.top() - this.top();
        }
        return new Point(dx, dy);
    },

    // Rectangle testing:

    containsPoint: function (aPoint) {
        return this.origin.le(aPoint) && aPoint.lt(this.corner);
    },

    containsRectangle: function (aRect) {
        return aRect.origin.gt(this.origin) &&
            aRect.corner.lt(this.corner);
    },

    intersects: function (aRect) {
        var ro = aRect.origin, rc = aRect.corner;
        return (rc.x >= this.origin.x) &&
            (rc.y >= this.origin.y) &&
            (ro.x <= this.corner.x) &&
            (ro.y <= this.corner.y);
    },

    isNearTo: function (aRect, threshold) {
        var ro = aRect.origin, rc = aRect.corner, border = threshold || 0;
        return (rc.x + border >= this.origin.x) &&
            (rc.y  + border >= this.origin.y) &&
            (ro.x - border <= this.corner.x) &&
            (ro.y - border <= this.corner.y);
    },

    // Rectangle transforming:

    scaleBy: function (scale) {
        // scale can be either a Point or a scalar
        var o = this.origin.multiplyBy(scale),
            c = this.corner.multiplyBy(scale);
        return new Rectangle(o.x, o.y, c.x, c.y);
    },

    translateBy: function (factor) {
        // factor can be either a Point or a scalar
        var o = this.origin.add(factor),
            c = this.corner.add(factor);
        return new Rectangle(o.x, o.y, c.x, c.y);
    },

    // Rectangle converting:

    asArray: function () {
        return [this.left(), this.top(), this.right(), this.bottom()];
    },

    asArray_xywh: function () {
        return [this.left(), this.top(), this.width(), this.height()];
    }



})

Rectangle.className = 'Rectangle';

module.exports = Rectangle;
},{"./Point":22}],24:[function(require,module,exports){
var FrameMorph = require('./FrameMorph');
var SliderMorph = require('./SliderMorph');
var Point = require('./Point');

var ScrollFrameMorph = Class.create(FrameMorph, {

	// ScrollFrameMorph ////////////////////////////////////////////////////
	
	initialize: function(scroller, size, sliderColor) {
	    this.init(scroller, size, sliderColor);
	},

	init: function ($super, scroller, size, sliderColor) {
	    var myself = this;

	    $super();
	    this.scrollBarSize = size || MorphicPreferences.scrollBarSize;
	    this.autoScrollTrigger = null;
	    this.isScrollingByDragging = true;    // change if desired
	    this.hasVelocity = true; // dto.
	    this.padding = 0; // around the scrollable area
	    this.growth = 0; // pixels or Point to grow right/left when near edge
	    this.isTextLineWrapping = false;
	    this.contents = scroller || new FrameMorph(this);
	    this.add(this.contents);
	    this.hBar = new SliderMorph(
	        null, // start
	        null, // stop
	        null, // value
	        null, // size
	        'horizontal',
	        sliderColor
	    );
	    this.hBar.setHeight(this.scrollBarSize);
	    this.hBar.action = function (num) {
	        myself.contents.setPosition(
	            new Point(
	                myself.left() - num,
	                myself.contents.position().y
	            )
	        );
	    };
	    this.hBar.isDraggable = false;
	    this.add(this.hBar);
	    this.vBar = new SliderMorph(
	        null, // start
	        null, // stop
	        null, // value
	        null, // size
	        'vertical',
	        sliderColor
	    );
	    this.vBar.setWidth(this.scrollBarSize);
	    this.vBar.action = function (num) {
	        myself.contents.setPosition(
	            new Point(
	                myself.contents.position().x,
	                myself.top() - num
	            )
	        );
	    };
	    this.vBar.isDraggable = false;
	    this.add(this.vBar);
	},

	adjustScrollBars: function () {
	    var hWidth = this.width() - this.scrollBarSize,
	        vHeight = this.height() - this.scrollBarSize;

	    this.changed();
	    if (this.contents.width() > this.width() +
	            MorphicPreferences.scrollBarSize) {
	        this.hBar.show();
	        if (this.hBar.width() !== hWidth) {
	            this.hBar.setWidth(hWidth);
	        }

	        this.hBar.setPosition(
	            new Point(
	                this.left(),
	                this.bottom() - this.hBar.height()
	            )
	        );
	        this.hBar.start = 0;
	        this.hBar.stop = this.contents.width() - this.width();
	        this.hBar.size =
	            this.width() / this.contents.width() * this.hBar.stop;
	        this.hBar.value = this.left() - this.contents.left();
	        this.hBar.drawNew();
	    } else {
	        this.hBar.hide();
	    }

	    if (this.contents.height() > this.height() +
	            this.scrollBarSize) {
	        this.vBar.show();
	        if (this.vBar.height() !== vHeight) {
	            this.vBar.setHeight(vHeight);
	        }

	        this.vBar.setPosition(
	            new Point(
	                this.right() - this.vBar.width(),
	                this.top()
	            )
	        );
	        this.vBar.start = 0;
	        this.vBar.stop = this.contents.height() - this.height();
	        this.vBar.size =
	            this.height() / this.contents.height() * this.vBar.stop;
	        this.vBar.value = this.top() - this.contents.top();
	        this.vBar.drawNew();
	    } else {
	        this.vBar.hide();
	    }
	},

	addContents: function (aMorph) {
	    this.contents.add(aMorph);
	    this.contents.adjustBounds();
	},

	setContents: function (aMorph) {
	    this.contents.children.forEach(function (m) {
	        m.destroy();
	    });
	    this.contents.children = [];
	    aMorph.setPosition(this.position().add(this.padding + 2));
	    this.addContents(aMorph);
	},

	setExtent: function ($super, aPoint) {
	    if (this.isTextLineWrapping) {
	        this.contents.setPosition(this.position().copy());
	    }
	    $super(aPoint);
	    this.contents.adjustBounds();
	},

	// ScrollFrameMorph scrolling by dragging:

	scrollX: function (steps) {
	    var cl = this.contents.left(),
	        l = this.left(),
	        cw = this.contents.width(),
	        r = this.right(),
	        newX;

	    newX = cl + steps;
	    if (newX + cw < r) {
	        newX = r - cw;
	    }
	    if (newX > l) {
	        newX = l;
	    }
	    if (newX !== cl) {
	        this.contents.setLeft(newX);
	    }
	},

	scrollY: function (steps) {
	    var ct = this.contents.top(),
	        t = this.top(),
	        ch = this.contents.height(),
	        b = this.bottom(),
	        newY;

	    newY = ct + steps;
	    if (newY + ch < b) {
	        newY = b - ch;
	    }
	    if (newY > t) {
	        newY = t;
	    }
	    if (newY !== ct) {
	        this.contents.setTop(newY);
	    }
	},

	step: function () {
	    nop();
	},

	mouseDownLeft: function (pos) {
	    if (!this.isScrollingByDragging) {
	        return null;
	    }
	    var world = this.root(),
	        oldPos = pos,
	        myself = this,
	        deltaX = 0,
	        deltaY = 0,
	        friction = 0.8;

	    this.step = function () {
	        var newPos;
	        if (world.hand.mouseButton &&
	                (world.hand.children.length === 0) &&
	                (myself.bounds.containsPoint(world.hand.position()))) {
	            newPos = world.hand.bounds.origin;
	            deltaX = newPos.x - oldPos.x;
	            if (deltaX !== 0) {
	                myself.scrollX(deltaX);
	            }
	            deltaY = newPos.y - oldPos.y;
	            if (deltaY !== 0) {
	                myself.scrollY(deltaY);
	            }
	            oldPos = newPos;
	        } else {
	            if (!myself.hasVelocity) {
	                myself.step = function () {
	                    nop();
	                };
	            } else {
	                if ((Math.abs(deltaX) < 0.5) &&
	                        (Math.abs(deltaY) < 0.5)) {
	                    myself.step = function () {
	                        nop();
	                    };
	                } else {
	                    deltaX = deltaX * friction;
	                    myself.scrollX(Math.round(deltaX));
	                    deltaY = deltaY * friction;
	                    myself.scrollY(Math.round(deltaY));
	                }
	            }
	        }
	        this.adjustScrollBars();
	    };
	},

	startAutoScrolling: function () {
	    var myself = this,
	        inset = MorphicPreferences.scrollBarSize * 3,
	        world = this.world(),
	        hand,
	        inner,
	        pos;

	    if (!world) {
	        return null;
	    }
	    hand = world.hand;
	    if (!this.autoScrollTrigger) {
	        this.autoScrollTrigger = Date.now();
	    }
	    this.step = function () {
	        pos = hand.bounds.origin;
	        inner = myself.bounds.insetBy(inset);
	        if ((myself.bounds.containsPoint(pos)) &&
	                (!(inner.containsPoint(pos))) &&
	                (hand.children.length > 0)) {
	            myself.autoScroll(pos);
	        } else {
	            myself.step = function () {
	                nop();
	            };
	            myself.autoScrollTrigger = null;
	        }
	    };
	},

	autoScroll: function (pos) {
	    var inset, area, rect;

	    if (Date.now() - this.autoScrollTrigger < 500) {
	        return null;
	    }

	    inset = MorphicPreferences.scrollBarSize * 3;
	    rect = new Rectangle(0, 0, 0, 0);
	    // may need to create independent rect
	    area = this.topLeft().extent(rect, new Point(this.width(), inset));
	    if (area.containsPoint(pos)) {
	        this.scrollY(inset - (pos.y - this.top()));
	    }
	    area = this.topLeft().extent(rect, new Point(inset, this.height()));
	    if (area.containsPoint(pos)) {
	        this.scrollX(inset - (pos.x - this.left()));
	    }
	    area = (new Point(this.right() - inset, this.top()))
	        .extent(rect, new Point(inset, this.height()));
	    if (area.containsPoint(pos)) {
	        this.scrollX(-(inset - (this.right() - pos.x)));
	    }
	    area = (new Point(this.left(), this.bottom() - inset))
	        .extent(rect, new Point(this.width(), inset));
	    if (area.containsPoint(pos)) {
	        this.scrollY(-(inset - (this.bottom() - pos.y)));
	    }
	    this.adjustScrollBars();
	},

	// ScrollFrameMorph scrolling by editing text:

	scrollCursorIntoView: function (morph) {
	    var txt = morph.target,
	        offset = txt.position().subtract(this.contents.position()),
	        ft = this.top() + this.padding,
	        fb = this.bottom() - this.padding;
	    this.contents.setExtent(txt.extent().add(offset).add(this.padding));
	    if (morph.top() < ft) {
	        this.contents.setTop(this.contents.top() + ft - morph.top());
	        morph.setTop(ft);
	    } else if (morph.bottom() > fb) {
	        this.contents.setBottom(this.contents.bottom() + fb - morph.bottom());
	        morph.setBottom(fb);
	    }
	    this.adjustScrollBars();
	},

	// ScrollFrameMorph events:

	mouseScroll: function (y, x) {
	    if (y) {
	        this.scrollY(y * MorphicPreferences.mouseScrollAmount);
	    }
	    if (x) {
	        this.scrollX(x * MorphicPreferences.mouseScrollAmount);
	    }
	    this.adjustScrollBars();
	},

	// ScrollFrameMorph duplicating:

	copyRecordingReferences: function ($super, dict) {
	    // inherited, see comment in Morph
	    var c = $super(dict);
	    if (c.contents && dict[this.contents]) {
	        c.contents = (dict[this.contents]);
	    }
	    if (c.hBar && dict[this.hBar]) {
	        c.hBar = (dict[this.hBar]);
	        c.hBar.action = function (num) {
	            c.contents.setPosition(
	                new Point(c.left() - num, c.contents.position().y)
	            );
	        };
	    }
	    if (c.vBar && dict[this.vBar]) {
	        c.vBar = (dict[this.vBar]);
	        c.vBar.action = function (num) {
	            c.contents.setPosition(
	                new Point(c.contents.position().x, c.top() - num)
	            );
	        };
	    }
	    return c;
	},

	// ScrollFrameMorph menu:

	developersMenu: function ($super) {
	    var menu = $super();
	    if (this.isTextLineWrapping) {
	        menu.addItem(
	            "auto line wrap off...",
	            'toggleTextLineWrapping',
	            'turn automatic\nline wrapping\noff'
	        );
	    } else {
	        menu.addItem(
	            "auto line wrap on...",
	            'toggleTextLineWrapping',
	            'enable automatic\nline wrapping'
	        );
	    }
	    return menu;
	},


	toggleTextLineWrapping: function () {
	    this.isTextLineWrapping = !this.isTextLineWrapping;
	
	},


})

ScrollFrameMorph.uber = FrameMorph.prototype;
ScrollFrameMorph.className = 'ScrollFrameMorph';

module.exports = ScrollFrameMorph;



	
},{"./FrameMorph":10,"./Point":22,"./SliderMorph":27}],25:[function(require,module,exports){
var Morph = require('./Morph');

var ShadowMorph = Class.create(Morph, {
	
	initialize: function(){
		this.init();
	}

})

ShadowMorph.uber = Morph.prototype;
ShadowMorph.className = 'ShadowMorph';

module.exports = ShadowMorph;

},{"./Morph":18}],26:[function(require,module,exports){
var CircleBoxMorph = require('./CircleBoxMorph');
var Color = require('./Color');

var SliderButtonMorph = Class.create(CircleBoxMorph, {

	// SliderButtonMorph ///////////////////////////////////////////////////
	
	initialize: function(orientation){
		this.init(orientation);
	},


	init: function ($super, orientation) {
	    this.color = new Color(80, 80, 80);
	    this.highlightColor = new Color(90, 90, 140);
	    this.pressColor = new Color(80, 80, 160);
	    this.is3D = false;
	    this.hasMiddleDip = true;
	    $super(orientation);
	},

	autoOrientation: function () {
	    nop();
	},

	drawNew: function ($super) {
	    var colorBak = this.color.copy();

	    $super();
	    if (this.is3D || !MorphicPreferences.isFlat) {
	        this.drawEdges();
	    }
	    this.normalImage = this.image;

	    this.color = this.highlightColor.copy();
	    $super();
	    if (this.is3D || !MorphicPreferences.isFlat) {
	        this.drawEdges();
	    }
	    this.highlightImage = this.image;

	    this.color = this.pressColor.copy();
	    $super();
	    if (this.is3D || !MorphicPreferences.isFlat) {
	        this.drawEdges();
	    }
	    this.pressImage = this.image;

	    this.color = colorBak;
	    this.image = this.normalImage;

	},

	drawEdges: function () {
	    var context = this.image.getContext('2d'),
	        gradient,
	        radius,
	        w = this.width(),
	        h = this.height();

	    context.lineJoin = 'round';
	    context.lineCap = 'round';

	    if (this.orientation === 'vertical') {
	        context.lineWidth = w / 3;
	        gradient = context.createLinearGradient(
	            0,
	            0,
	            context.lineWidth,
	            0
	        );
	        gradient.addColorStop(0, 'white');
	        gradient.addColorStop(1, this.color.toString());

	        context.strokeStyle = gradient;
	        context.beginPath();
	        context.moveTo(context.lineWidth * 0.5, w / 2);
	        context.lineTo(context.lineWidth * 0.5, h - w / 2);
	        context.stroke();

	        gradient = context.createLinearGradient(
	            w - context.lineWidth,
	            0,
	            w,
	            0
	        );
	        gradient.addColorStop(0, this.color.toString());
	        gradient.addColorStop(1, 'black');

	        context.strokeStyle = gradient;
	        context.beginPath();
	        context.moveTo(w - context.lineWidth * 0.5, w / 2);
	        context.lineTo(w - context.lineWidth * 0.5, h - w / 2);
	        context.stroke();

	        if (this.hasMiddleDip) {
	            gradient = context.createLinearGradient(
	                context.lineWidth,
	                0,
	                w - context.lineWidth,
	                0
	            );

	            radius = w / 4;
	            gradient.addColorStop(0, 'black');
	            gradient.addColorStop(0.35, this.color.toString());
	            gradient.addColorStop(0.65, this.color.toString());
	            gradient.addColorStop(1, 'white');

	            context.fillStyle = gradient;
	            context.beginPath();
	            context.arc(
	                w / 2,
	                h / 2,
	                radius,
	                radians(0),
	                radians(360),
	                false
	            );
	            context.closePath();
	            context.fill();
	        }
	    } else if (this.orientation === 'horizontal') {
	        context.lineWidth = h / 3;
	        gradient = context.createLinearGradient(
	            0,
	            0,
	            0,
	            context.lineWidth
	        );
	        gradient.addColorStop(0, 'white');
	        gradient.addColorStop(1, this.color.toString());

	        context.strokeStyle = gradient;
	        context.beginPath();
	        context.moveTo(h / 2, context.lineWidth * 0.5);
	        context.lineTo(w - h / 2, context.lineWidth * 0.5);
	        context.stroke();

	        gradient = context.createLinearGradient(
	            0,
	            h - context.lineWidth,
	            0,
	            h
	        );
	        gradient.addColorStop(0, this.color.toString());
	        gradient.addColorStop(1, 'black');

	        context.strokeStyle = gradient;
	        context.beginPath();
	        context.moveTo(h / 2, h - context.lineWidth * 0.5);
	        context.lineTo(w - h / 2, h - context.lineWidth * 0.5);
	        context.stroke();

	        if (this.hasMiddleDip) {
	            gradient = context.createLinearGradient(
	                0,
	                context.lineWidth,
	                0,
	                h - context.lineWidth
	            );

	            radius = h / 4;
	            gradient.addColorStop(0, 'black');
	            gradient.addColorStop(0.35, this.color.toString());
	            gradient.addColorStop(0.65, this.color.toString());
	            gradient.addColorStop(1, 'white');

	            context.fillStyle = gradient;
	            context.beginPath();
	            context.arc(
	                this.width() / 2,
	                this.height() / 2,
	                radius,
	                radians(0),
	                radians(360),
	                false
	            );
	            context.closePath();
	            context.fill();
	        }
	    }
	},

	//SliderButtonMorph events:

	mouseEnter: function () {
	    this.image = this.highlightImage;
	    this.changed();
	},

	mouseLeave: function () {
	    this.image = this.normalImage;
	    this.changed();
	},

	mouseDownLeft: function (pos) {
	    this.image = this.pressImage;
	    this.changed();
	    this.escalateEvent('mouseDownLeft', pos);
	},

	mouseClickLeft: function () {
	    this.image = this.highlightImage;
	    this.changed();
	},

	mouseMove: function () {
	    // prevent my parent from getting picked up
	    nop();
	},

})

SliderButtonMorph.uber = CircleBoxMorph.prototype;
SliderButtonMorph.className = 'SliderButtonMorph';

module.exports = SliderButtonMorph;


},{"./CircleBoxMorph":4,"./Color":6}],27:[function(require,module,exports){
var CircleBoxMorph = require('./CircleBoxMorph');
var Color = require('./Color');
var SliderButtonMorph = require('./SliderButtonMorph');
var Point = require('./Point');

var SliderMorph = Class.create(CircleBoxMorph, {

	// SliderMorph ///////////////////////////////////////////////////
	
	initialize: function($super, start, stop, value, size, orientation, color) {
	    this.init(
	        start || 1,
	        stop || 100,
	        value || 50,
	        size || 10,
	        orientation || 'vertical',
	        color
	    );
	},

	init: function (
		$super,
	    start,
	    stop,
	    value,
	    size,
	    orientation,
	    color
	) {
	    this.target = null;
	    this.action = null;
	    this.start = start;
	    this.stop = stop;
	    this.value = value;
	    this.size = size;
	    this.offset = null;
	    this.button = new SliderButtonMorph();
	    this.button.isDraggable = false;
	    this.button.color = new Color(200, 200, 200);
	    this.button.highlightColor = new Color(210, 210, 255);
	    this.button.pressColor = new Color(180, 180, 255);
	    $super(orientation);
	    this.add(this.button);
	    this.alpha = 0.3;
	    this.color = color || new Color(0, 0, 0);
	    this.setExtent(new Point(20, 100));
	    // this.drawNew();
	},

	autoOrientation: function () {
	    nop();
	},

	rangeSize: function () {
	    return this.stop - this.start;
	},

	ratio: function () {
	    return this.size / this.rangeSize();
	},

	unitSize: function () {
	    if (this.orientation === 'vertical') {
	        return (this.height() - this.button.height()) /
	            this.rangeSize();
	    }
	    return (this.width() - this.button.width()) /
	        this.rangeSize();
	},

	drawNew: function ($super) {
	    var bw, bh, posX, posY;

	    $super();
	    this.button.orientation = this.orientation;
	    if (this.orientation === 'vertical') {
	        bw  = this.width() - 2;
	        bh = Math.max(bw, Math.round(this.height() * this.ratio()));
	        this.button.silentSetExtent(new Point(bw, bh));
	        posX = 1;
	        posY = Math.min(
	            Math.round((this.value - this.start) * this.unitSize()),
	            this.height() - this.button.height()
	        );
	    } else {
	        bh = this.height() - 2;
	        bw  = Math.max(bh, Math.round(this.width() * this.ratio()));
	        this.button.silentSetExtent(new Point(bw, bh));
	        posY = 1;
	        posX = Math.min(
	            Math.round((this.value - this.start) * this.unitSize()),
	            this.width() - this.button.width()
	        );
	    }
	    this.button.setPosition(
	        new Point(posX, posY).add(this.bounds.origin)
	    );
	    this.button.drawNew();
	    this.button.changed();
	},

	updateValue: function () {
	    var relPos;
	    if (this.orientation === 'vertical') {
	        relPos = this.button.top() - this.top();
	    } else {
	        relPos = this.button.left() - this.left();
	    }
	    this.value = Math.round(relPos / this.unitSize() + this.start);
	    this.updateTarget();
	},

	updateTarget: function () {
	    if (this.action) {
	        if (typeof this.action === 'function') {
	            this.action.call(this.target, this.value);
	        } else { // assume it's a String
	            this.target[this.action](this.value);
	        }
	    }
	},

	// SliderMorph duplicating:

	copyRecordingReferences: function ($super, dict) {
	    // inherited, see comment in Morph
	    var c = $super(dict);
	    if (c.target && dict[this.target]) {
	        c.target = (dict[this.target]);
	    }
	    if (c.button && dict[this.button]) {
	        c.button = (dict[this.button]);
	    }
	    return c;
	},

	// SliderMorph menu:

	developersMenu: function ($super) {
	    var menu = $super();
	    menu.addItem(
	        "show value...",
	        'showValue',
	        'display a dialog box\nshowing the selected number'
	    );
	    menu.addItem(
	        "floor...",
	        function () {
	            this.prompt(
	                menu.title + '\nfloor:',
	                this.setStart,
	                this,
	                this.start.toString(),
	                null,
	                0,
	                this.stop - this.size,
	                true
	            );
	        },
	        'set the minimum value\nwhich can be selected'
	    );
	    menu.addItem(
	        "ceiling...",
	        function () {
	            this.prompt(
	                menu.title + '\nceiling:',
	                this.setStop,
	                this,
	                this.stop.toString(),
	                null,
	                this.start + this.size,
	                this.size * 100,
	                true
	            );
	        },
	        'set the maximum value\nwhich can be selected'
	    );
	    menu.addItem(
	        "button size...",
	        function () {
	            this.prompt(
	                menu.title + '\nbutton size:',
	                this.setSize,
	                this,
	                this.size.toString(),
	                null,
	                1,
	                this.stop - this.start,
	                true
	            );
	        },
	        'set the range\ncovered by\nthe slider button'
	    );
	    menu.addLine();
	    menu.addItem(
	        'set target',
	        "setTarget",
	        'select another morph\nwhose numerical property\nwill be ' +
	            'controlled by this one'
	    );
	    return menu;
	},

	showValue: function () {
	    this.inform(this.value);
	},

	userSetStart: function (num) {
	    // for context menu demo purposes
	    this.start = Math.max(num, this.stop);
	},

	setStart: function (num) {
	    // for context menu demo purposes
	    var newStart;
	    if (typeof num === 'number') {
	        this.start = Math.min(
	            num,
	            this.stop - this.size
	        );
	    } else {
	        newStart = parseFloat(num);
	        if (!isNaN(newStart)) {
	            this.start = Math.min(
	                newStart,
	                this.stop - this.size
	            );
	        }
	    }
	    this.value = Math.max(this.value, this.start);
	    this.updateTarget();
	    this.drawNew();
	    this.changed();
	},

	setStop: function (num) {
	    // for context menu demo purposes
	    var newStop;
	    if (typeof num === 'number') {
	        this.stop = Math.max(num, this.start + this.size);
	    } else {
	        newStop = parseFloat(num);
	        if (!isNaN(newStop)) {
	            this.stop = Math.max(newStop, this.start + this.size);
	        }
	    }
	    this.value = Math.min(this.value, this.stop);
	    this.updateTarget();
	    this.drawNew();
	    this.changed();
	},

	setSize: function (num) {
	    // for context menu demo purposes
	    var newSize;
	    if (typeof num === 'number') {
	        this.size = Math.min(
	            Math.max(num, 1),
	            this.stop - this.start
	        );
	    } else {
	        newSize = parseFloat(num);
	        if (!isNaN(newSize)) {
	            this.size = Math.min(
	                Math.max(newSize, 1),
	                this.stop - this.start
	            );
	        }
	    }
	    this.value = Math.min(this.value, this.stop - this.size);
	    this.updateTarget();
	    this.drawNew();
	    this.changed();
	},

	setTarget: function (targetMenu, propertyMenu) {
	    var choices = this.overlappedMorphs(),
	        // menu = new MenuMorph(this, 'choose target:'),
	        myself = this;

	    choices.push(this.world());
	    choices.forEach(function (each) {
	        targetMenu.addItem(each.toString().slice(0, 50), function () {
	            myself.target = each;
	            myself.setTargetSetter();
	        });
	    });
	    if (choices.length === 1) {
	        this.target = choices[0];
	        this.setTargetSetter(propertyMenu);
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

	setTargetSetter: function (menu) {
	    var choices = this.target.numericalSetters(),
	        // menu = new MenuMorph(this, 'choose target property:'),
	        myself = this;

	    choices.forEach(function (each) {
	        menu.addItem(each, function () {
	            myself.action = each;
	        });
	    });
	    if (choices.length === 1) {
	        this.action = choices[0];
	    } else if (choices.length > 0) {
	        menu.popUpAtHand(this.world());
	    }
	},

	numericalSetters: function ($super) {
	    // for context menu demo purposes
	    var list = $super();
	    list.push('setStart', 'setStop', 'setSize');
	    return list;
	},

	// SliderMorph stepping:

	step: null,

	mouseDownLeft: function (pos) {
	    var world, myself = this;

	    if (!this.button.bounds.containsPoint(pos)) {
	        this.offset = new Point(); // return null;
	    } else {
	        this.offset = pos.subtract(this.button.bounds.origin);
	    }
	    world = this.root();
	    this.step = function () {
	        var mousePos, newX, newY;
	        if (world.hand.mouseButton) {
	            mousePos = world.hand.bounds.origin;
	            if (myself.orientation === 'vertical') {
	                newX = myself.button.bounds.origin.x;
	                newY = Math.max(
	                    Math.min(
	                        mousePos.y - myself.offset.y,
	                        myself.bottom() - myself.button.height()
	                    ),
	                    myself.top()
	                );
	            } else {
	                newY = myself.button.bounds.origin.y;
	                newX = Math.max(
	                    Math.min(
	                        mousePos.x - myself.offset.x,
	                        myself.right() - myself.button.width()
	                    ),
	                    myself.left()
	                );
	            }
	            myself.button.setPosition(new Point(newX, newY));
	            myself.updateValue();
	        } else {
	            this.step = null;
	        }
	    };
	},



})

SliderMorph.uber = CircleBoxMorph.prototype;
SliderMorph.className = 'SliderMorph';

module.exports = SliderMorph;

},{"./CircleBoxMorph":4,"./Color":6,"./Point":22,"./SliderButtonMorph":26}],28:[function(require,module,exports){
var BoxMorph = require('./BoxMorph');
var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');
var TextMorph = require('./TextMorph')

var SpeechBubbleMorph = Class.create(BoxMorph, {
    // SpeechBubbleMorph ///////////////////////////////////////////////////

    /*
        I am a comic-style speech bubble that can display either a string,
        a Morph, a Canvas or a toString() representation of anything else.
        If I am invoked using popUp() I behave like a tool tip.
    */

    initialize: function(
        contents,
        color,
        edge,
        border,
        borderColor,
        padding,
        isThought
    ) {
        this.init(contents, color, edge, border, borderColor, padding, isThought);
    },

    init: function (
        $super, 
        contents,
        color,
        edge,
        border,
        borderColor,
        padding,
        isThought
    ) {
        this.isPointingRight = true; // orientation of text
        this.contents = contents || '';
        this.padding = padding || 0; // additional vertical pixels
        this.isThought = isThought || false; // draw "think" bubble
        this.isClickable = false;
        $super(
            this,
            edge || 6,
            border || ((border === 0) ? 0 : 1),
            borderColor || new Color(140, 140, 140)
        );
        this.color = color || new Color(230, 230, 230);
        this.drawNew();
    },

    // SpeechBubbleMorph invoking:

    popUp: function (world, pos, isClickable) {
        this.drawNew();
        this.setPosition(pos.subtract(new Point(0, this.height())));
        this.addShadow(new Point(2, 2), 80);
        this.keepWithin(world);
        world.add(this);
        this.fullChanged();
        world.hand.destroyTemporaries();
        world.hand.temporaries.push(this);

        if (!isClickable) {
            this.mouseEnter = function () {
                this.destroy();
            };
        } else {
            this.isClickable = true;
        }
    },

    // SpeechBubbleMorph drawing:

    drawNew: function ($super) {
        // re-build my contents
        if (this.contentsMorph) {
            this.contentsMorph.destroy();
        }
        if (this.contents instanceof Morph) {
            this.contentsMorph = this.contents;
        } else if (isString(this.contents)) {
            this.contentsMorph = new TextMorph(
                this.contents,
                MorphicPreferences.bubbleHelpFontSize,
                null,
                false,
                true,
                'center'
            );
        } else if (this.contents instanceof HTMLCanvasElement) {
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(this.contents.width);
            this.contentsMorph.silentSetHeight(this.contents.height);
            this.contentsMorph.image = this.contents;
        } else {
            this.contentsMorph = new TextMorph(
                this.contents.toString(),
                MorphicPreferences.bubbleHelpFontSize,
                null,
                false,
                true,
                'center'
            );
        }
        this.add(this.contentsMorph);

        // adjust my layout
        this.silentSetWidth(this.contentsMorph.width() +
            (this.padding ? this.padding * 2 : this.edge * 2));
        this.silentSetHeight(this.contentsMorph.height() +
            this.edge +
            this.border * 2 +
            this.padding * 2 +
            2);

        // draw my outline
        $super();

        // position my contents
        this.contentsMorph.setPosition(this.position().add(
            new Point(
                this.padding || this.edge,
                this.border + this.padding + 1
            )
        ));
    },

    outlinePath: function (
        context,
        radius,
        inset
    ) {
        var offset = radius + inset,
            w = this.width(),
            h = this.height(),
            rad;

        function circle(x, y, r) {
            context.moveTo(x + r, y);
            context.arc(x, y, r, radians(0), radians(360));
        }

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
            h - offset - radius,
            radius,
            radians(0),
            radians(90),
            false
        );
        if (!this.isThought) { // draw speech bubble hook
            if (this.isPointingRight) {
                context.lineTo(
                    offset + radius,
                    h - offset
                );
                context.lineTo(
                    radius / 2 + inset,
                    h - inset
                );
            } else { // pointing left
                context.lineTo(
                    w - (radius / 2 + inset),
                    h - inset
                );
                context.lineTo(
                    w - (offset + radius),
                    h - offset
                );
            }
        }
        // bottom left:
        context.arc(
            offset,
            h - offset - radius,
            radius,
            radians(90),
            radians(180),
            false
        );
        if (this.isThought) {
            // close large bubble:
            context.lineTo(
                inset,
                offset
            );
            // draw thought bubbles:
            if (this.isPointingRight) {
                // tip bubble:
                rad = radius / 4;
                circle(rad + inset, h - rad - inset, rad);
                // middle bubble:
                rad = radius / 3.2;
                circle(rad * 2 + inset, h - rad - inset * 2, rad);
                // top bubble:
                rad = radius / 2.8;
                circle(rad * 3 + inset * 2, h - rad - inset * 4, rad);
            } else { // pointing left
                // tip bubble:
                rad = radius / 4;
                circle(w - (rad + inset), h - rad - inset, rad);
                // middle bubble:
                rad = radius / 3.2;
                circle(w - (rad * 2 + inset), h - rad - inset * 2, rad);
                // top bubble:
                rad = radius / 2.8;
                circle(w - (rad * 3 + inset * 2), h - rad - inset * 4, rad);
            }
        }
    },

    // SpeechBubbleMorph shadow

    /*
        only take the 'plain' image, so the box rounding and the
        shadow doesn't become conflicted by embedded scrolling panes
    */

    shadowImage: function (off, color) {
        // fallback for Windows Chrome-Shadow bug
        var fb, img, outline, sha, ctx,
            offset = off || new Point(7, 7),
            clr = color || new Color(0, 0, 0);
        fb = this.extent();
        img = this.image;
        outline = newCanvas(fb);
        ctx = outline.getContext('2d');
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(
            img,
            -offset.x,
            -offset.y
        );
        sha = newCanvas(fb);
        ctx = sha.getContext('2d');
        ctx.drawImage(outline, 0, 0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = clr.toString();
        ctx.fillRect(0, 0, fb.x, fb.y);
        return sha;
    },

    shadowImageBlurred: function (off, color) {
        var fb, img, sha, ctx,
            offset = off || new Point(7, 7),
            blur = this.shadowBlur,
            clr = color || new Color(0, 0, 0);
        fb = this.extent().add(blur * 2);
        img = this.image;
        sha = newCanvas(fb);
        ctx = sha.getContext('2d');
        ctx.shadowOffsetX = offset.x;
        ctx.shadowOffsetY = offset.y;
        ctx.shadowBlur = blur;
        ctx.shadowColor = clr.toString();
        ctx.drawImage(
            img,
            blur - offset.x,
            blur - offset.y
        );
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(
            img,
            blur - offset.x,
            blur - offset.y
        );
        return sha;
    },

    // SpeechBubbleMorph resizing

    fixLayout: function () {
        this.removeShadow();
        this.drawNew();
        this.addShadow(new Point(2, 2), 80);
    },


})

SpeechBubbleMorph.uber = BoxMorph.prototype;
SpeechBubbleMorph.className = 'SpeechBubbleMorph';

module.exports = SpeechBubbleMorph;




    
},{"./BoxMorph":3,"./Color":6,"./Morph":18,"./Point":22,"./TextMorph":31}],29:[function(require,module,exports){
var FrameMorph = require('./FrameMorph');
var Point = require('./Point');
var StringMorph = require('./StringMorph');

var StringFieldMorph = Class.create(FrameMorph, {
	
	initialize: function(
	    defaultContents,
	    minWidth,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric
	) {
	    this.init(
	        defaultContents || '',
	        minWidth || 100,
	        fontSize || 12,
	        fontStyle || 'sans-serif',
	        bold || false,
	        italic || false,
	        isNumeric
	    );
	},

	init: function (
		$super,
	    defaultContents,
	    minWidth,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric
	) {
	    this.defaultContents = defaultContents;
	    this.minWidth = minWidth;
	    this.fontSize = fontSize;
	    this.fontStyle = fontStyle;
	    this.isBold = bold;
	    this.isItalic = italic;
	    this.isNumeric = isNumeric || false;
	    this.text = null;
	    $super();
	    this.color = new Color(255, 255, 255);
	    this.isEditable = true;
	    this.acceptsDrops = false;
	    this.drawNew();
	},

	drawNew: function ($super) {
	    var txt;
	    txt = this.text ? this.string() : this.defaultContents;
	    this.text = null;
	    this.children.forEach(function (child) {
	        child.destroy();
	    });
	    this.children = [];
	    this.text = new StringMorph(
	        txt,
	        this.fontSize,
	        this.fontStyle,
	        this.isBold,
	        this.isItalic,
	        this.isNumeric
	    );

	    this.text.isNumeric = this.isNumeric; // for whichever reason...
	    this.text.setPosition(this.bounds.origin.copy());
	    this.text.isEditable = this.isEditable;
	    this.text.isDraggable = false;
	    this.text.enableSelecting();
	    this.silentSetExtent(
	        new Point(
	            Math.max(this.width(), this.minWidth),
	            this.text.height()
	        )
	    );
	    $super();
	    this.add(this.text);
	},

	string: function () {
	    return this.text.text;
	},

	mouseClickLeft: function (pos) {
	    if (this.isEditable) {
	        this.text.edit();
	    } else {
	        this.escalateEvent('mouseClickLeft', pos);
	    }
	},

	// StringFieldMorph duplicating:

	copyRecordingReferences: function ($super, dict) {
	    // inherited, see comment in Morph
	    var c = $super(dict);
	    if (c.text && dict[this.text]) {
	        c.text = (dict[this.text]);
	    }
	    return c;
	},


})

StringFieldMorph.uber = FrameMorph.prototype;
StringFieldMorph.className = 'StringFieldMorph';

module.exports = StringFieldMorph;

	
},{"./FrameMorph":10,"./Point":22,"./StringMorph":30}],30:[function(require,module,exports){
var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');

var StringMorph = Class.create(Morph, {

	// StringMorph /////////////////////////////////////////////////////////

	// I am a single line of text
	
	initialize: function(
	    text,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric,
	    shadowOffset,
	    shadowColor,
	    color,
	    fontName
	) {
	    this.init(
	        text,
	        fontSize,
	        fontStyle,
	        bold,
	        italic,
	        isNumeric,
	        shadowOffset,
	        shadowColor,
	        color,
	        fontName
	    );
	},


	init: function (
		$super,
	    text,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    isNumeric,
	    shadowOffset,
	    shadowColor,
	    color,
	    fontName
	) {
	    // additional properties:
	    this.text = text || ((text === '') ? '' : 'StringMorph');
	    this.fontSize = fontSize || 12;
	    this.fontName = fontName || MorphicPreferences.globalFontFamily;
	    this.fontStyle = fontStyle || 'sans-serif';
	    this.isBold = bold || false;
	    this.isItalic = italic || false;
	    this.isEditable = false;
	    this.isSelectable = true;
	    this.isNumeric = isNumeric || false;
	    this.isPassword = false;
	    this.shadowOffset = shadowOffset || new Point(0, 0);
	    this.shadowColor = shadowColor || null;
	    this.isShowingBlanks = false;
	    this.blanksColor = new Color(180, 140, 140);

	    // additional properties for text-editing:
	    this.isScrollable = true; // scrolls into view when edited
	    this.currentlySelecting = false;
	    this.startMark = 0;
	    this.endMark = 0;
	    this.markedTextColor = new Color(255, 255, 255);
	    this.markedBackgoundColor = new Color(60, 60, 120);

	    // initialize inherited properties:
	    $super();

	    // override inherited properites:
	    this.color = color || new Color(0, 0, 0);
	    this.noticesTransparentClick = true;
	    this.drawNew();
	},

	toString: function () {
	    // e.g. 'a StringMorph("Hello World")'
	    return 'a ' +
	        (this.constructor.name ||
	            this.constructor.toString().split(' ')[1].split('(')[0]) +
	        '("' + this.text.slice(0, 30) + '...")';
	},

	password: function (letter, length) {
	    var ans = '',
	        i;
	    for (i = 0; i < length; i += 1) {
	        ans += letter;
	    }
	    return ans;
	},

	font: function () {
	    // answer a font string, e.g. 'bold italic 12px sans-serif'
	    var font = '';
	    if (this.isBold) {
	        font = font + 'bold ';
	    }
	    if (this.isItalic) {
	        font = font + 'italic ';
	    }
	    return font +
	        this.fontSize + 'px ' +
	        (this.fontName ? this.fontName + ', ' : '') +
	        this.fontStyle;
	},

	drawNew: function () {
	    var context, width, start, stop, i, p, c, x, y,
	        shadowOffset = this.shadowOffset || new Point(),
	        txt = this.isPassword ?
	                this.password('*', this.text.length) : this.text;

	    // initialize my surface property
	    this.image = newCanvas();
	    context = this.image.getContext('2d');
	    context.font = this.font();

	    // set my extent
	    width = Math.max(
	        context.measureText(txt).width + Math.abs(shadowOffset.x),
	        1
	    );
	    this.bounds.corner = this.bounds.origin.add(
	        new Point(
	            width,
	            fontHeight(this.fontSize) + Math.abs(shadowOffset.y)
	        )
	    );
	    this.image.width = width;
	    this.image.height = this.height();

	    // prepare context for drawing text
	    context.font = this.font();
	    context.textAlign = 'left';
	    context.textBaseline = 'bottom';

	    // first draw the shadow, if any
	    if (this.shadowColor) {
	        x = Math.max(shadowOffset.x, 0);
	        y = Math.max(shadowOffset.y, 0);
	        context.fillStyle = this.shadowColor.toString();
	        context.fillText(txt, x, fontHeight(this.fontSize) + y);
	    }

	    // now draw the actual text
	    x = Math.abs(Math.min(shadowOffset.x, 0));
	    y = Math.abs(Math.min(shadowOffset.y, 0));
	    context.fillStyle = this.color.toString();

	    if (this.isShowingBlanks) {
	        this.renderWithBlanks(context, x, fontHeight(this.fontSize) + y);
	    } else {
	        context.fillText(txt, x, fontHeight(this.fontSize) + y);
	    }

	    // draw the selection
	    start = Math.min(this.startMark, this.endMark);
	    stop = Math.max(this.startMark, this.endMark);
	    for (i = start; i < stop; i += 1) {
	        p = this.slotPosition(i).subtract(this.position());
	        c = txt.charAt(i);
	        context.fillStyle = this.markedBackgoundColor.toString();
	        context.fillRect(p.x, p.y, context.measureText(c).width + 1 + x,
	            fontHeight(this.fontSize) + y);
	        context.fillStyle = this.markedTextColor.toString();
	        context.fillText(c, p.x + x, fontHeight(this.fontSize) + y);
	    }

	    // notify my parent of layout change
	    if (this.parent) {
	        if (this.parent.fixLayout) {
	            this.parent.fixLayout();
	        }
	    }
	},

	renderWithBlanks: function (context, startX, y) {
	    var space = context.measureText(' ').width,
	        blank = newCanvas(new Point(space, this.height())),
	        ctx = blank.getContext('2d'),
	        words = this.text.split(' '),
	        x = startX || 0,
	        isFirst = true;

	    // create the blank form
	    ctx.fillStyle = this.blanksColor.toString();
	    ctx.arc(
	        space / 2,
	        blank.height / 2,
	        space / 2,
	        radians(0),
	        radians(360)
	    );
	    ctx.fill();

	    function drawBlank() {
	        context.drawImage(blank, x, 0);
	        x += space;
	    }

	    // render my text inserting blanks
	    words.forEach(function (word) {
	        if (!isFirst) {
	            drawBlank();
	        }
	        isFirst = false;
	        if (word !== '') {
	            context.fillText(word, x, y);
	            x += context.measureText(word).width;
	        }
	    });
	},

	// StringMorph mesuring:

	slotPosition: function (slot) {
	    // answer the position point of the given index ("slot")
	    // where the cursor should be placed
	    var txt = this.isPassword ?
	                this.password('*', this.text.length) : this.text,
	        dest = Math.min(Math.max(slot, 0), txt.length),
	        context = this.image.getContext('2d'),
	        xOffset,
	        x,
	        y,
	        idx;

	    xOffset = 0;
	    for (idx = 0; idx < dest; idx += 1) {
	        xOffset += context.measureText(txt[idx]).width;
	    }
	    this.pos = dest;
	    x = this.left() + xOffset;
	    y = this.top();
	    return new Point(x, y);
	},

	slotAt: function (aPoint) {
	    // answer the slot (index) closest to the given point
	    // so the cursor can be moved accordingly
	    var txt = this.isPassword ?
	                this.password('*', this.text.length) : this.text,
	        idx = 0,
	        charX = 0,
	        context = this.image.getContext('2d');

	    while (aPoint.x - this.left() > charX) {
	        charX += context.measureText(txt[idx]).width;
	        idx += 1;
	        if (idx === txt.length) {
	            if ((context.measureText(txt).width -
	                    (context.measureText(txt[idx - 1]).width / 2)) <
	                    (aPoint.x - this.left())) {
	                return idx;
	            }
	        }
	    }
	    return idx - 1;
	},

	upFrom: function (slot) {
	    // answer the slot above the given one
	    return slot;
	},

	downFrom: function (slot) {
	    // answer the slot below the given one
	    return slot;
	},

	startOfLine: function () {
	    // answer the first slot (index) of the line for the given slot
	    return 0;
	},

	endOfLine: function () {
	    // answer the slot (index) indicating the EOL for the given slot
	    return this.text.length;
	},

	rawHeight: function () {
	    // answer my corrected fontSize
	    return this.height() / 1.2;
	},

	// StringMorph menus:

	developersMenu: function ($super) {
	    var menu = $super();

	    menu.addLine();
	    menu.addItem("edit", 'edit');
	    menu.addItem(
	        "font size...",
	        function () {
	            this.prompt(
	                menu.title + '\nfont\nsize:',
	                this.setFontSize,
	                this,
	                this.fontSize.toString(),
	                null,
	                6,
	                500,
	                true
	            );
	        },
	        'set this String\'s\nfont point size'
	    );
	    if (this.fontStyle !== 'serif') {
	        menu.addItem("serif", 'setSerif');
	    }
	    if (this.fontStyle !== 'sans-serif') {
	        menu.addItem("sans-serif", 'setSansSerif');
	    }
	    if (this.isBold) {
	        menu.addItem("normal weight", 'toggleWeight');
	    } else {
	        menu.addItem("bold", 'toggleWeight');
	    }
	    if (this.isItalic) {
	        menu.addItem("normal style", 'toggleItalic');
	    } else {
	        menu.addItem("italic", 'toggleItalic');
	    }
	    if (this.isShowingBlanks) {
	        menu.addItem("hide blanks", 'toggleShowBlanks');
	    } else {
	        menu.addItem("show blanks", 'toggleShowBlanks');
	    }
	    if (this.isPassword) {
	        menu.addItem("show characters", 'toggleIsPassword');
	    } else {
	        menu.addItem("hide characters", 'toggleIsPassword');
	    }
	    return menu;
	},

	toggleIsDraggable: function () {
	    // for context menu demo purposes
	    this.isDraggable = !this.isDraggable;
	    if (this.isDraggable) {
	        this.disableSelecting();
	    } else {
	        this.enableSelecting();
	    }
	},

	toggleShowBlanks: function () {
	    this.isShowingBlanks = !this.isShowingBlanks;
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	toggleWeight: function () {
	    this.isBold = !this.isBold;
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	toggleItalic: function () {
	    this.isItalic = !this.isItalic;
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	toggleIsPassword: function () {
	    this.isPassword = !this.isPassword;
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	setSerif: function () {
	    this.fontStyle = 'serif';
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	setSansSerif: function () {
	    this.fontStyle = 'sans-serif';
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	setFontSize: function (size) {
	    // for context menu demo purposes
	    var newSize;
	    if (typeof size === 'number') {
	        this.fontSize = Math.round(Math.min(Math.max(size, 4), 500));
	    } else {
	        newSize = parseFloat(size);
	        if (!isNaN(newSize)) {
	            this.fontSize = Math.round(
	                Math.min(Math.max(newSize, 4), 500)
	            );
	        }
	    }
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	setText: function (size) {
	    // for context menu demo purposes
	    this.text = Math.round(size).toString();
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	updateText: function (text) {
	    // for context menu demo purposes
	    this.text = text.toString();
	    this.changed();
	    this.drawNew();
	    this.changed();
	},

	numericalSetters: function () {
	    // for context menu demo purposes
	    return [
	        'setLeft',
	        'setTop',
	        'setAlphaScaled',
	        'setFontSize',
	        'setText'
	    ];
	},

	// StringMorph editing:

	edit: function () {
	    this.root().edit(this);
	},

	selection: function () {
	    var start, stop;
	    start = Math.min(this.startMark, this.endMark);
	    stop = Math.max(this.startMark, this.endMark);
	    return this.text.slice(start, stop);
	},

	selectionStartSlot: function () {
	    return Math.min(this.startMark, this.endMark);
	},

	clearSelection: function () {
	    this.currentlySelecting = false;
	    this.startMark = 0;
	    this.endMark = 0;
	    this.drawNew();
	    this.changed();
	},

	deleteSelection: function () {
	    var start, stop, text;
	    text = this.text;
	    start = Math.min(this.startMark, this.endMark);
	    stop = Math.max(this.startMark, this.endMark);
	    this.text = text.slice(0, start) + text.slice(stop);
	    this.changed();
	    this.clearSelection();
	},

	selectAll: function () {
	    if (this.isEditable) {
	        this.startMark = 0;
	        this.endMark = this.text.length;
	        this.drawNew();
	        this.changed();
	    }
	},

	mouseDownLeft: function (pos) {

		if(this.isSelectable) {
			if (this.isEditable) {
		        this.clearSelection();
		    } else {
		        this.escalateEvent('mouseDownLeft', pos);
		    }
		} else {
			this.clearSelection();
	        if (this.isEditable && (!this.isDraggable)) {
	            this.edit();
	            this.root().cursor.gotoPos(pos);
	            this.startMark = this.slotAt(pos);
	            this.endMark = this.startMark;
	            this.currentlySelecting = true;
	        }
		}

	    
	},

	mouseClickLeft: function (pos) {
	    var cursor;
	    if (this.isEditable) {
	        if (!this.currentlySelecting) {
	            this.edit(); // creates a new cursor
	        }
	        cursor = this.root().cursor;
	        if (cursor) {
	            cursor.gotoPos(pos);
	        }
	        this.currentlySelecting = true;
	    } else {
	        this.escalateEvent('mouseClickLeft', pos);
	    }
	},

	enableSelecting: function () {
	    this.isSelectable = true;
	    this.mouseMove = function (pos) {
	        if (this.isEditable &&
	                this.currentlySelecting &&
	                (!this.isDraggable)) {
	            var newMark = this.slotAt(pos);
	            if (newMark !== this.endMark) {
	                this.endMark = newMark;
	                this.drawNew();
	                this.changed();
	            }
	        }
	    };
	},

	disableSelecting: function () {
	    this.isSelectable = false;
	    delete this.mouseMove;
	},


})

StringMorph.uber = Morph.prototype;
StringMorph.className = 'StringMorph';

module.exports = StringMorph;


},{"./Color":6,"./Morph":18,"./Point":22}],31:[function(require,module,exports){
var Morph = require('./Morph');
var Color = require('./Color');
var Point = require('./Point');
var StringMorph = require('./StringMorph');

var TextMorph = Class.create(Morph, {

	// TextMorph ////////////////////////////////////////////////////////////////

	// I am a multi-line, word-wrapping String, quasi-inheriting from StringMorph
	
	initialize: function(
	    text,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    alignment,
	    width,
	    fontName,
	    shadowOffset,
	    shadowColor
	) {
	    this.init(text,
	        fontSize,
	        fontStyle,
	        bold,
	        italic,
	        alignment,
	        width,
	        fontName,
	        shadowOffset,
	        shadowColor);
	},


	init: function (
		$super, 
	    text,
	    fontSize,
	    fontStyle,
	    bold,
	    italic,
	    alignment,
	    width,
	    fontName,
	    shadowOffset,
	    shadowColor
	) {
	    // additional properties:
	    this.text = text || (text === '' ? text : 'TextMorph');
	    this.words = [];
	    this.lines = [];
	    this.lineSlots = [];
	    this.fontSize = fontSize || 12;
	    this.fontName = fontName || MorphicPreferences.globalFontFamily;
	    this.fontStyle = fontStyle || 'sans-serif';
	    this.isBold = bold || false;
	    this.isItalic = italic || false;
	    this.alignment = alignment || 'left';
	    this.shadowOffset = shadowOffset || new Point(0, 0);
	    this.shadowColor = shadowColor || null;
	    this.maxWidth = width || 0;
	    this.maxLineWidth = 0;
	    this.backgroundColor = null;
	    this.isEditable = false;

	    //additional properties for ad-hoc evaluation:
	    this.receiver = null;

	    // additional properties for text-editing:
	    this.isScrollable = true; // scrolls into view when edited
	    this.currentlySelecting = false;
	    this.startMark = 0;
	    this.endMark = 0;
	    this.markedTextColor = new Color(255, 255, 255);
	    this.markedBackgoundColor = new Color(60, 60, 120);

	    // initialize inherited properties:
	    $super();

	    // override inherited properites:
	    this.color = new Color(0, 0, 0);
	    this.noticesTransparentClick = true;
	    this.drawNew();
	},

	toString: function () {
	    // e.g. 'a TextMorph("Hello World")'
	    return 'a TextMorph' + '("' + this.text.slice(0, 30) + '...")';
	},

	font: StringMorph.prototype.font,

	parse: function () {
	    var myself = this,
	        paragraphs = this.text.split('\n'),
	        canvas = newCanvas(),
	        context = canvas.getContext('2d'),
	        oldline = '',
	        newline,
	        w,
	        slot = 0;

	    context.font = this.font();
	    this.maxLineWidth = 0;
	    this.lines = [];
	    this.lineSlots = [0];
	    this.words = [];

	    paragraphs.forEach(function (p) {
	        myself.words = myself.words.concat(p.split(' '));
	        myself.words.push('\n');
	    });

	    this.words.forEach(function (word) {
	        if (word === '\n') {
	            myself.lines.push(oldline);
	            myself.lineSlots.push(slot);
	            myself.maxLineWidth = Math.max(
	                myself.maxLineWidth,
	                context.measureText(oldline).width
	            );
	            oldline = '';
	        } else {
	            if (myself.maxWidth > 0) {
	                newline = oldline + word + ' ';
	                w = context.measureText(newline).width;
	                if (w > myself.maxWidth) {
	                    myself.lines.push(oldline);
	                    myself.lineSlots.push(slot);
	                    myself.maxLineWidth = Math.max(
	                        myself.maxLineWidth,
	                        context.measureText(oldline).width
	                    );
	                    oldline = word + ' ';
	                } else {
	                    oldline = newline;
	                }
	            } else {
	                oldline = oldline + word + ' ';
	            }
	            slot += word.length + 1;
	        }
	    });
	},

	drawNew: function () {
	    var context, height, i, line, width, shadowHeight, shadowWidth,
	        offx, offy, x, y, start, stop, p, c, rect;

	    this.image = newCanvas();
	    context = this.image.getContext('2d');
	    context.font = this.font();
	    this.parse();

	    // set my extent
	    shadowWidth = Math.abs(this.shadowOffset.x);
	    shadowHeight = Math.abs(this.shadowOffset.y);
	    height = this.lines.length * (fontHeight(this.fontSize) + shadowHeight);
	    if (this.maxWidth === 0) {
	        rect = new Rectangle(0, 0, 0, 0);
	        this.bounds = this.bounds.origin.extent(
	            rect,
	            new Point(this.maxLineWidth + shadowWidth, height)
	        );
	    } else {
	        rect = new Rectangle(0, 0, 0, 0);
	        this.bounds = this.bounds.origin.extent(
	            rect,
	            new Point(this.maxWidth + shadowWidth, height)
	        );
	    }
	    this.image.width = this.width();
	    this.image.height = this.height();

	    // prepare context for drawing text
	    context = this.image.getContext('2d');
	    context.font = this.font();
	    context.textAlign = 'left';
	    context.textBaseline = 'bottom';

	    // fill the background, if desired
	    if (this.backgroundColor) {
	        context.fillStyle = this.backgroundColor.toString();
	        context.fillRect(0, 0, this.width(), this.height());
	    }

	    // draw the shadow, if any
	    if (this.shadowColor) {
	        offx = Math.max(this.shadowOffset.x, 0);
	        offy = Math.max(this.shadowOffset.y, 0);
	        context.fillStyle = this.shadowColor.toString();

	        for (i = 0; i < this.lines.length; i = i + 1) {
	            line = this.lines[i];
	            width = context.measureText(line).width + shadowWidth;
	            if (this.alignment === 'right') {
	                x = this.width() - width;
	            } else if (this.alignment === 'center') {
	                x = (this.width() - width) / 2;
	            } else { // 'left'
	                x = 0;
	            }
	            y = (i + 1) * (fontHeight(this.fontSize) + shadowHeight)
	                - shadowHeight;
	            context.fillText(line, x + offx, y + offy);
	        }
	    }

	    // now draw the actual text
	    offx = Math.abs(Math.min(this.shadowOffset.x, 0));
	    offy = Math.abs(Math.min(this.shadowOffset.y, 0));
	    context.fillStyle = this.color.toString();

	    for (i = 0; i < this.lines.length; i = i + 1) {
	        line = this.lines[i];
	        width = context.measureText(line).width + shadowWidth;
	        if (this.alignment === 'right') {
	            x = this.width() - width;
	        } else if (this.alignment === 'center') {
	            x = (this.width() - width) / 2;
	        } else { // 'left'
	            x = 0;
	        }
	        y = (i + 1) * (fontHeight(this.fontSize) + shadowHeight)
	            - shadowHeight;
	        context.fillText(line, x + offx, y + offy);
	    }

	    // draw the selection
	    start = Math.min(this.startMark, this.endMark);
	    stop = Math.max(this.startMark, this.endMark);
	    for (i = start; i < stop; i += 1) {
	        p = this.slotPosition(i).subtract(this.position());
	        c = this.text.charAt(i);
	        context.fillStyle = this.markedBackgoundColor.toString();
	        context.fillRect(p.x, p.y, context.measureText(c).width + 1,
	            fontHeight(this.fontSize));
	        context.fillStyle = this.markedTextColor.toString();
	        context.fillText(c, p.x, p.y + fontHeight(this.fontSize));
	    }

	    // notify my parent of layout change
	    if (this.parent) {
	        if (this.parent.layoutChanged) {
	            this.parent.layoutChanged();
	        }
	    }
	},

	setExtent: function (aPoint) {
	    this.maxWidth = Math.max(aPoint.x, 0);
	    this.changed();
	    this.drawNew();
	},

	// TextMorph mesuring:

	columnRow: function (slot) {
	    // answer the logical position point of the given index ("slot")
	    var row,
	        col,
	        idx = 0;

	    for (row = 0; row < this.lines.length; row += 1) {
	        idx = this.lineSlots[row];
	        for (col = 0; col < this.lines[row].length; col += 1) {
	            if (idx === slot) {
	                return new Point(col, row);
	            }
	            idx += 1;
	        }
	    }
	    // return new Point(0, 0);
	    return new Point(
	        this.lines[this.lines.length - 1].length - 1,
	        this.lines.length - 1
	    );
	},

	slotPosition: function (slot) {
	    // answer the physical position point of the given index ("slot")
	    // where the cursor should be placed
	    var colRow = this.columnRow(slot),
	        context = this.image.getContext('2d'),
	        shadowHeight = Math.abs(this.shadowOffset.y),
	        xOffset = 0,
	        yOffset,
	        x,
	        y,
	        idx;

	    yOffset = colRow.y * (fontHeight(this.fontSize) + shadowHeight);
	    for (idx = 0; idx < colRow.x; idx += 1) {
	        xOffset += context.measureText(this.lines[colRow.y][idx]).width;
	    }
	    x = this.left() + xOffset;
	    y = this.top() + yOffset;
	    return new Point(x, y);
	},

	slotAt: function (aPoint) {
	    // answer the slot (index) closest to the given point
	    // so the cursor can be moved accordingly
	    var charX = 0,
	        row = 0,
	        col = 0,
	        shadowHeight = Math.abs(this.shadowOffset.y),
	        context = this.image.getContext('2d');

	    while (aPoint.y - this.top() >
	            ((fontHeight(this.fontSize) + shadowHeight) * row)) {
	        row += 1;
	    }
	    row = Math.max(row, 1);
	    while (aPoint.x - this.left() > charX) {
	        charX += context.measureText(this.lines[row - 1][col]).width;
	        col += 1;
	    }
	    return this.lineSlots[Math.max(row - 1, 0)] + col - 1;
	},

	upFrom: function (slot) {
	    // answer the slot above the given one
	    var above,
	        colRow = this.columnRow(slot);
	    if (colRow.y < 1) {
	        return slot;
	    }
	    above = this.lines[colRow.y - 1];
	    if (above.length < colRow.x - 1) {
	        return this.lineSlots[colRow.y - 1] + above.length;
	    }
	    return this.lineSlots[colRow.y - 1] + colRow.x;
	},

	downFrom: function (slot) {
	    // answer the slot below the given one
	    var below,
	        colRow = this.columnRow(slot);
	    if (colRow.y > this.lines.length - 2) {
	        return slot;
	    }
	    below = this.lines[colRow.y + 1];
	    if (below.length < colRow.x - 1) {
	        return this.lineSlots[colRow.y + 1] + below.length;
	    }
	    return this.lineSlots[colRow.y + 1] + colRow.x;
	},

	startOfLine: function (slot) {
	    // answer the first slot (index) of the line for the given slot
	    return this.lineSlots[this.columnRow(slot).y];
	},

	endOfLine: function (slot) {
	    // answer the slot (index) indicating the EOL for the given slot
	    return this.startOfLine(slot) +
	        this.lines[this.columnRow(slot).y].length - 1;
	},

	// TextMorph editing:

	edit: StringMorph.prototype.edit,

	selection: StringMorph.prototype.selection,

	selectionStartSlot: StringMorph.prototype.selectionStartSlot,

	clearSelection: StringMorph.prototype.clearSelection,

	deleteSelection: StringMorph.prototype.deleteSelection,

	selectAll: StringMorph.prototype.selectAll,

	mouseDownLeft: StringMorph.prototype.mouseDownLeft,

	mouseClickLeft: StringMorph.prototype.mouseClickLeft,

	enableSelecting: StringMorph.prototype.enableSelecting,

	disableSelecting: StringMorph.prototype.disableSelecting,

	selectAllAndEdit: function () {
	    this.edit();
	    this.selectAll();
	},

	// TextMorph menus:

	developersMenu: function ($super) {
	    var menu = $super();
	    menu.addLine();
	    menu.addItem("edit", 'edit');
	    menu.addItem(
	        "font size...",
	        function () {
	            this.prompt(
	                menu.title + '\nfont\nsize:',
	                this.setFontSize,
	                this,
	                this.fontSize.toString(),
	                null,
	                6,
	                100,
	                true
	            );
	        },
	        'set this Text\'s\nfont point size'
	    );
	    if (this.alignment !== 'left') {
	        menu.addItem("align left", 'setAlignmentToLeft');
	    }
	    if (this.alignment !== 'right') {
	        menu.addItem("align right", 'setAlignmentToRight');
	    }
	    if (this.alignment !== 'center') {
	        menu.addItem("align center", 'setAlignmentToCenter');
	    }
	    menu.addLine();
	    if (this.fontStyle !== 'serif') {
	        menu.addItem("serif", 'setSerif');
	    }
	    if (this.fontStyle !== 'sans-serif') {
	        menu.addItem("sans-serif", 'setSansSerif');
	    }
	    if (this.isBold) {
	        menu.addItem("normal weight", 'toggleWeight');
	    } else {
	        menu.addItem("bold", 'toggleWeight');
	    }
	    if (this.isItalic) {
	        menu.addItem("normal style", 'toggleItalic');
	    } else {
	        menu.addItem("italic", 'toggleItalic');
	    }
	    return menu;
	},

	setAlignmentToLeft: function () {
	    this.alignment = 'left';
	    this.drawNew();
	    this.changed();
	},

	setAlignmentToRight: function () {
	    this.alignment = 'right';
	    this.drawNew();
	    this.changed();
	},

	setAlignmentToCenter: function () {
	    this.alignment = 'center';
	    this.drawNew();
	    this.changed();
	},

	toggleIsDraggable: StringMorph.prototype.toggleIsDraggable,

	toggleWeight: StringMorph.prototype.toggleWeight,

	toggleItalic: StringMorph.prototype.toggleItalic,

	setSerif: StringMorph.prototype.setSerif,

	setSansSerif: StringMorph.prototype.setSansSerif,

	setText: StringMorph.prototype.setText,

	// for dynamic text
	updateText: StringMorph.prototype.updateText,

	setFontSize: StringMorph.prototype.setFontSize,

	numericalSetters: StringMorph.prototype.numericalSetters,

	// TextMorph evaluation:

	evaluationMenu: function (menu) {
	    // var menu = new MenuMorph(this, null);
	    menu.addItem(
	        "do it",
	        'doIt',
	        'evaluate the\nselected expression'
	    );
	    menu.addItem(
	        "show it",
	        'showIt',
	        'evaluate the\nselected expression\nand show the result'
	    );
	    menu.addItem(
	        "inspect it",
	        'inspectIt',
	        'evaluate the\nselected expression\nand inspect the result'
	    );
	    menu.addLine();
	    menu.addItem("select all", 'selectAllAndEdit');
	    return menu;
	},

	setReceiver: function (obj, menu) {
	    this.receiver = obj;
	    this.customContextMenu = this.evaluationMenu(menu);
	},

	doIt: function () {
	    this.receiver.evaluateString(this.selection());
	    this.edit();
	},

	showIt: function () {
	    var result = this.receiver.evaluateString(this.selection());
	    if (result !== null) {
	        this.inform(result);
	    }
	},

	inspectIt: function (result, inspector) {
	    // var result = this.receiver.evaluateString(this.selection()),
	    //     
	    var world = this.world(),
	        inspector;
	    if (isObject(result)) {
	        // inspector = new InspectorMorph(result);
	        inspector.setPosition(world.hand.position());
	        inspector.keepWithin(world);
	        world.add(inspector);
	        inspector.changed();
	    }
	},



})

TextMorph.uber = Morph.prototype;
TextMorph.className = 'TextMorph';

module.exports = TextMorph;


},{"./Color":6,"./Morph":18,"./Point":22,"./StringMorph":30}],32:[function(require,module,exports){

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
    },
})

TriggerMorph.uber = Morph.prototype;
TriggerMorph.className = 'TriggerMorph';

module.exports = TriggerMorph;

    

},{"./Color":6,"./Morph":18,"./Point":22,"./SpeechBubbleMorph":28,"./StringMorph":30}],33:[function(require,module,exports){
var Morph = require('./Morph');
var FrameMorph = require('./FrameMorph');
var Color = require('./Color');
var Point = require('./Point');
var HandMorph = require('./HandMorph');
var Rectangle = require('./Rectangle');
var MenuMorph = require('./MenuMorph');
var BoxMorph = require('./BoxMorph');
var CircleBoxMorph = require('./CircleBoxMorph');
var SliderMorph = require('./SliderMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var HandleMorph = require('./HandleMorph');
var StringMorph = require('./StringMorph');
var TextMorph = require('./TextMorph');
var SpeechBubbleMorph = require('./SpeechBubbleMorph');
var GrayPaletteMorph = require('./GrayPaletteMorph');
var ColorPaletteMorph = require('./ColorPaletteMorph');
var ColorPickerMorph = require('./ColorPickerMorph');
var MouseSensorMorph = require('./MouseSensorMorph');
var BouncerMorph = require('./BouncerMorph');
var PenMorph = require('./PenMorph');
var SliderMorph = require('./SliderMorph');


var WorldMorph = Class.create(FrameMorph, {
	
	// WorldMorph //////////////////////////////////////////////////////////

	// I represent the <canvas> element
	
	initialize: function(aCanvas, fillPage) {
	    this.init(aCanvas, fillPage);
	},

	// WorldMorph initialization:

	init: function ($super, aCanvas, fillPage) {
	    $super();
	    this.color = new Color(205, 205, 205); // (130, 130, 130)
	    this.alpha = 1;
	    this.bounds = new Rectangle(0, 0, aCanvas.width, aCanvas.height);
	    this.drawNew();
	    this.isVisible = true;
	    this.isDraggable = false;
	    this.currentKey = null; // currently pressed key code
	    this.worldCanvas = aCanvas;

	    // additional properties:
	    this.stamp = Date.now(); // reference in multi-world setups
	    while (this.stamp === Date.now()) {nop(); }
	    this.stamp = Date.now();

	    this.useFillPage = fillPage;
	    if (this.useFillPage === undefined) {
	        this.useFillPage = true;
	    }
	    this.isDevMode = false;
	    this.broken = [];
	    this.hand = new HandMorph(this);
	    this.keyboardReceiver = null;
	    this.lastEditedText = null;
	    this.cursor = null;
	    this.activeMenu = null;
	    this.activeHandle = null;
	    this.virtualKeyboard = null;

	    this.initEventListeners();
	},

	// World Morph display:

	brokenFor: function (aMorph) {
	    // private
	    var fb = aMorph.fullBounds();
	    return this.broken.filter(function (rect) {
	        return rect.intersects(fb);
	    });
	},

	fullDrawOn: function ($super, aCanvas, aRect) {
	    $super(aCanvas, aRect);
	    this.hand.fullDrawOn(aCanvas, aRect);
	},

	updateBroken: function () {
	    var myself = this;
	    this.condenseDamages();
	    this.broken.forEach(function (rect) {
	        if (rect.extent().gt(new Point(0, 0))) {
	            myself.fullDrawOn(myself.worldCanvas, rect);
	        }
	    });
	    this.broken = [];
	},

	condenseDamages: function () {
	    // collapse clustered damaged rectangles into their unions,
	    // thereby reducing the array of brokens to a manageable size

	    function condense(src) {
	        var trgt = [], hit;
	        src.forEach(function (rect) {
	            hit = detect(
	                trgt,
	                function (each) {return each.isNearTo(rect, 20); }
	            );
	            if (hit) {
	                hit.mergeWith(rect);
	            } else {
	                trgt.push(rect);
	            }
	        });
	        return trgt;
	    }

	    var again = true, size = this.broken.length;
	    while (again) {
	        this.broken = condense(this.broken);
	        again = (this.broken.length < size);
	        size = this.broken.length;
	    }
	},

	doOneCycle: function () {
	    this.stepFrame();
	    this.updateBroken();
	},

	fillPage: function () {
	    var pos = getDocumentPositionOf(this.worldCanvas),
	        clientHeight = window.innerHeight,
	        clientWidth = window.innerWidth,
	        myself = this;


	    if (pos.x > 0) {
	        this.worldCanvas.style.position = "absolute";
	        this.worldCanvas.style.left = "0px";
	        pos.x = 0;
	    }
	    if (pos.y > 0) {
	        this.worldCanvas.style.position = "absolute";
	        this.worldCanvas.style.top = "0px";
	        pos.y = 0;
	    }
	    if (document.documentElement.scrollTop) {
	        // scrolled down b/c of viewport scaling
	        clientHeight = document.documentElement.clientHeight;
	    }
	    if (document.documentElement.scrollLeft) {
	        // scrolled left b/c of viewport scaling
	        clientWidth = document.documentElement.clientWidth;
	    }
	    if (this.worldCanvas.width !== clientWidth) {
	        this.worldCanvas.width = clientWidth;
	        this.setWidth(clientWidth);
	    }
	    if (this.worldCanvas.height !== clientHeight) {
	        this.worldCanvas.height = clientHeight;
	        this.setHeight(clientHeight);
	    }
	    this.children.forEach(function (child) {
	        if (child.reactToWorldResize) {
	            child.reactToWorldResize(myself.bounds.copy());
	        }
	    });
	},

	// WorldMorph global pixel access:

	getGlobalPixelColor: function (point) {
	/*
	    answer the color at the given point.

	    Note: for some strange reason this method works fine if the page is
	    opened via HTTP, but *not*, if it is opened from a local uri
	    (e.g. from a directory), in which case it's always null.

	    This behavior is consistent throughout several browsers. I have no
	    clue what's behind this, apparently the imageData attribute of
	    canvas context only gets filled with meaningful data if transferred
	    via HTTP ???

	    This is somewhat of a showstopper for color detection in a planned
	    offline version of Snap.

	    The issue has also been discussed at: (join lines before pasting)
	    http://stackoverflow.com/questions/4069400/
	    canvas-getimagedata-doesnt-work-when-running-locally-on-windows-
	    security-excep

	    The suggestion solution appears to work, since the settings are
	    applied globally.
	*/
	    var dta = this.worldCanvas.getContext('2d').getImageData(
	        point.x,
	        point.y,
	        1,
	        1
	    ).data;
	    return new Color(dta[0], dta[1], dta[2]);
	},

	// WorldMorph events:

	initVirtualKeyboard: function () {
	    var myself = this;

	    if (this.virtualKeyboard) {
	        document.body.removeChild(this.virtualKeyboard);
	        this.virtualKeyboard = null;
	    }
	    if (!MorphicPreferences.isTouchDevice
	            || !MorphicPreferences.useVirtualKeyboard) {
	        return;
	    }
	    this.virtualKeyboard = document.createElement("input");
	    this.virtualKeyboard.type = "text";
	    this.virtualKeyboard.style.color = "transparent";
	    this.virtualKeyboard.style.backgroundColor = "transparent";
	    this.virtualKeyboard.style.border = "none";
	    this.virtualKeyboard.style.outline = "none";
	    this.virtualKeyboard.style.position = "absolute";
	    this.virtualKeyboard.style.top = "0px";
	    this.virtualKeyboard.style.left = "0px";
	    this.virtualKeyboard.style.width = "0px";
	    this.virtualKeyboard.style.height = "0px";
	    this.virtualKeyboard.autocapitalize = "none"; // iOS specific
	    document.body.appendChild(this.virtualKeyboard);

	    this.virtualKeyboard.addEventListener(
	        "keydown",
	        function (event) {
	            // remember the keyCode in the world's currentKey property
	            myself.currentKey = event.keyCode;
	            if (myself.keyboardReceiver) {
	                myself.keyboardReceiver.processKeyDown(event);
	            }
	            // supress backspace override
	            if (event.keyIdentifier === 'U+0008' ||
	                    event.keyIdentifier === 'Backspace') {
	                event.preventDefault();
	            }
	            // supress tab override and make sure tab gets
	            // received by all browsers
	            if (event.keyIdentifier === 'U+0009' ||
	                    event.keyIdentifier === 'Tab') {
	                if (myself.keyboardReceiver) {
	                    myself.keyboardReceiver.processKeyPress(event);
	                }
	                event.preventDefault();
	            }
	        },
	        false
	    );

	    this.virtualKeyboard.addEventListener(
	        "keyup",
	        function (event) {
	            // flush the world's currentKey property
	            myself.currentKey = null;
	            // dispatch to keyboard receiver
	            if (myself.keyboardReceiver) {
	                if (myself.keyboardReceiver.processKeyUp) {
	                    myself.keyboardReceiver.processKeyUp(event);
	                }
	            }
	            event.preventDefault();
	        },
	        false
	    );

	    this.virtualKeyboard.addEventListener(
	        "keypress",
	        function (event) {
	            if (myself.keyboardReceiver) {
	                myself.keyboardReceiver.processKeyPress(event);
	            }
	            event.preventDefault();
	        },
	        false
	    );
	},

	initEventListeners: function () {
	    var canvas = this.worldCanvas, myself = this;

	    if (myself.useFillPage) {
	        myself.fillPage();
	    } else {
	        this.changed();
	    }

	    canvas.addEventListener(
	        "mousedown",
	        function (event) {
	            event.preventDefault();
	            canvas.focus();
	            myself.hand.processMouseDown(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "touchstart",
	        function (event) {
	            myself.hand.processTouchStart(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "mouseup",
	        function (event) {
	            event.preventDefault();
	            myself.hand.processMouseUp(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "dblclick",
	        function (event) {
	            event.preventDefault();
	            myself.hand.processDoubleClick(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "touchend",
	        function (event) {
	            myself.hand.processTouchEnd(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "mousemove",
	        function (event) {
	            myself.hand.processMouseMove(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "touchmove",
	        function (event) {
	            myself.hand.processTouchMove(event);
	        },
	        false
	    );

	    canvas.addEventListener(
	        "contextmenu",
	        function (event) {
	            // suppress context menu for Mac-Firefox
	            event.preventDefault();
	        },
	        false
	    );

	    canvas.addEventListener(
	        "keydown",
	        function (event) {
	            // remember the keyCode in the world's currentKey property
	            myself.currentKey = event.keyCode;
	            if (myself.keyboardReceiver) {
	                myself.keyboardReceiver.processKeyDown(event);
	            }
	            // supress backspace override
	            if (event.keyIdentifier === 'U+0008' ||
	                    event.keyIdentifier === 'Backspace') {
	                event.preventDefault();
	            }
	            // supress tab override and make sure tab gets
	            // received by all browsers
	            if (event.keyIdentifier === 'U+0009' ||
	                    event.keyIdentifier === 'Tab') {
	                if (myself.keyboardReceiver) {
	                    myself.keyboardReceiver.processKeyPress(event);
	                }
	                event.preventDefault();
	            }
	            if ((event.ctrlKey || event.metaKey) &&
	                    (event.keyIdentifier !== 'U+0056')) { // allow pasting-in
	                event.preventDefault();
	            }
	        },
	        false
	    );

	    canvas.addEventListener(
	        "keyup",
	        function (event) {
	            // flush the world's currentKey property
	            myself.currentKey = null;
	            // dispatch to keyboard receiver
	            if (myself.keyboardReceiver) {
	                if (myself.keyboardReceiver.processKeyUp) {
	                    myself.keyboardReceiver.processKeyUp(event);
	                }
	            }
	            event.preventDefault();
	        },
	        false
	    );

	    canvas.addEventListener(
	        "keypress",
	        function (event) {
	            if (myself.keyboardReceiver) {
	                myself.keyboardReceiver.processKeyPress(event);
	            }
	            event.preventDefault();
	        },
	        false
	    );

	    canvas.addEventListener( // Safari, Chrome
	        "mousewheel",
	        function (event) {
	            myself.hand.processMouseScroll(event);
	            event.preventDefault();
	        },
	        false
	    );
	    canvas.addEventListener( // Firefox
	        "DOMMouseScroll",
	        function (event) {
	            myself.hand.processMouseScroll(event);
	            event.preventDefault();
	        },
	        false
	    );

	    document.body.addEventListener(
	        "paste",
	        function (event) {
	            var txt = event.clipboardData.getData("Text");
	            if (txt && myself.cursor) {
	                myself.cursor.insert(txt);
	            }
	        },
	        false
	    );

	    window.addEventListener(
	        "dragover",
	        function (event) {
	            event.preventDefault();
	        },
	        false
	    );
	    window.addEventListener(
	        "drop",
	        function (event) {
	            myself.hand.processDrop(event);
	            event.preventDefault();
	        },
	        false
	    );

	    window.addEventListener(
	        "resize",
	        function () {
	            if (myself.useFillPage) {
	                myself.fillPage();
	            }
	        },
	        false
	    );

	    window.onbeforeunload = function (evt) {
	        var e = evt || window.event,
	            msg = "Are you sure you want to leave?";
	        // For IE and Firefox
	        if (e) {
	            e.returnValue = msg;
	        }
	        // For Safari / chrome
	        return msg;
	    };
	},

	mouseDownLeft: function () {
	    nop();
	},

	mouseClickLeft: function () {
	    nop();
	},

	mouseDownRight: function () {
	    nop();
	},

	mouseClickRight: function () {
	    nop();
	},

	wantsDropOf: function () {
	    // allow handle drops if any drops are allowed
	    return this.acceptsDrops;
	},

	droppedImage: function () {
	    return null;
	},

	droppedSVG: function () {
	    return null;
	},

	// WorldMorph text field tabbing:

	nextTab: function (editField) {
	    var next = this.nextEntryField(editField);
	    if (next) {
	        editField.clearSelection();
	        next.selectAll();
	        next.edit();
	    }
	},

	previousTab: function (editField) {
	    var prev = this.previousEntryField(editField);
	    if (prev) {
	        editField.clearSelection();
	        prev.selectAll();
	        prev.edit();
	    }
	},

	// WorldMorph menu:

	contextMenu: function () {
	    var menu;

	    if (this.isDevMode) {
	        menu = new MenuMorph(this, this.constructor.name ||
	            this.constructor.toString().split(' ')[1].split('(')[0]);
	    } else {
	        menu = new MenuMorph(this, 'Morphic');
	    }
	    if (this.isDevMode) {
	        menu.addItem("demo...", 'userCreateMorph', 'sample morphs');
	        menu.addLine();
	        menu.addItem("hide all...", 'hideAll');
	        menu.addItem("show all...", 'showAllHiddens');
	        menu.addItem(
	            "move all inside...",
	            'keepAllSubmorphsWithin',
	            'keep all submorphs\nwithin and visible'
	        );
	        menu.addItem(
	            "inspect...",
	            'inspect',
	            'open a window on\nall properties'
	        );
	        menu.addLine();
	        menu.addItem(
	            "restore display",
	            'changed',
	            'redraw the\nscreen once'
	        );
	        menu.addItem(
	            "fill page...",
	            'fillPage',
	            'let the World automatically\nadjust to browser resizings'
	        );
	        if (useBlurredShadows) {
	            menu.addItem(
	                "sharp shadows...",
	                'toggleBlurredShadows',
	                'sharp drop shadows\nuse for old browsers'
	            );
	        } else {
	            menu.addItem(
	                "blurred shadows...",
	                'toggleBlurredShadows',
	                'blurry shades,\n use for new browsers'
	            );
	        }
	        menu.addItem(
	            "color...",
	            function () {
	                this.pickColor(
	                    menu.title + '\ncolor:',
	                    this.setColor,
	                    this,
	                    this.color
	                );
	            },
	            'choose the World\'s\nbackground color'
	        );
	        if (MorphicPreferences === standardSettings) {
	            menu.addItem(
	                "touch screen settings",
	                'togglePreferences',
	                'bigger menu fonts\nand sliders'
	            );
	        } else {
	            menu.addItem(
	                "standard settings",
	                'togglePreferences',
	                'smaller menu fonts\nand sliders'
	            );
	        }
	        menu.addLine();
	    }
	    if (this.isDevMode) {
	        menu.addItem(
	            "user mode...",
	            'toggleDevMode',
	            'disable developers\'\ncontext menus'
	        );
	    } else {
	        menu.addItem("development mode...", 'toggleDevMode');
	    }
	    menu.addItem("about morphic.js...", 'about');
	    return menu;
	},

	userCreateMorph: function () {
	    var myself = this, menu, newMorph;

	    function create(aMorph) {
	        aMorph.isDraggable = true;
	        aMorph.pickUp(myself);
	    }

	    menu = new MenuMorph(this, 'make a morph');
	    menu.addItem('rectangle', function () {
	        create(new Morph());
	    });
	    menu.addItem('box', function () {
	        create(new BoxMorph());
	    });
	    menu.addItem('circle box', function () {
	        create(new CircleBoxMorph());
	    });
	    menu.addLine();
	    menu.addItem('slider', function () {
	        create(new SliderMorph());
	    });
	    menu.addItem('frame', function () {
	        newMorph = new FrameMorph();
	        newMorph.setExtent(new Point(350, 250));
	        create(newMorph);
	    });
	    menu.addItem('scroll frame', function () {
	        newMorph = new ScrollFrameMorph();
	        newMorph.contents.acceptsDrops = true;
	        newMorph.contents.adjustBounds();
	        newMorph.setExtent(new Point(350, 250));
	        create(newMorph);
	    });
	    menu.addItem('handle', function () {
	        create(new HandleMorph());
	    });
	    menu.addLine();
	    menu.addItem('string', function () {
	        newMorph = new StringMorph('Hello, World!');
	        newMorph.isEditable = true;
	        create(newMorph);
	    });
	    menu.addItem('text', function () {
	        newMorph = new TextMorph(
	            "Ich wei\u00DF nicht, was soll es bedeuten, dass ich so " +
	                "traurig bin, ein M\u00E4rchen aus uralten Zeiten, das " +
	                "kommt mir nicht aus dem Sinn. Die Luft ist k\u00FChl " +
	                "und es dunkelt, und ruhig flie\u00DFt der Rhein; der " +
	                "Gipfel des Berges funkelt im Abendsonnenschein. " +
	                "Die sch\u00F6nste Jungfrau sitzet dort oben wunderbar, " +
	                "ihr gold'nes Geschmeide blitzet, sie k\u00E4mmt ihr " +
	                "goldenes Haar, sie k\u00E4mmt es mit goldenem Kamme, " +
	                "und singt ein Lied dabei; das hat eine wundersame, " +
	                "gewalt'ge Melodei. Den Schiffer im kleinen " +
	                "Schiffe, ergreift es mit wildem Weh; er schaut " +
	                "nicht die Felsenriffe, er schaut nur hinauf in " +
	                "die H\u00F6h'. Ich glaube, die Wellen verschlingen " +
	                "am Ende Schiffer und Kahn, und das hat mit ihrem " +
	                "Singen, die Loreley getan."
	        );
	        newMorph.isEditable = true;
	        newMorph.maxWidth = 300;
	        newMorph.drawNew();
	        create(newMorph);
	    });
	    menu.addItem('speech bubble', function () {
	        newMorph = new SpeechBubbleMorph('Hello, World!');
	        create(newMorph);
	    });
	    menu.addLine();
	    menu.addItem('gray scale palette', function () {
	        create(new GrayPaletteMorph());
	    });
	    menu.addItem('color palette', function () {
	        create(new ColorPaletteMorph());
	    });
	    menu.addItem('color picker', function () {
	        create(new ColorPickerMorph());
	    });
	    menu.addLine();
	    menu.addItem('sensor demo', function () {
	        newMorph = new MouseSensorMorph();
	        newMorph.setColor(new Color(230, 200, 100));
	        newMorph.edge = 35;
	        newMorph.border = 15;
	        newMorph.borderColor = new Color(200, 100, 50);
	        newMorph.alpha = 0.2;
	        newMorph.setExtent(new Point(100, 100));
	        create(newMorph);
	    });
	    menu.addItem('animation demo', function () {
	        var foo, bar, baz, garply, fred;

	        foo = new BouncerMorph();
	        foo.setPosition(new Point(50, 20));
	        foo.setExtent(new Point(300, 200));
	        foo.alpha = 0.9;
	        foo.speed = 3;

	        bar = new BouncerMorph();
	        bar.setColor(new Color(50, 50, 50));
	        bar.setPosition(new Point(80, 80));
	        bar.setExtent(new Point(80, 250));
	        bar.type = 'horizontal';
	        bar.direction = 'right';
	        bar.alpha = 0.9;
	        bar.speed = 5;

	        baz = new BouncerMorph();
	        baz.setColor(new Color(20, 20, 20));
	        baz.setPosition(new Point(90, 140));
	        baz.setExtent(new Point(40, 30));
	        baz.type = 'horizontal';
	        baz.direction = 'right';
	        baz.speed = 3;

	        garply = new BouncerMorph();
	        garply.setColor(new Color(200, 20, 20));
	        garply.setPosition(new Point(90, 140));
	        garply.setExtent(new Point(20, 20));
	        garply.type = 'vertical';
	        garply.direction = 'up';
	        garply.speed = 8;

	        fred = new BouncerMorph();
	        fred.setColor(new Color(20, 200, 20));
	        fred.setPosition(new Point(120, 140));
	        fred.setExtent(new Point(20, 20));
	        fred.type = 'vertical';
	        fred.direction = 'down';
	        fred.speed = 4;

	        bar.add(garply);
	        bar.add(baz);
	        foo.add(fred);
	        foo.add(bar);

	        create(foo);
	    });
	    menu.addItem('pen', function () {
	        create(new PenMorph());
	    });
	    if (myself.customMorphs) {
	        menu.addLine();
	        myself.customMorphs().forEach(function (morph) {
	            menu.addItem(morph.toString(), function () {
	                create(morph);
	            });
	        });
	    }
	    menu.popUpAtHand(this);
	},

	toggleDevMode: function () {
	    this.isDevMode = !this.isDevMode;
	},

	hideAll: function () {
	    this.children.forEach(function (child) {
	        child.hide();
	    });
	},

	showAllHiddens: function () {
	    this.forAllChildren(function (child) {
	        if (!child.isVisible) {
	            child.show();
	        }
	    });
	},

	about: function () {
	    var versions = '', module;

	    for (module in modules) {
	        if (Object.prototype.hasOwnProperty.call(modules, module)) {
	            versions += ('\n' + module + ' (' + modules[module] + ')');
	        }
	    }
	    if (versions !== '') {
	        versions = '\n\nmodules:\n\n' +
	            'morphic (' + morphicVersion + ')' +
	            versions;
	    }

	    this.inform(
	        'morphic.js\n\n' +
	            'a lively Web GUI\ninspired by Squeak\n' +
	            morphicVersion +
	            '\n\nwritten by Jens M\u00F6nig\njens@moenig.org' +
	            versions
	    );
	},

	edit: function (aStringOrTextMorph) {
	    var pos = getDocumentPositionOf(this.worldCanvas);

	    if (!aStringOrTextMorph.isEditable) {
	        return null;
	    }
	    if (this.cursor) {
	        this.cursor.destroy();
	    }
	    if (this.lastEditedText) {
	        this.lastEditedText.clearSelection();
	    }
	    this.cursor = new CursorMorph(aStringOrTextMorph);
	    aStringOrTextMorph.parent.add(this.cursor);
	    this.keyboardReceiver = this.cursor;

	    this.initVirtualKeyboard();
	    if (MorphicPreferences.isTouchDevice
	            && MorphicPreferences.useVirtualKeyboard) {
	        this.virtualKeyboard.style.top = this.cursor.top() + pos.y + "px";
	        this.virtualKeyboard.style.left = this.cursor.left() + pos.x + "px";
	        this.virtualKeyboard.focus();
	    }

	    if (MorphicPreferences.useSliderForInput) {
	        if (!aStringOrTextMorph.parentThatIsA('MenuMorph')) {
	            this.slide(aStringOrTextMorph);
	        }
	    }
	},

	slide: function (aStringOrTextMorph) {
	    // display a slider for numeric text entries
	    var val = parseFloat(aStringOrTextMorph.text),
	        menu,
	        slider;

	    if (isNaN(val)) {
	        val = 0;
	    }
	    menu = new MenuMorph();
	    slider = new SliderMorph(
	        val - 25,
	        val + 25,
	        val,
	        10,
	        'horizontal'
	    );
	    slider.alpha = 1;
	    slider.color = new Color(225, 225, 225);
	    slider.button.color = menu.borderColor;
	    slider.button.highlightColor = slider.button.color.copy();
	    slider.button.highlightColor.b += 100;
	    slider.button.pressColor = slider.button.color.copy();
	    slider.button.pressColor.b += 150;
	    slider.silentSetHeight(MorphicPreferences.scrollBarSize);
	    slider.silentSetWidth(MorphicPreferences.menuFontSize * 10);
	    slider.drawNew();
	    slider.action = function (num) {
	        aStringOrTextMorph.changed();
	        aStringOrTextMorph.text = Math.round(num).toString();
	        aStringOrTextMorph.drawNew();
	        aStringOrTextMorph.changed();
	        aStringOrTextMorph.escalateEvent(
	            'reactToSliderEdit',
	            aStringOrTextMorph
	        );
	    };
	    menu.items.push(slider);
	    menu.popup(this, aStringOrTextMorph.bottomLeft().add(new Point(0, 5)));
	},

	stopEditing: function () {
	    if (this.cursor) {
	        this.lastEditedText = this.cursor.target;
	        this.cursor.destroy();
	        this.cursor = null;
	        this.lastEditedText.escalateEvent('reactToEdit', this.lastEditedText);
	    }
	    this.keyboardReceiver = null;
	    if (this.virtualKeyboard) {
	        this.virtualKeyboard.blur();
	        document.body.removeChild(this.virtualKeyboard);
	        this.virtualKeyboard = null;
	    }
	    this.worldCanvas.focus();
	},

	toggleBlurredShadows: function () {
	    useBlurredShadows = !useBlurredShadows;
	},

	togglePreferences: function () {
	    if (MorphicPreferences === standardSettings) {
	        MorphicPreferences = touchScreenSettings;
	    } else {
	        MorphicPreferences = standardSettings;
	    }
	},

	customMorphs: function () {
	    // add examples to the world's demo menu

	    return [];

		/*
		    return [
		        new SymbolMorph(
		            'pipette',
		            50,
		            new Color(250, 250, 250),
		            new Point(-1, -1),
		            new Color(20, 20, 20)
		        )
		    ];
		*/
		/*
		    var sm = new ScriptsMorph();
		    sm.setExtent(new Point(800, 600));

		    return [
		        new SymbolMorph(),
		        new HatBlockMorph(),
		        new CommandBlockMorph(),
		        sm,
		        new CommandSlotMorph(),
		        new CSlotMorph(),
		        new InputSlotMorph(),
		        new InputSlotMorph(null, true),
		        new BooleanSlotMorph(),
		        new ColorSlotMorph(),
		        new TemplateSlotMorph('foo'),
		        new ReporterBlockMorph(),
		        new ReporterBlockMorph(true),
		        new ArrowMorph(),
		        new MultiArgMorph(),
		        new FunctionSlotMorph(),
		        new ReporterSlotMorph(),
		        new ReporterSlotMorph(true),
		//        new DialogBoxMorph('Dialog Box'),
		//        new InputFieldMorph('Input Field')
		        new RingMorph(),
		        new RingCommandSlotMorph(),
		        new RingReporterSlotMorph(),
		        new RingReporterSlotMorph(true)
		    ];
		*/
	},

})

WorldMorph.uber = FrameMorph.prototype;
WorldMorph.className = 'WorldMorph';

module.exports = WorldMorph;



},{"./BouncerMorph":2,"./BoxMorph":3,"./CircleBoxMorph":4,"./Color":6,"./ColorPaletteMorph":7,"./ColorPickerMorph":8,"./FrameMorph":10,"./GrayPaletteMorph":11,"./HandMorph":12,"./HandleMorph":13,"./MenuMorph":17,"./Morph":18,"./MouseSensorMorph":19,"./PenMorph":21,"./Point":22,"./Rectangle":23,"./ScrollFrameMorph":24,"./SliderMorph":27,"./SpeechBubbleMorph":28,"./StringMorph":30,"./TextMorph":31}],34:[function(require,module,exports){
(function (global){
// morphic.js

global.Color = require('./Color');
global.Point = require('./Point');
global.Rectangle = require('./Rectangle');
global.Node = require('./Node');
global.Morph = require('./Morph');
global.ShadowMorph = require('./ShadowMorph');
global.HandleMorph = require('./HandleMorph');
global.PenMorph = require('./PenMorph');
global.ColorPaletteMorph = require('./ColorPaletteMorph');
global.GrayPaletteMorph = require('./GrayPaletteMorph');
global.ColorPickerMorph = require('./ColorPickerMorph');
global.BlinkerMorph = require('./BlinkerMorph');
global.CursorMorph = require('./CursorMorph');
global.BoxMorph = require('./BoxMorph');
global.SpeechBubbleMorph = require('./SpeechBubbleMorph');
global.ScrollFrameMorph = require('./CircleBoxMorph');
global.ScrollFrameMorph = require('./SliderButtonMorph');
global.StringMorph = require('./StringMorph');
global.TextMorph = require('./TextMorph');
global.MouseSensorMorph = require('./MouseSensorMorph');
global.StringFieldMorph = require('./StringFieldMorph');
global.BouncerMorph = require('./BouncerMorph');
global.TriggerMorph = require('./TriggerMorph');
global.InspectorMorph = require('./InspectorMorph');
global.FrameMorph = require('./FrameMorph');
global.SliderMorph = require('./SliderMorph');
global.SliderButtonMorph = require('./SliderButtonMorph');
global.ScrollFrameMorph = require('./ScrollFrameMorph');
global.MenuMorph = require('./MenuMorph');
global.MenuItemMorph = require('./MenuItemMorph');
global.HandMorph = require('./HandMorph');
global.WorldMorph = require('./WorldMorph');

// widgets.js



// blocks.js

// gui.js

// cloud.js
global.Cloud = require('./Cloud');


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./BlinkerMorph":1,"./BouncerMorph":2,"./BoxMorph":3,"./CircleBoxMorph":4,"./Cloud":5,"./Color":6,"./ColorPaletteMorph":7,"./ColorPickerMorph":8,"./CursorMorph":9,"./FrameMorph":10,"./GrayPaletteMorph":11,"./HandMorph":12,"./HandleMorph":13,"./InspectorMorph":14,"./MenuItemMorph":16,"./MenuMorph":17,"./Morph":18,"./MouseSensorMorph":19,"./Node":20,"./PenMorph":21,"./Point":22,"./Rectangle":23,"./ScrollFrameMorph":24,"./ShadowMorph":25,"./SliderButtonMorph":26,"./SliderMorph":27,"./SpeechBubbleMorph":28,"./StringFieldMorph":29,"./StringMorph":30,"./TextMorph":31,"./TriggerMorph":32,"./WorldMorph":33}]},{},[34]);
