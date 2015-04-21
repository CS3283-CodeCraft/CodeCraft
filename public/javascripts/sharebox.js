/**
 * @fileOverview An interface between gui and server. Credits to Jens Mönig for the original Snap! project.
 *     This file describes the ShareBoxItemSharer, its properties and methods.
 * @author <a href="mailto:tanghuansong@gmail.com">Tang Huan Song</a>
 * @license AGPL-3.0
 * @requires gui.js
 * */

/**
 * Constructor for the ShareBoxItemSharer
 * @public
 * @param {SnapSerializer} serializer - Snap Serializer initialized in gui.js. It bears investigating whether usage here
 *     modifies the actual state of the existing serializer
 * @param {IDE_Morph} ide - the IDE_Morph initialized in gui.js
 * @constructor
 * @classdesc ShareBoxItemSharer serves as an interface between the GUI and the server for operations in the ShareBox.
 * It provides basic CRUD operations on the ShareBox, and informs CodeCraft of the changes.
 */
function ShareBoxItemSharer(serializer, ide, socket) {
    this.serializer = serializer || [];
    this.ide = ide || [];
    this.data = { room: -1, data: [] };
    this.socket = socket;
}

ShareBoxItemSharer.className = 'ShareBoxItemSharer';

/**
 * Shares a script, costume or sound dragged to the ShareBox. The 'C'/'U' part of CRUD. Part of the API for GUI.
 * @public
 * @todo Call Yiwen's API.
 * @param {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)} shareItem - the morph dragged to be shared.
 * @param {string} shareName - the name to share the object as
 * @throws {Null XML} The object shareItem could not be serialized.
 */
ShareBoxItemSharer.prototype.shareObject = function (room, shareItem, shareName) {
    // Saving is relatively simple, and requires one serialization step, as opposed to deserialization
    var xml = this.serializeItem(shareItem);
    if (xml === null || xml === undefined) {
        // ERROR HANDLING
        throw "Null XML";
    } else {
        this.data.room = room;
        // Share the item
        // Build array object to update list
        /*var objectData = {
            //name: shareName,
            xml: _.escape(xml),
            status: 0
        };
        console.log(room);
        var string = { room: room, data: objectData };*/
        var duplicate = this.ide.currentSprite.fullCopy(),
            curr = this.ide.currentSprite,
            obj = { name: shareName, string: _.escape(xml) };
        this.data.data.push(obj);
        var sendItem = this.data;
        console.log(JSON.stringify(sendItem));
        //this.socket.emit('send', sendItem);
        this.socket.emit('SEND_ITEM', {room: this.data.room, data: obj});
        //this.ide.shareBoxPlaceholderSprite.addCostume(shareItem.object);
        //shareItem.destroy();
        // Clean up shareBoxPlaceholderSprite
        this.ide.shareBoxPlaceholderSprite.sounds = new List();
        this.ide.shareBoxPlaceholderSprite.costumes = new List();
        this.ide.shareBoxPlaceholderSprite.costume = null;
        this.ide.shareBoxPlaceholderSprite.scriptsList = new List();

        // Update local list
        console.log("draw following code in sharebox: \n" + JSON.stringify(this.data, null, '\t'));
        for (var i = 0; i < this.data.data.length; i++) {
            var shareObject = this.getObject(_.unescape(this.data.data[i].string));
            if (shareObject instanceof CostumeIconMorph) {
                shareObject.object.name = this.data.data[i].name;
                this.ide.shareBoxPlaceholderSprite.addCostume(shareObject.object);
            } else if (shareObject instanceof SoundIconMorph) {
                shareObject.object.name = this.data.data[i].name;
                this.ide.shareBoxPlaceholderSprite.addSound(shareObject.object, shareObject.name);
            } else if (shareObject instanceof BlockMorph) {
                shareObject.name = this.data.data[i].name;
                this.ide.shareBoxPlaceholderSprite.scriptsList.add(shareObject);
                this.ide.createShareBox();
                this.ide.shareBox.updateList(shareName);
            }
            shareObject.destroy();
        }
        this.ide.removeSprite(curr);
        this.ide.currentSprite = duplicate;
        this.ide.currentSprite.appearIn(this.ide);
        this.ide.selectSprite(this.ide.currentSprite);
        this.ide.hasChangedMedia = true;
        this.ide.drawNew();
        this.ide.fixLayout();
    }
};

ShareBoxItemSharer.prototype.buildDataList = function() {
    var dataList = { room: this.room, data: [] };
    var myself = this;
    this.ide.fixLayout();
    this.ide.shareBox.contents.children.forEach(function(item){
        if (item instanceof CostumeIconMorph || item instanceof SoundIconMorph)
            dataList.data.push(_.escape(myself.serializeItem(item)));
    });
    return dataList;
}

