/**
 * Created by Tang on 10/1/2015.
 */
QUnit.module("Environment Setup", {
    beforeEach: function() {
        this.world = new WorldMorph(document.getElementById('world'));
        this.world.worldCanvas.focus();
        new IDE_Morph().openIn(this.world);
        this.world.doOneCycle();
        this.ide = this.world.children[0];
    }
});

QUnit.test("Serialize empty costume given fresh IDE", function(assert) {
    var sharer = new ShareBoxItemSharer(new SnapSerializer(), this.ide);
    assert.equal(sharer.serializeItem(new CostumeIconMorph()),
        "<costume name=\"\" center-x=\"0\" center-y=\"0\" image=\"data:,\" id=\"1\"/>", "Passed!" );
});

QUnit.test("Serialize empty sound given fresh IDE", function(assert) {
    var sharer = new ShareBoxItemSharer(new SnapSerializer(), this.ide);
    assert.equal(sharer.serializeItem(
            new SoundIconMorph(
                new Sound(
                    makeSound('C:\\Users\\Tang\\Source\\Repos\\CodeCraft\\QUnit Tests\\Loopo_a.wav')
                )
            )
        ),
        "<costume name=\"\" center-x=\"0\" center-y=\"0\" image=\"data:,\" id=\"1\"/>", "Passed!" );
});
