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
var ToggleButtonMorph = requrie('./ToggleButtonMorph');
var HandleMorph = require('./HandleMorph');
var StringMorph = require('./StringMorph');

// ProjectDialogMorph inherits from DialogBoxMorph:

var ProjectDialogMorph = Class.create(DialogBoxMorph, {

	initialize: function() {

	},

	init: function($super, ide, task) {
		$super();

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
	},

	popUp: function (world) {
		world = world || this.ide.world();
		if (world) {
			ProjectDialogMorph.uber.popUp.call(this, world);
			this.handle = new HandleMorph(
				this,
				350,
				300,
				this.corner,
				this.corner
			);
		}
	},

	// ProjectDialogMorph source buttons

	addSourceButton: function (source, label, symbol) {
		var myself = this,
			lbl1 = new StringMorph(
				label,
				10,
				null,
				true,
				null,
				null,
				new Point(1, 1),
				new Color(255, 255, 255)
			),
			lbl2 = new StringMorph(
				label,
				10,
				null,
				true,
				null,
				null,
				new Point(-1, -1),
				this.titleBarColor.darker(50),
				new Color(255, 255, 255)
			),
			l1 = new Morph(),
			l2 = new Morph(),
			button;

		lbl1.add(new SymbolMorph(
			symbol,
			24,
			this.titleBarColor.darker(20),
			new Point(1, 1),
			this.titleBarColor.darker(50)
		));
		lbl1.children[0].setCenter(lbl1.center());
		lbl1.children[0].setBottom(lbl1.top() - this.padding / 2);

		l1.image = lbl1.fullImage();
		l1.bounds = lbl1.fullBounds();

		lbl2.add(new SymbolMorph(
			symbol,
			24,
			new Color(255, 255, 255),
			new Point(-1, -1),
			this.titleBarColor.darker(50)
		));
		lbl2.children[0].setCenter(lbl2.center());
		lbl2.children[0].setBottom(lbl2.top() - this.padding / 2);

		l2.image = lbl2.fullImage();
		l2.bounds = lbl2.fullBounds();

		button = new ToggleButtonMorph(
			null, //colors,
			myself, // the ProjectDialog is the target
			function () { // action
				myself.setSource(source);
			},
			[l1, l2],
			function () {  // query
				return myself.source === source;
			}
		);

		button.corner = this.buttonCorner;
		button.edge = this.buttonEdge;
		button.outline = this.buttonOutline;
		button.outlineColor = this.buttonOutlineColor;
		button.outlineGradient = this.buttonOutlineGradient;
		button.labelMinExtent = new Point(60, 0);
		button.padding = this.buttonPadding;
		button.contrast = this.buttonContrast;
		button.pressColor = this.titleBarColor.darker(20);

		button.drawNew();
		button.fixLayout();
		button.refresh();
		this.srcBar.add(button);
	},

	// ProjectDialogMorph list field control

	fixListFieldItemColors: function () {
		// remember to always fixLayout() afterwards for the changes
		// to take effect
		var myself = this;
		this.listField.contents.children[0].alpha = 0;
		this.listField.contents.children[0].children.forEach(function (item) {
			item.pressColor = myself.titleBarColor.darker(20);
			item.color = new Color(0, 0, 0, 0);
			item.noticesTransparentClick = true;
		});
	},

	// ProjectDialogMorph ops

	setSource: function (source) {
		var myself = this,
			msg;

		this.source = source; //this.task === 'save' ? 'local' : source;
		this.srcBar.children.forEach(function (button) {
			button.refresh();
		});
		switch (this.source) {
			case 'cloud':
				msg = myself.ide.showMessage('Updating\nproject list...');
				this.projectList = [];
				SnapCloud.getProjectList(
					function (projectList) {
						myself.installCloudProjectList(projectList);
						msg.destroy();
					},
					function (err, lbl) {
						msg.destroy();
						myself.ide.cloudError().call(null, err, lbl);
					}
				);
				return;
			case 'examples':
				this.projectList = this.getExamplesProjectList();
				break;
			case 'local':
				this.projectList = this.getLocalProjectList();
				break;
		}

		this.listField.destroy();
		this.listField = new ListMorph(
			this.projectList,
			this.projectList.length > 0 ?
				function (element) {
					return element.name;
				} : null,
			null,
			function () {
				myself.ok();
			}
		);

		this.fixListFieldItemColors();
		this.listField.fixLayout = nop;
		this.listField.edge = InputFieldMorph.prototype.edge;
		this.listField.fontSize = InputFieldMorph.prototype.fontSize;
		this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
		this.listField.contrast = InputFieldMorph.prototype.contrast;
		this.listField.drawNew = InputFieldMorph.prototype.drawNew;
		this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

		if (this.source === 'local') {
			this.listField.action = function (item) {
				var src, xml;

				if (item === undefined) {
					return;
				}
				if (myself.nameField) {
					myself.nameField.setContents(item.name || '');
				}
				if (myself.task === 'open') {

					src = localStorage['-snap-project-' + item.name];
					xml = myself.ide.serializer.parse(src);

					myself.notesText.text = xml.childNamed('notes').contents
					|| '';
					myself.notesText.drawNew();
					myself.notesField.contents.adjustBounds();
					myself.preview.texture = xml.childNamed('thumbnail').contents
					|| null;
					myself.preview.cachedTexture = null;
					myself.preview.drawNew();
				}
				myself.edit();
			};
		} else { // 'examples', 'cloud' is initialized elsewhere
			this.listField.action = function (item) {
				var src, xml;
				if (item === undefined) {
					return;
				}
				if (myself.nameField) {
					myself.nameField.setContents(item.name || '');
				}
				src = myself.ide.getURL(
					'http://snap.berkeley.edu/snapsource/Examples/' +
					item.name + '.xml'
				);

				xml = myself.ide.serializer.parse(src);
				myself.notesText.text = xml.childNamed('notes').contents
				|| '';
				myself.notesText.drawNew();
				myself.notesField.contents.adjustBounds();
				myself.preview.texture = xml.childNamed('thumbnail').contents
				|| null;
				myself.preview.cachedTexture = null;
				myself.preview.drawNew();
				myself.edit();
			};
		}
		this.body.add(this.listField);
		this.shareButton.hide();
		this.unshareButton.hide();
		if (this.source === 'local') {
			this.deleteButton.show();
		} else { // examples
			this.deleteButton.hide();
		}
		this.buttons.fixLayout();
		this.fixLayout();
		if (this.task === 'open') {
			this.clearDetails();
		}
	},

	getLocalProjectList: function () {
		var stored, name, dta,
			projects = [];
		for (stored in localStorage) {
			if (Object.prototype.hasOwnProperty.call(localStorage, stored)
				&& stored.substr(0, 14) === '-snap-project-') {
				name = stored.substr(14);
				dta = {
					name: name,
					thumb: null,
					notes: null
				};
				projects.push(dta);
			}
		}
		projects.sort(function (x, y) {
			return x.name < y.name ? -1 : 1;
		});
		return projects;
	},

	getExamplesProjectList: function () {
		var dir,
			projects = [];

		dir = this.ide.getURL('http://snap.berkeley.edu/snapsource/Examples/');
		dir.split('\n').forEach(
			function (line) {
				var startIdx = line.search(new RegExp('href=".*xml"')),
					endIdx,
					name,
					dta;
				if (startIdx > 0) {
					endIdx = line.search(new RegExp('.xml'));
					name = line.substring(startIdx + 6, endIdx);
					dta = {
						name: name,
						thumb: null,
						notes: null
					};
					projects.push(dta);
				}
			}
		);
		projects.sort(function (x, y) {
			return x.name < y.name ? -1 : 1;
		});
		return projects;
	},

	installCloudProjectList: function (pl) {
		var myself = this;
		this.projectList = pl || [];
		this.projectList.sort(function (x, y) {
			return x.ProjectName < y.ProjectName ? -1 : 1;
		});

		this.listField.destroy();
		this.listField = new ListMorph(
			this.projectList,
			this.projectList.length > 0 ?
				function (element) {
					return element.ProjectName;
				} : null,
			[ // format: display shared project names bold
				[
					'bold',
					function (proj) {
						return proj.Public === 'true';
					}
				]
			],
			function () {
				myself.ok();
			}
		);
		this.fixListFieldItemColors();
		this.listField.fixLayout = nop;
		this.listField.edge = InputFieldMorph.prototype.edge;
		this.listField.fontSize = InputFieldMorph.prototype.fontSize;
		this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
		this.listField.contrast = InputFieldMorph.prototype.contrast;
		this.listField.drawNew = InputFieldMorph.prototype.drawNew;
		this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

		this.listField.action = function (item) {
			if (item === undefined) {
				return;
			}
			if (myself.nameField) {
				myself.nameField.setContents(item.ProjectName || '');
			}
			if (myself.task === 'open') {
				myself.notesText.text = item.Notes || '';
				myself.notesText.drawNew();
				myself.notesField.contents.adjustBounds();
				myself.preview.texture = item.Thumbnail || null;
				myself.preview.cachedTexture = null;
				myself.preview.drawNew();
				(new SpeechBubbleMorph(new TextMorph(
					localize('last changed') + '\n' + item.Updated,
					null,
					null,
					null,
					null,
					'center'
				))).popUp(
					myself.world(),
					myself.preview.rightCenter().add(new Point(2, 0))
				);
			}
			if (item.Public === 'true') {
				myself.shareButton.hide();
				myself.unshareButton.show();
			} else {
				myself.unshareButton.hide();
				myself.shareButton.show();
			}
			myself.buttons.fixLayout();
			myself.fixLayout();
			myself.edit();
		};
		this.body.add(this.listField);
		this.shareButton.show();
		this.unshareButton.hide();
		this.deleteButton.show();
		this.buttons.fixLayout();
		this.fixLayout();
		if (this.task === 'open') {
			this.clearDetails();
		}
	},

	clearDetails: function () {
		this.notesText.text = '';
		this.notesText.drawNew();
		this.notesField.contents.adjustBounds();
		this.preview.texture = null;
		this.preview.cachedTexture = null;
		this.preview.drawNew();
	},

	openProject: function () {
		var proj = this.listField.selected,
			src;
		if (!proj) {
			return;
		}
		this.ide.source = this.source;
		if (this.source === 'cloud') {
			this.openCloudProject(proj);
		} else if (this.source === 'examples') {
			src = this.ide.getURL(
				'http://snap.berkeley.edu/snapsource/Examples/' +
				proj.name + '.xml'
			);
			this.ide.openProjectString(src);
			this.destroy();
		} else { // 'local'
			this.ide.openProject(proj.name);
			this.destroy();
		}
	},

	openCloudProject: function (project) {
		var myself = this;
		myself.ide.nextSteps([
			function () {
				myself.ide.showMessage('Fetching project\nfrom the cloud...');
			},
			function () {
				myself.rawOpenCloudProject(project);
			}
		]);
	},

	rawOpenCloudProject: function (proj) {
		var myself = this;
		SnapCloud.reconnect(
			function () {
				SnapCloud.callService(
					'getProject',
					function (response) {
						SnapCloud.disconnect();
						myself.ide.source = 'cloud';
						myself.ide.droppedText(response[0].SourceCode);
						if (proj.Public === 'true') {
							location.hash = '#present:Username=' +
							encodeURIComponent(SnapCloud.username) +
							'&ProjectName=' +
							encodeURIComponent(proj.ProjectName);
						}
					},
					myself.ide.cloudError(),
					[proj.ProjectName]
				);
			},
			myself.ide.cloudError()
		);
		this.destroy();
	},

	saveProject: function () {
		var name = this.nameField.contents().text.text,
			notes = this.notesText.text,
			myself = this;

		this.ide.projectNotes = notes || this.ide.projectNotes;
		if (name) {
			if (this.source === 'cloud') {
				if (detect(
						this.projectList,
						function (item) {
							return item.ProjectName === name;
						}
					)) {
					this.ide.confirm(
						localize(
							'Are you sure you want to replace'
						) + '\n"' + name + '"?',
						'Replace Project',
						function () {
							myself.ide.setProjectName(name);
							myself.saveCloudProject();
						}
					);
				} else {
					this.ide.setProjectName(name);
					myself.saveCloudProject();
				}
			} else { // 'local'
				if (detect(
						this.projectList,
						function (item) {
							return item.name === name;
						}
					)) {
					this.ide.confirm(
						localize(
							'Are you sure you want to replace'
						) + '\n"' + name + '"?',
						'Replace Project',
						function () {
							myself.ide.setProjectName(name);
							myself.ide.source = 'local';
							myself.ide.saveProject(name);
							myself.destroy();
						}
					);
				} else {
					this.ide.setProjectName(name);
					myself.ide.source = 'local';
					this.ide.saveProject(name);
					this.destroy();
				}
			}
		}
	},

	saveCloudProject: function () {
		var myself = this;
		this.ide.showMessage('Saving project\nto the cloud...');
		SnapCloud.saveProject(
			this.ide,
			function () {
				myself.ide.source = 'cloud';
				myself.ide.showMessage('saved.', 2);
			},
			this.ide.cloudError()
		);
		this.destroy();
	},

	deleteProject: function () {
		var myself = this,
			proj,
			idx,
			name;

		if (this.source === 'cloud') {
			proj = this.listField.selected;
			if (proj) {
				this.ide.confirm(
					localize(
						'Are you sure you want to delete'
					) + '\n"' + proj.ProjectName + '"?',
					'Delete Project',
					function () {
						SnapCloud.reconnect(
							function () {
								SnapCloud.callService(
									'deleteProject',
									function () {
										SnapCloud.disconnect();
										myself.ide.hasChangedMedia = true;
										idx = myself.projectList.indexOf(proj);
										myself.projectList.splice(idx, 1);
										myself.installCloudProjectList(
											myself.projectList
										); // refresh list
									},
									myself.ide.cloudError(),
									[proj.ProjectName]
								);
							},
							myself.ide.cloudError()
						);
					}
				);
			}
		} else { // 'local, examples'
			if (this.listField.selected) {
				name = this.listField.selected.name;
				this.ide.confirm(
					localize(
						'Are you sure you want to delete'
					) + '\n"' + name + '"?',
					'Delete Project',
					function () {
						delete localStorage['-snap-project-' + name];
						myself.setSource(myself.source); // refresh list
					}
				);
			}
		}
	},

	shareProject: function () {
		var myself = this,
			proj = this.listField.selected,
			entry = this.listField.active;

		if (proj) {
			this.ide.confirm(
				localize(
					'Are you sure you want to publish'
				) + '\n"' + proj.ProjectName + '"?',
				'Share Project',
				function () {
					myself.ide.showMessage('sharing\nproject...');
					SnapCloud.reconnect(
						function () {
							SnapCloud.callService(
								'publishProject',
								function () {
									SnapCloud.disconnect();
									proj.Public = 'true';
									myself.unshareButton.show();
									myself.shareButton.hide();
									entry.label.isBold = true;
									entry.label.drawNew();
									entry.label.changed();
									myself.buttons.fixLayout();
									myself.drawNew();
									myself.ide.showMessage('shared.', 2);
								},
								myself.ide.cloudError(),
								[proj.ProjectName]
							);
						},
						myself.ide.cloudError()
					);
				}
			);
		}
	},

	unshareProject: function () {
		var myself = this,
			proj = this.listField.selected,
			entry = this.listField.active;


		if (proj) {
			this.ide.confirm(
				localize(
					'Are you sure you want to unpublish'
				) + '\n"' + proj.ProjectName + '"?',
				'Unshare Project',
				function () {
					myself.ide.showMessage('unsharing\nproject...');
					SnapCloud.reconnect(
						function () {
							SnapCloud.callService(
								'unpublishProject',
								function () {
									SnapCloud.disconnect();
									proj.Public = 'false';
									myself.shareButton.show();
									myself.unshareButton.hide();
									entry.label.isBold = false;
									entry.label.drawNew();
									entry.label.changed();
									myself.buttons.fixLayout();
									myself.drawNew();
									myself.ide.showMessage('unshared.', 2);
								},
								myself.ide.cloudError(),
								[proj.ProjectName]
							);
						},
						myself.ide.cloudError()
					);
				}
			);
		}
	},

	edit: function () {
		if (this.nameField) {
			this.nameField.edit();
		}
	},

	// ProjectDialogMorph layout

	fixLayout: function () {
		var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
			thin = this.padding / 2,
			oldFlag = Morph.prototype.trackChanges;

		Morph.prototype.trackChanges = false;

		if (this.buttons && (this.buttons.children.length > 0)) {
			this.buttons.fixLayout();
		}

		if (this.body) {
			this.body.setPosition(this.position().add(new Point(
				this.padding,
				th + this.padding
			)));
			this.body.setExtent(new Point(
				this.width() - this.padding * 2,
				this.height() - this.padding * 3 - th - this.buttons.height()
			));
			this.srcBar.setPosition(this.body.position());
			if (this.nameField) {
				this.nameField.setWidth(
					this.body.width() - this.srcBar.width() - this.padding * 6
				);
				this.nameField.setLeft(this.srcBar.right() + this.padding * 3);
				this.nameField.setTop(this.srcBar.top());
				this.nameField.drawNew();
			}

			this.listField.setLeft(this.srcBar.right() + this.padding);
			this.listField.setWidth(
				this.body.width()
				- this.srcBar.width()
				- this.preview.width()
				- this.padding
				- thin
			);
			this.listField.contents.children[0].adjustWidths();

			if (this.nameField) {
				this.listField.setTop(this.nameField.bottom() + this.padding);
				this.listField.setHeight(
					this.body.height() - this.nameField.height() - this.padding
				);
			} else {
				this.listField.setTop(this.body.top());
				this.listField.setHeight(this.body.height());
			}

			this.preview.setRight(this.body.right());
			if (this.nameField) {
				this.preview.setTop(this.nameField.bottom() + this.padding);
			} else {
				this.preview.setTop(this.body.top());
			}

			this.notesField.setTop(this.preview.bottom() + thin);
			this.notesField.setLeft(this.preview.left());
			this.notesField.setHeight(
				this.body.bottom() - this.preview.bottom() - thin
			);
		}

		if (this.label) {
			this.label.setCenter(this.center());
			this.label.setTop(this.top() + (th - this.label.height()) / 2);
		}

		if (this.buttons && (this.buttons.children.length > 0)) {
			this.buttons.setCenter(this.center());
			this.buttons.setBottom(this.bottom() - this.padding);
		}

		Morph.prototype.trackChanges = oldFlag;
		this.changed();
	}
});

ProjectDialogMorph.uber = DialogBoxMorph.prototype;
ProjectDialogMorph.className = 'ProjectDialogMorph';

module.exports = ProjectDialogMorph;