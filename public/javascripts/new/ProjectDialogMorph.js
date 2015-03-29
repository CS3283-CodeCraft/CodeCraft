/**
 * Created by Shurelia on 30/3/2015.
 *
 * WORK IN PROGRESS
 */

// Requires
var DialogBoxMorph = require('./DialogBoxMorph');
var InputFieldMorph = require('./InputFieldMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var TextMorph = require('./TextMorph');
var Morph = require('./Morph');
var AlignmentMorph = require('./AlignmentMorph');
var ListMorph = require('./ListMorph');
var Color = require('./Color');
var Point = require('./Point');

// ProjectDialogMorph inherits from DialogBoxMorph:

var ProjectDialogMorph = Class.create(DialogBoxMorph, {

    initialize: function() {

    },

    init: function(ide, task) {
        var myself = this;

        // additional properties:
        this.ide = ide;
        this.task = task || 'open'; // String describing what do do (open, save)
        this.source = ide.source || 'local'; // or 'cloud' or 'examples'
        this.projectList = []; // [{name: , thumb: , notes:}]

        this.handle = null;
        this.srcBar = null;
        this.nameField = null;
        this.listField = null;
        this.preview = null;
        this.notesText = null;
        this.notesField = null;
        this.deleteButton = null;
        this.shareButton = null;
        this.unshareButton = null;

        // initialize inherited properties:
        ProjectDialogMorph.uber.init.call(
            this,
            this, // target
            null, // function
            null // environment
        );

        // override inherited properites:
        this.labelString = this.task === 'save' ? 'Save Project' : 'Open Project';
        this.createLabel();
        this.key = 'project' + task;

        // build contents
        this.buildContents();
        this.onNextStep = function () { // yield to show "updating" message
            myself.setSource(myself.source);
        };
    },

    buildContents: function () {
        var thumbnail, notification;

        this.addBody(new Morph());
        this.body.color = this.color;

        this.srcBar = new AlignmentMorph('column', this.padding / 2);

        if (this.ide.cloudMsg) {
            notification = new TextMorph(
                this.ide.cloudMsg,
                10,
                null, // style
                false, // bold
                null, // italic
                null, // alignment
                null, // width
                null, // font name
                new Point(1, 1), // shadow offset
                new Color(255, 255, 255) // shadowColor
            );
            notification.refresh = nop;
            this.srcBar.add(notification);
        }

        this.addSourceButton('cloud', localize('Cloud'), 'cloud');
        this.addSourceButton('local', localize('Browser'), 'storage');
        if (this.task === 'open') {
            this.addSourceButton('examples', localize('Examples'), 'poster');
        }
        this.srcBar.fixLayout();
        this.body.add(this.srcBar);

        if (this.task === 'save') {
            this.nameField = new InputFieldMorph(this.ide.projectName);
            this.body.add(this.nameField);
        }

        this.listField = new ListMorph([]);
        this.fixListFieldItemColors();
        this.listField.fixLayout = nop;
        this.listField.edge = InputFieldMorph.prototype.edge;
        this.listField.fontSize = InputFieldMorph.prototype.fontSize;
        this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
        this.listField.contrast = InputFieldMorph.prototype.contrast;
        this.listField.drawNew = InputFieldMorph.prototype.drawNew;
        this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

        this.body.add(this.listField);

        this.preview = new Morph();
        this.preview.fixLayout = nop;
        this.preview.edge = InputFieldMorph.prototype.edge;
        this.preview.fontSize = InputFieldMorph.prototype.fontSize;
        this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
        this.preview.contrast = InputFieldMorph.prototype.contrast;
        this.preview.drawNew = function () {
            InputFieldMorph.prototype.drawNew.call(this);
            if (this.texture) {
                this.drawTexture(this.texture);
            }
        };
        this.preview.drawCachedTexture = function () {
            var context = this.image.getContext('2d');
            context.drawImage(this.cachedTexture, this.edge, this.edge);
            this.changed();
        };
        this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
        this.preview.setExtent(
            this.ide.serializer.thumbnailSize.add(this.preview.edge * 2)
        );

        this.body.add(this.preview);
        this.preview.drawNew();
        if (this.task === 'save') {
            thumbnail = this.ide.stage.thumbnail(
                SnapSerializer.prototype.thumbnailSize
            );
            this.preview.texture = null;
            this.preview.cachedTexture = thumbnail;
            this.preview.drawCachedTexture();
        }

        this.notesField = new ScrollFrameMorph();
        this.notesField.fixLayout = nop;

        this.notesField.edge = InputFieldMorph.prototype.edge;
        this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
        this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
        this.notesField.contrast = InputFieldMorph.prototype.contrast;
        this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
        this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

        this.notesField.acceptsDrops = false;
        this.notesField.contents.acceptsDrops = false;

        if (this.task === 'open') {
            this.notesText = new TextMorph('');
        } else { // 'save'
            this.notesText = new TextMorph(this.ide.projectNotes);
            this.notesText.isEditable = true;
            this.notesText.enableSelecting();
        }

        this.notesField.isTextLineWrapping = true;
        this.notesField.padding = 3;
        this.notesField.setContents(this.notesText);
        this.notesField.setWidth(this.preview.width());

        this.body.add(this.notesField);

        if (this.task === 'open') {
            this.addButton('openProject', 'Open');
            this.action = 'openProject';
        } else { // 'save'
            this.addButton('saveProject', 'Save');
            this.action = 'saveProject';
        }
        this.shareButton = this.addButton('shareProject', 'Share');
        this.unshareButton = this.addButton('unshareProject', 'Unshare');
        this.shareButton.hide();
        this.unshareButton.hide();
        this.deleteButton = this.addButton('deleteProject', 'Delete');
        this.addButton('cancel', 'Cancel');

        if (notification) {
            this.setExtent(new Point(455, 335).add(notification.extent()));
        } else {
            this.setExtent(new Point(455, 335));
        }
        this.fixLayout();

    }
});