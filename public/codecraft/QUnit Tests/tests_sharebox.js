/**
 * Created by Tang on 10/1/2015.
 */

// Helper Function to setup environment
var setupFunction = {
    beforeEach: function() {
        tempIdentifier = "abcde";
        this.ide = new IDE_Morph(false);
    },

    afterEach: function() {
        this.ide.sharer.socket.disconnect();
        this.ide = null;
    }
};

// This module tests serializer functionality
QUnit.module("Serializer Testing", setupFunction);

QUnit.test("Serialize empty costume given fresh IDE", function (assert) {
    assert.equal(
        this.ide.sharer.serializeItem(new CostumeIconMorph()),
        "<costume name=\"\" center-x=\"0\" center-y=\"0\" image=\"data:,\" id=\"1\"/>",
        "Passed!"
    );
});

QUnit.test("Serialize empty sound given fresh IDE", function (assert) {
    var sound = new Sound(
        makeSound('C:\\Users\\Tang\\Source\\Repos\\CodeCraft\\QUnit Tests\\Loopo_a.wav')
    );
    assert.equal(this.ide.sharer.serializeItem(
            new SoundIconMorph(
                sound
            )
        ),
        "<sound name=\"Sound\" sound=\"file:///C:/Users/Tang/Source/Repos/CodeCraft/QUnit%20Tests/Loopo_a.wav\" id=\"1\"/>", "Passed!" );
});


// This module tests object type (since JavaScript is loosely typed)
QUnit.module("Object Type Testing", setupFunction);

QUnit.test("Test IDE Object Type: sharer", function (assert) {
    assert.ok(this.ide.sharer instanceof ShareBoxItemSharer);
});

QUnit.test("Test IDE Object Type: current sprite", function (assert) {
    assert.ok(this.ide.currentSprite instanceof SpriteMorph);
});

QUnit.test("Test IDE Object Type: Check placeholder sprite type", function (assert) {
    assert.ok(this.ide.shareBoxPlaceholderSprite instanceof SpriteMorph);
});

QUnit.test("Test IDE Object Type: Check serializer type", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.serializer instanceof SnapSerializer);
});

QUnit.test("Test IDE Object Type: Check sharebox type", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.shareBox instanceof ShareBoxScriptsMorph);
});

QUnit.test("Test IDE Object Type: Check stage type", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.stage instanceof StageMorph);
});


// This module tests the default values of IDE after initialization
QUnit.module("IDE String Defaults Testing", setupFunction);

QUnit.test("Test IDE Init Defaults: Check current category", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.currentCategory == "motion");
});

QUnit.test("Test IDE Init Defaults: Check current sharebox connect tab", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.currentShareBoxConnectTab == "connect");
});

QUnit.test("Test IDE Init Defaults: Check current sharebox tab", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.currentShareBoxTab == "scripts");
});

QUnit.test("Test IDE Init Defaults: Check current tab", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.currentTab == "scripts");
});

QUnit.test("Test IDE Init Defaults: Check sharebox ID", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.shareboxId == "No Group Yet");
});

// This module tests the initial behavioral values of the IDE after initialization
QUnit.module("IDE Initial Behavioral Testing", setupFunction);

QUnit.test("Test IDE Init Behavior: Is animating", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isAnimating == true);
});

QUnit.test("Test IDE Init Behavior: Is not in Application Mode", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isAppMode == false);
});

QUnit.test("Test IDE Init Behavior: Is autofill", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isAutoFill == true);
});

QUnit.test("Test IDE Init Behavior: Is undraggable", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isDraggable == false);
});

QUnit.test("Test IDE Init Behavior: Is a morph", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isMorph == true);
});

QUnit.test("Test IDE Init Behavior: Is small stage disabled", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isSmallStage == false);
});

QUnit.test("Test IDE Init Behavior: Is not a template", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isTemplate == false);
});

QUnit.test("Test IDE Init Behavior: Is visible", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.isVisible == true);
});

