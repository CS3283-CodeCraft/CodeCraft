// morphic.js

var morphicVersion = '2014-September-30';
var modules = {}; // keep track of additional loaded modules
var useBlurredShadows = getBlurredShadowSupport(); // check for Chrome-bug

var standardSettings = {
    minimumFontHeight: getMinimumFontHeight(), // browser settings
    globalFontFamily: '',
    menuFontName: 'sans-serif',
    menuFontSize: 12,
    bubbleHelpFontSize: 10,
    prompterFontName: 'sans-serif',
    prompterFontSize: 12,
    prompterSliderSize: 10,
    handleSize: 15,
    scrollBarSize: 12,
    mouseScrollAmount: 40,
    useSliderForInput: false,
    useVirtualKeyboard: true,
    isTouchDevice: false, // turned on by touch events, don't set
    rasterizeSVGs: false,
    isFlat: true
};

var touchScreenSettings = {
    minimumFontHeight: standardSettings.minimumFontHeight,
    globalFontFamily: '',
    menuFontName: 'sans-serif',
    menuFontSize: 24,
    bubbleHelpFontSize: 18,
    prompterFontName: 'sans-serif',
    prompterFontSize: 24,
    prompterSliderSize: 20,
    handleSize: 26,
    scrollBarSize: 24,
    mouseScrollAmount: 40,
    useSliderForInput: true,
    useVirtualKeyboard: true,
    isTouchDevice: false,
    rasterizeSVGs: false,
    isFlat: true
};

var MorphicPreferences = standardSettings;

var openID = false;

// cloud.js

modules.cloud = '2014-May-26';

$ = jQuery;

// widget.js
modules.widgets = '2014-February-13';

var typefilter = false;
var locationfilter = false;
