// Nodes ///////////////////////////////////////////////////////////////

var Node = Class.create({

    initialize: function(parent, childrenArray){
        this.init(parent || null, childrenArray || []);
    },

    instanceOf : function(className){
    	var a = this.constructor;
    	return instanceOf(a, className);
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