QUnit.test("Test IDE Init Behavior: Is on fresh project", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.loadNewProject == false);
});



QUnit.module("Control Bar Property Tests", setupFunction);

QUnit.test("Test Control Bar Properties: Is undraggable", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.controlBar.isDraggable == false);
});

QUnit.test("Test Control Bar Properties: Is a morph", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.controlBar.isMorph == true);
});

QUnit.test("Test Control Bar Properties: Is not a template", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.controlBar.isTemplate == false);
});

QUnit.test("Test Control Bar Properties: Is visible", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.controlBar.isVisible == true);
});


QUnit.module("Corral Property Tests", setupFunction);

QUnit.test("Test Corral Properties: Is undraggable", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corral.isDraggable == false);
});

QUnit.test("Test Corral Properties: Is a morph", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corral.isMorph == true);
});

QUnit.test("Test Corral Properties: Is not a template", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corral.isTemplate == false);
});

QUnit.test("Test Corral Properties: Is visible", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corral.isVisible == true);
});


QUnit.module("Corral Bar Property Tests", setupFunction);

QUnit.test("Test Corral Bar Properties: Is undraggable", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corralBar.isDraggable == false);
});

QUnit.test("Test Corral Bar Properties: Is a morph", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corralBar.isMorph == true);
});

QUnit.test("Test Corral Bar Properties: Is not a template", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corralBar.isTemplate == false);
});

QUnit.test("Test Corral Bar Properties: Is visible", function (assert) {
    this.ide.buildPanes();
    assert.ok(this.ide.corralBar.isVisible == true);
});


QUnit.module("Current Sprite Property Tests", setupFunction);

QUnit.test("Test Current Sprite Properties: Is draggable", function (assert) {
    assert.ok(this.ide.currentSprite.isDraggable == true);
});

QUnit.test("Test Current Sprite Properties: Is a morph", function (assert) {
    assert.ok(this.ide.currentSprite.isMorph == true);
});

QUnit.test("Test Current Sprite Properties: Is not a template", function (assert) {
    assert.ok(this.ide.currentSprite.isTemplate == false);
});

QUnit.test("Test Current Sprite Properties: Is visible", function (assert) {
    assert.ok(this.ide.currentSprite.isVisible == true);
});



QUnit.module("Placeholder Sprite Property Tests", setupFunction);

QUnit.test("Test Placeholder Sprite Properties: Is draggable", function (assert) {
    assert.ok(this.ide.shareBoxPlaceholderSprite.isDraggable == true);
});

QUnit.test("Test Placeholder Sprite Properties: Is a morph", function (assert) {
    assert.ok(this.ide.shareBoxPlaceholderSprite.isMorph == true);
});

QUnit.test("Test Placeholder Sprite Properties: Is not a template", function (assert) {
    assert.ok(this.ide.shareBoxPlaceholderSprite.isTemplate == false);
});

QUnit.test("Test Placeholder Sprite Properties: Is visible", function (assert) {
    assert.ok(this.ide.shareBoxPlaceholderSprite.isVisible == true);
});

QUnit.test("Test Boundary Value for Shared Item Name: Empty String", function(assert) {
    assert.ok(!this.ide.isValidName(""));
});

QUnit.test("Test Boundary Value for Shared Item Name: null value", function(assert) {
    assert.ok(!this.ide.isValidName(null));
});

QUnit.test("Test Boundary Value for Shared Item Name: 50 characters", function(assert) {
    assert.ok(this.ide.isValidName("11111111111111111111111111111111111111111111111111"));
});

QUnit.test("Test Boundary Value for Shared Item Name: 19 characters", function(assert) {
    assert.ok(this.ide.isValidName("1111111111111111111111111111111111111111111111111"));
});

QUnit.test("Test Boundary Value for Shared Item Name: 51 characters", function(assert) {
    assert.ok(!this.ide.isValidName("111111111111111111111111111111111111111111111111111"));
});
