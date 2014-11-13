/**
 * Created by Undisputed_Seraphim on 11/13/2014.
 *
 * This file contains assorted odds and ends.
 * EXPERIMENTAL CLASSES GO HERE!!
 */

// ImageMorph //////////////////////////////////////////////////////

var ImageMorph;

// I represent the abstract concept of an image, boxed into a Morphic object.
// Images must have a static, fixed size. No support for gifs at the moment.
// Path of the image must also be static and relative.
// Mutability of the image is not a priority and might possibly never be implemented.

// ImageMorph inherits from Morph

ImageMorph.prototype = new Morph();
ImageMorph.prototype.constructor = ImageMorph;
ImageMorph.uber = Morph.prototype;

function ImageMorph(
	path,
	width,
	height) {
	this.init(
		path || null,
		width,
		height
	);
}

ImageMorph.prototype.init = function (
	path,
	width,
	height) {
	// Initialize inherited properties
	ImageMorph.uber.init.call(this);
	// Override inherited properties
	this.autoOrient = false;

	var dim = newCanvas(new Point(
		width, height
	));

	var context = dim.getContext('2d');
	var img = new Image();
	img.src = path;
	img.onload = function() {
		// Create a pattern with this image, set it to repeat
		context.fillStyle = context.createPattern(img, 'repeat');
		context.fillRect(0, 0, width, height);
	};
};
