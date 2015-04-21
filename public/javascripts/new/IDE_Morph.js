/**
 * Created by Shurelia on 29/3/2015.
 */

// Requires
var Morph = require('./Morph');
var Color =  require('./Color');
var StringMorph = require('./StringMorph');
var Point = require('./Point');
var Rectangle = require('./Rectangle');
var TextMorph = require('./TextMorph');
var PushButtonMorph = require('./PushButtonMorph');
var ToggleButtonMorph = require('./ToggleButtonMorph');
var DialogBoxMorph = require('./DialogBoxMorph');
var ScrollFrameMorph = require('./ScrollFrameMorph');
var TabMorph = require('./TabMorph');
var InputFieldMorph = require('./InputFieldMorph');
var ToggleMorph = require('./ToggleMorph');
var FrameMorph = require('./FrameMorph');
var AlignmentMorph = require('./AlignmentMorph');

// I am SNAP's top-level frame the editor window.
// IDE_Morph inherits from Morph.



var IDE_Morph = Class.create(Morph, {

	initialize: function() {

	},

	init: function($super, isAutoFill) {
		// global font setting
		MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

		// restore saved user preferences
		this.userLanguage = null; // user language preference for startup
		this.applySavedSettings();

		// additional properties:
		this.cloudMsg = null;
		this.source = 'local';
		this.serializer = new SnapSerializer();

		this.globalVariables = new VariableFrame();
		this.currentSprite = new SpriteMorph(this.globalVariables);
		this.shareBoxPlaceholderSprite = new SpriteMorph(this.globalVariables);
		this.sprites = new List([this.currentSprite]);
		this.currentCategory = 'motion';
		this.currentTab = 'scripts';
		this.currentShareBoxTab = 'scripts';
		this.currentShareBoxConnectTab = 'connect';
		this.projectName = '';
		this.projectNotes = '';

		this.logo = null;
		this.controlBar = null;
		this.categories = null;
		this.palette = null;
		this.spriteBar = null;
		this.spriteEditor = null;
		this.stage = null;
		this.corralBar = null;
		this.corral = null;
		this.shareBoxBar = null;
		this.shareBox = null;
		this.shareAssetsBox = null;
		this.shareBoxTitleBar = null;
		this.shareBoxConnectBar = null;
		this.shareBoxConnect = null;

		this.isAutoFill = isAutoFill || true;
		this.isAppMode = false;
		this.isSmallStage = false;
		this.filePicker = null;
		this.hasChangedMedia = false;

		this.isAnimating = true;
		this.stageRatio = 1; // for IDE animations, e.g. when zooming

		this.loadNewProject = false; // flag when starting up translated
		this.shield = null;

		// initialize inherited properties:
		IDE_Morph.uber.init.call(this);

		// override inherited properties:
		this.color = this.backgroundColor;
	},

	setDefaultDesign: function() {
		MorphicPreferences.isFlat = false;
		SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
		SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
		StageMorph.prototype.paletteTextColor = SpriteMorph.prototype.paletteTextColor;
		StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
		SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor.lighter(30);

		IDE_Morph.prototype.buttonContrast = 30;
		IDE_Morph.prototype.backgroundColor = new Color(40, 40, 40);
		IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

		IDE_Morph.prototype.groupColor = SpriteMorph.prototype.paletteColor.lighter(8);
		IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
		IDE_Morph.prototype.buttonLabelColor = new Color(255, 255, 255);
		IDE_Morph.prototype.tabColors = [
			IDE_Morph.prototype.groupColor.darker(40),
			IDE_Morph.prototype.groupColor.darker(60),
			IDE_Morph.prototype.groupColor
		];
		IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
		IDE_Morph.prototype.appModeColor = new Color();
		IDE_Morph.prototype.scriptsPaneTexture = 'scriptsPaneTexture.gif';
		IDE_Morph.prototype.padding = 5;

		SpriteIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		CostumeIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		SoundIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		TurtleIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
	},

	setFlatDesign: function () {
		MorphicPreferences.isFlat = true;
		SpriteMorph.prototype.paletteColor = new Color(255, 255, 255);
		SpriteMorph.prototype.paletteTextColor = new Color(70, 70, 70);
		StageMorph.prototype.paletteTextColor = SpriteMorph.prototype.paletteTextColor;
		StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
		SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor;

		IDE_Morph.prototype.buttonContrast = 30;
		IDE_Morph.prototype.backgroundColor = new Color(200, 200, 200);
		IDE_Morph.prototype.frameColor = new Color(255, 255, 255);

		IDE_Morph.prototype.groupColor = new Color(230, 230, 230);
		IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
		IDE_Morph.prototype.buttonLabelColor = new Color(70, 70, 70);
		IDE_Morph.prototype.tabColors = [
			IDE_Morph.prototype.groupColor.lighter(60),
			IDE_Morph.prototype.groupColor.darker(10),
			IDE_Morph.prototype.groupColor
		];
		IDE_Morph.prototype.rotationStyleColors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.groupColor.darker(10),
			IDE_Morph.prototype.groupColor.darker(30)
		];
		IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
		IDE_Morph.prototype.scriptsPaneTexture = null;
		IDE_Morph.prototype.padding = 1;

		SpriteIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		CostumeIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		SoundIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
		TurtleIconMorph.prototype.labelColor = IDE_Morph.prototype.buttonLabelColor;
	},

	openIn: function (world) {
		var hash, usr, myself = this, urlLanguage = null;

		this.buildPanes();
		world.add(this);
		world.userMenu = this.userMenu;

		// get persistent user data, if any
		if (localStorage) {
			usr = localStorage['-snap-user'];
			if (usr) {
				usr = SnapCloud.parseResponse(usr)[0];
				if (usr) {
					SnapCloud.username = usr.username || null;
					SnapCloud.password = usr.password || null;
				}
			}
		}

		// override SnapCloud's user message with Morphic
		SnapCloud.message = function (string) {
			var m = new MenuMorph(null, string),
				intervalHandle;
			m.popUpCenteredInWorld(world);
			intervalHandle = setInterval(function () {
				m.destroy();
				clearInterval(intervalHandle);
			}, 2000);
		};

		// prevent non-DialogBoxMorphs from being dropped
		// onto the World in user-mode
		world.reactToDropOf = function (morph) {
			if (!(morph instanceof DialogBoxMorph)) {
				if (world.hand.grabOrigin) {
					morph.slideBackTo(world.hand.grabOrigin);
				} else {
					world.hand.grab(morph);
				}
			}
		};

		this.reactToWorldResize(world.bounds);

		function getURL(url) {
			try {
				var request = new XMLHttpRequest();
				request.open('GET', url, false);
				request.send();
				if (request.status === 200) {
					return request.responseText;
				}
				throw new Error('unable to retrieve ' + url);
			} catch (err) {
				return;
			}
		}

		// dynamic notifications from non-source text files
		// has some issues, commented out for now
		/*
		 this.cloudMsg = getURL('http://snap.berkeley.edu/cloudmsg.txt');
		 motd = getURL('http://snap.berkeley.edu/motd.txt');
		 if (motd) {
		 this.inform('Snap!', motd);
		 }
		 */

		function interpretUrlAnchors() {
			var dict;
			if (location.hash.substr(0, 6) === '#open:') {
				hash = location.hash.substr(6);
				if (hash.charAt(0) === '%'
					|| hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
					hash = decodeURIComponent(hash);
				}
				if (contains(
						['project', 'blocks', 'sprites', 'snapdata'].map(
							function (each) {
								return hash.substr(0, 8).indexOf(each);
							}
						),
						1
					)) {
					this.droppedText(hash);
				} else {
					this.droppedText(getURL(hash));
				}
			} else if (location.hash.substr(0, 5) === '#run:') {
				hash = location.hash.substr(5);
				if (hash.charAt(0) === '%'
					|| hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
					hash = decodeURIComponent(hash);
				}
				if (hash.substr(0, 8) === '<project>') {
					this.rawOpenProjectString(hash);
				} else {
					this.rawOpenProjectString(getURL(hash));
				}
				this.toggleAppMode(true);
				this.runScripts();
			} else if (location.hash.substr(0, 9) === '#present:') {
				this.shield = new Morph();
				this.shield.color = this.color;
				this.shield.setExtent(this.parent.extent());
				this.parent.add(this.shield);
				myself.showMessage('Fetching project\nfrom the cloud...');

				// make sure to lowercase the username
				dict = SnapCloud.parseDict(location.hash.substr(9));
				dict.Username = dict.Username.toLowerCase();

				SnapCloud.getPublicProject(
					SnapCloud.encodeDict(dict),
					function (projectData) {
						var msg;
						myself.nextSteps([
							function () {
								msg = myself.showMessage('Opening project...');
							},
							function () {
								if (projectData.indexOf('<snapdata') === 0) {
									myself.rawOpenCloudDataString(projectData);
								} else if (
									projectData.indexOf('<project') === 0
								) {
									myself.rawOpenProjectString(projectData);
								}
								myself.hasChangedMedia = true;
							},
							function () {
								myself.shield.destroy();
								myself.shield = null;
								msg.destroy();
								myself.toggleAppMode(true);
								myself.runScripts();
							}
						]);
					},
					this.cloudError()
				);
			} else if (location.hash.substr(0, 6) === '#lang:') {
				urlLanguage = location.hash.substr(6);
				this.setLanguage(urlLanguage);
				this.loadNewProject = true;
			} else if (location.hash.substr(0, 7) === '#signup') {
				this.createCloudAccount();
			}
		}

		if (this.userLanguage) {
			this.setLanguage(this.userLanguage, interpretUrlAnchors);
		} else {
			interpretUrlAnchors.call(this);
		}
	},

	buildPanes: function () {
		this.createLogo();
		this.createControlBar();
		this.createCategories();
		this.createPalette();
		this.createStage();
		this.createSpriteBar();
		this.createSpriteEditor();
		this.createCorralBar();
		this.createCorral();
		this.createShareBoxTitleBar();
		this.createShareBoxBar();
		this.createShareBox();
		this.createShareAssetsBox();
		this.createShareBoxConnectBar();
		this.createShareBoxConnect();
	},

	// @BEGIN Supporting functions contained in BuildPanes.
	// Go to '@END' for the next section.

	createLogo: function () {
		var myself = this;

		if (this.logo) {
			this.logo.destroy();
		}

		this.logo = new Morph();
		this.logo.texture = 'images/cc_logo.png'; // xinni: new logo
		this.logo.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d'),
				gradient = context.createLinearGradient(
					0,
					0,
					this.width(),
					0
				);
			//gradient.addColorStop(0, 'grey');
			//gradient.addColorStop(0.5, myself.frameColor.toString());
			context.fillStyle = MorphicPreferences.isFlat ?
				myself.frameColor.toString() : gradient;
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		this.logo.drawCachedTexture = function () {
			var context = this.image.getContext('2d');
			context.drawImage(
				this.cachedTexture,
				5,
				Math.round((this.height() - this.cachedTexture.height) / 2)
			);
			this.changed();
		};

		this.logo.mouseClickLeft = function () {
			myself.snapMenu();
		};

		this.logo.color = new Color();
		this.logo.setExtent(new Point(200, 28)); // xinni: edited dimensions of the logo
		this.add(this.logo);
	},

	createControlBar: function () {
		// assumes the logo has already been created
		var padding = 5,
			button,
			stopButton,
			pauseButton,
			startButton,
			projectButton,
			settingsButton,
			stageSizeButton,
			appModeButton,
			cloudButton,
			x,
			colors = [
				this.groupColor.darker(3),
				this.frameColor.darker(40),
				this.frameColor.darker(40)
			],
			myself = this;

		if (this.controlBar) {
			this.controlBar.destroy();
		}

		this.controlBar = new Morph();
		this.controlBar.color = this.frameColor;
		this.controlBar.setHeight(this.logo.height()); // height is fixed
		this.controlBar.mouseClickLeft = function () {
			this.world().fillPage();
		};
		this.add(this.controlBar);

		//smallStageButton
		button = new ToggleButtonMorph(
			null, //colors,
			myself, // the IDE is the target
			'toggleStageSize',
			[
				new SymbolMorph('smallStage', 14),
				new SymbolMorph('normalStage', 14)
			],
			function () {  // query
				return myself.isSmallStage;
			}
		);

		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = this.buttonLabelColor;
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'stage size\nsmall & normal';
		button.fixLayout();
		button.refresh();
		stageSizeButton = button;
		this.controlBar.add(stageSizeButton);
		this.controlBar.stageSizeButton = button; // for refreshing

		//appModeButton
		button = new ToggleButtonMorph(
			null, //colors,
			myself, // the IDE is the target
			'toggleAppMode',
			[
				new SymbolMorph('fullScreen', 14),
				new SymbolMorph('normalScreen', 14)
			],
			function () {  // query
				return myself.isAppMode;
			}
		);

		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = this.buttonLabelColor;
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'app & edit\nmodes';
		button.fixLayout();
		button.refresh();
		appModeButton = button;
		this.controlBar.add(appModeButton);
		this.controlBar.appModeButton = appModeButton; // for refreshing

		// stopButton
		button = new PushButtonMorph(
			this,
			'stopAllScripts',
			new SymbolMorph('octagon', 14)
		);
		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = new Color(200, 0, 0);
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'stop\nevery-\nthing';
		button.fixLayout();
		stopButton = button;
		this.controlBar.add(stopButton);

		//pauseButton
		button = new ToggleButtonMorph(
			null, //colors,
			myself, // the IDE is the target
			'togglePauseResume',
			[
				new SymbolMorph('pause', 12),
				new SymbolMorph('pointRight', 14)
			],
			function () {  // query
				return myself.isPaused();
			}
		);

		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = new Color(255, 220, 0);
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'pause/resume\nall scripts';
		button.fixLayout();
		button.refresh();
		pauseButton = button;
		this.controlBar.add(pauseButton);
		this.controlBar.pauseButton = pauseButton; // for refreshing

		// startButton
		button = new PushButtonMorph(
			this,
			'pressStart',
			new SymbolMorph('flag', 14)
		);
		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = new Color(0, 200, 0);
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'start green\nflag scripts';
		button.fixLayout();
		startButton = button;
		this.controlBar.add(startButton);
		this.controlBar.startButton = startButton;

		// projectButton
		button = new PushButtonMorph(
			this,
			'projectMenu',
			new SymbolMorph('file', 14)
			//'\u270E'
		);
		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = this.buttonLabelColor;
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'open, save, & annotate project';
		button.fixLayout();
		projectButton = button;
		this.controlBar.add(projectButton);
		this.controlBar.projectButton = projectButton; // for menu positioning

		// settingsButton
		button = new PushButtonMorph(
			this,
			'settingsMenu',
			new SymbolMorph('gears', 14)
			//'\u2699'
		);
		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = this.buttonLabelColor;
		button.contrast = this.buttonContrast;
		button.drawNew();
		button.fixLayout();
		settingsButton = button;
		this.controlBar.add(settingsButton);
		this.controlBar.settingsButton = settingsButton; // for menu positioning

		// cloudButton
		button = new PushButtonMorph(
			this,
			'cloudMenu',
			new SymbolMorph('cloud', 11)
		);
		button.corner = 12;
		button.color = colors[0];
		button.highlightColor = colors[1];
		button.pressColor = colors[2];
		button.labelMinExtent = new Point(36, 18);
		button.padding = 0;
		button.labelShadowOffset = new Point(-1, -1);
		button.labelShadowColor = colors[1];
		button.labelColor = this.buttonLabelColor;
		button.contrast = this.buttonContrast;
		button.drawNew();
		// button.hint = 'cloud operations';
		button.fixLayout();
		cloudButton = button;
		this.controlBar.add(cloudButton);
		this.controlBar.cloudButton = cloudButton; // for menu positioning

		this.controlBar.fixLayout = function () {
			x = this.right() - padding;
			[stopButton, pauseButton, startButton].forEach(
				function (button) {
					button.setCenter(myself.controlBar.center());
					button.setRight(x);
					x -= button.width();
					x -= padding;
				}
			);

			x = myself.right() - (StageMorph.prototype.dimensions.x
			* (myself.isSmallStage ? myself.stageRatio : 1));

			[stageSizeButton, appModeButton].forEach(
				function (button) {
					x += padding;
					button.setCenter(myself.controlBar.center());
					button.setLeft(x);
					x += button.width();
				}
			);

			settingsButton.setCenter(myself.controlBar.center());
			settingsButton.setLeft(this.left() + 100); // xinni: new logo is bigger, hence shifted top buttons right.

			cloudButton.setCenter(myself.controlBar.center());
			cloudButton.setRight(settingsButton.left() - padding);

			projectButton.setCenter(myself.controlBar.center());
			projectButton.setRight(cloudButton.left() - padding);

			this.updateLabel();
		};

		this.controlBar.updateLabel = function () {
			var suffix = myself.world().isDevMode ?
			' - ' + localize('development mode') : '';

			if (this.label) {
				this.label.destroy();
			}
			if (myself.isAppMode) {
				return;
			}

			this.label = new StringMorph(
				(myself.projectName || localize('untitled')) + suffix,
				14,
				'sans-serif',
				true,
				false,
				false,
				MorphicPreferences.isFlat ? null : new Point(2, 1),
				myself.frameColor.darker(myself.buttonContrast)
			);
			this.label.color = myself.buttonLabelColor;
			this.label.drawNew();
			this.add(this.label);
			this.label.setCenter(this.center());
			this.label.setLeft(this.settingsButton.right() + padding);
		};
	},

	createCategories: function () {
		// assumes the logo has already been created
		var myself = this;

		if (this.categories) {
			this.categories.destroy();
		}
		this.categories = new Morph();
		this.categories.color = this.groupColor;
		this.categories.silentSetWidth(this.logo.width()); // width is fixed

		function addCategoryButton(category) {
			var labelWidth = 75,
				colors = [
					myself.frameColor,
					myself.frameColor.darker(50),
					SpriteMorph.prototype.blockColor[category]
				],
				button;

			button = new ToggleButtonMorph(
				colors,
				myself, // the IDE is the target
				function () {
					myself.currentCategory = category;
					myself.categories.children.forEach(function (each) {
						each.refresh();
					});
					myself.refreshPalette(true);
				},
				category[0].toUpperCase().concat(category.slice(1)), // label
				function () {  // query
					return myself.currentCategory === category;
				},
				null, // env
				null, // hint
				null, // template cache
				labelWidth, // minWidth
				true // has preview
			);

			button.corner = 8;
			button.padding = 0;
			button.labelShadowOffset = new Point(-1, -1);
			button.labelShadowColor = colors[1];
			button.labelColor = myself.buttonLabelColor;
			button.fixLayout();
			button.refresh();
			myself.categories.add(button);
			return button;
		}

		function fixCategoriesLayout() {
			var buttonWidth = myself.categories.children[0].width(),
				buttonHeight = myself.categories.children[0].height(),
				border = 3,
				rows = Math.ceil((myself.categories.children.length) / 2),
				xPadding = (myself.categories.width()
					- border
					- buttonWidth * 2) / 3,
				yPadding = 2,
				l = myself.categories.left(),
				t = myself.categories.top(),
				i = 0,
				row,
				col;

			myself.categories.children.forEach(function (button) {
				i += 1;
				row = Math.ceil(i / 2);
				col = 2 - (i % 2);
				button.setPosition(new Point(
					l + (col * xPadding + ((col - 1) * buttonWidth)),
					t + (row * yPadding + ((row - 1) * buttonHeight) + border)
				));
			});

			myself.categories.setHeight(
				(rows + 1) * yPadding
				+ rows * buttonHeight
				+ 2 * border
			);
		}

		SpriteMorph.prototype.categories.forEach(function (cat) {
			if (!contains(['lists', 'other'], cat)) {
				addCategoryButton(cat);
			}
		});
		fixCategoriesLayout();
		this.add(this.categories);
	},

	createPalette: function (forSearching) {
		// assumes that the logo pane has already been created
		// needs the categories pane for layout
		var myself = this;

		if (this.palette) {
			this.palette.destroy();
		}

		if (forSearching) {
			this.palette = new ScrollFrameMorph(
				null,
				null,
				this.currentSprite.sliderColor
			);
		} else {
			this.palette = this.currentSprite.palette(this.currentCategory);
		}
		this.palette.isDraggable = false;
		this.palette.acceptsDrops = true;
		this.palette.contents.acceptsDrops = false;

		this.palette.reactToDropOf = function (droppedMorph) {
			if (droppedMorph instanceof DialogBoxMorph) {
				myself.world().add(droppedMorph);
			} else if (droppedMorph instanceof SpriteMorph) {
				myself.removeSprite(droppedMorph);
			} else if (droppedMorph instanceof SpriteIconMorph) {
				droppedMorph.destroy();
				myself.removeSprite(droppedMorph.object);
			} else if (droppedMorph instanceof CostumeIconMorph) {
				myself.currentSprite.wearCostume(null);
				droppedMorph.destroy();
			} else {
				droppedMorph.destroy();
			}
		};

		this.palette.setWidth(this.logo.width());
		this.add(this.palette);
		return this.palette;
	},

	createStage: function () {
		// assumes that the logo pane has already been created
		if (this.stage) {
			this.stage.destroy();
		}
		StageMorph.prototype.frameRate = 0;
		this.stage = new StageMorph(this.globalVariables);
		this.stage.setExtent(this.stage.dimensions); // dimensions are fixed
		if (this.currentSprite instanceof SpriteMorph) {
			this.currentSprite.setPosition(
				this.stage.center().subtract(
					this.currentSprite.extent().divideBy(2)
				)
			);
			this.stage.add(this.currentSprite);
		}
		this.add(this.stage);
	},

	createSpriteBar: function () {
		// assumes that the categories pane has already been created
		var rotationStyleButtons = [],
			thumbSize = new Point(45, 45),
			nameField,
			padlock,
			thumbnail,
			tabCorner = 15,
			tabColors = this.tabColors,
			tabBar = new AlignmentMorph('row', -tabCorner * 2),
			tab,
			symbols = ['\u2192', '\u21BB', '\u2194'],
			labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
			myself = this;

		if (this.spriteBar) {
			this.spriteBar.destroy();
		}

		this.spriteBar = new Morph();
		this.spriteBar.color = this.frameColor;
		this.add(this.spriteBar);

		function addRotationStyleButton(rotationStyle) {
			var colors = myself.rotationStyleColors,
				button;

			button = new ToggleButtonMorph(
				colors,
				myself, // the IDE is the target
				function () {
					if (myself.currentSprite instanceof SpriteMorph) {
						myself.currentSprite.rotationStyle = rotationStyle;
						myself.currentSprite.changed();
						myself.currentSprite.drawNew();
						myself.currentSprite.changed();
					}
					rotationStyleButtons.forEach(function (each) {
						each.refresh();
					});
				},
				symbols[rotationStyle], // label
				function () {  // query
					return myself.currentSprite instanceof SpriteMorph
						&& myself.currentSprite.rotationStyle === rotationStyle;
				},
				null, // environment
				localize(labels[rotationStyle])
			);

			button.corner = 8;
			button.labelMinExtent = new Point(11, 11);
			button.padding = 0;
			button.labelShadowOffset = new Point(-1, -1);
			button.labelShadowColor = colors[1];
			button.labelColor = myself.buttonLabelColor;
			button.fixLayout();
			button.refresh();
			rotationStyleButtons.push(button);
			button.setPosition(myself.spriteBar.position().add(2));
			button.setTop(button.top()
				+ ((rotationStyleButtons.length - 1) * (button.height() + 2))
			);
			myself.spriteBar.add(button);
			if (myself.currentSprite instanceof StageMorph) {
				button.hide();
			}
			return button;
		}

		addRotationStyleButton(1);
		addRotationStyleButton(2);
		addRotationStyleButton(0);
		this.rotationStyleButtons = rotationStyleButtons;

		thumbnail = new Morph();
		thumbnail.setExtent(thumbSize);
		thumbnail.image = this.currentSprite.thumbnail(thumbSize);
		thumbnail.setPosition(
			rotationStyleButtons[0].topRight().add(new Point(5, 3))
		);
		this.spriteBar.add(thumbnail);

		thumbnail.fps = 3;

		thumbnail.step = function () {
			if (thumbnail.version !== myself.currentSprite.version) {
				thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
				thumbnail.changed();
				thumbnail.version = myself.currentSprite.version;
			}
		};

		nameField = new InputFieldMorph(this.currentSprite.name);
		nameField.setWidth(100); // fixed dimensions
		nameField.contrast = 90;
		nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
		this.spriteBar.add(nameField);
		nameField.drawNew();
		nameField.accept = function () {
			var newName = nameField.getValue();
			myself.currentSprite.setName(
				myself.newSpriteName(newName, myself.currentSprite)
			);
			nameField.setContents(myself.currentSprite.name);
		};
		this.spriteBar.reactToEdit = nameField.accept;

		// padlock
		padlock = new ToggleMorph(
			'checkbox',
			null,
			function () {
				myself.currentSprite.isDraggable = !myself.currentSprite.isDraggable;
			},
			localize('draggable'),
			function () {
				return myself.currentSprite.isDraggable;
			}
		);
		padlock.label.isBold = false;
		padlock.label.setColor(this.buttonLabelColor);
		padlock.color = tabColors[2];
		padlock.highlightColor = tabColors[0];
		padlock.pressColor = tabColors[1];

		padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
			new Point() : new Point(-1, -1);
		padlock.tick.shadowColor = new Color(); // black
		padlock.tick.color = this.buttonLabelColor;
		padlock.tick.isBold = false;
		padlock.tick.drawNew();

		padlock.setPosition(nameField.bottomLeft().add(2));
		padlock.drawNew();
		this.spriteBar.add(padlock);
		if (this.currentSprite instanceof StageMorph) {
			padlock.hide();
		}

		// tab bar
		tabBar.tabTo = function (tabString) {
			var active;
			myself.currentTab = tabString;
			this.children.forEach(function (each) {
				each.refresh();
				if (each.state) {
					active = each;
				}
			});
			active.refresh(); // needed when programmatically tabbing
			myself.createSpriteEditor();
			myself.fixLayout('tabEditor');
		};

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('scripts');
			},
			localize('Scripts'), // label
			function () {  // query
				return myself.currentTab === 'scripts';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		tabBar.add(tab);

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('costumes');
			},
			localize('Costumes'), // label
			function () {  // query
				return myself.currentTab === 'costumes';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		tabBar.add(tab);

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('sounds');
			},
			localize('Sounds'), // label
			function () {  // query
				return myself.currentTab === 'sounds';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		tabBar.add(tab);

		tabBar.fixLayout();
		tabBar.children.forEach(function (each) {
			each.refresh();
		});
		this.spriteBar.tabBar = tabBar;
		this.spriteBar.add(this.spriteBar.tabBar);

		this.spriteBar.fixLayout = function () {
			this.tabBar.setLeft(this.left());
			this.tabBar.setBottom(this.bottom() + 75);
		};
	},

	createSpriteEditor: function () {
		// assumes that the logo pane and the stage have already been created
		var scripts = this.currentSprite.scripts,
			myself = this;

		if (this.spriteEditor) {
			this.spriteEditor.destroy();
		}

		if (this.currentTab === 'scripts') {
			scripts.isDraggable = false;
			scripts.color = this.groupColor;
			scripts.texture = this.scriptsPaneTexture;

			this.spriteEditor = new ScrollFrameMorph(
				scripts,
				null,
				this.sliderColor
			);
			this.spriteEditor.padding = 10;
			this.spriteEditor.growth = 50;
			this.spriteEditor.isDraggable = false;
			this.spriteEditor.acceptsDrops = false;
			this.spriteEditor.contents.acceptsDrops = true;

			scripts.scrollFrame = this.spriteEditor;
			this.add(this.spriteEditor);
			this.spriteEditor.scrollX(this.spriteEditor.padding);
			this.spriteEditor.scrollY(this.spriteEditor.padding);
		} else if (this.currentTab === 'costumes') {
			this.spriteEditor = new WardrobeMorph(
				this.currentSprite,
				this.sliderColor
			);
			this.spriteEditor.color = this.groupColor;
			this.add(this.spriteEditor);
			this.spriteEditor.updateSelection();

			this.spriteEditor.acceptsDrops = false;
			this.spriteEditor.contents.acceptsDrops = false;
		} else if (this.currentTab === 'sounds') {
			this.spriteEditor = new JukeboxMorph(
				this.currentSprite,
				this.sliderColor
			);
			this.spriteEditor.color = this.groupColor;
			this.add(this.spriteEditor);
			this.spriteEditor.updateSelection();
			this.spriteEditor.acceptDrops = false;
			this.spriteEditor.contents.acceptsDrops = false;
		} else {
			this.spriteEditor = new Morph();
			this.spriteEditor.color = this.groupColor;
			this.spriteEditor.acceptsDrops = true;
			this.spriteEditor.reactToDropOf = function (droppedMorph) {
				if (droppedMorph instanceof DialogBoxMorph) {
					myself.world().add(droppedMorph);
				} else if (droppedMorph instanceof SpriteMorph) {
					myself.removeSprite(droppedMorph);
				} else {
					droppedMorph.destroy();
				}
			};
			this.add(this.spriteEditor);
		}
	},

	createCorralBar: function () {
		// assumes the stage has already been created
		var padding = 5,
			newButton,
			paintButton,
			libraryButton,
			colors = [
				this.groupColor,
				this.frameColor.darker(50),
				this.frameColor.darker(50)
			];

		if (this.corralBar) {
			this.corralBar.destroy();
		}

		this.corralBar = new Morph();
		this.corralBar.color = this.frameColor;
		this.corralBar.setHeight(this.logo.height()); // height is fixed
		this.add(this.corralBar);

		// NEW SPRITE BUTTON ///////////////////////////////////////////
		var button1 = new PushButtonMorph(
			this,
			"addNewSprite",
			new SymbolMorph("turtle", 14),
			null,
			null,
			null,
			"symbolButton"
		);
		button1.drawNew();
		button1.hint = 'Add a new Turtle sprite';
		button1.fixLayout();
		newButton = button1;
		newButton.setCenter(this.corralBar.center());
		newButton.setLeft(this.corralBar.left() + padding);
		this.corralBar.add(newButton);

		// PAINT BUTTON ////////////////////////////////////////////////
		var button2 = new PushButtonMorph(
			this,
			"paintNewSprite",
			new SymbolMorph("brush",15),
			null,
			null,
			null,
			"symbolButton"
		);
		button2.drawNew();
		button2.hint = 'Paint a new sprite';
		button2.fixLayout();
		paintButton = button2;
		paintButton.setCenter(this.corralBar.center());
		paintButton.setTop(newButton.bottom() + padding);
		this.corralBar.add(paintButton);

		// IMPORT FROM LIBRARY /////////////////////////////////////////
		var img = new Image();
		img.src = 'merlion.jpg';
		var button3 = new PushButtonMorph(
			this,
			"openLibrary",
			(String.fromCharCode("0xf03e")),
			null,
			null,
			null,
			"iconButton"
		);
		button3.drawNew();
		button3.hint = 'Open library';
		button3.fixLayout();
		libraryButton = button3;
		libraryButton.setCenter(this.corralBar.center());
		libraryButton.setTop(paintButton.bottom() + padding);
		this.corralBar.add(libraryButton);
	},

	createCorral: function () {
		// assumes the corral bar has already been created
		var frame, template, padding = 5, myself = this;

		if (this.corral) {
			this.corral.destroy();
		}

		this.corral = new Morph();
		this.corral.color = this.groupColor;
		this.add(this.corral);

		this.corral.stageIcon = new SpriteIconMorph(this.stage);
		this.corral.stageIcon.isDraggable = false;
		//this.corral.stageIcon.setPosition(new Point(0,-20));
		this.corral.add(this.corral.stageIcon);

		//this.corral.stageIcon = new SpriteIconMorph(this.stage);
		//this.corral.stageIcon.isDraggable = false;
		//this.corral.add(this.corral.stageIcon);

		frame = new ScrollFrameMorph(null, null, this.sliderColor);
		frame.acceptsDrops = false;
		frame.contents.acceptsDrops = false;

		frame.contents.wantsDropOf = function (morph) {
			return morph instanceof SpriteIconMorph;
		};

		frame.contents.reactToDropOf = function (spriteIcon) {
			myself.corral.reactToDropOf(spriteIcon);
		};

		frame.alpha = 0;

		this.sprites.asArray().forEach(function (morph) {
			template = new SpriteIconMorph(morph, template);
			frame.contents.add(template);
		});

		this.corral.frame = frame;
		this.corral.add(frame);

		this.corral.fixLayout = function () {
			//this.stageIcon.setCenter(this.center());
			//this.stageIcon.setLeft(this.left() + padding);
			this.frame.setLeft(this.stageIcon.right() + padding);
			this.frame.setExtent(new Point(
				this.right() - this.frame.left(),
				this.height()
			));
			this.arrangeIcons();
			this.refresh();
		};

		this.corral.arrangeIcons = function () {
			var x = this.frame.left(),
				y = this.frame.top(),
				max = this.frame.right(),
				start = this.frame.left();

			this.frame.contents.children.forEach(function (icon) {
				var w = icon.width();

				if (x + w > max) {
					x = start;
					y += icon.height(); // they're all the same
				}
				icon.setPosition(new Point(x, y));
				x += w;
			});
			this.frame.contents.adjustBounds();
		};

		this.corral.addSprite = function (sprite) {
			this.frame.contents.add(new SpriteIconMorph(sprite));
			this.fixLayout();
		};

		this.corral.refresh = function () {
			this.stageIcon.refresh();
			this.frame.contents.children.forEach(function (icon) {
				icon.refresh();
			});
		};

		this.corral.wantsDropOf = function (morph) {
			return morph instanceof SpriteIconMorph;
		};

		this.corral.reactToDropOf = function (spriteIcon) {
			var idx = 1,
				pos = spriteIcon.position();
			spriteIcon.destroy();
			this.frame.contents.children.forEach(function (icon) {
				if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
					idx += 1;
				}
			});
			myself.sprites.add(spriteIcon.object, idx);
			myself.createCorral();
			myself.fixLayout();
		};
	},

	// ****************************
	// SHAREBOX
	// ****************************
	// xinni: "settings" and "add member" buttons on the title bar.

	createShareBoxTitleBarButtons: function () {
		// destroy if already exists
		if (this.shareBoxTitleBarButtons) {
			this.shareBoxTitleBarButtons.destroy();
		}

		// initialize frame holder for buttons.
		this.shareBoxTitleBarButtons = new FrameMorph();
		this.shareBoxTitleBarButtons.setColor(this.groupColor.darker(20));
		this.add(this.shareBoxTitleBarButtons);

		console.log("Create sharebox buttons");

		// settings button
		var button1 = new PushButtonMorph(
			this,
			'shareBoxSettingsMenu',
			new SymbolMorph('gears', 14),
			null,
			null,
			null,
			"symbolButton"
		);
		button1.drawNew();
		button1.fixLayout();
		shareBoxSettingsButton = button1;


		// add member button
		var button2 = new PushButtonMorph(
			this,
			"showAddMemberPopup",
			(String.fromCharCode("0xf067")),
			null,
			null,
			null,
			"iconButton"
		);
		button2.drawNew();
		button2.hint = 'New Member';
		button2.fixLayout();
		shareBoxAddMemberButton = button2;


		// add to title bar
		this.shareBoxTitleBarButtons.add(shareBoxSettingsButton);
		this.shareBoxTitleBarButtons.shareBoxSettingsButton = shareBoxSettingsButton;
		this.shareBoxTitleBarButtons.add(shareBoxAddMemberButton);
		this.shareBoxTitleBarButtons.shareBoxAddMemberButton = shareBoxAddMemberButton;

		// position buttons
		if (this.shareBoxTitleBarButtons) {
			// position add new member button
			this.shareBoxTitleBarButtons.shareBoxAddMemberButton.setLeft(this.shareBoxTitleBarButtons.left());
			this.shareBoxTitleBarButtons.shareBoxAddMemberButton.setTop(this.shareBoxTitleBarButtons.top() + 2);

			// position settings button
			this.shareBoxTitleBarButtons.shareBoxSettingsButton.setTop(this.shareBoxTitleBarButtons.top() + 2);
			this.shareBoxTitleBarButtons.shareBoxSettingsButton.setLeft(this.shareBoxTitleBarButtons.shareBoxAddMemberButton.right());
		}

		this.fixLayout();
		this.shareBoxTitleBarButtons.fixLayout = function () {    };
	},

	// xinni: title bar that says 'SHAREBOX'.
	createShareBoxTitleBar: function () {
		// destroy if already exists
		if (this.shareBoxTitleBar) {
			this.shareBoxTitleBar.destroy();
		}

		// initialize frame
		this.shareBoxTitleBar = new FrameMorph();
		this.shareBoxTitleBar.setColor(this.groupColor.darker(20));

		// initialize title "ShareBox"
		this.shareBoxTitle = new StringMorph(
			"ShareBox",
			14,
			'sans-serif',
			true,
			false,
			false,
			null,
			this.frameColor.darker(this.buttonContrast)
		);

		this.shareBoxTitle.setLeft(this.shareBoxTitleBar.left() + 5);
		this.shareBoxTitle.setTop(this.shareBoxTitleBar.top() + 5);
		this.shareBoxTitle.setWidth(200);
		this.shareBoxTitle.drawNew();
		this.shareBoxTitleBar.add(this.shareBoxTitle);

		// add to myself
		this.add(this.shareBoxTitleBar);

		this.shareBoxTitle.fixLayout = function() {
		};
	},

	// xinni: the 'scripts' and 'assets' tabs.
	createShareBoxBar: function () {
		var
			tabCorner = 15,
			tabColors = this.tabColors,
			tabBar = new AlignmentMorph('row', -tabCorner * 2),
			tab,
			myself = this;

		if (this.shareBoxBar) {
			this.shareBoxBar.destroy();
		}

		// delete the connect bar if sharebox is in operation
		if (this.shareBoxConnectBar) {
			this.shareBoxConnectBar.destroy();
		}

		this.shareBoxBar = new Morph();
		this.shareBoxBar.bounds = new Rectangle(0, 0, 0, 0); // xinni: remove unwanted floating rectangle
		this.shareBoxBar.color = null;
		this.add(this.shareBoxBar);

		/*
		 // tab bar
		 tabBar.tabTo = function (tabString) {
		 var active;
		 myself.currentShareBoxTab = tabString;
		 this.children.forEach(function (each) {
		 each.refresh();
		 if (each.state) {active = each; }
		 });
		 active.refresh(); // needed when programmatically tabbing
		 if (tabString === 'scripts') {
		 if (!myself.shareBox) {
		 myself.createShareBox();
		 myself.shareAssetsBox.hide();
		 myself.shareAssetsBox.destroy();
		 } else {
		 myself.shareBox.show();
		 myself.shareAssetsBox.hide();
		 myself.shareAssetsBox.destroy();
		 }
		 } else {
		 if (!myself.shareAssetsBox) {
		 myself.createShareAssetsBox();
		 myself.shareBox.hide();
		 myself.shareBox.destroy();
		 } else {
		 myself.shareAssetsBox.show();
		 myself.shareBox.hide();
		 myself.shareBox.destroy();
		 }
		 }
		 myself.fixLayout('tabEditor');
		 };
		 */

		//Experiment-----------------------------------
		tabBar.tabTo = function (tabString) {
			var active;
			myself.currentShareBoxTab = tabString;
			this.children.forEach(function (each) {
				each.refresh();
				if (each.state) {
					active = each;
				}
			});
			active.refresh(); // needed when programmatically tabbing
			myself.createShareBox();
			myself.fixLayout('tabEditor');
		};
		//---------------------------------------------

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('scripts');
			},
			localize('Scripts'), // label
			function () {  // query
				return myself.currentShareBoxTab === 'scripts';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		tabBar.add(tab);

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('assets');
			},
			localize('Assets'), // label
			function () {  // query
				return myself.currentShareBoxTab === 'assets';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		//tab.setPosition(new Point(500,500));
		tabBar.add(tab);


		tabBar.fixLayout();
		tabBar.children.forEach(function (each) {
			each.refresh();
		});
		this.shareBoxBar.tabBar = tabBar;
		this.shareBoxBar.add(this.shareBoxBar.tabBar);

		this.shareBoxBar.fixLayout = function () {
			this.setExtent(new Point(
				this.right() - this.left(),
				this.height()
			));
			this.tabBar.setLeft(this.left());
			this.tabBar.setBottom(this.bottom() + 75);
		};

		//myself.fixLayout();
	},

	// xinni: shows the whole share box and hide the connection screens and tabs
	createShareBox: function (shareboxId) {
		// Initialization of Sharebox and its default behavior
		var scripts = this.shareBoxPlaceholderSprite.scripts,
			myself = this;

		shareboxId = typeof shareboxId !== 'undefined' ? shareboxId : 42;

		// Destroy if sharebox exists
		if (this.shareBox) {
			this.shareBox.destroy();
		}

		// delete the connect morph if sharebox is in operation
		if (this.shareBoxConnect) {
			this.shareBoxConnect.destroy();
		}

		var sharer = IDE_Morph.makeSocket.call(this, myself, shareboxId);
		if (this.currentShareBoxTab === 'scripts') {
			scripts.isDraggable = false;
			scripts.color = this.groupColor;
			scripts.texture = this.scriptsPaneTexture;

			this.shareBox = new FrameMorph();
			this.shareBox.color = this.groupColor;
			this.shareBox.acceptsDrops = true;
			this.add(this.shareBox);

			this.shareBox.reactToDropOf = function (droppedMorph) {
				var shareName = prompt("Give the item a name.");
				sharer.shareObject((shareboxId.toString()), droppedMorph, shareName);
				droppedMorph.destroy();
			};
		} else if (this.currentShareBoxTab === 'assets') {
			this.shareBox = new ShareBoxAssetsMorph(
				this.shareBoxPlaceholderSprite,
				this.sliderColor
			);
			this.shareBox.color = this.groupColor;
			this.add(this.shareBox);
			this.shareBox.updateSelection();

			this.shareBox.acceptsDrops = true;

			this.shareBox.reactToDropOf = function (droppedMorph) {
				var shareName = prompt("Give the item a name.");
				sharer.shareObject((shareboxId.toString()), droppedMorph, shareName);
				droppedMorph.destroy();
			};

		} else {
			this.shareBox = new Morph();

			this.shareBox.color = this.groupColor;
			this.shareBox.acceptsDrops = true;

			this.shareBox.reactToDropOf = function (droppedMorph) {
				if (droppedMorph instanceof BlockMorph) {
					this.world().add(droppedMorph);
				} else {
					droppedMorph.destroy();
				}
			};
			this.add(this.shareBox);
		}

		console.log("sharebox created with id " + shareboxId)

	},

	// destroys sharebox and goes back to sharebox connect
	destroyShareBox: function() {
		if (this.shareBox) {
			this.shareBox.destroy();
		}

		if (this.shareAssetsBox) {
			this.shareAssetsBox.destroy();
		}

		if (this.shareBoxTitleBarButtons) {
			this.shareBoxTitleBarButtons.destroy();
		}

		this.createShareBoxConnectBar();
		this.createShareBoxConnect();
		this.fixLayout();
	},

	createShareAssetsBox: function () {
		// Initialization of ShareAssetsBox and its default behavior
		var myself = this;

		// Destroy if sharebox exists
		if (this.shareAssetsBox) {
			this.shareAssetsBox.destroy();
		}

		// delete the connect morph if sharebox is in operation
		if (this.shareBoxConnect) {
			this.shareBoxConnect.destroy();
		}

		this.shareAssetsBox = new FrameMorph();
		this.shareAssetsBox.color = this.groupColor;
		this.shareAssetsBox.acceptsDrops = true;
		this.add(this.shareAssetsBox);

		this.shareAssetsBox.reactToDropOf = function (droppedMorph) {
			if (droppedMorph instanceof BlockMorph) {
				myself.shareAssetsBox.add(droppedMorph);
			} else {
				droppedMorph.destroy();
			}
		};

		// Executes shareBox prototype functionality. To be modified/deleted thereafter
		// IDE_Morph.makeSocket.call(this, myself);
	},

	// xinni: ShareBox connection tab bar that just says "Create group"
	createShareBoxConnectBar: function () {
		if (this.shareBoxConnectBar) {
			this.shareBoxConnectBar.destroy();
		}

		// destroy the sharebox bar when currently not connected.
		if (this.shareBoxBar) {
			this.shareBoxBar.destroy();
		}

		var
			tabCorner = 15,
			tabColors = this.tabColors,
			tabBar = new AlignmentMorph('row', -tabCorner * 2),
			tab,
			myself = this;


		this.shareBoxConnectBar = new Morph();
		this.shareBoxConnectBar.bounds = new Rectangle(0, 0, 0, 0); // xinni: remove unwanted floating rectangle
		this.shareBoxConnectBar.color = null;
		this.add(this.shareBoxConnectBar);

		// tab bar
		// disable tabTo function for now as not needed
		/*
		 tabBar.tabTo = function (tabString) {
		 var active;
		 myself.currentShareBoxConnectTab = tabString;
		 this.children.forEach(function (each) {
		 each.refresh();
		 if (each.state) {active = each; }
		 });
		 active.refresh(); // needed when programmatically tabbing
		 myself.createShareBoxConnect();
		 myself.fixLayout('tabEditor');
		 };
		 */

		tab = new TabMorph(
			tabColors,
			null, // target
			function () {
				tabBar.tabTo('connect');
			},
			localize('Create New Group'), // label
			function () {  // query
				return myself.currentShareBoxConnectTab === 'connect';
			}
		);
		tab.padding = 3;
		tab.corner = tabCorner;
		tab.edge = 1;
		tab.labelShadowOffset = new Point(-1, -1);
		tab.labelShadowColor = tabColors[1];
		tab.labelColor = this.buttonLabelColor;
		tab.drawNew();
		tab.fixLayout();
		tabBar.add(tab);

		tabBar.fixLayout();
		tabBar.children.forEach(function (each) {
			each.refresh();
		});
		this.shareBoxConnectBar.tabBar = tabBar;
		this.shareBoxConnectBar.add(this.shareBoxConnectBar.tabBar);

		this.shareBoxConnectBar.fixLayout = function () {
			this.setExtent(new Point(
				this.right() - this.left(),
				this.height()
			));
			this.tabBar.setLeft(this.left());
			this.tabBar.setBottom(this.bottom() + 75);
		};

	},

	// xinni: creates and shows ShareBox connection morph
	createShareBoxConnect: function () {

		// init variables
		var myself = this;
		var padding = 10;
		this.newGroupScreen = new FrameMorph();

		// hide sharebox if haven't connected
		if (this.shareBox) {
			this.shareBox.destroy();
		}

		// destroy if already exists
		if (this.shareBoxConnect) {
			this.shareBoxConnect.destroy();
		}

		// init shareBoxConnect
		this.shareBoxConnect = new ScrollFrameMorph();
		this.shareBoxConnect.color = this.groupColor;
		this.shareBoxConnect.acceptsDrops = false;

		// add to myself
		this.add(this.shareBoxConnect);

		// *****************************
		// screen 1: CREATE A NEW GROUP
		// *****************************

		// init screen
		if (this.newGroupScreen) {
			this.newGroupScreen.destroy();
		}

		this.newGroupScreen = new FrameMorph();
		this.newGroupScreen.color = this.shareBoxConnect.color;
		this.shareBoxConnect.addContents(this.newGroupScreen);

		// screen 1: NEW GROUP logo
		if (this.newGroupLogo) {
			this.newGroupLogo.destroy();
		}
		newGroupLogo = new Morph();
		newGroupLogo.texture = 'images/share.png';
		newGroupLogo.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.shareBoxConnect.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		newGroupLogo.setExtent(new Point(181, 123));
		newGroupLogo.setLeft(this.stage.width() / 2 - newGroupLogo.width() / 2);
		newGroupLogo.setTop(this.stage.height() / 8);
		this.newGroupScreen.add(newGroupLogo);

		// screen 1: NEW SESSION text
		txt = new TextMorph("Start a collaboration session");
		txt.setColor(SpriteMorph.prototype.paletteTextColor);
		txt.setPosition(new Point(this.stage.width() / 2 - txt.width() / 2, newGroupLogo.bottom() + padding));
		this.newGroupScreen.add(txt);

		// screen 1: CREATE NEW GROUP button
		var groupButton = new PushButtonMorph(null, null, "Create a Group", null, null, null, "green");
		groupButton.setPosition(new Point(this.stage.width() / 2 - groupButton.width() / 2, txt.bottom() + padding));
		groupButton.action = function() {
			console.log("Creating a new group and initializing a new session.");
			myself.showEntireShareBoxComponent();
		};
		this.newGroupScreen.add(groupButton);

		this.shareBoxConnect.drawNew();

	},

	// xinni: shows sharebox and title bar buttons (settings and add)
	showEntireShareBoxComponent: function() {

		console.log("showEntireShareBoxComponent triggered.");

		// destroy screens and morphs shown before this.
		if (this.newGroupScreen) {
			this.newGroupScreen.destroy();
		}
		if (this.requestReceivedScreen) {
			this.requestReceivedScreen.destroy();
		}
		if (this.shareBoxConnect) {
			this.shareBoxConnect.destroy();
		}
		if (this.shareBoxConnectBar) {
			this.shareBoxConnectBar.destroy();
		}

		console.log("sharebox about to be created. previous screens destroyed.");

		// create title bar buttons
		if (!this.shareBoxTitleBarButtons) {
			this.createShareBoxTitleBarButtons();
		}

		// create share box
		myself = this;
		SnapCloud.createSharebox(tempIdentifier, function(data) {
			var shareboxId = prompt("sharebox id?", data.data[0].id);
			console.log("show entire share box");
			myself.createShareBoxBar();
			myself.createShareBox(shareboxId);
			myself.fixLayout();

			var txt = new TextMorph(data.data[0].id.toString());
			txt.setColor(SpriteMorph.prototype.paletteTextColor);
			txt.setPosition(new Point(5, 5));
			txt.show();
			myself.shareBox.add(txt);
		});
	},

	// ********************************
	// ShareBox screens and messages
	// ********************************

	// xinni: Creates the request received screen.
	// i.e. "You have a group invite" message. Show this to the user who is requested!!

	showRequestReceivedMessage: function () {
		// *****************************
		// screen 3: Request received
		// *****************************

		var padding = 10;

		// init screen
		if (this.requestReceivedScreen) {
			this.requestReceivedScreen.destroy();
		}
		this.requestReceivedScreen = new FrameMorph();
		this.requestReceivedScreen.color = this.shareBoxConnect.color;

		// add to shareBoxConnect
		if (this.shareBoxConnect) {
			this.shareBoxConnect.addContents(this.requestReceivedScreen);
		} else {
			console.log("Tried to show request received in non existing sharebox");
		}

		// screen 3: Awaiting reply logo
		if (this.requestReceivedLogo) {
			this.requestReceivedLogo.destroy();
		}

		var requestReceivedLogo = new Morph();
		requestReceivedLogo.texture = 'images/notification.png';
		requestReceivedLogo.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.shareBoxConnect.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};
		requestReceivedLogo.setExtent(new Point(129, 123));
		requestReceivedLogo.setLeft(this.stage.width() / 2 - requestReceivedLogo.width() / 2);
		requestReceivedLogo.setTop(this.stage.width() / 8);
		this.requestReceivedScreen.add(requestReceivedLogo);

		// screen 3: Awaiting reply text
		txt = new TextMorph("'marylim' would like to invite you to their collaboration group.");

		txt.setColor(SpriteMorph.prototype.paletteTextColor);
		txt.setPosition(new Point(this.stage.width() / 2 - txt.width() / 2, requestReceivedLogo.bottom() + padding));
		this.requestReceivedScreen.add(txt);

		// screen 3: Accept button -> launch sharebox.
		acceptButton = new PushButtonMorph(null, null, "Accept", null, null, null, "green");
		acceptButton.setPosition(new Point(myself.stage.width() / 2 - acceptButton.width() - padding, txt.bottom() + padding));
		acceptButton.action = function () {
			console.log("Accept button pressed. Launch Sharebox.");
			this.showEntireShareBoxComponent();
		};
		this.requestReceivedScreen.add(acceptButton);

		// screen 3: Reject button -> go back to create group screen.
		rejectButton = new PushButtonMorph(null, null, "Reject", null, null, null, "red");
		rejectButton.setPosition(new Point(myself.stage.width() / 2 + padding, txt.bottom() + padding));
		rejectButton.action = function () {
			console.log("Reject button pressed. Back to Create group screen.");
			myself.newGroupScreen.show();
			myself.requestReceivedScreen.hide();
		};
		this.requestReceivedScreen.add(rejectButton);

		// show the screen.
		this.requestReceivedScreen.show();

	},

	// xinni: Show this when a sharebox session exists but there are no scripts added yet
	showNoScriptsMessage: function () {
		var padding = 10;

		// init morph
		if (this.noScriptsMessage) {
			this.noScriptsMessage.destroy();
		}
		this.noScriptsMessage = new FrameMorph();
		this.noScriptsMessage.color = this.shareBoxConnect.color;

		// add to sharebox
		if (this.shareBox) {
			this.shareBox.addContents(this.noScriptsMessage);
		} else {
			console.log("Tried to call No Scripts message in a non existing sharebox.");
		}


		// "Drag blocks to share script"
		scriptsInstructionsTxt = new TextMorph("Drag block(s) here to share a script.");
		scriptsInstructionsTxt.setColor(SpriteMorph.prototype.paletteTextColor);
		scriptsInstructionsTxt.setPosition(new Point(this.shareBox.width() / 2 - scriptsInstructionsTxt.width() / 2, this.shareBox.top() + padding));
		this.noScriptsMessage.add(scriptsInstructionsTxt);

		// "No scripts here yet :("
		noScriptsYetTxt = new TextMorph("No scripts shared yet :(");
		noScriptsYetTxt.setColor(SpriteMorph.prototype.paletteTextColor);
		noScriptsYetTxt.setPosition(new Point(this.shareBox.width() / 2 - noScriptsYetTxt.width() / 2, this.showNoScriptsMessage.scriptsInstructionsTxt.top() + padding*3));
		this.noScriptsMessage.add(noScriptsYetTxt);


		// show the screen.
		this.noScriptsMessage.show();
	},

	// xinni: Show this window when not connected to server (this.showShareBoxDisconnectedWindow();)
	showShareBoxDisconnectedWindow: function () {
		var padding = 10;

		if (this.shareBoxDisconnectedWindow) {
			this.shareBoxDisconnectedWindow.destroy();
		}

		// disconnected window morph
		this.shareBoxDisconnectedWindow = new ScrollFrameMorph();
		this.shareBoxDisconnectedWindow.color = this.groupColor;
		this.shareBoxDisconnectedWindow.acceptsDrops = false;
		myself = this;
		this.add(this.shareBoxDisconnectedWindow);

		// disconnected logo
		if (this.disconnectedLogo) {
			this.disconnectedLogo.destroy();
		}
		disconnectedLogo = new Morph();
		disconnectedLogo.texture = 'images/error.png';
		disconnectedLogo.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.groupColor;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};
		disconnectedLogo.setExtent(new Point(128, 128));
		disconnectedLogo.setLeft(this.stage.width() / 2 - disconnectedLogo.width() / 2);
		disconnectedLogo.setTop(this.stage.height() / 8);
		this.shareBoxDisconnectedWindow.add(disconnectedLogo);

		// disconnected text
		disconnectedTxt = new TextMorph("Unable to connect to server.");
		disconnectedTxt.setColor(SpriteMorph.prototype.paletteTextColor);
		disconnectedTxt.setPosition(new Point(this.stage.width() / 2 - disconnectedTxt.width() / 2, disconnectedLogo.bottom() + padding));
		this.shareBoxDisconnectedWindow.add(disconnectedTxt);
	},

	// *****************************
	// ShareBox popups
	// *****************************

	// * * * * * * * * * View Members Popup * * * * * * * * * * * * * * * * *

	// xinni: Displays a list of group members. Condition: must be in group.
	showViewMembersPopup: function() {
		var world = this.world();
		var popupWidth = 500;
		var popupHeight = 400;

		// these are just dummy lists and values.
		// replace these values with actual sharebox group member data.
		var showingToCreator = true; // creator view. you can delete members
		var groupMembers = ["john_the_creator", "seraphim_undisputed", "tang_huan_song"]; // first member is creator!
		var pendingMembers = ["chng_xinni", "zhang_yiwen"];
		var groupMembersIsOnline = [true, false, true]; // stores whether each official member is online


		// set up the frames to contain the member list "viewMembersPopup" and "membersViewFrame"
		if (this.viewMembersPopup) {
			this.viewMembersPopup.destroy();
		}
		this.viewMembersPopup = new DialogBoxMorph();
		this.viewMembersPopup.setExtent(new Point(popupWidth, popupHeight));

		if (this.membersViewFrame) {
			this.membersViewFrame.destroy();
		}
		this.membersViewFrame = new ScrollFrameMorph();
		this.membersViewFrame.setColor(this.viewMembersPopup.color);
		this.membersViewFrame.setExtent(new Point(640, 350));
		this.membersViewFrame.setTop(this.viewMembersPopup.top() + 30);
		this.membersViewFrame.setLeft(this.viewMembersPopup.left());
		this.membersViewFrame.setWidth(this.viewMembersPopup.width());
		this.membersViewFrame.drawNew();
		this.viewMembersPopup.add(this.membersViewFrame);

		// list group members
		this.showGroupMemberTitle(groupMembers.length);
		for (var i = 0; i < groupMembers.length; i++) {
			if (i === 0) { // assumes first member is always the creator
				this.showMemberRow(true, groupMembersIsOnline[i], groupMembers[i], i + 1, showingToCreator);
			} else { // not creator, is normal member
				this.showMemberRow(false, groupMembersIsOnline[i], groupMembers[i], i + 1, showingToCreator);
			}
		}

		// list pending group members
		this.showPendingMemberTitle(pendingMembers.length, groupMembers.length);
		for (var j = 0; j < pendingMembers.length; j++) {
			this.showMemberRow(false, false, pendingMembers[j], j + groupMembers.length + 2, showingToCreator);
		}


		// add close button
		var button = new PushButtonMorph(null, null, "Close me", null, null, null, "green");
		button.action = function() { myself.viewMembersPopup.cancel(); };
		button.setCenter(this.viewMembersPopup.center());
		button.setBottom(this.viewMembersPopup.bottom() - 10);
		this.viewMembersPopup.add(button);

		// add title
		this.viewMembersPopup.labelString = "View Sharebox Members";
		this.viewMembersPopup.createLabel();

		// popup the popup
		this.viewMembersPopup.drawNew();
		this.viewMembersPopup.fixLayout();
		this.viewMembersPopup.popUp(world);
	},

	showGroupMemberTitle: function(numberOfGroupMembers) {
		var titlePadding = 5;
		var titleBarHeight = 30;

		// initialize frame
		if (this.groupMemberTitle) {
			this.groupMemberTitle.destroy();
		}
		this.groupMemberTitle = new FrameMorph();
		this.groupMemberTitle.setColor(this.groupColor.darker(20));

		// initialize title "Group Members (count)"
		if (this.groupMemberTxt) {
			this.groupMemberTxt.destroy();
		}
		this.groupMemberTxt = new StringMorph(
			"Group Members (" + numberOfGroupMembers + ")",
			14,
			'sans-serif',
			true,
			false,
			false,
			null,
			this.frameColor.darker(this.buttonContrast)
		);


		// position title
		this.groupMemberTitle.setLeft(this.membersViewFrame.left() + titlePadding);
		this.groupMemberTitle.setTop(this.membersViewFrame.top() + titlePadding);
		this.groupMemberTitle.setWidth(this.membersViewFrame.width() - titlePadding*2);
		this.groupMemberTitle.setHeight(titleBarHeight);
		this.groupMemberTitle.drawNew();

		// position text
		this.groupMemberTxt.setLeft(this.groupMemberTitle.left() + titlePadding);
		this.groupMemberTxt.setTop(this.groupMemberTitle.top() + titlePadding);
		this.groupMemberTxt.setWidth(400);
		this.groupMemberTxt.drawNew();


		// add title
		this.groupMemberTitle.add(this.groupMemberTxt);
		this.membersViewFrame.add(this.groupMemberTitle);
	},

	showPendingMemberTitle: function(numberOfPendingMembers, numberOfGroupMembers) {
		var titlePadding = 5;
		var titleBarHeight = 30;

		// initialize frame
		if (this.pendingMemberTitle) {
			this.pendingMemberTitle.destroy();
		}
		this.pendingMemberTitle = new FrameMorph();
		this.pendingMemberTitle.setColor(this.groupColor.darker(20));

		// initialize title "Pending Members (count)"
		if (this.pendingMemberTxt) {
			this.pendingMemberTxt.destroy();
		}
		this.pendingMemberTxt = new StringMorph(
			"Pending Members (" + numberOfPendingMembers + ")",
			14,
			'sans-serif',
			true,
			false,
			false,
			null,
			this.frameColor.darker(this.buttonContrast)
		);

		// position title
		this.pendingMemberTitle.setLeft(this.membersViewFrame.left() + titlePadding);
		this.pendingMemberTitle.setTop(this.groupMemberTitle.bottom() + (numberOfGroupMembers * (groupMemberRow.height() + titlePadding)) + titlePadding);
		this.pendingMemberTitle.setWidth(this.membersViewFrame.width() - titlePadding*2);
		this.pendingMemberTitle.setHeight(titleBarHeight);
		this.pendingMemberTitle.drawNew();

		// position text
		this.pendingMemberTxt.setLeft(this.pendingMemberTitle.left() + titlePadding);
		this.pendingMemberTxt.setTop(this.pendingMemberTitle.top() + titlePadding);
		this.pendingMemberTxt.setWidth(400);
		this.pendingMemberTxt.drawNew();

		// add title
		this.pendingMemberTitle.add(this.pendingMemberTxt);
		this.membersViewFrame.add(this.pendingMemberTitle);
	},

	// isOnline, username, isLastRow (dont add line separator)
	showMemberRow: function(isCreator, isOnline, username, rowNo, showingToCreator) {
		var titlePadding = 5;
		var myself = this;
		console.log("Adding member row for " + username);

		groupMemberRow = new FrameMorph();
		groupMemberRow.setColor(this.membersViewFrame.color);
		groupMemberRow.setHeight(40);
		groupMemberRow.setWidth(this.membersViewFrame.width());

		// show Online green dot
		if (isOnline) {
			onlineDot = new StringMorph(
				"☻",
				14,
				'sans-serif',
				true,
				false,
				false,
				null,
				new Color(60, 158, 0)
			);
			onlineDot.setColor(new Color(60, 158, 0));
			onlineDot.setLeft(myself.membersViewFrame.left() + 10);
			onlineDot.drawNew();
			groupMemberRow.add(onlineDot);
		}

		// show username
		usernameLabel = new StringMorph(
			username,
			14,
			'sans-serif',
			true,
			false,
			false,
			null,
			this.frameColor.darker(this.buttonContrast)
		);
		usernameLabel.setLeft(myself.membersViewFrame.left() + 10 + 40 + 10);
		usernameLabel.drawNew();
		groupMemberRow.add(usernameLabel);

		// show delete button for ordinary members
		if (showingToCreator && (rowNo > 1)) {
			deleteButton = new PushButtonMorph(
				this,
				null,
				(String.fromCharCode("0xf068")),
				null,
				null,
				null,
				"deleteIconButton"
			);
			deleteButton.setRight(myself.membersViewFrame.right() - titlePadding*2);
			deleteButton.action = function() { myself.showRemoveMemberPopup(username); };
			deleteButton.drawNew();
			deleteButton.fixLayout();
			groupMemberRow.add(deleteButton);
		}

		// position and add the row to the frame
		// position title
		groupMemberRow.setLeft(myself.membersViewFrame.left() + titlePadding);
		groupMemberRow.setTop(myself.groupMemberTitle.bottom() + ((rowNo - 1) * (groupMemberRow.height() + titlePadding)) + titlePadding);
		groupMemberRow.setWidth(myself.membersViewFrame.width() - titlePadding*2);
		groupMemberRow.drawNew();
		this.membersViewFrame.add(groupMemberRow);
	},

	// * * * * * * * * * Add Member Popup * * * * * * * * * * * * * * * * *

	// xinni: Popup when creator chooses "Add new Member"
	showAddMemberPopup: function() {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 300;

		if (this.addMemberPopup) {
			this.addMemberPopup.destroy();
		}
		this.addMemberPopup = new DialogBoxMorph();
		this.addMemberPopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);

		button.setRight(this.addMemberPopup.right() - 3);
		button.setTop(this.addMemberPopup.top() + 2);
		button.action = function () { myself.addMemberPopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.addMemberPopup.add(button);

		// the text input box
		var usernameInput = new InputFieldMorph();
		usernameInput.setWidth(200);
		usernameInput.setCenter(myself.addMemberPopup.center());
		usernameInput.fontSize = 15;
		usernameInput.typeInPadding = 4;
		usernameInput.fixLayout();
		usernameInput.drawNew();
		this.addMemberPopup.add(usernameInput);


		// "Add" Button
		addButton = new PushButtonMorph(null, null, "Add this user", null, null, null, "green");
		addButton.setCenter(myself.addMemberPopup.center());
		addButton.setTop(usernameInput.bottom() + 10);
		addButton.action = function () {
			// get the username from the input
			var username = usernameInput.getValue();
			var txtColor = new Color(204, 0, 0);

			if (username == "") {
				// show error message for blank username
				if (this.txt) {
					this.txt.destroy();
				}
				this.txt = new TextMorph("Please enter a non-blank username.");
				this.txt.setColor(txtColor);
				this.txt.setCenter(myself.addMemberPopup.center());
				this.txt.setTop(addButton.bottom() + 20);
				myself.addMemberPopup.add(this.txt);
				this.txt.drawNew();
				myself.addMemberPopup.fixLayout();
				myself.addMemberPopup.drawNew();
			} else {
				// add member to pending members, and feedback result to the user (success/fail)
				// this result value is returned from an internal add member function (NOT ADDED YET)
				var result = "group_full"; // EITHER: success, connection_error, user_offline, user_nonexistent, user_has_group, group_full
				if (result === "success") {
					myself.addMemberPopup.cancel();
					myself.showAddMemberSuccessPopup(username);
				} else { // return result as any of the following:
					myself.showAddMemberFailurePopup(username, result);
				}
			}
		};
		this.addMemberPopup.add(addButton);


		// add title
		this.addMemberPopup.labelString = "Add a member";
		this.addMemberPopup.createLabel();

		// popup
		this.addMemberPopup.drawNew();
		this.addMemberPopup.fixLayout();
		this.addMemberPopup.popUp(world);
	},

	// notifies the user that new member has been added successfully.
	showAddMemberSuccessPopup: function(username) {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 330;

		if (this.addMemberSuccessPopup) {
			this.addMemberSuccessPopup.destroy();
		}
		this.addMemberSuccessPopup = new DialogBoxMorph();
		this.addMemberSuccessPopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.addMemberSuccessPopup.right() - 3);
		button.setTop(this.addMemberSuccessPopup.top() + 2);
		button.action = function () { myself.addMemberSuccessPopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.addMemberSuccessPopup.add(button);

		// add title
		this.addMemberSuccessPopup.labelString = username + " added!";
		this.addMemberSuccessPopup.createLabel();

		// success image
		var successImage = new Morph();
		successImage.texture = 'images/success.png';
		successImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.addMemberSuccessPopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		successImage.setExtent(new Point(128, 128));
		successImage.setCenter(this.addMemberSuccessPopup.center());
		successImage.setTop(this.addMemberSuccessPopup.top() + 40);
		this.addMemberSuccessPopup.add(successImage);

		// success message
		txt = new TextMorph("You've sent " + username + " a group invite. \n\n" + username + " has been added as a Pending Member, \nand will become a group member once the\ninvite is accepted.");
		txt.setCenter(this.addMemberSuccessPopup.center());
		txt.setTop(successImage.bottom() + 20);
		this.addMemberSuccessPopup.add(txt);
		txt.drawNew();

		// "got it!" button, closes the dialog.
		okButton = new PushButtonMorph(null, null, "Got it!", null, null, null, "green");
		okButton.setCenter(this.addMemberSuccessPopup.center());
		okButton.setBottom(this.addMemberSuccessPopup.bottom() - 10);
		okButton.action = function() { myself.addMemberSuccessPopup.cancel(); };
		this.addMemberSuccessPopup.add(okButton);

		// popup
		this.addMemberSuccessPopup.drawNew();
		this.addMemberSuccessPopup.fixLayout();
		this.addMemberSuccessPopup.popUp(world);
	},

	// causes of error: connection_error, user_offline, user_nonexistent, user_has_group, group_full
	showAddMemberFailurePopup: function(username, errorCause) {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 300;

		if (this.addMemberFailurePopup) {
			this.addMemberFailurePopup.destroy();
		}
		this.addMemberFailurePopup = new DialogBoxMorph();
		this.addMemberFailurePopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.addMemberFailurePopup.right() - 3);
		button.setTop(this.addMemberFailurePopup.top() + 2);
		button.action = function () { myself.addMemberFailurePopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.addMemberFailurePopup.add(button);

		// add title
		this.addMemberFailurePopup.labelString = "Failed to add " + username;
		this.addMemberFailurePopup.createLabel();

		// failure image
		var failureImage = new Morph();
		failureImage.texture = 'images/failure.png';
		failureImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.addMemberFailurePopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		failureImage.setExtent(new Point(128, 128));
		failureImage.setCenter(this.addMemberFailurePopup.center());
		failureImage.setTop(this.addMemberFailurePopup.top() + 40);
		this.addMemberFailurePopup.add(failureImage);

		// failure message
		if (errorCause === "connection_error") {
			txt = new TextMorph("Failed to add " + username + " due to a connection error.\nPlease try again later.");
		} else if (errorCause === "user_offline") {
			txt = new TextMorph("Sorry, " + username + " is offline right now.\nPlease trying adding them later.");
		} else if (errorCause === "user_nonexistent") {
			txt = new TextMorph("Failed to add " + username + ".\nThis user does not exist.");
		} else if (errorCause === "user_has_group") {
			txt = new TextMorph("Sorry, " + username + " is already in a group.");
		} else if (errorCause === "group_full") {
			txt = new TextMorph("Your group is full (5 members).\nNew members can't be added right now.");
		} else {
			txt = new TextMorph(username + " could not be added for unknown reasons.");
		}

		txt.setCenter(this.addMemberFailurePopup.center());
		txt.setTop(failureImage.bottom() + 20);
		this.addMemberFailurePopup.add(txt);
		txt.drawNew();

		// "OK" button, closes the dialog.
		okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
		okButton.setCenter(this.addMemberFailurePopup.center());
		okButton.setBottom(this.addMemberFailurePopup.bottom() - 10);
		okButton.action = function() { myself.addMemberFailurePopup.cancel(); };
		this.addMemberFailurePopup.add(okButton);

		// popup
		this.addMemberFailurePopup.drawNew();
		this.addMemberFailurePopup.fixLayout();
		this.addMemberFailurePopup.popUp(world);
	},

	// * * * * * * * * * Leave group Popup * * * * * * * * * * * * * * * * *

	// xinni: Popup when user chooses "Leave group"
	showLeaveGroupPopup: function() {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 300;

		if (this.leaveGroupPopup) {
			this.leaveGroupPopup.destroy();
		}
		this.leaveGroupPopup = new DialogBoxMorph();
		this.leaveGroupPopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.leaveGroupPopup.right() - 3);
		button.setTop(this.leaveGroupPopup.top() + 2);
		button.action = function () { myself.leaveGroupPopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.leaveGroupPopup.add(button);

		// add title
		this.leaveGroupPopup.labelString = "Leave this group?";
		this.leaveGroupPopup.createLabel();

		// leave group image
		var leaveGroupImage = new Morph();
		leaveGroupImage.texture = 'images/error.png';
		leaveGroupImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.leaveGroupPopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		leaveGroupImage.setExtent(new Point(128, 128));
		leaveGroupImage.setCenter(this.leaveGroupPopup.center());
		leaveGroupImage.setTop(this.leaveGroupPopup.top() + 40);
		this.leaveGroupPopup.add(leaveGroupImage);

		// leave group text
		txt = new TextMorph("You're about to leave your Sharebox Group.\n Press OK to continue.")
		txt.setCenter(this.leaveGroupPopup.center());
		txt.setTop(leaveGroupImage.bottom() + 20);
		this.leaveGroupPopup.add(txt);
		txt.drawNew();

		// OK -> close sharebox and go back to Sharebox Connect
		confirmButton = new PushButtonMorph(null, null, "OK", null, null, null, "green");
		confirmButton.setWidth(120);
		confirmButton.action = function () {
			// call a function here that lets member leave group. return success/failure value.
			// IF A CREATOR LEAVES, THE ENTIRE SHAREBOX SESSION IS TERMINATED.

			var result = "failure"; // DUMMY VALUE FOR NOW. Can be success failure.

			if (result === "success") {
				// destroy sharebox morph and show sharebox connect
				myself.destroyShareBox();
				myself.leaveGroupPopup.cancel();
			} else {
				myself.showLeaveGroupFailurePopup();
			}
		};
		// Cancel -> close the dialog.
		rejectButton = new PushButtonMorph(null, null, "Cancel", null, null, null, "red");
		rejectButton.setWidth(120);
		rejectButton.action = function () {
			myself.leaveGroupPopup.cancel();
		};

		// position and add the OK and cancel buttons
		confirmButton.setTop(txt.bottom() + 20);
		rejectButton.setTop(txt.bottom() + 20);
		confirmButton.setLeft(this.leaveGroupPopup.left() + 65);
		rejectButton.setLeft(confirmButton.right() + 30);
		confirmButton.label.setCenter(confirmButton.center());
		rejectButton.label.setCenter(rejectButton.center());
		this.leaveGroupPopup.add(confirmButton);
		this.leaveGroupPopup.add(rejectButton);

		// popup
		this.leaveGroupPopup.drawNew();
		this.leaveGroupPopup.fixLayout();
		this.leaveGroupPopup.popUp(world);
	},

	showLeaveGroupFailurePopup: function() {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 300;

		if (this.leaveGroupFailurePopup) {
			this.leaveGroupFailurePopup.destroy();
		}
		this.leaveGroupFailurePopup = new DialogBoxMorph();
		this.leaveGroupFailurePopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.leaveGroupFailurePopup.right() - 3);
		button.setTop(this.leaveGroupFailurePopup.top() + 2);
		button.action = function () { myself.leaveGroupFailurePopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.leaveGroupFailurePopup.add(button);

		// add title
		this.leaveGroupFailurePopup.labelString = "Error leaving group";
		this.leaveGroupFailurePopup.createLabel();

		// failure image
		var failureImage = new Morph();
		failureImage.texture = 'images/failure.png';
		failureImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.leaveGroupFailurePopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		failureImage.setExtent(new Point(128, 128));
		failureImage.setCenter(this.leaveGroupFailurePopup.center());
		failureImage.setTop(this.leaveGroupFailurePopup.top() + 40);
		this.leaveGroupFailurePopup.add(failureImage);

		// failure message

		txt = new TextMorph("Sorry! We failed to remove you from the group.\nThis could be due to a connection error.\nPlease try again.");
		txt.setCenter(this.leaveGroupFailurePopup.center());
		txt.setTop(failureImage.bottom() + 20);
		this.leaveGroupFailurePopup.add(txt);
		txt.drawNew();

		// "OK" button, closes the dialog.
		okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
		okButton.setCenter(this.leaveGroupFailurePopup.center());
		okButton.setBottom(this.leaveGroupFailurePopup.bottom() - 10);
		okButton.action = function() { myself.leaveGroupFailurePopup.cancel(); };
		this.leaveGroupFailurePopup.add(okButton);

		// popup
		this.leaveGroupFailurePopup.drawNew();
		this.leaveGroupFailurePopup.fixLayout();
		this.leaveGroupFailurePopup.popUp(world);
	},

	// * * * * * * * * * Inform Removed Member Popup * * * * * * * * * * * * * * * * *

	// xinni: Popup to user, when creator kicks the user out of the group
	showYouHaveBeenRemovedPopup: function() {
		var world = this.world();
		var myself = this;
		var popupWidth = 400;
		var popupHeight = 300;

		if (this.youHaveBeenRemovedPopup) {
			this.youHaveBeenRemovedPopup.destroy();
		}
		this.youHaveBeenRemovedPopup = new DialogBoxMorph();
		this.youHaveBeenRemovedPopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.youHaveBeenRemovedPopup.right() - 3);
		button.setTop(this.youHaveBeenRemovedPopup.top() + 2);
		button.action = function () { myself.youHaveBeenRemovedPopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.youHaveBeenRemovedPopup.add(button);

		// add title
		this.youHaveBeenRemovedPopup.labelString = "Oops!";
		this.youHaveBeenRemovedPopup.createLabel();

		// failure image
		var failureImage = new Morph();
		failureImage.texture = 'images/error.png';
		failureImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.youHaveBeenRemovedPopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		failureImage.setExtent(new Point(128, 128));
		failureImage.setCenter(this.youHaveBeenRemovedPopup.center());
		failureImage.setTop(this.youHaveBeenRemovedPopup.top() + 40);
		this.youHaveBeenRemovedPopup.add(failureImage);

		// You were removed message
		txt = new TextMorph("You have been removed from your Sharebox group.\nWe will bring you back to the connection screen shortly.");
		txt.setCenter(this.youHaveBeenRemovedPopup.center());
		txt.setTop(failureImage.bottom() + 20);
		this.youHaveBeenRemovedPopup.add(txt);
		txt.drawNew();

		// "OK" button, closes the dialog.
		okButton = new PushButtonMorph(null, null, "Alrighty", null, null, null, "green");
		okButton.setCenter(this.youHaveBeenRemovedPopup.center());
		okButton.setBottom(this.youHaveBeenRemovedPopup.bottom() - 20);
		okButton.action = function() { myself.youHaveBeenRemovedPopup.cancel(); };
		this.youHaveBeenRemovedPopup.add(okButton);

		// popup
		this.youHaveBeenRemovedPopup.drawNew();
		this.youHaveBeenRemovedPopup.fixLayout();
		this.youHaveBeenRemovedPopup.popUp(world);
	},

	// * * * * * * * * * Remove a Member Popup * * * * * * * * * * * * * * * * *

	// xinni: Popup to creator, when they try to remove a member
	showRemoveMemberPopup: function(username) {
		var world = this.world();
		var myself = this;
		var popupWidth = 500;
		var popupHeight = 400;

		if (this.removeMemberPopup) {
			this.removeMemberPopup.destroy();
		}
		this.removeMemberPopup = new DialogBoxMorph();
		this.removeMemberPopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.removeMemberPopup.right() - 3);
		button.setTop(this.removeMemberPopup.top() + 2);
		button.action = function () { myself.removeMemberPopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.removeMemberPopup.add(button);

		// add title
		this.removeMemberPopup.labelString = "Remove " + username + " from group";
		this.removeMemberPopup.createLabel();

		// leave group image
		var removeMemberImage = new Morph();
		removeMemberImage.texture = 'images/removed.png';
		removeMemberImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.removeMemberPopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		removeMemberImage.setExtent(new Point(128, 128));
		removeMemberImage.setCenter(this.removeMemberPopup.center());
		removeMemberImage.setTop(this.removeMemberPopup.top() + 90);
		this.removeMemberPopup.add(removeMemberImage);

		// leave group text
		txt = new TextMorph("You're about to remove " + username + " from your group.\nPress OK to continue.")
		txt.setCenter(this.removeMemberPopup.center());
		txt.setTop(removeMemberImage.bottom() + 20);
		this.removeMemberPopup.add(txt);
		txt.drawNew();

		// OK -> close sharebox and go back to Sharebox Connect
		confirmButton = new PushButtonMorph(null, null, "OK", null, null, null, "green");
		confirmButton.setWidth(120);
		confirmButton.action = function () {
			// call a function here that lets creator delete the member. return success/failure value.
			var result = "failure"; // DUMMY VALUE FOR NOW. Can be success || failure.

			if (result === "success") {
				myself.removeMemberPopup.cancel();
				if (myself.viewMembersPopup) {
					myself.viewMembersPopup.destroy();
				}
				myself.showViewMembersPopup();
			} else {
				myself.showRemoveMemberFailurePopup(username);
			}
		};
		// Cancel -> close the dialog.
		rejectButton = new PushButtonMorph(null, null, "Cancel", null, null, null, "red");
		rejectButton.setWidth(120);
		rejectButton.action = function () {
			myself.removeMemberPopup.cancel();
		};

		// position and add the OK and cancel buttons
		confirmButton.setTop(txt.bottom() + 20);
		rejectButton.setTop(txt.bottom() + 20);
		confirmButton.setLeft(this.removeMemberPopup.left() + 115);
		rejectButton.setLeft(confirmButton.right() + 30);
		confirmButton.label.setCenter(confirmButton.center());
		rejectButton.label.setCenter(rejectButton.center());
		this.removeMemberPopup.add(confirmButton);
		this.removeMemberPopup.add(rejectButton);

		// popup
		this.removeMemberPopup.drawNew();
		this.removeMemberPopup.fixLayout();
		this.removeMemberPopup.popUp(world);
	},

	showRemoveMemberFailurePopup: function(username) {
		var world = this.world();
		var myself = this;
		var popupWidth = 500;
		var popupHeight = 400;

		if (this.removeMemberFailurePopup) {
			this.removeMemberFailurePopup.destroy();
		}
		this.removeMemberFailurePopup = new DialogBoxMorph();
		this.removeMemberFailurePopup.setExtent(new Point(popupWidth, popupHeight));

		// close dialog button
		button = new PushButtonMorph(
			this,
			null,
			(String.fromCharCode("0xf00d")),
			null,
			null,
			null,
			"redCircleIconButton"
		);
		button.setRight(this.removeMemberFailurePopup.right() - 3);
		button.setTop(this.removeMemberFailurePopup.top() + 2);
		button.action = function () { myself.removeMemberFailurePopup.cancel(); };
		button.drawNew();
		button.fixLayout();
		this.removeMemberFailurePopup.add(button);

		// add title
		this.removeMemberFailurePopup.labelString = "Failed to remove " + username;
		this.removeMemberFailurePopup.createLabel();

		// failure image
		var failureImage = new Morph();
		failureImage.texture = 'images/failure.png';
		failureImage.drawNew = function () {
			this.image = newCanvas(this.extent());
			var context = this.image.getContext('2d');
			var picBgColor = myself.removeMemberFailurePopup.color;
			context.fillStyle = picBgColor.toString();
			context.fillRect(0, 0, this.width(), this.height());
			if (this.texture) {
				this.drawTexture(this.texture);
			}
		};

		failureImage.setExtent(new Point(128, 128));
		failureImage.setCenter(this.removeMemberFailurePopup.center());
		failureImage.setTop(this.removeMemberFailurePopup.top() + 90);
		this.removeMemberFailurePopup.add(failureImage);

		// failure message

		txt = new TextMorph("Failed to remove " + username + " due to a connection error.\nPlease try again later.");
		txt.setCenter(this.removeMemberFailurePopup.center());
		txt.setTop(failureImage.bottom() + 20);
		this.removeMemberFailurePopup.add(txt);
		txt.drawNew();

		// "OK" button, closes the dialog.
		okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
		okButton.setCenter(this.removeMemberFailurePopup.center());
		okButton.setTop(txt.bottom() + 20);
		okButton.action = function() { myself.removeMemberFailurePopup.cancel(); };
		this.removeMemberFailurePopup.add(okButton);

		// popup
		this.removeMemberFailurePopup.drawNew();
		this.removeMemberFailurePopup.fixLayout();
		this.removeMemberFailurePopup.popUp(world);
	},

	// IDE_Morph layout

	// xinni: decide width, height, position of frames here.
	fixLayout: function (situation) {
		// situation is a string, i.e.
		// 'selectSprite' or 'refreshPalette' or 'tabEditor'

		// paddings
		var padding = this.padding;
		var corralBarPadding = 5;
		var shareBoxTitleTopPadding = 5;
		var shareBoxTitleLeftPadding = 40;
		var shareBoxInternalTopPadding = 35;
		var shareBoxInternalLeftPadding = 6;

		// heights and widths
		var shareBoxTitleBarButtonsWidth = 90;
		var shareBoxTitleBarHeight = 30;
		var corralBarHeight = 90;

		// position points
		var spriteBarPosition = new Point(205, 145);
		var corralPosition = new Point(260, 50);

		Morph.prototype.trackChanges = false;

		if (situation !== 'refreshPalette') {
			// controlBar
			this.controlBar.setPosition(this.logo.topRight());
			this.controlBar.setWidth(this.right() - this.controlBar.left());
			this.controlBar.fixLayout();

			// categories
			this.categories.setLeft(this.logo.left());
			this.categories.setTop(this.logo.bottom());
		}

		// palette
		this.palette.setLeft(this.logo.left());
		this.palette.setTop(this.categories.bottom());
		this.palette.setHeight(this.bottom() - this.palette.top());


		// layout of stage, sprite editor, corral, sharebox.
		if (situation !== 'refreshPalette') {
			// stage
			if (this.isAppMode) {
				this.stage.setScale(Math.floor(Math.min(
					(this.width() - padding * 2) / this.stage.dimensions.x,
					(this.height() - this.controlBar.height() * 2 - padding * 2)
					/ this.stage.dimensions.y
				) * 10) / 10);
				this.stage.setCenter(this.center());
			} else {
				//this.stage.setScale(this.isSmallStage ? 0.5 : 1);
				this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
				this.stage.setTop(this.logo.bottom() + padding);
				this.stage.setRight(this.right());
			}

			// spriteBar
			this.spriteBar.setPosition(this.logo.bottomRight().add(padding));
			this.spriteBar.setPosition(spriteBarPosition);
			this.spriteBar.setExtent(new Point(
				Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
				this.categories.bottom() - this.spriteBar.top() - padding
			));
			this.spriteBar.fixLayout();

			// spriteEditor
			if (this.spriteEditor.isVisible) {
				this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
				this.spriteEditor.setPosition(new Point(205, 220));
				this.spriteEditor.setExtent(new Point(
					this.spriteBar.width() - 5,
					this.bottom() - this.spriteEditor.top()
				));
			}

			// corralBar
			//this.corralBar.setLeft(this.stage.left());
			this.corralBar.setLeft(this.stage.left());
			this.corralBar.setPosition(this.logo.bottomRight().add(corralBarPadding));
			this.corralBar.setHeight(corralBarHeight);

			// corral
			if (!contains(['selectSprite', 'tabEditor'], situation)) {
				this.corral.setPosition(corralPosition);
				this.corral.setTop(this.logo.bottom() + corralBarPadding);
				//this.corral.setLeft(240);
				//this.corral.setWidth(this.stage.width());
				this.corral.setWidth(this.spriteBar.width() - 60);
				//this.corral.setHeight(this.bottom() - this.corral.top());
				this.corral.setHeight(corralBarHeight);
				this.corral.fixLayout();
			}

			// Share Box Title Bar
			if (this.shareBoxTitleBar) {
				this.shareBoxTitleBar.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
				this.shareBoxTitleBar.setLeft(this.stage.left());
				this.shareBoxTitleBar.setWidth(this.stage.width());
				this.shareBoxTitleBar.setHeight(shareBoxTitleBarHeight);
				//this.shareBoxTitleBar.fixLayout();
			}

			// Share Box Title Buttons
			if (this.shareBoxTitleBarButtons) {
				this.shareBoxTitleBarButtons.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
				this.shareBoxTitleBarButtons.setRight(this.stage.right());
				this.shareBoxTitleBarButtons.setWidth(shareBoxTitleBarButtonsWidth);
				this.shareBoxTitleBarButtons.setHeight(shareBoxTitleBarHeight);
				//this.shareBoxTitleBarButtons.fixLayout();
			}

			// Share Box Tab Bar
			if (this.shareBoxBar) {
				this.shareBoxBar.setTop(this.stage.bottom() - shareBoxTitleLeftPadding + shareBoxTitleBarHeight);
				this.shareBoxBar.setLeft(this.categories.width() + this.spriteBar.width() + 2 * padding + this.stage.width() / 1.5);
				this.shareBoxBar.fixLayout(); // xinni: position the tabs
			}

			// Share Box
			if (this.shareBox) {
				this.shareBox.setTop(this.stage.bottom() + shareBoxInternalTopPadding + shareBoxTitleBarHeight);
				this.shareBox.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
				this.shareBox.setWidth(this.stage.width());
				this.shareBox.setHeight(this.bottom() - this.shareBox.top());
			}

			// Share Box
			if (this.shareAssetsBox) {
				this.shareAssetsBox.setTop(this.stage.bottom() + shareBoxInternalTopPadding + shareBoxTitleBarHeight);
				this.shareAssetsBox.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
				this.shareAssetsBox.setWidth(this.stage.width());
				this.shareAssetsBox.setHeight(this.bottom() - this.shareAssetsBox.top());
			}

			// Share Box Disconnected Window
			if (this.shareBoxDisconnectedWindow) {
				this.shareBoxDisconnectedWindow.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
				this.shareBoxDisconnectedWindow.setLeft(this.stage.left());
				this.shareBoxDisconnectedWindow.setWidth(this.stage.width());
				this.shareBoxDisconnectedWindow.setHeight(this.height() - this.stage.height());
			}

			// Share Box Connect Tab Bar
			if (this.shareBoxConnectBar) {
				this.shareBoxConnectBar.setTop(this.stage.bottom() - shareBoxTitleLeftPadding + shareBoxTitleBarHeight);
				this.shareBoxConnectBar.setLeft(this.categories.width() + this.spriteBar.width() + 2 * padding);
				this.shareBoxConnectBar.fixLayout();
			}

			// Share Box Connect
			if (this.shareBoxConnect) {
				this.shareBoxConnect.setTop(this.shareBox.top());
				this.shareBoxConnect.setLeft(this.shareBox.left());
				this.shareBoxConnect.setWidth(this.stage.width());
				this.shareBoxConnect.setHeight(this.bottom() - this.stage.bottom() + shareBoxInternalTopPadding);
				this.newGroupScreen.setExtent(new Point(this.shareBoxConnect.width(), this.shareBoxConnect.height()));
			}

			// ShareBox Group Request Received (under sharebox connect)
			if (this.requestReceivedScreen) {
				this.requestReceivedScreen.setExtent(new Point(this.shareBoxConnect.width(), this.shareBoxConnect.height()));
			}

			// Sharebox No scripts Message (under sharebox)
			if (this.noScriptsMessage && this.shareBox) {
				this.noScriptsMessage.setHeight(this.shareBox.height());
				this.noScriptsMessage.setWidth(this.shareBox.width());
			}

			// huan song most likely scrapping these?
			/*
			 if (this.addScriptScreen) {
			 this.addScriptScreen.setTop(this.stage.bottom() + shareBoxInternalTopPadding);
			 this.addScriptScreen.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
			 this.addScriptScreen.setWidth(this.stage.width());
			 this.addScriptScreen.setHeight(this.bottom() - this.shareBox.top());
			 }

			 if (this.scriptListScreen) {
			 this.scriptListScreen.setTop(this.stage.bottom() + shareBoxInternalTopPadding);
			 this.scriptListScreen.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
			 this.scriptListScreen.setWidth(this.stage.width());
			 this.scriptListScreen.setHeight(this.bottom() - this.shareBox.top());
			 }*/
		}

		Morph.prototype.trackChanges = true;
		this.changed();
	},

	setProjectName: function (string) {
		this.projectName = string.replace(/['"]/g, ''); // filter quotation marks
		this.hasChangedMedia = true;
		this.controlBar.updateLabel();
	},

	// IDE_Morph resizing
	setExtent: function (point) {
		var padding = new Point(430, 110),
			minExt,
			ext;

		// determine the minimum dimensions making sense for the current mode
		if (this.isAppMode) {
			minExt = StageMorph.prototype.dimensions.add(
				this.controlBar.height() + 10
			);
		} else {
			/* // auto-switches to small stage mode, commented out b/c I don't like it
			 if (point.x < 910) {
			 this.isSmallStage = true;
			 this.stageRatio = 0.5;
			 }
			 */
			minExt = this.isSmallStage ?
				padding.add(StageMorph.prototype.dimensions.divideBy(2))
				: padding.add(StageMorph.prototype.dimensions);
			/*
			 minExt = this.isSmallStage ?
			 new Point(700, 350) : new Point(910, 490);
			 */
		}
		ext = point.max(minExt);
		IDE_Morph.uber.setExtent.call(this, ext);
		this.fixLayout();
	},

	// IDE_Morph events
	reactToWorldResize: function (rect) {
		if (this.isAutoFill) {
			this.setPosition(rect.origin);
			this.setExtent(rect.extent());
		}
		if (this.filePicker) {
			document.body.removeChild(this.filePicker);
			this.filePicker = null;
		}
	},

	droppedImage: function (aCanvas, name) {
		var costume = new Costume(
			aCanvas,
			this.currentSprite.newCostumeName(
				name ? name.split('.')[0] : '' // up to period
			)
		);

		if (costume.isTainted()) {
			this.inform(
				'Unable to import this image',
				'The picture you wish to import has been\n' +
				'tainted by a restrictive cross-origin policy\n' +
				'making it unusable for costumes in Snap!. \n\n' +
				'Try downloading this picture first to your\n' +
				'computer, and import it from there.'
			);
			return;
		}

		this.currentSprite.addCostume(costume);
		this.currentSprite.wearCostume(costume);
		this.spriteBar.tabBar.tabTo('costumes');
		this.hasChangedMedia = true;
	},

	droppedSVG: function (anImage, name) {
		var costume = new SVG_Costume(anImage, name.split('.')[0]);
		this.currentSprite.addCostume(costume);
		this.currentSprite.wearCostume(costume);
		this.spriteBar.tabBar.tabTo('costumes');
		this.hasChangedMedia = true;
		this.showMessage(
			'SVG costumes are\nnot yet fully supported\nin every browser',
			2
		);
	},

	droppedAudio: function (anAudio, name) {
		this.currentSprite.addSound(anAudio, name.split('.')[0]); // up to period
		this.spriteBar.tabBar.tabTo('sounds');
		this.hasChangedMedia = true;
	},

	droppedText: function (aString, name) {
		var lbl = name ? name.split('.')[0] : '';
		if (aString.indexOf('<project') === 0) {
			return this.openProjectString(aString);
		}
		if (aString.indexOf('<snapdata') === 0) {
			return this.openCloudDataString(aString);
		}
		if (aString.indexOf('<blocks') === 0) {
			return this.openBlocksString(aString, lbl, true);
		}
		if (aString.indexOf('<sprites') === 0) {
			return this.openSpritesString(aString);
		}
		if (aString.indexOf('<media') === 0) {
			return this.openMediaString(aString);
		}
	},

	droppedBinary: function (anArrayBuffer, name) {
		// dynamically load ypr->Snap!
		var ypr = document.getElementById('ypr'),
			myself = this,
			suffix = name.substring(name.length - 3);

		if (suffix.toLowerCase() !== 'ypr') {
			return;
		}

		function loadYPR(buffer, lbl) {
			var reader = new sb.Reader(),
				pname = lbl.split('.')[0]; // up to period
			reader.onload = function (info) {
				myself.droppedText(new sb.XMLWriter().write(pname, info));
			};
			reader.readYPR(new Uint8Array(buffer));
		}

		if (!ypr) {
			ypr = document.createElement('script');
			ypr.id = 'ypr';
			ypr.onload = function () {
				loadYPR(anArrayBuffer, name);
			};
			document.head.appendChild(ypr);
			ypr.src = 'ypr.js';
		} else {
			loadYPR(anArrayBuffer, name);
		}
	},

	// IDE_Morph button actions
	refreshPalette: function (shouldIgnorePosition) {
		var oldTop = this.palette.contents.top();

		this.createPalette();
		this.fixLayout('refreshPalette');
		if (!shouldIgnorePosition) {
			this.palette.contents.setTop(oldTop);
		}
	},

	pressStart: function () {
		if (this.world().currentKey === 16) { // shiftClicked
			this.toggleFastTracking();
		} else {
			this.runScripts();
		}
	},

	toggleFastTracking: function () {
		if (this.stage.isFastTracked) {
			this.stopFastTracking();
		} else {
			this.startFastTracking();
		}
	},

	toggleVariableFrameRate: function () {
		if (StageMorph.prototype.frameRate) {
			StageMorph.prototype.frameRate = 0;
			this.stage.fps = 0;
		} else {
			StageMorph.prototype.frameRate = 30;
			this.stage.fps = 30;
		}
	},

	startFastTracking: function () {
		this.stage.isFastTracked = true;
		this.stage.fps = 0;
		this.controlBar.startButton.labelString = new SymbolMorph('flash', 14);
		this.controlBar.startButton.drawNew();
		this.controlBar.startButton.fixLayout();
	},

	stopFastTracking: function () {
		this.stage.isFastTracked = false;
		this.stage.fps = this.stage.frameRate;
		this.controlBar.startButton.labelString = new SymbolMorph('flag', 14);
		this.controlBar.startButton.drawNew();
		this.controlBar.startButton.fixLayout();
	},

	runScripts: function () {
		this.stage.fireGreenFlagEvent();
	},

	togglePauseResume: function () {
		if (this.stage.threads.isPaused()) {
			this.stage.threads.resumeAll(this.stage);
		} else {
			this.stage.threads.pauseAll(this.stage);
		}
		this.controlBar.pauseButton.refresh();
	},

	isPaused: function () {
		if (!this.stage) {
			return false;
		}
		return this.stage.threads.isPaused();
	},

	stopAllScripts: function () {
		this.stage.fireStopAllEvent();
	},

	selectSprite: function (sprite) {
		this.currentSprite = sprite;
		this.createPalette();
		this.createSpriteBar();
		this.createSpriteEditor();
		this.corral.refresh();
		this.fixLayout('selectSprite');
		this.currentSprite.scripts.fixMultiArgs();
	},

	// IDE_Morph skins
	defaultDesign: function () {
		this.setDefaultDesign();
		this.refreshIDE();
		this.removeSetting('design');
	},

	flatDesign: function () {
		this.setFlatDesign();
		this.refreshIDE();
		this.saveSetting('design', 'flat');
	},

	refreshIDE: function () {
		var projectData;

		if (Process.prototype.isCatchingErrors) {
			try {
				projectData = this.serializer.serialize(this.stage);
			} catch (err) {
				this.showMessage('Serialization failed: ' + err);
			}
		} else {
			projectData = this.serializer.serialize(this.stage);
		}
		SpriteMorph.prototype.initBlocks();
		this.buildPanes();
		this.fixLayout();
		if (this.loadNewProject) {
			this.newProject();
		} else {
			this.openProjectString(projectData);
		}
	},

	// IDE_Morph settings persistance
	applySavedSettings: function () {
		var design = this.getSetting('design'),
			zoom = this.getSetting('zoom'),
			language = this.getSetting('language'),
			click = this.getSetting('click'),
			longform = this.getSetting('longform'),
			plainprototype = this.getSetting('plainprototype');

		// design
		if (design === 'flat') {
			this.setFlatDesign();
		} else {
			this.setDefaultDesign();
		}

		// blocks zoom
		if (zoom) {
			SyntaxElementMorph.prototype.setScale(Math.min(zoom, 12));
			CommentMorph.prototype.refreshScale();
			SpriteMorph.prototype.initBlocks();
		}

		// language
		if (language && language !== 'en') {
			this.userLanguage = language;
		} else {
			this.userLanguage = null;
		}

		//  click
		if (click && !BlockMorph.prototype.snapSound) {
			BlockMorph.prototype.toggleSnapSound();
		}

		// long form
		if (longform) {
			InputSlotDialogMorph.prototype.isLaunchingExpanded = true;
		}

		// plain prototype labels
		if (plainprototype) {
			BlockLabelPlaceHolderMorph.prototype.plainLabel = true;
		}
	},

	saveSetting: function (key, value) {
		if (localStorage) {
			localStorage['-snap-setting-' + key] = value;
		}
	},

	getSetting: function (key) {
		if (localStorage) {
			return localStorage['-snap-setting-' + key];
		}
		return null;
	},

	removeSetting: function (key) {
		if (localStorage) {
			delete localStorage['-snap-setting-' + key];
		}
	},

	// IDE_Morph sprite list access
	addNewSprite: function () {
		var sprite = new SpriteMorph(this.globalVariables),
			rnd = Process.prototype.reportRandom;

		sprite.name = this.newSpriteName(sprite.name);
		sprite.setCenter(this.stage.center());
		this.stage.add(sprite);

		// randomize sprite properties
		sprite.setHue(rnd.call(this, 0, 100));
		sprite.setBrightness(rnd.call(this, 50, 100));
		sprite.turn(rnd.call(this, 1, 360));
		sprite.setXPosition(rnd.call(this, -220, 220));
		sprite.setYPosition(rnd.call(this, -160, 160));

		this.sprites.add(sprite);
		this.corral.addSprite(sprite);
		this.selectSprite(sprite);
	},

	paintNewSprite: function () {
		var sprite = new SpriteMorph(this.globalVariables),
			cos = new Costume(),
			myself = this;

		sprite.name = this.newSpriteName(sprite.name);
		sprite.setCenter(this.stage.center());
		this.stage.add(sprite);
		this.sprites.add(sprite);
		this.corral.addSprite(sprite);
		this.selectSprite(sprite);
		cos.edit(
			this.world(),
			this,
			true,
			function () {
				myself.removeSprite(sprite);
			},
			function () {
				sprite.addCostume(cos);
				sprite.wearCostume(cos);
			}
		);
	},

	addNewSpritePrototype: function () {
		var sprite = new SpriteMorph(new Image()),
			cos = new Costume(newCanvas(new Point(100, 100)), new Image('library2.jpg')),
			myself = this;

		img = new Image();
		img.src = 'merlion.jpg';

		sprite.image = img;

		//sprite.name = this.newSpriteName('Merlion');
		sprite.name = 'Merlion';
		sprite.setCenter(this.stage.center());
		this.stage.add(sprite);

		this.sprites.add(sprite);
		this.corral.addSprite(sprite);
		this.selectSprite(sprite);

		//myself.removeSprite(sprite);
		//sprite.addCostume(cos);
		//sprite.wearCostume(cos);
	},

	nextScene: function () {
		var db = new DialogBoxMorph();
		//var button;
		var nextscenebutton;
		var pic = newCanvas(new Point(
			//434, 294
			900, 550
		));

		ctx = pic.getContext("2d");
		img = new Image();
		img.src = 'library2.jpg';
		img.onload = function () {
			// create pattern
			var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
			ctx.fillStyle = ptrn;
			ctx.fillRect(0, 0, pic.width, pic.height); // context.fillRect(x, y, width, height);
		};

		db.inform(
			'Import Resource',
			'I have a gigantic unicorn',
			this.world(),
			pic,
			'library window'
		);

		var button;		//merlion
		button = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button.setWidth(70);
		button.setHeight(70);

		button.setPosition(new Point(780, 425));

		db.add(button);

		var button2;		//$1 coin
		button2 = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button2.setWidth(70);
		button2.setHeight(70);

		button2.setPosition(new Point(935, 425));

		db.add(button2);

		var button3;		//Chinese boy
		button3 = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button3.setWidth(70);
		button3.setHeight(70);

		button3.setPosition(new Point(780, 265));

		db.add(button3);

		var button4;		//malay girl
		button4 = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button4.setWidth(70);
		button4.setHeight(70);

		button4.setPosition(new Point(935, 265));

		db.add(button4);

		var button5;		//indian boy
		button5 = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button5.setWidth(70);
		button5.setHeight(70);

		button5.setPosition(new Point(1090, 265));

		db.add(button5);

		var button6;		//ah lian
		button6 = new PushButtonMorph(
			this,
			'addNewSpritePrototype',
			"+",
			null,
			null,
			null,
			'show green button'
		);

		button6.setWidth(70);
		button6.setHeight(70);

		button6.setPosition(new Point(1245, 265));

		db.add(button6);
	},

	openLibrary: function () {
		var db = new DialogBoxMorph();
		//var button;
		var nextscenebutton;
		//var txt;
		var myself = this,
			world = this.world();

		//db.createLabel();
		//db.addBody(txt);
		//db.addButton('ok', 'Ok');
		//db.addButton('cancel', 'Cancel');
		//db.fixLayout();
		//db.drawNew();
		//this.add(db);
		db.setWidth(screen.width*0.7);
		db.setHeight(screen.height*0.7);
		//db.fontSize = 40;
		db.createCheckBox(db.length,db.height);

		db.createImage(
			function(){return new SpriteMorph(new Image())},
			screen.width * 0.3,
			screen.height * 0.15
		);
	},

	duplicateSprite: function (sprite) {
		var duplicate = sprite.fullCopy();

		duplicate.setPosition(this.world().hand.position());
		duplicate.appearIn(this);
		duplicate.keepWithin(this.stage);
		this.selectSprite(duplicate);
	},

	removeSprite: function (sprite) {
		var idx, myself = this;
		sprite.parts.forEach(function (part) {
			myself.removeSprite(part);
		});
		idx = this.sprites.asArray().indexOf(sprite) + 1;
		this.stage.threads.stopAllForReceiver(sprite);
		sprite.destroy();
		this.stage.watchers().forEach(function (watcher) {
			if (watcher.object() === sprite) {
				watcher.destroy();
			}
		});
		if (idx > 0) {
			this.sprites.remove(idx);
		}
		this.createCorral();
		this.fixLayout();
		this.currentSprite = detect(
			this.stage.children,
			function (morph) {
				return morph instanceof SpriteMorph;
			}
		) || this.stage;

		this.selectSprite(this.currentSprite);
	},

	newSpriteName: function (name, ignoredSprite) {
		var ix = name.indexOf('('),
			stem = (ix < 0) ? name : name.substring(0, ix),
			count = 1,
			newName = stem,
			all = this.sprites.asArray().filter(
				function (each) {
					return each !== ignoredSprite;
				}
			).map(
				function (each) {
					return each.name;
				}
			);
		while (contains(all, newName)) {
			count += 1;
			newName = stem + '(' + count + ')';
		}
		return newName;
	},

	// IDE_Morph menus
	userMenu: function () {
		var menu = new MenuMorph(this);
		// menu.addItem('help', 'nop');
		return menu;
	},

	snapMenu: function () {
		var menu,
			world = this.world();

		menu = new MenuMorph(this);
		menu.addItem('About...', 'aboutSnap');
		menu.addLine();
		menu.addItem('Reference manual',
			function () {
				window.open('help/SnapManual.pdf', 'SnapReferenceManual');
			}
		);

		menu.addItem('Snap! website',
			function () {
				window.open('http://snap.berkeley.edu/', 'SnapWebsite');
			}
		);

		menu.addItem('Download source',
			function () {
				window.open(
					'http://snap.berkeley.edu/snapsource/snap.zip',
					'SnapSource'
				);
			}
		);

		if (world.isDevMode) {
			menu.addLine();
			menu.addItem(
				'Switch back to user mode',
				'switchToUserMode',
				'disable deep-Morphic\ncontext menus'
				+ '\nand show user-friendly ones',
				new Color(0, 100, 0)
			);
		} else if (world.currentKey === 16) { // shift-click
			menu.addLine();
			menu.addItem(
				'Switch to dev mode',
				'switchToDevMode',
				'enable Morphic\ncontext menus\nand inspectors,'
				+ '\nnot user-friendly!',
				new Color(100, 0, 0)
			);
		}
		menu.popup(world, this.logo.bottomLeft());
	},

	cloudMenu: function () {
		var menu,
			myself = this,
			world = this.world(),
			pos = this.controlBar.cloudButton.bottomLeft(),
			shiftClicked = (world.currentKey === 16);

		menu = new MenuMorph(this);
		if (shiftClicked) {
			menu.addItem(
				'url...',
				'setCloudURL',
				null,
				new Color(100, 0, 0)
			);
			menu.addLine();
		}
		if (!SnapCloud.username) {
			menu.addItem(
				'Login...',
				'initializeCloud'
			);
			menu.addItem(
				'Signup...',
				'createCloudAccount'
			);
			menu.addItem(
				'Reset Password...',
				'resetCloudPassword'
			);
		} else {
			menu.addItem(
				localize('Logout') + ' ' + SnapCloud.username,
				'logout'
			);
			menu.addItem(
				'Change Password...',
				'changeCloudPassword'
			);
		}
		if (shiftClicked) {
			menu.addLine();
			menu.addItem(
				'export project media only...',
				function () {
					if (myself.projectName) {
						myself.exportProjectMedia(myself.projectName);
					} else {
						myself.prompt('Export Project As...', function (name) {
							myself.exportProjectMedia(name);
						}, null, 'exportProject');
					}
				},
				null,
				this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
			);
			menu.addItem(
				'export project without media...',
				function () {
					if (myself.projectName) {
						myself.exportProjectNoMedia(myself.projectName);
					} else {
						myself.prompt('Export Project As...', function (name) {
							myself.exportProjectNoMedia(name);
						}, null, 'exportProject');
					}
				},
				null,
				new Color(100, 0, 0)
			);
			menu.addItem(
				'export project as cloud data...',
				function () {
					if (myself.projectName) {
						myself.exportProjectAsCloudData(myself.projectName);
					} else {
						myself.prompt('Export Project As...', function (name) {
							myself.exportProjectAsCloudData(name);
						}, null, 'exportProject');
					}
				},
				null,
				new Color(100, 0, 0)
			);
			menu.addLine();
			menu.addItem(
				'open shared project from cloud...',
				function () {
					myself.prompt('Author name…', function (usr) {
						myself.prompt('Project name...', function (prj) {
							var id = 'Username=' +
								encodeURIComponent(usr.toLowerCase()) +
								'&ProjectName=' +
								encodeURIComponent(prj);
							myself.showMessage(
								'Fetching project\nfrom the cloud...'
							);
							SnapCloud.getPublicProject(
								id,
								function (projectData) {
									var msg;
									if (!Process.prototype.isCatchingErrors) {
										window.open(
											'data:text/xml,' + projectData
										);
									}
									myself.nextSteps([
										function () {
											msg = myself.showMessage(
												'Opening project...'
											);
										},
										function () {
											myself.rawOpenCloudDataString(
												projectData
											);
										},
										function () {
											msg.destroy();
										}
									]);
								},
								myself.cloudError()
							);

						}, null, 'project');
					}, null, 'project');
				},
				null,
				new Color(100, 0, 0)
			);
		}
		menu.popup(world, pos);
	},

	settingsMenu: function () {
		var menu,
			stage = this.stage,
			world = this.world(),
			myself = this,
			pos = this.controlBar.settingsButton.bottomLeft(),
			shiftClicked = (world.currentKey === 16);

		function addPreference(label, toggle, test, onHint, offHint, hide) {
			var on = '\u2611 ',
				off = '\u2610 ';
			if (!hide || shiftClicked) {
				menu.addItem(
					(test ? on : off) + localize(label),
					toggle,
					test ? onHint : offHint,
					hide ? new Color(100, 0, 0) : null
				);
			}
		}

		menu = new MenuMorph(this);
		menu.addItem('Language...', 'languageMenu');
		menu.addItem(
			'Zoom blocks...',
			'userSetBlocksScale'
		);
		menu.addItem(
			'Stage size...',
			'userSetStageSize'
		);
		menu.addLine();
		addPreference(
			'Blurred shadows',
			'toggleBlurredShadows',
			useBlurredShadows,
			'uncheck to use solid drop\nshadows and highlights',
			'check to use blurred drop\nshadows and highlights',
			true
		);
		addPreference(
			'Zebra coloring',
			'toggleZebraColoring',
			BlockMorph.prototype.zebraContrast,
			'uncheck to disable alternating\ncolors for nested block',
			'check to enable alternating\ncolors for nested blocks',
			true
		);
		addPreference(
			'Dynamic input labels',
			'toggleDynamicInputLabels',
			SyntaxElementMorph.prototype.dynamicInputLabels,
			'uncheck to disable dynamic\nlabels for variadic inputs',
			'check to enable dynamic\nlabels for variadic inputs',
			true
		);
		addPreference(
			'Prefer empty slot drops',
			'togglePreferEmptySlotDrops',
			ScriptsMorph.prototype.isPreferringEmptySlots,
			'uncheck to allow dropped\nreporters to kick out others',
			'settings menu prefer empty slots hint',
			true
		);
		addPreference(
			'Long form input dialog',
			'toggleLongFormInputDialog',
			InputSlotDialogMorph.prototype.isLaunchingExpanded,
			'uncheck to use the input\ndialog in short form',
			'check to always show slot\ntypes in the input dialog'
		);
		addPreference(
			'Plain prototype labels',
			'togglePlainPrototypeLabels',
			BlockLabelPlaceHolderMorph.prototype.plainLabel,
			'uncheck to always show (+) symbols\nin block prototype labels',
			'check to hide (+) symbols\nin block prototype labels'
		);
		addPreference(
			'Virtual keyboard',
			'toggleVirtualKeyboard',
			MorphicPreferences.useVirtualKeyboard,
			'uncheck to disable\nvirtual keyboard support\nfor mobile devices',
			'check to enable\nvirtual keyboard support\nfor mobile devices',
			true
		);
		addPreference(
			'Input sliders',
			'toggleInputSliders',
			MorphicPreferences.useSliderForInput,
			'uncheck to disable\ninput sliders for\nentry fields',
			'check to enable\ninput sliders for\nentry fields'
		);
		if (MorphicPreferences.useSliderForInput) {
			addPreference(
				'Execute on slider change',
				'toggleSliderExecute',
				InputSlotMorph.prototype.executeOnSliderEdit,
				'uncheck to supress\nrunning scripts\nwhen moving the slider',
				'check to run\nthe edited script\nwhen moving the slider'
			);
		}
		addPreference(
			'Clicking sound',
			function () {
				BlockMorph.prototype.toggleSnapSound();
				if (BlockMorph.prototype.snapSound) {
					myself.saveSetting('click', true);
				} else {
					myself.removeSetting('click');
				}
			},
			BlockMorph.prototype.snapSound,
			'uncheck to turn\nblock clicking\nsound off',
			'check to turn\nblock clicking\nsound on'
		);
		addPreference(
			'Animations',
			function () {
				myself.isAnimating = !myself.isAnimating;
			},
			myself.isAnimating,
			'uncheck to disable\nIDE animations',
			'check to enable\nIDE animations',
			true
		);
		addPreference(
			'Turbo mode',
			'toggleFastTracking',
			this.stage.isFastTracked,
			'uncheck to run scripts\nat normal speed',
			'check to prioritize\nscript execution'
		);
		addPreference(
			'Rasterize SVGs',
			function () {
				MorphicPreferences.rasterizeSVGs = !MorphicPreferences.rasterizeSVGs;
			},
			MorphicPreferences.rasterizeSVGs,
			'uncheck for smooth\nscaling of vector costumes',
			'check to rasterize\nSVGs on import',
			true
		);
		addPreference(
			'Flat design',
			function () {
				if (MorphicPreferences.isFlat) {
					return myself.defaultDesign();
				}
				myself.flatDesign();
			},
			MorphicPreferences.isFlat,
			'uncheck for default\nGUI design',
			'check for alternative\nGUI design',
			false
		);
		addPreference(
			'Sprite Nesting',
			function () {
				SpriteMorph.prototype.enableNesting = !SpriteMorph.prototype.enableNesting;
			},
			SpriteMorph.prototype.enableNesting,
			'uncheck to disable\nsprite composition',
			'check to enable\nsprite composition',
			true
		);
		menu.addLine(); // everything below this line is stored in the project
		addPreference(
			'Thread safe scripts',
			function () {
				stage.isThreadSafe = !stage.isThreadSafe;
			},
			this.stage.isThreadSafe,
			'uncheck to allow\nscript reentrance',
			'check to disallow\nscript reentrance'
		);
		addPreference(
			'Prefer smooth animations',
			'toggleVariableFrameRate',
			StageMorph.prototype.frameRate,
			'uncheck for greater speed\nat variable frame rates',
			'check for smooth, predictable\nanimations across computers'
		);
		addPreference(
			'Flat line ends',
			function () {
				SpriteMorph.prototype.useFlatLineEnds = !SpriteMorph.prototype.useFlatLineEnds;
			},
			SpriteMorph.prototype.useFlatLineEnds,
			'uncheck for round ends of lines',
			'check for flat ends of lines'
		);
		addPreference(
			'Codification support',
			function () {
				StageMorph.prototype.enableCodeMapping = !StageMorph.prototype.enableCodeMapping;
				myself.currentSprite.blocksCache.variables = null;
				myself.currentSprite.paletteCache.variables = null;
				myself.refreshPalette();
			},
			StageMorph.prototype.enableCodeMapping,
			'uncheck to disable\nblock to text mapping features',
			'check for block\nto text mapping features',
			false
		);
		menu.popup(world, pos);
	},

	projectMenu: function () {
		var menu,
			myself = this,
			world = this.world(),
			pos = this.controlBar.projectButton.bottomLeft(),
			graphicsName = this.currentSprite instanceof SpriteMorph ?
				'Costumes' : 'Backgrounds',
			shiftClicked = (world.currentKey === 16);

		menu = new MenuMorph(this);
		menu.addItem('Project notes...', 'editProjectNotes');
		menu.addLine();
		menu.addItem('New', 'createNewProject');
		menu.addItem('Open...', 'openProjectsBrowser');
		menu.addItem('Save', "save");
		if (shiftClicked) {
			menu.addItem(
				'Save to disk',
				'saveProjectToDisk',
				'experimental - store this project\nin your downloads folder',
				new Color(100, 0, 0)
			);
		}
		menu.addItem('Save As...', 'saveProjectsBrowser');
		menu.addLine();
		menu.addItem(
			'Import...',
			function () {
				var inp = document.createElement('input');
				if (myself.filePicker) {
					document.body.removeChild(myself.filePicker);
					myself.filePicker = null;
				}
				inp.type = 'file';
				inp.style.color = "transparent";
				inp.style.backgroundColor = "transparent";
				inp.style.border = "none";
				inp.style.outline = "none";
				inp.style.position = "absolute";
				inp.style.top = "0px";
				inp.style.left = "0px";
				inp.style.width = "0px";
				inp.style.height = "0px";
				inp.addEventListener(
					"change",
					function () {
						document.body.removeChild(inp);
						myself.filePicker = null;
						world.hand.processDrop(inp.files);
					},
					false
				);
				document.body.appendChild(inp);
				myself.filePicker = inp;
				inp.click();
			},
			'file menu import hint' // looks up the actual text in the translator
		);

		menu.addItem(
			shiftClicked ?
				'Export project as plain text...' : 'Export project...',
			function () {
				if (myself.projectName) {
					myself.exportProject(myself.projectName, shiftClicked);
				} else {
					myself.prompt('Export Project As...', function (name) {
						myself.exportProject(name);
					}, null, 'exportProject');
				}
			},
			'show project data as XML\nin a new browser window',
			shiftClicked ? new Color(100, 0, 0) : null
		);

		menu.addItem(
			'Export blocks...',
			function () {
				myself.exportGlobalBlocks();
			},
			'show global custom block definitions as XML\nin a new browser window'
		);

		if (shiftClicked) {
			menu.addItem(
				'Export all scripts as pic...',
				function () {
					myself.exportScriptsPicture();
				},
				'show a picture of all scripts\nand block definitions',
				new Color(100, 0, 0)
			);
		}

		menu.addLine();
		menu.addItem(
			'Import tools',
			function () {
				myself.droppedText(
					myself.getURLsbeOrRelative(
						'tools.xml'
					),
					'tools'
				);
			},
			'load the official library of\npowerful blocks'
		);
		menu.addItem(
			'Libraries...',
			function () {
				// read a list of libraries from an external file,
				var libMenu = new MenuMorph(this, 'Import library'),
					libUrl = 'http://snap.berkeley.edu/snapsource/libraries/' +
						'LIBRARIES';

				function loadLib(name) {
					var url = 'http://snap.berkeley.edu/snapsource/libraries/'
						+ name
						+ '.xml';
					myself.droppedText(myself.getURL(url), name);
				}

				myself.getURL(libUrl).split('\n').forEach(function (line) {
					if (line.length > 0) {
						libMenu.addItem(
							line.substring(line.indexOf('\t') + 1),
							function () {
								loadLib(
									line.substring(0, line.indexOf('\t'))
								);
							}
						);
					}
				});

				libMenu.popup(world, pos);
			},
			'Select categories of additional blocks to add to this project.'
		);

		menu.addItem(
			localize(graphicsName) + '...',
			function () {
				var dir = graphicsName,
					names = myself.getCostumesList(dir),
					libMenu = new MenuMorph(
						myself,
						localize('Import') + ' ' + localize(dir)
					);

				function loadCostume(name) {
					var url = dir + '/' + name,
						img = new Image();
					img.onload = function () {
						var canvas = newCanvas(new Point(img.width, img.height));
						canvas.getContext('2d').drawImage(img, 0, 0);
						myself.droppedImage(canvas, name);
					};
					img.src = url;
				}

				names.forEach(function (line) {
					if (line.length > 0) {
						libMenu.addItem(
							line,
							function () {
								loadCostume(line);
							}
						);
					}
				});
				libMenu.popup(world, pos);
			},
			'Select a costume from the media library'
		);
		menu.addItem(
			localize('Sounds') + '...',
			function () {
				var names = this.getCostumesList('Sounds'),
					libMenu = new MenuMorph(this, 'Import sound');

				function loadSound(name) {
					var url = 'Sounds/' + name,
						audio = new Audio();
					audio.src = url;
					audio.load();
					myself.droppedAudio(audio, name);
				}

				names.forEach(function (line) {
					if (line.length > 0) {
						libMenu.addItem(
							line,
							function () {
								loadSound(line);
							}
						);
					}
				});
				libMenu.popup(world, pos);
			},
			'Select a sound from the media library'
		);

		menu.popup(world, pos);
	},

	getCostumesList: function (dirname) {
		var dir,
			costumes = [];

		dir = this.getURL(dirname);
		dir.split('\n').forEach(
			function (line) {
				var startIdx = line.search(new RegExp('href="[^./?].*"')),
					endIdx,
					name;

				if (startIdx > 0) {
					name = line.substring(startIdx + 6);
					endIdx = name.search(new RegExp('"'));
					name = name.substring(0, endIdx);
					costumes.push(name);
				}
			}
		);
		costumes.sort(function (x, y) {
			return x < y ? -1 : 1;
		});
		return costumes;
	},

	// xinni: sharebox menu buttons
	shareBoxSettingsMenu: function() {

		console.log("Settings for sharebox triggered");

		var menu,
			world = this.world(),
			pos = this.shareBoxTitleBarButtons.shareBoxSettingsButton.bottomLeft();

		menu = new MenuMorph(this);
		menu.addItem(
			'View/Edit Members',
			'showViewMembersPopup'
		);
		menu.addLine();
		menu.addItem(
			'Add Members',
			'showAddMemberPopup'
		);
		menu.addLine();
		menu.addItem(
			'Leave group',
			'showLeaveGroupPopup'
		);
		menu.popup(world, pos);

	},

	// IDE_Morph menu actions

	aboutSnap: function () {
		var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
			module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
			world = this.world();

		aboutTxt = 'Snap! 4.0\nBuild Your Own Blocks\n\n--- beta ---\n\n'
		+ 'Copyright \u24B8 2014 Jens M\u00F6nig and '
		+ 'Brian Harvey\n'
		+ 'jens@moenig.org, bh@cs.berkeley.edu\n\n'

		+ 'Snap! is developed by the University of California, Berkeley\n'
		+ '          with support from the National Science Foundation '
		+ 'and MioSoft.   \n'

		+ 'The design of Snap! is influenced and inspired by Scratch,\n'
		+ 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

		+ 'for more information see http://snap.berkeley.edu\n'
		+ 'and http://scratch.mit.edu';

		noticeTxt = localize('License')
		+ '\n\n'
		+ 'Snap! is free software: you can redistribute it and/or modify\n'
		+ 'it under the terms of the GNU Affero General Public License as\n'
		+ 'published by the Free Software Foundation, either version 3 of\n'
		+ 'the License, or (at your option) any later version.\n\n'

		+ 'This program is distributed in the hope that it will be useful,\n'
		+ 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
		+ 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
		+ 'GNU Affero General Public License for more details.\n\n'

		+ 'You should have received a copy of the\n'
		+ 'GNU Affero General Public License along with this program.\n'
		+ 'If not, see http://www.gnu.org/licenses/';

		creditsTxt = localize('Contributors')
		+ '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
		+ 'countless bugfixes'
		+ '\nKartik Chandra: Paint Editor'
		+ '\nMichael Ball: Time/Date UI, many bugfixes'
		+ '\n"Ava" Yuan Yuan: Graphic Effects'
		+ '\nKyle Hotchkiss: Block search design'
		+ '\nIan Reynolds: UI Design, Event Bindings, '
		+ 'Sound primitives'
		+ '\nIvan Motyashov: Initial Squeak Porting'
		+ '\nDavide Della Casa: Morphic Optimizations'
		+ '\nAchal Dave: Web Audio'
		+ '\nJoe Otto: Morphic Testing and Debugging';

		for (module in modules) {
			if (Object.prototype.hasOwnProperty.call(modules, module)) {
				versions += ('\n' + module + ' (' +
				modules[module] + ')');
			}
		}
		if (versions !== '') {
			versions = localize('current module versions:') + ' \n\n' +
			'morphic (' + morphicVersion + ')' +
			versions;
		}
		translations = localize('Translations') + '\n' + SnapTranslator.credits();

		dlg = new DialogBoxMorph();
		dlg.inform('About Snap', aboutTxt, world);
		btn1 = dlg.buttons.children[0];
		translatorsBtn = dlg.addButton(
			function () {
				dlg.body.text = translations;
				dlg.body.drawNew();
				btn1.show();
				btn2.show();
				btn3.hide();
				btn4.hide();
				licenseBtn.hide();
				translatorsBtn.hide();
				dlg.fixLayout();
				dlg.drawNew();
				dlg.setCenter(world.center());
			},
			'Translators...'
		);
		btn2 = dlg.addButton(
			function () {
				dlg.body.text = aboutTxt;
				dlg.body.drawNew();
				btn1.show();
				btn2.hide();
				btn3.show();
				btn4.show();
				licenseBtn.show();
				translatorsBtn.hide();
				dlg.fixLayout();
				dlg.drawNew();
				dlg.setCenter(world.center());
			},
			'Back...'
		);
		btn2.hide();
		licenseBtn = dlg.addButton(
			function () {
				dlg.body.text = noticeTxt;
				dlg.body.drawNew();
				btn1.show();
				btn2.show();
				btn3.hide();
				btn4.hide();
				licenseBtn.hide();
				translatorsBtn.hide();
				dlg.fixLayout();
				dlg.drawNew();
				dlg.setCenter(world.center());
			},
			'License...'
		);
		btn3 = dlg.addButton(
			function () {
				dlg.body.text = versions;
				dlg.body.drawNew();
				btn1.show();
				btn2.show();
				btn3.hide();
				btn4.hide();
				licenseBtn.hide();
				translatorsBtn.hide();
				dlg.fixLayout();
				dlg.drawNew();
				dlg.setCenter(world.center());
			},
			'Modules...'
		);
		btn4 = dlg.addButton(
			function () {
				dlg.body.text = creditsTxt;
				dlg.body.drawNew();
				btn1.show();
				btn2.show();
				translatorsBtn.show();
				btn3.hide();
				btn4.hide();
				licenseBtn.hide();
				dlg.fixLayout();
				dlg.drawNew();
				dlg.setCenter(world.center());
			},
			'Credits...'
		);
		translatorsBtn.hide();
		dlg.fixLayout();
		dlg.drawNew();
	},

	editProjectNotes: function () {
		var dialog = new DialogBoxMorph().withKey('projectNotes'),
			frame = new ScrollFrameMorph(),
			text = new TextMorph(this.projectNotes || ''),
			ok = dialog.ok,
			myself = this,
			size = 250,
			world = this.world();

		frame.padding = 6;
		frame.setWidth(size);
		frame.acceptsDrops = false;
		frame.contents.acceptsDrops = false;

		text.setWidth(size - frame.padding * 2);
		text.setPosition(frame.topLeft().add(frame.padding));
		text.enableSelecting();
		text.isEditable = true;

		frame.setHeight(size);
		frame.fixLayout = nop;
		frame.edge = InputFieldMorph.prototype.edge;
		frame.fontSize = InputFieldMorph.prototype.fontSize;
		frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
		frame.contrast = InputFieldMorph.prototype.contrast;
		frame.drawNew = InputFieldMorph.prototype.drawNew;
		frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

		frame.addContents(text);
		text.drawNew();

		dialog.ok = function () {
			myself.projectNotes = text.text;
			ok.call(this);
		};

		dialog.justDropped = function () {
			text.edit();
		};

		dialog.labelString = 'Project Notes';
		dialog.createLabel();
		dialog.addBody(frame);
		frame.drawNew();
		dialog.addButton('ok', 'OK');
		dialog.addButton('cancel', 'Cancel');
		dialog.fixLayout();
		dialog.drawNew();
		dialog.popUp(world);
		dialog.setCenter(world.center());
		text.edit();
	},

	newProject: function () {
		this.source = SnapCloud.username ? 'cloud' : 'local';
		if (this.stage) {
			this.stage.destroy();
		}
		if (location.hash.substr(0, 6) !== '#lang:') {
			location.hash = '';
		}
		this.globalVariables = new VariableFrame();
		this.currentSprite = new SpriteMorph(this.globalVariables);
		this.sprites = new List([this.currentSprite]);
		StageMorph.prototype.dimensions = new Point(480, 360);
		StageMorph.prototype.hiddenPrimitives = {};
		StageMorph.prototype.codeMappings = {};
		StageMorph.prototype.codeHeaders = {};
		StageMorph.prototype.enableCodeMapping = false;
		SpriteMorph.prototype.useFlatLineEnds = false;
		this.setProjectName('');
		this.projectNotes = '';
		this.createStage();
		this.add(this.stage);
		this.createCorral();
		this.selectSprite(this.stage.children[0]);
		this.fixLayout();
	},

	save: function () {
		if (this.source === 'examples') {
			this.source = 'local'; // cannot save to examples
		}
		if (this.projectName) {
			if (this.source === 'local') { // as well as 'examples'
				this.saveProject(this.projectName);
			} else { // 'cloud'
				this.saveProjectToCloud(this.projectName);
			}
		} else {
			this.saveProjectsBrowser();
		}
	},

	saveProject: function (name) {
		var myself = this;
		this.nextSteps([
			function () {
				myself.showMessage('Saving...');
			},
			function () {
				myself.rawSaveProject(name);
			}
		]);
	},

	rawSaveProject: function (name) {
		var str;
		if (name) {
			this.setProjectName(name);
			if (Process.prototype.isCatchingErrors) {
				try {
					localStorage['-snap-project-' + name]
						= str = this.serializer.serialize(this.stage);
					location.hash = '#open:' + str;
					this.showMessage('Saved!', 1);
				} catch (err) {
					this.showMessage('Save failed: ' + err);
				}
			} else {
				localStorage['-snap-project-' + name]
					= str = this.serializer.serialize(this.stage);
				location.hash = '#open:' + str;
				this.showMessage('Saved!', 1);
			}
		}
	},

	saveProjectToDisk: function () {
		var data,
			link = document.createElement('a');

		if (Process.prototype.isCatchingErrors) {
			try {
				data = this.serializer.serialize(this.stage);
				link.setAttribute('href', 'data:text/xml,' + data);
				link.setAttribute('download', this.projectName + '.xml');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} catch (err) {
				this.showMessage('Saving failed: ' + err);
			}
		} else {
			data = this.serializer.serialize(this.stage);
			link.setAttribute('href', 'data:text/xml,' + data);
			link.setAttribute('download', this.projectName + '.xml');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	},

	exportProject: function (name, plain) {
		var menu, str;
		if (name) {
			this.setProjectName(name);
			if (Process.prototype.isCatchingErrors) {
				try {
					menu = this.showMessage('Exporting');
					str = encodeURIComponent(
						this.serializer.serialize(this.stage)
					);
					location.hash = '#open:' + str;
					window.open('data:text/'
					+ (plain ? 'plain,' + str : 'xml,' + str));
					menu.destroy();
					this.showMessage('Exported!', 1);
				} catch (err) {
					this.showMessage('Export failed: ' + err);
				}
			} else {
				menu = this.showMessage('Exporting');
				str = encodeURIComponent(
					this.serializer.serialize(this.stage)
				);
				location.hash = '#open:' + str;
				window.open('data:text/'
				+ (plain ? 'plain,' + str : 'xml,' + str));
				menu.destroy();
				this.showMessage('Exported!', 1);
			}
		}
	},

	exportGlobalBlocks: function () {
		if (this.stage.globalBlocks.length > 0) {
			new BlockExportDialogMorph(
				this.serializer,
				this.stage.globalBlocks
			).popUp(this.world());
		} else {
			this.inform(
				'Export blocks',
				'this project doesn\'t have any\n'
				+ 'custom global blocks yet'
			);
		}
	},

	exportSprite: function (sprite) {
		var str = this.serializer.serialize(sprite.allParts());
		window.open('data:text/xml,<sprites app="'
		+ this.serializer.app
		+ '" version="'
		+ this.serializer.version
		+ '">'
		+ str
		+ '</sprites>');
	},

	exportScriptsPicture: function () {
		var pics = [],
			pic,
			padding = 20,
			w = 0,
			h = 0,
			y = 0,
			ctx;

		// collect all script pics
		this.sprites.asArray().forEach(function (sprite) {
			pics.push(sprite.image);
			pics.push(sprite.scripts.scriptsPicture());
			sprite.customBlocks.forEach(function (def) {
				pics.push(def.scriptsPicture());
			});
		});
		pics.push(this.stage.image);
		pics.push(this.stage.scripts.scriptsPicture());
		this.stage.customBlocks.forEach(function (def) {
			pics.push(def.scriptsPicture());
		});

		// collect global block pics
		this.stage.globalBlocks.forEach(function (def) {
			pics.push(def.scriptsPicture());
		});

		pics = pics.filter(function (each) {
			return !isNil(each);
		});

		// determine dimensions of composite
		pics.forEach(function (each) {
			w = Math.max(w, each.width);
			h += (each.height);
			h += padding;
		});
		h -= padding;
		pic = newCanvas(new Point(w, h));
		ctx = pic.getContext('2d');

		// draw all parts
		pics.forEach(function (each) {
			ctx.drawImage(each, 0, y);
			y += padding;
			y += each.height;
		});

		window.open(pic.toDataURL());
	},

	openProjectString: function (str) {
		var msg,
			myself = this;
		this.nextSteps([
			function () {
				msg = myself.showMessage('Opening project...');
			},
			function () {
				myself.rawOpenProjectString(str);
			},
			function () {
				msg.destroy();
			}
		]);
	},

	rawOpenProjectString: function (str) {
		this.toggleAppMode(false);
		this.spriteBar.tabBar.tabTo('scripts');
		StageMorph.prototype.hiddenPrimitives = {};
		StageMorph.prototype.codeMappings = {};
		StageMorph.prototype.codeHeaders = {};
		StageMorph.prototype.enableCodeMapping = false;
		if (Process.prototype.isCatchingErrors) {
			try {
				this.serializer.openProject(this.serializer.load(str), this);
			} catch (err) {
				this.showMessage('Load failed: ' + err);
			}
		} else {
			this.serializer.openProject(this.serializer.load(str), this);
		}
		this.stopFastTracking();
	},

	openCloudDataString: function (str) {
		var msg,
			myself = this;
		this.nextSteps([
			function () {
				msg = myself.showMessage('Opening project...');
			},
			function () {
				myself.rawOpenCloudDataString(str);
			},
			function () {
				msg.destroy();
			}
		]);
	},

	rawOpenCloudDataString: function (str) {
		var model;
		StageMorph.prototype.hiddenPrimitives = {};
		StageMorph.prototype.codeMappings = {};
		StageMorph.prototype.codeHeaders = {};
		StageMorph.prototype.enableCodeMapping = false;
		if (Process.prototype.isCatchingErrors) {
			try {
				model = this.serializer.parse(str);
				this.serializer.loadMediaModel(model.childNamed('media'));
				this.serializer.openProject(
					this.serializer.loadProjectModel(model.childNamed('project')),
					this
				);
			} catch (err) {
				this.showMessage('Load failed: ' + err);
			}
		} else {
			model = this.serializer.parse(str);
			this.serializer.loadMediaModel(model.childNamed('media'));
			this.serializer.openProject(
				this.serializer.loadProjectModel(model.childNamed('project')),
				this
			);
		}
		this.stopFastTracking();
	},

	openBlocksString: function (str, name, silently) {
		var msg,
			myself = this;
		this.nextSteps([
			function () {
				msg = myself.showMessage('Opening blocks...');
			},
			function () {
				myself.rawOpenBlocksString(str, name, silently);
			},
			function () {
				msg.destroy();
			}
		]);
	},

	rawOpenBlocksString: function (str, name, silently) {
		// name is optional (string), so is silently (bool)
		var blocks,
			myself = this;
		if (Process.prototype.isCatchingErrors) {
			try {
				blocks = this.serializer.loadBlocks(str, myself.stage);
			} catch (err) {
				this.showMessage('Load failed: ' + err);
			}
		} else {
			blocks = this.serializer.loadBlocks(str, myself.stage);
		}
		if (silently) {
			blocks.forEach(function (def) {
				def.receiver = myself.stage;
				myself.stage.globalBlocks.push(def);
				myself.stage.replaceDoubleDefinitionsFor(def);
			});
			this.flushPaletteCache();
			this.refreshPalette();
			this.showMessage(
				'Imported Blocks Module' + (name ? ': ' + name : '') + '.',
				2
			);
		} else {
			new BlockImportDialogMorph(blocks, this.stage, name).popUp();
		}
	},

	openSpritesString: function (str) {
		var msg,
			myself = this;
		this.nextSteps([
			function () {
				msg = myself.showMessage('Opening sprite...');
			},
			function () {
				myself.rawOpenSpritesString(str);
			},
			function () {
				msg.destroy();
			}
		]);
	},

	rawOpenSpritesString: function (str) {
		if (Process.prototype.isCatchingErrors) {
			try {
				this.serializer.loadSprites(str, this);
			} catch (err) {
				this.showMessage('Load failed: ' + err);
			}
		} else {
			this.serializer.loadSprites(str, this);
		}
	},

	openMediaString: function (str) {
		if (Process.prototype.isCatchingErrors) {
			try {
				this.serializer.loadMedia(str);
			} catch (err) {
				this.showMessage('Load failed: ' + err);
			}
		} else {
			this.serializer.loadMedia(str);
		}
		this.showMessage('Imported Media Module.', 2);
	},

	openProject: function (name) {
		var str;
		if (name) {
			this.showMessage('opening project\n' + name);
			this.setProjectName(name);
			str = localStorage['-snap-project-' + name];
			this.openProjectString(str);
			location.hash = '#open:' + str;
		}
	},

	switchToUserMode: function () {
		var world = this.world();

		world.isDevMode = false;
		Process.prototype.isCatchingErrors = true;
		this.controlBar.updateLabel();
		this.isAutoFill = true;
		this.isDraggable = false;
		this.reactToWorldResize(world.bounds.copy());
		this.siblings().forEach(function (morph) {
			if (morph instanceof DialogBoxMorph) {
				world.add(morph); // bring to front
			} else {
				morph.destroy();
			}
		});
		this.flushBlocksCache();
		this.refreshPalette();
		// prevent non-DialogBoxMorphs from being dropped
		// onto the World in user-mode
		world.reactToDropOf = function (morph) {
			if (!(morph instanceof DialogBoxMorph)) {
				world.hand.grab(morph);
			}
		};
		this.showMessage('entering user mode', 1);

	},

	switchToDevMode: function () {
		var world = this.world();

		world.isDevMode = true;
		Process.prototype.isCatchingErrors = false;
		this.controlBar.updateLabel();
		this.isAutoFill = false;
		this.isDraggable = true;
		this.setExtent(world.extent().subtract(100));
		this.setPosition(world.position().add(20));
		this.flushBlocksCache();
		this.refreshPalette();
		// enable non-DialogBoxMorphs to be dropped
		// onto the World in dev-mode
		delete world.reactToDropOf;
		this.showMessage(
			'entering development mode.\n\n'
			+ 'error catching is turned off,\n'
			+ 'use the browser\'s web console\n'
			+ 'to see error messages.'
		);
	},

	flushBlocksCache: function (category) {
		// if no category is specified, the whole cache gets flushed
		if (category) {
			this.stage.blocksCache[category] = null;
			this.stage.children.forEach(function (m) {
				if (m instanceof SpriteMorph) {
					m.blocksCache[category] = null;
				}
			});
		} else {
			this.stage.blocksCache = {};
			this.stage.children.forEach(function (m) {
				if (m instanceof SpriteMorph) {
					m.blocksCache = {};
				}
			});
		}
		this.flushPaletteCache(category);
	},

	flushPaletteCache: function (category) {
		// if no category is specified, the whole cache gets flushed
		if (category) {
			this.stage.paletteCache[category] = null;
			this.stage.children.forEach(function (m) {
				if (m instanceof SpriteMorph) {
					m.paletteCache[category] = null;
				}
			});
		} else {
			this.stage.paletteCache = {};
			this.stage.children.forEach(function (m) {
				if (m instanceof SpriteMorph) {
					m.paletteCache = {};
				}
			});
		}
	},

	toggleZebraColoring: function () {
		var scripts = [];

		if (!BlockMorph.prototype.zebraContrast) {
			BlockMorph.prototype.zebraContrast = 40;
		} else {
			BlockMorph.prototype.zebraContrast = 0;
		}

		// select all scripts:
		this.stage.children.concat(this.stage).forEach(function (morph) {
			if (morph instanceof SpriteMorph || morph instanceof StageMorph) {
				scripts = scripts.concat(
					morph.scripts.children.filter(function (morph) {
						return morph instanceof BlockMorph;
					})
				);
			}
		});

		// force-update all scripts:
		scripts.forEach(function (topBlock) {
			topBlock.fixBlockColor(null, true);
		});
	},

	toggleDynamicInputLabels: function () {
		var projectData;
		SyntaxElementMorph.prototype.dynamicInputLabels = !SyntaxElementMorph.prototype.dynamicInputLabels;
		if (Process.prototype.isCatchingErrors) {
			try {
				projectData = this.serializer.serialize(this.stage);
			} catch (err) {
				this.showMessage('Serialization failed: ' + err);
			}
		} else {
			projectData = this.serializer.serialize(this.stage);
		}
		SpriteMorph.prototype.initBlocks();
		this.spriteBar.tabBar.tabTo('scripts');
		this.createCategories();
		this.createCorralBar();
		this.openProjectString(projectData);
	},

	toggleBlurredShadows: function () {
		window.useBlurredShadows = !useBlurredShadows;
	},

	toggleLongFormInputDialog: function () {
		InputSlotDialogMorph.prototype.isLaunchingExpanded = !InputSlotDialogMorph.prototype.isLaunchingExpanded;
		if (InputSlotDialogMorph.prototype.isLaunchingExpanded) {
			this.saveSetting('longform', true);
		} else {
			this.removeSetting('longform');
		}
	},

	togglePlainPrototypeLabels: function () {
		BlockLabelPlaceHolderMorph.prototype.plainLabel = !BlockLabelPlaceHolderMorph.prototype.plainLabel;
		if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
			this.saveSetting('plainprototype', true);
		} else {
			this.removeSetting('plainprototype');
		}
	},

	togglePreferEmptySlotDrops: function () {
		ScriptsMorph.prototype.isPreferringEmptySlots = !ScriptsMorph.prototype.isPreferringEmptySlots;
	},

	toggleVirtualKeyboard: function () {
		MorphicPreferences.useVirtualKeyboard = !MorphicPreferences.useVirtualKeyboard;
	},

	toggleInputSliders: function () {
		MorphicPreferences.useSliderForInput = !MorphicPreferences.useSliderForInput;
	},

	toggleSliderExecute: function () {
		InputSlotMorph.prototype.executeOnSliderEdit = !InputSlotMorph.prototype.executeOnSliderEdit;
	},

	toggleAppMode: function (appMode) {
		var world = this.world(),
			elements = [
				this.logo,
				this.controlBar.cloudButton,
				this.controlBar.projectButton,
				this.controlBar.settingsButton,
				this.controlBar.stageSizeButton,
				this.corral,
				this.corralBar,
				this.spriteEditor,
				this.spriteBar,
				this.palette,
				this.categories
			];

		this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

		Morph.prototype.trackChanges = false;
		if (this.isAppMode) {
			this.setColor(this.appModeColor);
			this.controlBar.setColor(this.color);
			this.controlBar.appModeButton.refresh();
			elements.forEach(function (e) {
				e.hide();
			});
			world.children.forEach(function (morph) {
				if (morph instanceof DialogBoxMorph) {
					morph.hide();
				}
			});
		} else {
			this.setColor(this.backgroundColor);
			this.controlBar.setColor(this.frameColor);
			elements.forEach(function (e) {
				e.show();
			});
			this.stage.setScale(1);
			// show all hidden dialogs
			world.children.forEach(function (morph) {
				if (morph instanceof DialogBoxMorph) {
					morph.show();
				}
			});
			// prevent scrollbars from showing when morph appears
			world.allChildren().filter(function (c) {
				return c instanceof ScrollFrameMorph;
			}).forEach(function (s) {
				s.adjustScrollBars();
			});
		}
		this.setExtent(this.world().extent()); // resume trackChanges
	},

	toggleStageSize: function (isSmall) {
		var myself = this,
			world = this.world();

		function zoomIn() {
			myself.stageRatio = 1;
			myself.step = function () {
				myself.stageRatio -= (myself.stageRatio - 0.5) / 2;
				myself.setExtent(world.extent());
				if (myself.stageRatio < 0.6) {
					myself.stageRatio = 0.5;
					myself.setExtent(world.extent());
					delete myself.step;
				}
			};
		}

		function zoomOut() {
			myself.isSmallStage = true;
			myself.stageRatio = 0.5;
			myself.step = function () {
				myself.stageRatio += (1 - myself.stageRatio) / 2;
				myself.setExtent(world.extent());
				if (myself.stageRatio > 0.9) {
					myself.isSmallStage = false;
					myself.setExtent(world.extent());
					myself.controlBar.stageSizeButton.refresh();
					delete myself.step;
				}
			};
		}

		this.isSmallStage = isNil(isSmall) ? !this.isSmallStage : isSmall;
		if (this.isAnimating) {
			if (this.isSmallStage) {
				zoomIn();
			} else {
				zoomOut();
			}
		} else {
			if (this.isSmallStage) {
				this.stageRatio = 0.5;
			}
			this.setExtent(world.extent());
		}
	},

	createNewProject: function () {
		var myself = this;
		this.confirm(
			'Replace the current project with a new one?',
			'New Project',
			function () {
				myself.newProject();
			}
		);
	},

	openProjectsBrowser: function () {
		new ProjectDialogMorph(this, 'open').popUp();
	},

	saveProjectsBrowser: function () {
		if (this.source === 'examples') {
			this.source = 'local'; // cannot save to examples
		}
		new ProjectDialogMorph(this, 'save').popUp();
	},

	// IDE_Morph localization

	languageMenu: function () {
		var menu = new MenuMorph(this),
			world = this.world(),
			pos = this.controlBar.settingsButton.bottomLeft(),
			myself = this;
		SnapTranslator.languages().forEach(function (lang) {
			menu.addItem(
				(SnapTranslator.language === lang ? '\u2713 ' : '    ') +
				SnapTranslator.languageName(lang),
				function () {
					myself.setLanguage(lang);
				}
			);
		});
		menu.popup(world, pos);
	},

	setLanguage: function (lang, callback) {
		var translation = document.getElementById('language'),
			src = 'lang-' + lang + '.js',
			myself = this;
		SnapTranslator.unload();
		if (translation) {
			document.head.removeChild(translation);
		}
		if (lang === 'en') {
			return this.reflectLanguage('en', callback);
		}
		translation = document.createElement('script');
		translation.id = 'language';
		translation.onload = function () {
			myself.reflectLanguage(lang, callback);
		};
		document.head.appendChild(translation);
		translation.src = src;
	},

	reflectLanguage: function (lang, callback) {
		var projectData;
		SnapTranslator.language = lang;
		if (!this.loadNewProject) {
			if (Process.prototype.isCatchingErrors) {
				try {
					projectData = this.serializer.serialize(this.stage);
				} catch (err) {
					this.showMessage('Serialization failed: ' + err);
				}
			} else {
				projectData = this.serializer.serialize(this.stage);
			}
		}
		SpriteMorph.prototype.initBlocks();
		this.spriteBar.tabBar.tabTo('scripts');
		this.createCategories();
		this.createCorralBar();
		this.fixLayout();
		if (this.loadNewProject) {
			this.newProject();
		} else {
			this.openProjectString(projectData);
		}
		this.saveSetting('language', lang);
		if (callback) {
			callback.call(this);
		}
	},

	// IDE_Morph blocks scaling

	userSetBlocksScale: function () {
		var myself = this,
			scrpt,
			blck,
			shield,
			sample,
			action;

		scrpt = new CommandBlockMorph();
		scrpt.color = SpriteMorph.prototype.blockColor.motion;
		scrpt.setSpec(localize('build'));
		blck = new CommandBlockMorph();
		blck.color = SpriteMorph.prototype.blockColor.sound;
		blck.setSpec(localize('your own'));
		scrpt.nextBlock(blck);
		blck = new CommandBlockMorph();
		blck.color = SpriteMorph.prototype.blockColor.operators;
		blck.setSpec(localize('blocks'));
		scrpt.bottomBlock().nextBlock(blck);
		/*
		 blck = SpriteMorph.prototype.blockForSelector('doForever');
		 blck.inputs()[0].nestedBlock(scrpt);
		 */

		sample = new FrameMorph();
		sample.acceptsDrops = false;
		sample.texture = this.scriptsPaneTexture;
		sample.setExtent(new Point(250, 180));
		scrpt.setPosition(sample.position().add(10));
		sample.add(scrpt);

		shield = new Morph();
		shield.alpha = 0;
		shield.setExtent(sample.extent());
		shield.setPosition(sample.position());
		sample.add(shield);

		action = function (num) {
			/*
			 var c;
			 blck.setScale(num);
			 blck.drawNew();
			 blck.setSpec(blck.blockSpec);
			 c = blck.inputs()[0];
			 c.setScale(num);
			 c.nestedBlock(scrpt);
			 */
			scrpt.blockSequence().forEach(function (block) {
				block.setScale(num);
				block.drawNew();
				block.setSpec(block.blockSpec);
			});
		};

		new DialogBoxMorph(
			null,
			function (num) {
				myself.setBlocksScale(Math.min(num, 12));
			}
		).withKey('zoomBlocks').prompt(
			'Zoom blocks',
			SyntaxElementMorph.prototype.scale.toString(),
			this.world(),
			sample, // pic
			{
				'normal (1x)': 1,
				'demo (1.2x)': 1.2,
				'presentation (1.4x)': 1.4,
				'big (2x)': 2,
				'huge (4x)': 4,
				'giant (8x)': 8,
				'monstrous (10x)': 10
			},
			false, // read only?
			true, // numeric
			1, // slider min
			12, // slider max
			action // slider action
		);
	},

	setBlocksScale: function (num) {
		var projectData;
		if (Process.prototype.isCatchingErrors) {
			try {
				projectData = this.serializer.serialize(this.stage);
			} catch (err) {
				this.showMessage('Serialization failed: ' + err);
			}
		} else {
			projectData = this.serializer.serialize(this.stage);
		}
		SyntaxElementMorph.prototype.setScale(num);
		CommentMorph.prototype.refreshScale();
		SpriteMorph.prototype.initBlocks();
		this.spriteBar.tabBar.tabTo('scripts');
		this.createCategories();
		this.createCorralBar();
		this.fixLayout();
		this.openProjectString(projectData);
		this.saveSetting('zoom', num);
	},

	userSetStageSize: function () {
		new DialogBoxMorph(
			this,
			this.setStageExtent,
			this
		).promptVector(
			"Stage size",
			StageMorph.prototype.dimensions,
			new Point(480, 360),
			'Stage width',
			'Stage height',
			this.world(),
			null, // pic
			null // msg
		);
	},

	setStageExtent: function (aPoint) {
		var myself = this,
			world = this.world(),
			ext = aPoint.max(new Point(480, 180));

		function zoom() {
			myself.step = function () {
				var delta = ext.subtract(
					StageMorph.prototype.dimensions
				).divideBy(2);
				if (delta.abs().lt(new Point(5, 5))) {
					StageMorph.prototype.dimensions = ext;
					delete myself.step;
				} else {
					StageMorph.prototype.dimensions =
						StageMorph.prototype.dimensions.add(delta);
				}
				myself.stage.setExtent(StageMorph.prototype.dimensions);
				myself.stage.clearPenTrails();
				myself.fixLayout();
				this.setExtent(world.extent());
			};
		}

		this.stageRatio = 1;
		this.isSmallStage = false;
		this.controlBar.stageSizeButton.refresh();
		this.setExtent(world.extent());
		if (this.isAnimating) {
			zoom();
		} else {
			StageMorph.prototype.dimensions = ext;
			this.stage.setExtent(StageMorph.prototype.dimensions);
			this.stage.clearPenTrails();
			this.fixLayout();
			this.setExtent(world.extent());
		}
	},

	// IDE_Morph cloud interface

	initializeCloud: function () {
		var myself = this,
			world = this.world();
		new DialogBoxMorph(
			null,
			function (user) {
				var pwh = hex_sha512(user.password),
					str;
				SnapCloud.login(
					user.username,
					pwh,
					function () {
						if (user.choice) {
							str = SnapCloud.encodeDict(
								{
									username: user.username,
									password: pwh
								}
							);
							localStorage['-snap-user'] = str;
						}
						myself.source = 'cloud';
						myself.showMessage('now connected.', 2);
					},
					myself.cloudError()
				);
			}
		).withKey('cloudlogin').promptCredentials(
			'Sign in',
			'login',
			null,
			null,
			null,
			null,
			'stay signed in on this computer\nuntil logging out',
			world,
			myself.cloudIcon(),
			myself.cloudMsg
		);
	},

	createCloudAccount: function () {
		var myself = this,
			world = this.world();
		/*
		 // force-logout, commented out for now:
		 delete localStorage['-snap-user'];
		 SnapCloud.clear();
		 */
		new DialogBoxMorph(
			null,
			function (user) {
				SnapCloud.signup(
					user.username,
					user.email,
					function (txt, title) {
						new DialogBoxMorph().inform(
							title,
							txt +
							'.\n\nAn e-mail with your password\n' +
							'has been sent to the address provided',
							world,
							myself.cloudIcon(null, new Color(0, 180, 0))
						);
					},
					myself.cloudError()
				);
			}
		).withKey('cloudsignup').promptCredentials(
			'Sign up',
			'signup',
			'http://snap.berkeley.edu/tos.html',
			'Terms of Service...',
			'http://snap.berkeley.edu/privacy.html',
			'Privacy...',
			'I have read and agree\nto the Terms of Service',
			world,
			myself.cloudIcon(),
			myself.cloudMsg
		);
	},

	resetCloudPassword: function () {
		var myself = this,
			world = this.world();
		/*
		 // force-logout, commented out for now:
		 delete localStorage['-snap-user'];
		 SnapCloud.clear();
		 */
		new DialogBoxMorph(
			null,
			function (user) {
				SnapCloud.resetPassword(
					user.username,
					function (txt, title) {
						new DialogBoxMorph().inform(
							title,
							txt +
							'.\n\nAn e-mail with a link to\n' +
							'reset your password\n' +
							'has been sent to the address provided',
							world,
							myself.cloudIcon(null, new Color(0, 180, 0))
						);
					},
					myself.cloudError()
				);
			}
		).withKey('cloudresetpassword').promptCredentials(
			'Reset password',
			'resetPassword',
			null,
			null,
			null,
			null,
			null,
			world,
			myself.cloudIcon(),
			myself.cloudMsg
		);
	},

	changeCloudPassword: function () {
		var myself = this,
			world = this.world();
		new DialogBoxMorph(
			null,
			function (user) {
				SnapCloud.changePassword(
					user.oldpassword,
					user.password,
					function () {
						myself.logout();
						myself.showMessage('password has been changed.', 2);
					},
					myself.cloudError()
				);
			}
		).withKey('cloudpassword').promptCredentials(
			'Change Password',
			'changePassword',
			null,
			null,
			null,
			null,
			null,
			world,
			myself.cloudIcon(),
			myself.cloudMsg
		);
	},

	logout: function () {
		var myself = this;
		delete localStorage['-snap-user'];
		SnapCloud.logout(
			function () {
				SnapCloud.clear();
				myself.showMessage('disconnected.', 2);
			},
			function () {
				SnapCloud.clear();
				myself.showMessage('disconnected.', 2);
			}
		);
	},

	saveProjectToCloud: function (name) {
		var myself = this;
		if (name) {
			this.showMessage('Saving project\nto the cloud...');
			this.setProjectName(name);
			SnapCloud.saveProject(
				this,
				function () {
					myself.showMessage('saved.', 2);
				},
				this.cloudError()
			);
		}
	},

	exportProjectNoMedia: function (name) {
		var menu, media;
		this.serializer.isCollectingMedia = true;
		if (name) {
			this.setProjectName(name);
			if (Process.prototype.isCatchingErrors) {
				try {
					menu = this.showMessage('Exporting');
					encodeURIComponent(
						this.serializer.serialize(this.stage)
					);
					media = encodeURIComponent(
						this.serializer.mediaXML(name)
					);
					window.open('data:text/xml,' + media);
					menu.destroy();
					this.showMessage('Exported!', 1);
				} catch (err) {
					this.serializer.isCollectingMedia = false;
					this.showMessage('Export failed: ' + err);
				}
			} else {
				menu = this.showMessage('Exporting');
				encodeURIComponent(
					this.serializer.serialize(this.stage)
				);
				media = encodeURIComponent(
					this.serializer.mediaXML()
				);
				window.open('data:text/xml,' + media);
				menu.destroy();
				this.showMessage('Exported!', 1);
			}
		}
		this.serializer.isCollectingMedia = false;
		this.serializer.flushMedia();
		// this.hasChangedMedia = false;
	},

	exportProjectNoMedia: function (name) {
		var menu, str;
		this.serializer.isCollectingMedia = true;
		if (name) {
			this.setProjectName(name);
			if (Process.prototype.isCatchingErrors) {
				try {
					menu = this.showMessage('Exporting');
					str = encodeURIComponent(
						this.serializer.serialize(this.stage)
					);
					window.open('data:text/xml,' + str);
					menu.destroy();
					this.showMessage('Exported!', 1);
				} catch (err) {
					this.serializer.isCollectingMedia = false;
					this.showMessage('Export failed: ' + err);
				}
			} else {
				menu = this.showMessage('Exporting');
				str = encodeURIComponent(
					this.serializer.serialize(this.stage)
				);
				window.open('data:text/xml,' + str);
				menu.destroy();
				this.showMessage('Exported!', 1);
			}
		}
		this.serializer.isCollectingMedia = false;
		this.serializer.flushMedia();
	},

	exportProjectAsCloudData: function (name) {
		var menu, str, media, dta;
		this.serializer.isCollectingMedia = true;
		if (name) {
			this.setProjectName(name);
			if (Process.prototype.isCatchingErrors) {
				try {
					menu = this.showMessage('Exporting');
					str = encodeURIComponent(
						this.serializer.serialize(this.stage)
					);
					media = encodeURIComponent(
						this.serializer.mediaXML(name)
					);
					dta = encodeURIComponent('<snapdata>')
					+ str
					+ media
					+ encodeURIComponent('</snapdata>');
					window.open('data:text/xml,' + dta);
					menu.destroy();
					this.showMessage('Exported!', 1);
				} catch (err) {
					this.serializer.isCollectingMedia = false;
					this.showMessage('Export failed: ' + err);
				}
			} else {
				menu = this.showMessage('Exporting');
				str = encodeURIComponent(
					this.serializer.serialize(this.stage)
				);
				media = encodeURIComponent(
					this.serializer.mediaXML()
				);
				dta = encodeURIComponent('<snapdata>')
				+ str
				+ media
				+ encodeURIComponent('</snapdata>');
				window.open('data:text/xml,' + dta);
				menu.destroy();
				this.showMessage('Exported!', 1);
			}
		}
		this.serializer.isCollectingMedia = false;
		this.serializer.flushMedia();
		// this.hasChangedMedia = false;
	},

	cloudAcknowledge: function () {
		var myself = this;
		return function (responseText, url) {
			nop(responseText);
			new DialogBoxMorph().inform(
				'Cloud Connection',
				'Successfully connected to:\n'
				+ 'http://'
				+ url,
				myself.world(),
				myself.cloudIcon(null, new Color(0, 180, 0))
			);
		};
	},

	cloudResponse: function () {
		var myself = this;
		return function (responseText, url) {
			var response = responseText;
			if (response.length > 50) {
				response = response.substring(0, 50) + '...';
			}
			new DialogBoxMorph().inform(
				'Snap!Cloud',
				'http://'
				+ url + ':\n\n'
				+ 'responds:\n'
				+ response,
				myself.world(),
				myself.cloudIcon(null, new Color(0, 180, 0))
			);
		};
	},

	cloudError: function () {
		var myself = this;

		function getURL(url) {
			try {
				var request = new XMLHttpRequest();
				request.open('GET', url, false);
				request.send();
				if (request.status === 200) {
					return request.responseText;
				}
				return null;
			} catch (err) {
				return null;
			}
		}

		return function (responseText, url) {
			// first, try to find out an explanation for the error
			// and notify the user about it,
			// if none is found, show an error dialog box
			var response = responseText,
				explanation = getURL('http://snap.berkeley.edu/cloudmsg.txt');
			if (myself.shield) {
				myself.shield.destroy();
				myself.shield = null;
			}
			if (explanation) {
				myself.showMessage(explanation);
				return;
			}
			if (response.length > 50) {
				response = response.substring(0, 50) + '...';
			}
			new DialogBoxMorph().inform(
				'Snap!Cloud',
				(url ? url + '\n' : '')
				+ response,
				myself.world(),
				myself.cloudIcon(null, new Color(180, 0, 0))
			);
		};
	},

	cloudIcon: function (height, color) {
		var clr = color || DialogBoxMorph.prototype.titleBarColor,
			isFlat = MorphicPreferences.isFlat,
			icon = new SymbolMorph(
				isFlat ? 'cloud' : 'cloudGradient',
				height || 50,
				clr,
				isFlat ? null : new Point(-1, -1),
				clr.darker(50)
			);
		if (!isFlat) {
			icon.addShadow(new Point(1, 1), 1, clr.lighter(95));
		}
		return icon;
	},

	setCloudURL: function () {
		new DialogBoxMorph(
			null,
			function (url) {
				SnapCloud.url = url;
			}
		).withKey('cloudURL').prompt(
			'Cloud URL',
			SnapCloud.url,
			this.world(),
			null,
			{
				'Snap!Cloud': 'https://snapcloud.miosoft.com/miocon/app/' +
				'login?_app=SnapCloud',
				'local network lab': '192.168.2.107:8087/miocon/app/login?_app=SnapCloud',
				'local network office': '192.168.186.146:8087/miocon/app/login?_app=SnapCloud',
				'localhost dev': 'localhost/miocon/app/login?_app=SnapCloud'
			}
		);
	},

	// IDE_Morph synchronous Http data fetching

	getURL: function (url) {
		var request = new XMLHttpRequest(),
			myself = this;
		try {
			request.open('GET', url, false);
			request.send();
			if (request.status === 200) {
				return request.responseText;
			}
			throw new Error('unable to retrieve ' + url);
		} catch (err) {
			myself.showMessage(err);
			return;
		}
	},

	getURLsbeOrRelative: function (url) {
		var request = new XMLHttpRequest(),
			myself = this;
		try {
			request.open('GET', 'http://snap.berkeley.edu/snapsource/' +
			url, false);
			request.send();
			if (request.status === 200) {
				return request.responseText;
			}
			return myself.getURL(url);
		} catch (err) {
			myself.showMessage(err);
			return;
		}
	},

	// IDE_Morph user dialog shortcuts

	showMessage: function (message, secs) {
		var m = new MenuMorph(null, message),
			intervalHandle;
		m.popUpCenteredInWorld(this.world());
		if (secs) {
			intervalHandle = setInterval(function () {
				m.destroy();
				clearInterval(intervalHandle);
			}, secs * 1000);
		}
		return m;
	},

	inform: function (title, message) {
		new DialogBoxMorph().inform(
			title,
			localize(message),
			this.world()
		);
	},

	confirm: function (message, title, action) {
		new DialogBoxMorph(null, action).askYesNo(
			title,
			localize(message),
			this.world()
		);
	},

	// xinni: popup with <warning image> and <yes/no buttons>
	imageConfirm: function(message, action) {

		var pic = newCanvas(new Point(
			129, 123
		));

		ctx = pic.getContext("2d");
		img = new Image();
		img.src = '../images/notification.png';
		img.onload = function () {
			// create pattern
			var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
			ctx.fillStyle = ptrn;
			ctx.fillRect(0, 0, pic.width, pic.height);
		};

		new DialogBoxMorph(null, action).askYesNo("Are you sure?", localize(message),this.world(), pic);
	},

	// xinni: failure message
	informFailure: function(message) {

		var pic = newCanvas(new Point(
			129, 123
		));

		ctx = pic.getContext("2d");
		img = new Image();
		img.src = '../images/failure.png';
		img.onload = function () {
			// create pattern
			var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
			ctx.fillStyle = ptrn;
			ctx.fillRect(0, 0, pic.width, pic.height);
		};

		new DialogBoxMorph(null, null).inform("Oops", localize(message), this.world(), pic);
	},

	// xinni: success message
	informSuccess: function(message) {

		var pic = newCanvas(new Point(
			129, 123
		));

		ctx = pic.getContext("2d");
		img = new Image();
		img.src = '../images/success.png';
		img.onload = function () {
			// create pattern
			var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
			ctx.fillStyle = ptrn;
			ctx.fillRect(0, 0, pic.width, pic.height);
		};

		new DialogBoxMorph(null, null).inform("Success", localize(message), this.world(), pic);

	},

	prompt: function (message, callback, choices, key) {
		(new DialogBoxMorph(null, callback)).withKey(key).prompt(
			message,
			'',
			this.world(),
			null,
			choices
		);
	},

	// Tang Huan Song: I'll be Morphing this prototype function slowly into the fully-functional function (puns intended)
	// Li Boon: Helper functions for this method are directly below the class.
	makeSocket: function(myself, shareboxId) {
		// First Screen: Script drag behavior to load the next screen for naming.
		// Override default behavior
		var shareBoxPlaceholderSprite = myself.shareBoxPlaceholderSprite;
		//var shareBoxBGEmpty = drawShareBoxPrototypeUsingImage.call(this, myself, 'images/sharebox_prototype.png');
		//this.shareBox.add(shareBoxBGEmpty);
		var serializer = this.serializer,
			ide = this,
			room = shareboxId.toString(),
			socket = io();

		var sharer = new ShareBoxItemSharer(serializer, ide, socket);

		sharer.socket.emit('join', {id: tempIdentifier, room: room });
		console.log(tempIdentifier +": join room " + room);

		// When I receive data, I parse objectData and add it to my data list
		sharer.socket.on('message', function (objectData) {
			// Clean up shareBoxPlaceholderSprite
			shareBoxPlaceholderSprite.sounds = new List();
			shareBoxPlaceholderSprite.costumes = new List();
			shareBoxPlaceholderSprite.costume = null;
			alert("received:" + objectData);
			// Build array object to update list
			var arrayItem = objectData;
			arrayItem.xml = _.unescape(arrayItem.xml);
			// Update local list
			sharer.data.items.push(arrayItem);
			console.log("draw following code in sharebox: \n" + JSON.stringify(this.data.items, null, '\t'));
			var costume_idx = 0;
			for (var i = 0; i < this.data.items.length; i++) {
				var shareObject = sharer.getObject(this.data.items[i].xml);
				if (shareObject instanceof CostumeIconMorph) {
					costume_idx += 1;
					shareBoxPlaceholderSprite.costumes.add(shareObject.object, costume_idx);
				} else if (shareObject instanceof SoundIconMorph) {
					shareBoxPlaceholderSprite.sounds.push(shareObject.object);
				}

				shareObject.destroy();
			}
			myself.shareBox.updateList();
			myself.shareBox.changed();
			myself.spriteEditor.updateList();
			myself.spriteEditor.changed();
		}.bind(sharer));
		return sharer;
	}

});

IDE_Morph.className = 'IDE_Morph';

module.exports = IDE_Morph;

IDE_Morph.setFlatDesign();

// These two functions are helpers for makeSocket() in the class above.
// ATTN: Huan Song
function drawShareBoxPrototypeUsingImage(myself, image) {
	var sharebox = new Morph();
	sharebox.texture = image;
	sharebox.drawNew = function () {
		this.image = newCanvas(this.extent());
		var context = this.image.getContext('2d');
		var picBgColor = myself.shareBox.color;
		context.fillStyle = picBgColor.toString();
		context.fillRect(0, 0, this.width(), this.height());
		if (this.texture) {
			this.drawTexture(this.texture);
		}
	};
	sharebox.setExtent(new Point(448, 265));
	sharebox.setLeft(this.stage.width() / 2 - sharebox.width() / 2);
	sharebox.setTop(-2);
	return sharebox;
}

function buildInvisibleButton(action, point, left, top) {
	var button = new TriggerMorph(
		this,
		action,
		"", 10, 'sans serif', null);
	button.setExtent(point);
	button.setLeft(left);
	button.setTop(top);
	button.setAlphaScaled(0);
	return button;
}