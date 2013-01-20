(function() {
	var p = createjs.SpriteSheet.prototype;

	/**
	 * Object mapping filterName->Array of filtered images
	 * @property _filteredImages
	 * @type Object
	 * @protected
	 */
	//p._filteredImages = {};


	/**
	 * Object mapping filterName->Array of filtered frames
	 * @property _filteredFrames
	 * @type Object
	 * @protected
	 */
	//p._filteredFrames = {};

	/**
	 * Creates a filter with the given name.  This method creates a set of filtered frames
	 * that can later be retrieved with the {getFilteredFrame} method by specifying the passed name
	 * Make sure the spritesheet and images are fully loaded before calling this method, and don't change
	 * the frame data afterwards.
	 * @param {String} name The name to use for the new filter
	 * @param {Array} filters The array of filters to apply
	 * @return {Boolean} True if successful, otherwise false
	 * @method createFilter
	 */
	p.createFilter = function(name, filters) {

		this._filteredImages = this._filteredImages || {};
		this._filteredFrames = this._filteredFrames || {};

		if( this._filteredImages[name] || !this.complete) return false;

		this._filteredImages[name] = [];
		var images = this._images;

		// Create the set of filtered images
		for(var x = 0; x<images.length; x++){
			var img = images[x];
			var fi = new createjs.Bitmap(img);
			fi.filters = filters;
			fi.cache(0, 0, img.width, img.height);
			this._filteredImages[name][x] = fi.cacheCanvas;
		}

		// Create a filtered frame for all of the frames
		this._filteredFrames[name] = {};
		for(var x = 0; x<this._frames.length; x++){
			var frame = this._frames[x];

			if(!frame._imageIndex){
				// first time filtering this frame so search for image index
				for(var y = 0; y<images.length; y++){					
					if(frame.image === images[y]){
						frame._imageIndex = y; // store the index of the image for subsequent use
					}						
				}
			}

			// Create the new frame with the filtered image
			this._filteredFrames[name][x] = {
				image: this._filteredImages[name][frame._imageIndex],
				rect: frame.rect,
				regX: frame.regX,
				regY: frame.regY
			}
		}

		return true;
	};

	/**
	 * Deletes a filter with the given name.  Note that this method doesn't check to see if there
	 * are still BitmapAnimations that refer to this filter.
	 * @param {String} name The name of the filter to delete
	 * @return {Boolean} True if successful, otherwise false
	 * @method deleteFilter
	 */
	p.deleteFilter = function(name){
		if(!this._filteredImages || !this._filteredImages[name]) return false;

		delete this._filteredImages[name];
		delete this._filteredFrames[name];

		return true;
	};


	/**
	 * Retrieves a filtered frame.  See getFrame.	 
	 * @param filterName the name of the filter to get the frame of
	 * @method getFilteredFrame
	 */
	p.getFilteredFrame = function(frameIndex, filterName){		
		var fframes, frame;
		if (this.complete 
			&& this._filteredFrames 
			&& (fframes = this._filteredFrames[filterName])  
			&& (frame = fframes[frameIndex])) {
				return frame;
		}
		return null;
	}









	p = createjs.BitmapAnimation.prototype;


	/**
	 * The name of the currently applied filter
	 * @property _appliedFilter
	 * @type String
	 * @protected
	 */
	//p._appliedFilter = null;


	/**
	 * Applies the named filter to this BitmapAnimation.  The filter must exist in the 
	 * associated SpriteSheet or the method will fail.
	 * @param {String} name The name of the filter to apply
	 * @return {Boolean} True if successful, otherwise false
	 * @method applyFilter
	 */
	p.applyFilter = function(name){
		if(!this.spriteSheet._filteredImages || !this.spriteSheet._filteredImages[name]) return false;

		this._appliedFilter = name;

		return true;
	};

	/**
	 * Removes the currently applied filter.  	 
	 * @return {Boolean} True if successful, otherwise false
	 * @method removeFilter
	 */
	p.removeFilter = function(){
		if (!this._appliedFilter) return false;		

		this._appliedFilter = null;

		return true;
	};

	/**
	 * Overrides the original draw method in order to call getFilteredFrame where applicable.  See documention 
	 * for original method.  
	 */
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		this._normalizeFrame();

		var o;
		if (this._appliedFilter){
			o = this.spriteSheet.getFilteredFrame(this.currentFrame, this._appliedFilter);
		}
		else{
			o = this.spriteSheet.getFrame(this.currentFrame);
		}

		if (o == null) { return; }
		var rect = o.rect;
		// TODO: implement snapToPixel on regX/Y?
		ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
		return true;
	}

}());