var Morph = require('./Morph');
var Point = require('./Point');
var Color = require('./Color');

var SymbolMorph = Class.create(Morph, {

    // SymbolMorph //////////////////////////////////////////////////////////

    /*
        I display graphical symbols, such as special letters. I have been
        called into existence out of frustration about not being able to
        consistently use Unicode characters to the same ends.

        Symbols can also display costumes, if one is specified in lieu
        of a name property, although this feature is currently not being
        used because of asynchronous image loading issues.
     */

    name: [
        'square',
        'pointRight',
        'gears',
        'file',
        'fullScreen',
        'normalScreen',
        'smallStage',
        'normalStage',
        'turtle',
        'stage',
        'turtleOutline',
        'pause',
        'flag',
        'octagon',
        'cloud',
        'cloudOutline',
        'cloudGradient',
        'turnRight',
        'turnLeft',
        'storage',
        'poster',
        'flash',
        'brush',
        'rectangle',
        'rectangleSolid',
        'circle',
        'circleSolid',
        'line',
        'crosshairs',
        'paintbucket',
        'eraser',
        'pipette',
        'speechBubble',
        'speechBubbleOutline',
        'arrowUp',
        'arrowUpOutline',
        'arrowLeft',
        'arrowLeftOutline',
        'arrowDown',
        'arrowDownOutline',
        'arrowRight',
        'arrowRightOutline',
        'robot',
        'library'
    ],

    initialize: function(name, size, color, shaddowOffset, shadowColor){
        this.init(name, size, color, shaddowOffset, shadowColor);
    },

    init: function (
        $super, 
        name, // or costume
        size,
        color,
        shadowOffset,
        shadowColor
    ) {
        this.isProtectedLabel = false; // participate in zebraing
        this.isReadOnly = true;
        this.name = name || 'gears'; // can also be a costume
        this.size = size || ((size === 0) ? 0 : 50);
        this.shadowOffset = shadowOffset || new Point(0, 0);
        this.shadowColor = shadowColor || null;

        $super();
        this.color = color || new Color(0, 0, 0);
        this.drawNew();
    },

    // SymbolMorph zebra coloring:

    setLabelColor: function (
        textColor,
        shadowColor,
        shadowOffset
    ) {
        this.shadowOffset = shadowOffset;
        this.shadowColor = shadowColor;
        this.setColor(textColor);
    },

    // SymbolMorph displaying:

    drawNew: function () {
        var ctx, x, y, sx, sy;
        this.image = newCanvas(new Point(
            this.symbolWidth() + Math.abs(this.shadowOffset.x),
            this.size + Math.abs(this.shadowOffset.y)
        ));
        this.silentSetWidth(this.image.width);
        this.silentSetHeight(this.image.height);
        ctx = this.image.getContext('2d');
        sx = this.shadowOffset.x < 0 ? 0 : this.shadowOffset.x;
        sy = this.shadowOffset.y < 0 ? 0 : this.shadowOffset.y;
        x = this.shadowOffset.x < 0 ? Math.abs(this.shadowOffset.x) : 0;
        y = this.shadowOffset.y < 0 ? Math.abs(this.shadowOffset.y) : 0;
        if (this.shadowColor) {
            ctx.drawImage(
                this.symbolCanvasColored(this.shadowColor),
                sx,
                sy
            );
        }
        ctx.drawImage(
            this.symbolCanvasColored(this.color),
            x,
            y
        );
    },

    symbolCanvasColored: function (aColor) {
        // private
        if (this.name instanceof Costume) {
            return this.name.thumbnail(new Point(this.symbolWidth(), this.size));
        }

        var canvas = newCanvas(new Point(this.symbolWidth(), this.size));

        switch (this.name) {
        case 'square':
            return this.drawSymbolStop(canvas, aColor);
        case 'pointRight':
            return this.drawSymbolPointRight(canvas, aColor);
        case 'gears':
            return this.drawSymbolGears(canvas, aColor);
        case 'file':
            return this.drawSymbolFile(canvas, aColor);
        case 'fullScreen':
            return this.drawSymbolFullScreen(canvas, aColor);
        case 'normalScreen':
            return this.drawSymbolNormalScreen(canvas, aColor);
        case 'smallStage':
            return this.drawSymbolSmallStage(canvas, aColor);
        case 'normalStage':
            return this.drawSymbolNormalStage(canvas, aColor);
        case 'turtle':
            return this.drawSymbolTurtle(canvas, aColor);
        case 'stage':
            return this.drawSymbolStop(canvas, aColor);
        case 'turtleOutline':
            return this.drawSymbolTurtleOutline(canvas, aColor);
        case 'pause':
            return this.drawSymbolPause(canvas, aColor);
        case 'flag':
            return this.drawSymbolFlag(canvas, aColor);
        case 'octagon':
            return this.drawSymbolOctagon(canvas, aColor);
        case 'cloud':
            return this.drawSymbolCloud(canvas, aColor);
        case 'cloudOutline':
            return this.drawSymbolCloudOutline(canvas, aColor);
        case 'cloudGradient':
            return this.drawSymbolCloudGradient(canvas, aColor);
        case 'turnRight':
            return this.drawSymbolTurnRight(canvas, aColor);
        case 'turnLeft':
            return this.drawSymbolTurnLeft(canvas, aColor);
        case 'storage':
            return this.drawSymbolStorage(canvas, aColor);
        case 'poster':
            return this.drawSymbolPoster(canvas, aColor);
        case 'flash':
            return this.drawSymbolFlash(canvas, aColor);
        case 'brush':
            return this.drawSymbolBrush(canvas, aColor);
        case 'rectangle':
            return this.drawSymbolRectangle(canvas, aColor);
        case 'rectangleSolid':
            return this.drawSymbolRectangleSolid(canvas, aColor);
        case 'circle':
            return this.drawSymbolCircle(canvas, aColor);
        case 'circleSolid':
            return this.drawSymbolCircleSolid(canvas, aColor);
        case 'line':
            return this.drawSymbolLine(canvas, aColor);
        case 'crosshairs':
            return this.drawSymbolCrosshairs(canvas, aColor);
        case 'paintbucket':
            return this.drawSymbolPaintbucket(canvas, aColor);
        case 'eraser':
            return this.drawSymbolEraser(canvas, aColor);
        case 'pipette':
            return this.drawSymbolPipette(canvas, aColor);
        case 'speechBubble':
            return this.drawSymbolSpeechBubble(canvas, aColor);
        case 'speechBubbleOutline':
            return this.drawSymbolSpeechBubbleOutline(canvas, aColor);
        case 'arrowUp':
            return this.drawSymbolArrowUp(canvas, aColor);
        case 'arrowUpOutline':
            return this.drawSymbolArrowUpOutline(canvas, aColor);
        case 'arrowLeft':
            return this.drawSymbolArrowLeft(canvas, aColor);
        case 'arrowLeftOutline':
            return this.drawSymbolArrowLeftOutline(canvas, aColor);
        case 'arrowDown':
            return this.drawSymbolArrowDown(canvas, aColor);
        case 'arrowDownOutline':
            return this.drawSymbolArrowDownOutline(canvas, aColor);
        case 'arrowRight':
            return this.drawSymbolArrowRight(canvas, aColor);
        case 'arrowRightOutline':
            return this.drawSymbolArrowRightOutline(canvas, aColor);
        case 'robot':
            return this.drawSymbolRobot(canvas, aColor);
        case 'library':
            return this.drawSymbolLibrary(canvas, aColor);
        default:
            return canvas;
        }
    },

    symbolWidth: function () {
        // private
        var size = this.size;

        if (this.name instanceof Costume) {
            return (size / this.name.height()) * this.name.width();
        }
        switch (this.name) {
        case 'pointRight':
            return Math.sqrt(size * size - Math.pow(size / 2, 2));
        case 'flash':
        case 'file':
            return size * 0.8;
        case 'smallStage':
        case 'normalStage':
            return size * 1.2;
        case 'turtle':
        case 'turtleOutline':
        case 'stage':
            return size * 1.3;
        case 'cloud':
        case 'cloudGradient':
        case 'cloudOutline':
            return size * 1.6;
        case 'turnRight':
        case 'turnLeft':
            return size / 3 * 2;
        default:
            return size;
        }
    },

    drawSymbolStop: function (canvas, color) {
        // answer a canvas showing a vertically centered square
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = color.toString();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    },

    drawSymbolPointRight: function (canvas, color) {
        // answer a canvas showing a right-pointing, equilateral triangle
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, Math.round(canvas.height / 2));
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolGears: function (canvas, color) {
        // answer a canvas showing gears
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            r = w / 2,
            e = w / 6;

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = canvas.width / 7;

        ctx.beginPath();
        ctx.arc(r, r, w, radians(0), radians(360), true);
        ctx.arc(r, r, e * 1.5, radians(0), radians(360), false);
        ctx.closePath();
        ctx.clip();

        ctx.moveTo(0, r);
        ctx.lineTo(w, r);
        ctx.stroke();

        ctx.moveTo(r, 0);
        ctx.lineTo(r, w);
        ctx.stroke();

        ctx.moveTo(e, e);
        ctx.lineTo(w - e, w - e);
        ctx.stroke();

        ctx.moveTo(w - e, e);
        ctx.lineTo(e, w - e);
        ctx.stroke();

        return canvas;
    },

    drawSymbolFile: function (canvas, color) {
        // answer a canvas showing a page symbol
        var ctx = canvas.getContext('2d'),
            w = Math.min(canvas.width, canvas.height) / 2;

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, w);
        ctx.lineTo(canvas.width, w);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color.darker(25).toString();
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(canvas.width, w);
        ctx.lineTo(w, w);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolFullScreen: function (canvas, color) {
        // answer a canvas showing two arrows pointing diagonally outwards
        var ctx = canvas.getContext('2d'),
            h = canvas.height,
            c = canvas.width / 2,
            off = canvas.width / 20,
            w = canvas.width / 2;

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = canvas.width / 5;
        ctx.moveTo(c - off, c + off);
        ctx.lineTo(0, h);
        ctx.stroke();

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = canvas.width / 5;
        ctx.moveTo(c + off, c - off);
        ctx.lineTo(h, 0);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h - w);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(h, 0);
        ctx.lineTo(h - w, 0);
        ctx.lineTo(h, w);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolNormalScreen: function (canvas, color) {
        // answer a canvas showing two arrows pointing diagonally inwards
        var ctx = canvas.getContext('2d'),
            h = canvas.height,
            c = canvas.width / 2,
            off = canvas.width / 20,
            w = canvas.width;

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = canvas.width / 5;
        ctx.moveTo(c - off * 3, c + off * 3);
        ctx.lineTo(0, h);
        ctx.stroke();

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = canvas.width / 5;
        ctx.moveTo(c + off * 3, c - off * 3);
        ctx.lineTo(h, 0);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(c + off, c - off);
        ctx.lineTo(w, c - off);
        ctx.lineTo(c + off, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(c - off, c + off);
        ctx.lineTo(0, c + off);
        ctx.lineTo(c - off, w);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolSmallStage: function (canvas, color) {
        // answer a canvas showing a stage toggling symbol
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            w2 = w / 2,
            h2 = h / 2;

        ctx.fillStyle = color.darker(40).toString();
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = color.toString();
        ctx.fillRect(w2, 0, w2, h2);

        return canvas;
    },

    drawSymbolNormalStage: function (canvas, color) {
        // answer a canvas showing a stage toggling symbol
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            w2 = w / 2,
            h2 = h / 2;

        ctx.fillStyle = color.toString();
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = color.darker(25).toString();
        ctx.fillRect(w2, 0, w2, h2);

        return canvas;
    },

    drawSymbolTurtle: function (canvas, color) {
        // answer a canvas showing a turtle
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(canvas.height / 2, canvas.height / 2);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolTurtleOutline: function (canvas, color) {
        // answer a canvas showing a turtle
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(canvas.height / 2, canvas.height / 2);
        ctx.closePath();
        ctx.stroke();

        return canvas;
    },

    drawSymbolPause: function (canvas, color) {
        // answer a canvas showing two parallel rectangles
        var ctx = canvas.getContext('2d'),
            w = canvas.width / 5;

        ctx.fillStyle = color.toString();
        ctx.fillRect(0, 0, w * 2, canvas.height);
        ctx.fillRect(w * 3, 0, w * 2, canvas.height);
        return canvas;
    },

    drawSymbolFlag: function (canvas, color) {
        // answer a canvas showing a flag
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            l = Math.max(w / 12, 1),
            h = canvas.height;

        ctx.lineWidth = l;
        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(l / 2, 0);
        ctx.lineTo(l / 2, canvas.height);
        ctx.stroke();

        ctx.lineWidth = h / 2;
        ctx.beginPath();
        ctx.moveTo(0, h / 4);
        ctx.bezierCurveTo(
            w * 0.8,
            h / 4,
            w * 0.1,
            h * 0.5,
            w,
            h * 0.5
        );
        ctx.stroke();

        return canvas;
    },

    drawSymbolOctagon: function (canvas, color) {
        // answer a canvas showing an octagon
        var ctx = canvas.getContext('2d'),
            side = canvas.width,
            vert = (side - (side * 0.383)) / 2;

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(vert, 0);
        ctx.lineTo(side - vert, 0);
        ctx.lineTo(side, vert);
        ctx.lineTo(side, side - vert);
        ctx.lineTo(side - vert, side);
        ctx.lineTo(vert, side);
        ctx.lineTo(0, side - vert);
        ctx.lineTo(0, vert);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolCloud: function (canvas, color) {
        // answer a canvas showing an cloud
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            r1 = h * 2 / 5,
            r2 = h / 4,
            r3 = h * 3 / 10,
            r4 = h / 5;

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.arc(r2, h - r2, r2, radians(90), radians(259), false);
        ctx.arc(w / 20 * 5, h / 9 * 4, r4, radians(165), radians(300), false);
        ctx.arc(w / 20 * 11, r1, r1, radians(200), radians(357), false);
        ctx.arc(w - r3, h - r3, r3, radians(269), radians(90), false);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolCloudGradient: function (canvas, color) {
        // answer a canvas showing an cloud
        var ctx = canvas.getContext('2d'),
            gradient,
            w = canvas.width,
            h = canvas.height,
            r1 = h * 2 / 5,
            r2 = h / 4,
            r3 = h * 3 / 10,
            r4 = h / 5;

        gradient = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            w
        );
        gradient.addColorStop(0, color.lighter(25).toString());
        gradient.addColorStop(1, color.darker(25).toString());
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(r2, h - r2, r2, radians(90), radians(259), false);
        ctx.arc(w / 20 * 5, h / 9 * 4, r4, radians(165), radians(300), false);
        ctx.arc(w / 20 * 11, r1, r1, radians(200), radians(357), false);
        ctx.arc(w - r3, h - r3, r3, radians(269), radians(90), false);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolCloudOutline: function (canvas, color) {
        // answer a canvas showing an cloud
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            r1 = h * 2 / 5,
            r2 = h / 4,
            r3 = h * 3 / 10,
            r4 = h / 5;

        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.arc(r2 + 1, h - r2 - 1, r2, radians(90), radians(259), false);
        ctx.arc(w / 20 * 5, h / 9 * 4, r4, radians(165), radians(300), false);
        ctx.arc(w / 20 * 11, r1 + 1, r1, radians(200), radians(357), false);
        ctx.arc(w - r3 - 1, h - r3 - 1, r3, radians(269), radians(90), false);
        ctx.closePath();
        ctx.stroke();

        return canvas;
    },

    drawSymbolTurnRight: function (canvas, color) {
        // answer a canvas showing a right-turning arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            l = Math.max(w / 10, 1),
            r = w / 2;

        ctx.lineWidth = l;
        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.arc(r, r * 2, r - l / 2, radians(0), radians(-90), false);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(w, r);
        ctx.lineTo(r, 0);
        ctx.lineTo(r, r * 2);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolTurnLeft: function (canvas, color) {
        // answer a canvas showing a left-turning arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            l = Math.max(w / 10, 1),
            r = w / 2;

        ctx.lineWidth = l;
        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.arc(r, r * 2, r - l / 2, radians(180), radians(-90), true);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(r, 0);
        ctx.lineTo(r, r * 2);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolStorage: function (canvas, color) {
        // answer a canvas showing a stack of three disks
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            r = canvas.height,
            unit = canvas.height / 11;

        function drawDisk(bottom, fillTop) {
            ctx.fillStyle = color.toString();
            ctx.beginPath();
            ctx.arc(w / 2, bottom - h, r, radians(60), radians(120), false);
            ctx.lineTo(0, bottom - unit * 2);
            ctx.arc(
                w / 2,
                bottom - h - unit * 2,
                r,
                radians(120),
                radians(60),
                true
            );
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = color.darker(25).toString();
            ctx.beginPath();

            if (fillTop) {
                ctx.arc(
                    w / 2,
                    bottom - h - unit * 2,
                    r,
                    radians(120),
                    radians(60),
                    true
                );
            }

            ctx.arc(
                w / 2,
                bottom + unit * 6 + 1,
                r,
                radians(60),
                radians(120),
                true
            );
            ctx.closePath();

            if (fillTop) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }

        ctx.strokeStyle = color.toString();
        drawDisk(h);
        drawDisk(h - unit * 3);
        drawDisk(h - unit * 6, false);
        return canvas;
    },

    drawSymbolPoster: function (canvas, color) {
        // answer a canvas showing a poster stand
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            bottom = h * 0.75,
            edge = canvas.height / 5;

        ctx.fillStyle = color.toString();
        ctx.strokeStyle = color.toString();

        ctx.lineWidth = w / 15;
        ctx.moveTo(w / 2, h / 3);
        ctx.lineTo(w / 6, h);
        ctx.stroke();

        ctx.moveTo(w / 2, h / 3);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        ctx.moveTo(w / 2, h / 3);
        ctx.lineTo(w * 5 / 6, h);
        ctx.stroke();

        ctx.fillRect(0, 0, w, bottom);
        ctx.clearRect(0, bottom, w, w / 20);

        ctx.clearRect(w - edge, bottom - edge, edge + 1, edge + 1);

        ctx.fillStyle = color.darker(25).toString();
        ctx.beginPath();
        ctx.moveTo(w, bottom - edge);
        ctx.lineTo(w - edge, bottom - edge);
        ctx.lineTo(w - edge, bottom);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolFlash: function (canvas, color) {
        // answer a canvas showing a flash
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            w3 = w / 3,
            h = canvas.height,
            h3 = h / 3,
            off = h3 / 3;

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(w3, 0);
        ctx.lineTo(0, h3);
        ctx.lineTo(w3, h3);
        ctx.lineTo(0, h3 * 2);
        ctx.lineTo(w3, h3 * 2);
        ctx.lineTo(0, h);
        ctx.lineTo(w, h3 * 2 - off);
        ctx.lineTo(w3 * 2, h3 * 2 - off);
        ctx.lineTo(w, h3 - off);
        ctx.lineTo(w3 * 2, h3 - off);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolLibrary: function (canvas, color) {
        // to create a library symbol
        return canvas
    },

    drawSymbolBrush: function (canvas, color) {
        // answer a canvas showing a paintbrush
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            l = Math.max(w / 30, 0.5);

        ctx.fillStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(w / 8 * 3, h / 2);
        ctx.quadraticCurveTo(0, h / 2, l, h - l);
        ctx.quadraticCurveTo(w / 2, h, w / 2, h / 8 * 5);
        ctx.closePath();
        ctx.fill();

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color.toString();

        ctx.moveTo(w / 8 * 3, h / 2);
        ctx.lineTo(w * 0.75, l);
        ctx.quadraticCurveTo(w, 0, w - l, h * 0.25);
        ctx.stroke();

        ctx.moveTo(w / 2, h / 8 * 5);
        ctx.lineTo(w - l, h * 0.25);
        ctx.stroke();

        return canvas;
    },

    drawSymbolRectangle: function (canvas, color) {
        // answer a canvas showing a rectangle
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.width,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(l, l);
        ctx.lineTo(w - l, l);
        ctx.lineTo(w - l, h - l);
        ctx.lineTo(l, h - l);
        ctx.closePath();
        ctx.stroke();
        return canvas;
    },

    drawSymbolRectangleSolid: function (canvas, color) {
        // answer a canvas showing a solid rectangle
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.width;

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolCircle: function (canvas, color) {
        // answer a canvas showing a circle
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.arc(w / 2, w / 2, w / 2 - l, radians(0), radians(360), false);
        ctx.stroke();
        return canvas;
    },

    drawSymbolCircleSolid: function (canvas, color) {
        // answer a canvas showing a solid circle
        var ctx = canvas.getContext('2d'),
            w = canvas.width;

        ctx.fillStyle = color.toString();
        ctx.arc(w / 2, w / 2, w / 2, radians(0), radians(360), false);
        ctx.fill();
        return canvas;
    },

    drawSymbolLine: function (canvas, color) {
        // answer a canvas showing a diagonal line
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.lineCap = 'round';
        ctx.moveTo(l, l);
        ctx.lineTo(w - l, h - l);
        ctx.stroke();
        return canvas;
    },

    drawSymbolCrosshairs: function (canvas, color) {
        // answer a canvas showing a crosshairs
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            l = 0.5;

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.moveTo(l, h / 2);
        ctx.lineTo(w - l, h / 2);
        ctx.stroke();
        ctx.moveTo(w / 2, l);
        ctx.lineTo(w / 2, h - l);
        ctx.stroke();
        ctx.moveTo(w / 2, h / 2);
        ctx.arc(w / 2, w / 2, w / 3 - l, radians(0), radians(360), false);
        ctx.stroke();
        return canvas;
    },

    drawSymbolPaintbucket: function (canvas, color) {
        // answer a canvas showing a paint bucket
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 5,
            l = Math.max(w / 30, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(n * 2, n);
        ctx.lineTo(n * 4, n * 3);
        ctx.lineTo(n * 3, n * 4);
        ctx.quadraticCurveTo(n * 2, h, n, n * 4);
        ctx.quadraticCurveTo(0, n * 3, n, n * 2);
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = l;
        ctx.moveTo(n * 2, n * 2.5);
        ctx.arc(n * 2, n * 2.5, l, radians(0), radians(360), false);
        ctx.stroke();

        ctx.moveTo(n * 2, n * 2.5);
        ctx.lineTo(n * 2, n / 2 + l);
        ctx.stroke();

        ctx.arc(n * 1.5, n / 2 + l, n / 2, radians(0), radians(180), true);
        ctx.stroke();

        ctx.moveTo(n, n / 2 + l);
        ctx.lineTo(n, n * 2);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(n * 3.5, n * 3.5);
        ctx.quadraticCurveTo(w, n * 3.5, w - l, h);
        ctx.lineTo(w, h);
        ctx.quadraticCurveTo(w, n * 2, n * 2.5, n * 1.5);
        ctx.lineTo(n * 4, n * 3);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolEraser: function (canvas, color) {
        // answer a canvas showing an eraser
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 4,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(n * 3, l);
        ctx.lineTo(l, n * 3);
        ctx.quadraticCurveTo(n, h, n * 2, n * 3);
        ctx.lineTo(w - l, n);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(n * 3, 0);
        ctx.lineTo(n * 1.5, n * 1.5);
        ctx.lineTo(n * 2.5, n * 2.5);
        ctx.lineTo(w, n);
        ctx.closePath();
        ctx.fill();

        return canvas;
    },

    drawSymbolPipette: function (canvas, color) {
        // answer a canvas showing an eyedropper
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 4,
            n2 = n / 2,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(l, h - l);
        ctx.quadraticCurveTo(n2, h - n2, n2, h - n);
        ctx.lineTo(n * 2, n * 1.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(l, h - l);
        ctx.quadraticCurveTo(n2, h - n2, n, h - n2);
        ctx.lineTo(n * 2.5, n * 2);
        ctx.stroke();

        ctx.fillStyle = color.toString();
        ctx.arc(n * 3, n, n - l, radians(0), radians(360), false);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n * 2, n);
        ctx.lineTo(n * 3, n * 2);
        ctx.stroke();

        return canvas;
    },

    drawSymbolSpeechBubble: function (canvas, color) {
        // answer a canvas showing a speech bubble
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 3,
            l = Math.max(w / 20, 0.5);

        ctx.fillStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(n, n * 2);
        ctx.quadraticCurveTo(l, n * 2, l, n);
        ctx.quadraticCurveTo(l, l, n, l);
        ctx.lineTo(n * 2, l);
        ctx.quadraticCurveTo(w - l, l, w - l, n);
        ctx.quadraticCurveTo(w - l, n * 2, n * 2, n * 2);
        ctx.lineTo(n / 2, h - l);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolSpeechBubbleOutline: function (
        canvas,
        color
    ) {
        // answer a canvas showing a speech bubble
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 3,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(n, n * 2);
        ctx.quadraticCurveTo(l, n * 2, l, n);
        ctx.quadraticCurveTo(l, l, n, l);
        ctx.lineTo(n * 2, l);
        ctx.quadraticCurveTo(w - l, l, w - l, n);
        ctx.quadraticCurveTo(w - l, n * 2, n * 2, n * 2);
        ctx.lineTo(n / 2, h - l);
        ctx.closePath();
        ctx.stroke();
        return canvas;
    },

    drawSymbolArrowUp: function (canvas, color) {
        // answer a canvas showing an up arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 2,
            l = Math.max(w / 20, 0.5);

        ctx.fillStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(l, n);
        ctx.lineTo(n, l);
        ctx.lineTo(w - l, n);
        ctx.lineTo(w * 0.65, n);
        ctx.lineTo(w * 0.65, h - l);
        ctx.lineTo(w * 0.35, h - l);
        ctx.lineTo(w * 0.35, n);
        ctx.closePath();
        ctx.fill();
        return canvas;
    },

    drawSymbolArrowUpOutline: function (canvas, color) {
        // answer a canvas showing an up arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 2,
            l = Math.max(w / 20, 0.5);

        ctx.strokeStyle = color.toString();
        ctx.lineWidth = l * 2;
        ctx.beginPath();
        ctx.moveTo(l, n);
        ctx.lineTo(n, l);
        ctx.lineTo(w - l, n);
        ctx.lineTo(w * 0.65, n);
        ctx.lineTo(w * 0.65, h - l);
        ctx.lineTo(w * 0.35, h - l);
        ctx.lineTo(w * 0.35, n);
        ctx.closePath();
        ctx.stroke();
        return canvas;
    },

    drawSymbolArrowDown: function (canvas, color) {
        // answer a canvas showing a down arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(w, w);
        ctx.rotate(radians(180));
        this.drawSymbolArrowUp(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolArrowDownOutline: function (canvas, color) {
        // answer a canvas showing a down arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(w, w);
        ctx.rotate(radians(180));
        this.drawSymbolArrowUpOutline(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolArrowLeft: function (canvas, color) {
        // answer a canvas showing a left arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(0, w);
        ctx.rotate(radians(-90));
        this.drawSymbolArrowUp(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolArrowLeftOutline: function (canvas, color) {
        // answer a canvas showing a left arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(0, w);
        ctx.rotate(radians(-90));
        this.drawSymbolArrowUpOutline(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolArrowRight: function (canvas, color) {
        // answer a canvas showing a right arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(w, 0);
        ctx.rotate(radians(90));
        this.drawSymbolArrowUp(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolArrowRightOutline: function (canvas, color) {
        // answer a canvas showing a right arrow
        var ctx = canvas.getContext('2d'),
            w = canvas.width;
        ctx.save();
        ctx.translate(w, 0);
        ctx.rotate(radians(90));
        this.drawSymbolArrowUpOutline(canvas, color);
        ctx.restore();
        return canvas;
    },

    drawSymbolRobot: function (canvas, color) {
        // answer a canvas showing a humanoid robot
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            n = canvas.width / 6,
            n2 = n / 2,
            l = Math.max(w / 20, 0.5);

        ctx.fillStyle = color.toString();
        //ctx.lineWidth = l * 2;

        ctx.beginPath();
        ctx.moveTo(n + l, n);
        ctx.lineTo(n * 2, n);
        ctx.lineTo(n * 2.5, n * 1.5);
        ctx.lineTo(n * 3.5, n * 1.5);
        ctx.lineTo(n * 4, n);
        ctx.lineTo(n * 5 - l, n);
        ctx.lineTo(n * 4, n * 3);
        ctx.lineTo(n * 4, n * 4 - l);
        ctx.lineTo(n * 2, n * 4 - l);
        ctx.lineTo(n * 2, n * 3);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n * 2.75, n + l);
        ctx.lineTo(n * 2.4, n);
        ctx.lineTo(n * 2.2, 0);
        ctx.lineTo(n * 3.8, 0);
        ctx.lineTo(n * 3.6, n);
        ctx.lineTo(n * 3.25, n + l);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n * 2.5, n * 4);
        ctx.lineTo(n, n * 4);
        ctx.lineTo(n2 + l, h);
        ctx.lineTo(n * 2, h);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n * 3.5, n * 4);
        ctx.lineTo(n * 5, n * 4);
        ctx.lineTo(w - (n2 + l), h);
        ctx.lineTo(n * 4, h);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n, n);
        ctx.lineTo(l, n * 1.5);
        ctx.lineTo(l, n * 3.25);
        ctx.lineTo(n * 1.5, n * 3.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(n * 5, n);
        ctx.lineTo(w - l, n * 1.5);
        ctx.lineTo(w - l, n * 3.25);
        ctx.lineTo(n * 4.5, n * 3.5);
        ctx.closePath();
        ctx.fill();

        return canvas;
    }
});

SymbolMorph.uber = Morph.prototype;
SymbolMorph.className = 'SymbolMorph';

module.exports = SymbolMorph;