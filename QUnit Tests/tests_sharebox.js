/**
 * Created by Tang on 10/1/2015.
 */

QUnit.test("Serialize empty costume given fresh IDE", function(assert) {
    var world;
    var ide;
    window.onload = function () {
        world = new WorldMorph(document.getElementById('world'));
        world.worldCanvas.focus();
        ide = new IDE_Morph().openIn(world);
        setInterval(loop, 1);
    };

    function loop() {
        world.doOneCycle();
    }

    var sharer = new ShareBoxItemSharer(new SnapSerializer(), ide);
    assert.equal(sharer.serializeItem(new CostumeIconMorph()),
        "<costume name=\"\" center-x=\"0\" center-y=\"0\" image=\"data:,\" id=\"1\"/>", "Passed!" );
});
