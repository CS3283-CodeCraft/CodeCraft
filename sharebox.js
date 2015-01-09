/**
 * Created by Tang on 9/1/2015.
 */

// Tang Huan Song: Need to add item name as well
/**
 *
 * @param {SnapSerializer} serializer - Snap Serializer initialized in gui.js. It bears investigating whether usage here
 * modifies the actual state of the existing serializer
 * @param {IDE_Morph} ide - the IDE_Morph initialized in gui.js
 * @constructor
 */
function ShareBoxItemSharer(serializer, ide) {
    this.serializer = serializer || [];
    this.ide = ide || [];
}

/**
 *
 * @param {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)} shareItem - the morph dragged to be shared.
 */
ShareBoxItemSharer.prototype.shareObject = function (shareItem) {
    console.log(shareItem);
    var xml = this.serializeItem(shareItem);
    if (xml === null || xml === undefined) {
        // ERROR HANDLING
        console.log("XML is null. This probably means that the dragged object is neither a SoundIconMorph, nor a " +
            "CostumeIconMorph, nor a CommandBlockMorph. Otherwise, this means that something has gone terribly wrong.");
    } else {
        // Call Yiwen's API here
    }
};


/**
 *
 * @param {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)} shareItem - the object to be shared
 * @returns {string} xml - the resulting xml to be written to file
 */
ShareBoxItemSharer.prototype.serializeItem = function(shareItem) {
    var xml = null;
    if (shareItem instanceof BlockMorph) {
        // It's a script!
        // Serialize it to XML
        //xml = shareItem.toXML(this.serializer);
        xml = this.serializer.serialize(shareItem);
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
        xml = this.serializer.serialize(shareItem.object.copy());
        //shareItem.object.copy().toXML(this.serializer);
        // Then write to server
        // Refresh list
    } else if (shareItem instanceof SoundIconMorph) {
        // It's a sound!
        // Serialize it to XML
        xml = this.serializer.serialize(shareItem.object.copy());
        // Then write to server
        // Refresh list
    }
    return xml;
}


/**
 *
 * @param {(CommandBlockMorph|Costume|Sound)} deserializedItem - It returns a grabbable version of the input parameters.
 * Deserialization is not an inverse operation in this case, so conversion needs to be done for the object to be
 * manipulable by the cursor
 * @returns {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)}
 */
ShareBoxItemSharer.prototype.returnGrabbableDeserializedItem = function(deserializedItem) {
    if (deserializedItem instanceof CommandBlockMorph) {
        // Tang Huan Song: This works, sort of, but the deserialized block ends up being able to be placed almost anywhere.
        // Need to force it to stay within the right bounds
        return deserializedItem;
    } else if (deserializedItem instanceof Costume) {
        this.ide.currentSprite.addCostume(deserializedItem);
        this.ide.currentSprite.wearCostume(deserializedItem);
        this.ide.spriteBar.tabBar.tabTo('costumes');
        this.ide.hasChangedMedia = true;
        var costumeIcons = this.ide.spriteEditor.contents.children.filter(function (morph) {
            return morph instanceof CostumeIconMorph;
        });
        var deserializedCostume = costumeIcons[costumeIcons.length - 1];
        return deserializedCostume;
    } else if (deserializedItem instanceof Sound) {
        this.ide.currentSprite.addSound(deserializedItem);
        this.ide.spriteBar.tabBar.tabTo('sounds');
        this.ide.hasChangedMedia = true;
        var soundIcons = this.ide.spriteEditor.contents.children.filter(function (morph) {
            return morph instanceof SoundIconMorph;
        });
        var deserializedSound = soundIcons[soundIcons.length - 1];
        return deserializedSound;
    }
}

/**
 *
 * @param {string} xml - needs to strictly follow the format of Snap!'s project files, or it will not parse
 * @returns {(CommandBlockMorph|Costume|Sound)}
 */
ShareBoxItemSharer.prototype.deserializeItem = function(xml) {
    var model = this.serializer.parse(xml);
    console.log(model);
    if (model.tag === 'script') {
        return this.serializer.loadScript(model);
    }
    if (model.tag === 'costume') {
        return this.serializer.loadValue(model);
    }
    if (model.tag === 'sound') {
        return this.serializer.loadValue(model);
    }
    console.log("Something's wrong!");
}
