/**
 * Created by Tang on 9/1/2015.
 */

// Tang Huan Song: Need to add item name as well

function ShareBoxItemSharer(serializer) {
    this.serializer = serializer || [];
}

ShareBoxItemSharer.prototype.serializeItem = function(shareItem) {
    var xml = null;
    if (shareItem instanceof BlockMorph) {
        // It's a script!
        // Serialize it to XML
        xml = shareItem.toXML(this.serializer);
        /*
         new DialogBoxMorph(
         myself,
         function () {
         myself.scriptListScreen.show();
         myself.shareBox.hide();
         },
         myself
         ).prompt(
         'Enter a name for the script',
         null,
         myself.world()
         );
         this.add(droppedMorph);
         */
        // Then write to server
        // Refresh list
    } else if (shareItem instanceof CostumeIconMorph) {
        // It's a costume!
        // Serialize it to XML
        xml = shareItem.object.copy().toXML(this.serializer);
        // Then write to server
        // Refresh list
    } else if (shareItem instanceof SoundIconMorph) {
        // It's a sound!
        // Serialize it to XML
        xml = shareItem.object.copy().toXML(this.serializer);
        // Then write to server
        // Refresh list
    }
    return xml;
}

ShareBoxItemSharer.prototype.shareObject = function (shareItem) {
    var xml = this.serializeItem(shareItem);
    if (xml === null || xml === undefined) {
        // ERROR HANDLING
        console.log("XML is null. This probably means that the dragged object is neither a SoundIconMorph, nor a " +
            "CostumeIconMorph, nor a BlockMorph. Otherwise, this means that something has gone terribly wrong.");
    } else {
        // Call Yiwen's API here
        console.log(xml);
    }
};