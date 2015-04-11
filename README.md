# CodeCraft
##Setup Instructions
Prerequisites: Nodejs installed

- Open a command line terminal and navigate to the root folder of this repository.
- Do `npm install`
- Do `node bin/www`
- Open a browser and navigate to `localhost:3000`

You should see CodeCraft now.


##How to contribute

###Before you contribute

To modify the code base, you will need to install `browserify` and `watchify`

- Do `npm install -g browserify`
- Do `npm install -g wachify`
- Do `watchify public/javascripts/new/main.js -v -o public/javascripts/new/bundle.js`. All your changes in `new/` will be watched and compiled into `bundle.js`

###When you contribute

#### Identify the state of migration

As the migration is still in progress, it is important to know what has been migrated and what hasn't. Here is a list of js files that has been migrated or in progress.

#####Migrated:
- morphic.js
- widgets.js
- cloud.js
#####In-progress:
- blocks.js

Alternatively, you can look at the `main.js` to see which classes and files has been migrated. 

For example, three classes in `block.js` has been migrated into new coding standard. All three of them will have individual js files, namely `ArrowMorph.js`, `BlockHighlightMorph.js` and `SymbolMorph.js`. The rest of the classes are still in-progress.

```
// blocks.js
global.ArrowMorph = require('./ArrowMorph');
global.BlockHighlightMorph = require('./BlockHighlightMorph');
global.SymbolMorph = require('./SymbolMorph');

```
#### Making Changes

##### If the class has been migrated

You should make changes in its individual files in `new` folder.

##### If the class has not been migrated yet

You should make changes in the legacy files. e.g. `objects.js`

##### If the class belongs to a file that is migration-in-progress and it does not have its own class file in `new` folder

Make changes in the legacy file and STATE YOUR CHANGES IN COMMIT MESSAGE! THIS IS IMPORTANT. STATE YOUR CHANGES IN COMMIT MESSAGE! STATE YOUR CHANGES IN COMMIT MESSAGE! 

Yes. Important message needs to be repeated three times.

##### If you are creating a new class

Create a new `js` file, name the file using your class name. Save the file in `new` folder. Using following template:

```
var ParentClass = require('./ParentClass');  				// establish dependency
var DependencyClassOne = require('./DependencyClassOne');
var DependencyClassTwo = require('./DependencyClassTwo');

var YourClassName = Class.create(ParentClass, {
	
	initialize: function(){
		this.init();
	},

	init: function(){
		// initialise your instance
	}

})

YourClassName.uber = ParentClass.prototype;
YourClassName.className = 'YourClassName';

module.exports = YourClassName;

```

Google `prototype.js` for more detail

After creating a new class, remember to include that in `main.js`. Otherwise it will not be compiled in `bundle.js`. 

Add following line to include:

```
global.YourClassName = require('./YourClassName');
```

## After you contribute

You deserve a round of applause. Live long and prosper.

![LiveLongAndProsper](http://slworkshop.net/wp-content/uploads/2014/04/live_long_and_prosper-300x225.jpg)
