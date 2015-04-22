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
	    console.log(this.url);
	    var shareWith = eval("[" + prompt("Who you want to share with?", "1, 2, 3") + "]");
	    var data = {
	        creator_id: creatorId,
	        share_with: shareWith
	    };
	    var success = function(data){
	    	console.log("success");
	        callBack.call(null, data);
	    };
	    var url = this.url + 'sharebox';
	    console.log(url);
	    console.log(data);
	    $.post(url, data, success, 'json');
	    console.log("excuted");
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
	}

});

Cloud.className = 'Cloud';

module.exports = Cloud;