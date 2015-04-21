var Morph = require('./Morph');
var Point = require('./Point');

var BouncerMorph = Class.create(Morph, {

	// BouncerMorph ////////////////////////////////////////////////////////
	
	initialize: function(){
		this.init();
	},

	init: function ($super, type, speed) {
	    $super();
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
	}
});

BouncerMorph.uber = Morph.prototype;
BouncerMorph.className = 'BouncerMorph';

module.exports = BouncerMorph;