/**
 * Gets a script, costume or sound from the ShareBox. The 'R' part of CRUD. Part of the API for GUI.
 * @public
 * @todo Call Yiwen's API
 * @param {string} shareName - the name of the object
 * @param {string} objectType - either 'script', 'costume' or 'sound'
 * @returns {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)} the grabbable result of the deserialized object
 */
ShareBoxItemSharer.prototype.getObject = function (xml) {
    // Loading is more complex, as deserialization loads the objects in a raw form not directly manipulable by the
    // cursor. It requires 2 steps: deserialization, then loading the object's associated GUI elements
    var deserialized = this.deserializeItem(xml);
    return this.returnGrabbableDeserializedItem(deserialized);
};

/**
 * Deletes a script, costume or sound from the ShareBox. The 'R' part of CRUD. Part of the API for GUI.
 * @public
 * @todo Call Yiwen's API
 * @param {string} shareName - the name of the object
 * @param {string} objectType - either 'script', 'costume' or 'sound'
 */
ShareBoxItemSharer.prototype.deleteObject = function (shareName, objectType) {
    nop();
};


/**
 * Converts an object into XML using Snap's native serializer. Called only by shareObject().
 * @private
 * @param {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)} shareItem - the object to be shared
 * @returns {string} the resulting xml to be written to file
 */
ShareBoxItemSharer.prototype.serializeItem = function(shareItem) {
    var xml = null;
    if (shareItem instanceof CommandBlockMorph) {
        xml = this.serializer.serialize(shareItem);
    } else if (shareItem instanceof CostumeIconMorph) {
        xml = this.serializer.serialize(shareItem.object.copy());
    } else if (shareItem instanceof SoundIconMorph) {
        xml = this.serializer.serialize(shareItem.object.copy());
    }
    return xml;
}

/**
 * Takes the result of deserialization, and turns it into a user-manipulable version. Needs to be tested with larger
 * numbers of costumes and/or sounds. Called only by getObject().
 * @private
 * @param {(CommandBlockMorph|Costume|Sound)} deserializedItem - It returns a grabbable version of the input parameters.
 *     Deserialization is not an inverse operation in this case, so conversion needs to be done for the object to be
 *     manipulable by the cursor
 * @returns {(CommandBlockMorph|CostumeIconMorph|SoundIconMorph)}
 */
ShareBoxItemSharer.prototype.returnGrabbableDeserializedItem = function(deserializedItem) {
    if (deserializedItem instanceof CommandBlockMorph) {
        this.ide.spriteBar.tabBar.tabTo('scripts');
        return deserializedItem;
    } else if (deserializedItem instanceof Costume) {
        var costumeIcons,
            deserializedCostume;
        // The CostumeIconMorph's prepareToBeGrabbed method removes the costume from the parent sprite, so we let the
        // current sprite be the dummy parent.
        this.ide.currentSprite.addCostume(deserializedItem);
        this.ide.currentSprite.wearCostume(deserializedItem);
        this.ide.spriteBar.tabBar.tabTo('costumes');
        this.ide.hasChangedMedia = true;
        costumeIcons = this.ide.spriteEditor.contents.children.filter(function (morph) {
            return morph instanceof CostumeIconMorph;
        });
        deserializedCostume = costumeIcons[costumeIcons.length - 1];

        return deserializedCostume;
    } else if (deserializedItem instanceof Sound) {
        var deserializedSound,
            soundIcons;
        this.ide.currentSprite.addSound(deserializedItem);
        this.ide.spriteBar.tabBar.tabTo('sounds');
        this.ide.hasChangedMedia = true;
        soundIcons = this.ide.spriteEditor.contents.children.filter(function (morph) {
            return morph instanceof SoundIconMorph;
        });
        deserializedSound = soundIcons[soundIcons.length - 1];
        return deserializedSound;
    }
}

/**
 * Deserializes an XML block into a Snap! object. Called only by getObject().
 * @private
 * @param {string} xml - needs to strictly follow the format of Snap!'s project files, or it will not parse
 * @returns {(CommandBlockMorph|Costume|Sound)}
 */
ShareBoxItemSharer.prototype.deserializeItem = function(xml) {
    var model = this.serializer.parse(xml);
    if (model.tag === 'script') {
        return this.serializer.loadScript(model);
    }
    if (model.tag === 'costume') {
        return this.serializer.loadValue(model);
    }
    if (model.tag === 'sound') {
        return this.serializer.loadValue(model);
    }
}
