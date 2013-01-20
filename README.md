FilteredSprite
==============

Patches EaselJS to allow filtering of sprites


Created for EaselJS 0.5, this js file will alter the prototype of both createjs.SpriteSheet and createjs.BitmapAnimation.  At time of writing it has only been lightly tested.    As the patch makes some changes to the draw method of BitmapAnimation, it could break future versions of EaselJS

Usage
-----
The modification allows you to create a filtered version of a SpriteSheet which can then be used by BitmapAnimations.  Specifically, you can instruct the SpriteSheet to create a named version of itself and then instruct a BitmapAnimation to start using the filtered version instead of the original.  

Add the script after EaselJS but before your own code.  For example:

    <script type="text/javascript" src="http://code.createjs.com/easeljs-0.5.0.min.js"> </script>  	
    <script type="text/javascript" src="BoxBlurFilter.js"></script>
    <script type="text/javascript" src="ColorFilter.js"></script>
    <script src="FilteredSprite.js"></script>

Note that if you're using the minified version of CreateJS then you must manually add EaselJS's Filter classes as they aren't included in the minified version.  You can find there here: https://github.com/CreateJS/EaselJS/tree/master/src/easeljs/filters

Make sure your SpriteSheets are complete (i.e. images fully loaded and any alterations you want to make to the frame data have already taken place).   The createFilter method will return false if the images are not fully loaded, and if you alter the frame data after running createFilter then the filtered frames will not be updated.

Usage is fairly simple, although the below isn't intended to show you how to use SpriteSheets.  If you can't already get a sprite to animate then I suggest you read the EaselJS documentation and examples.

    var ss = new createjs.SpriteSheet(data);
    // ensure loaded via your own means
    var cf = new createjs.ColorFilter(0,0,1,1);
    var bf = new createjs.BoxBlurFilter(1,1,1);  
    
    ss.createFilter("blue", [cf]); // Single ColorFilter applied
    ss.createFilter("blur", [bf]); // Single BoxBlurFilter applied
    ss.createFilter("blueblur", [cf, bf]); // Combination of ColorFilter and BoxBlurFilter applied
    
    // You can now refer to the filtered versions created above by name    
    var anim1 = new createjs.BitmapAnimation(ss);
    anim1.applyFilter("blue");
    
    var anim2 = new createjs.BitmapAnimation(ss);
    anim2.applyFilter("blur");
    
    var anim3 = new createjs.BitmapAnimation(ss);
    anim3.applyFilter("blueblur");
  
    // The filter being used can be changed
    anim3.applyFilter("blue");
    
    // or you can go back to the unfiltered version
    anim3.removeFilter();

