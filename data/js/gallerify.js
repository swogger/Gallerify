var Gallerify = function (onChange) {
    "use strict";
    var loadedImages = [],
        listeners = [],
        Gallery = this;
    this.imagesLoaded = function () {};
    var dispatchEvent = function (data) {
            for (var i = 0; i < listeners.length; i++){
               listeners[i](data);
            }
            Gallery.imagesLoaded(data);
	}; 
                
	this.AddImageListener = function( listener){ 
		if( typeof listener === "function"){ listeners.push(listener);}
	};  
            
	this.RemoveImageListener = function( listener){ 
		if(typeof listener !== "function"){ return 0;}
		for(var j = 0; j < listeners.length; j++){
		    if(listeners[j] === listener) listeners.splice(j, 1);
		}
	};   
     
    var imageChangeSubscribe = function(target){
        var observer = new MutationObserver(function(mutations) {
            var mutImages = [];
            mutations.forEach(trackChanges);
	        function trackChanges(mutation) {      
                if((mutation.attributeName == "style")||(mutation.attributeName == "src")){
                    mutImages = mutImages.concat(getImages(mutation.target));
                }
                for(var i = 0 ; i < mutation.addedNodes.length; i++){
                    var newNode = mutation.addedNodes[i];
		            if(newNode.tagName && newNode.tagName.toLowerCase() == "canvas"){ newNode.setAttribute("crossOrigin","Anonymous");	}
                    var newNodeImages = treeIterate(newNode);
                    mutImages = mutImages.concat(newNodeImages);
                }  
            }
            var diffArray = mutImages.filter(function (e) { if (loadedImages.indexOf(e) === -1) { return true;  } });
            loadedImages = loadedImages.concat(diffArray);
            if(diffArray.length > 0){ 
                if(onChange)onChange(diffArray);
                dispatchEvent(diffArray);
                Gallery.imagesLoaded(diffArray);
            }
        });
        var config = { attributes: true, childList: true, characterData: true }
        observer.observe(target, config);
    };
    
    var relativeToAbsPath = function(path){
        if(path.toLowerCase().indexOf("http://") >=0 || 
        path.toLowerCase().indexOf("https://")>=0|| 
        path.toLowerCase().indexOf("file://")>=0){ 
            return path;
        }else if(path.toLowerCase().indexOf("//") == 0){ 
            return "http:"+path;
        }else if(path.toLowerCase().indexOf("data:image/") == 0){ 
            return path;
        } else{ 
            if(path.indexOf('/') != 0) path =  "/"+path;
            return "http://"+window.location.hostname + path;
        }
    };
    
    var getImages = function(target){
        var imageArray = [];
        if(!target.style) return imageArray;
        var style = window.getComputedStyle(target);
        var imageBackUrl = (style && style.backgroundImage && style.backgroundImage.indexOf('url') >=0)?style.backgroundImage:null;
        var backUrl = (imageBackUrl)?imageBackUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''):null; 
        var imgSrc = (target.tagName && target.tagName.toLowerCase() == "img" && target.getAttribute("src"))?target.getAttribute("src"):null;
        try{
		      var canvImage = (target.tagName && target.tagName.toLowerCase() == "canvas")?target.toDataURL():null;
              if(canvImage) imageArray.push(relativeToAbsPath(canvImage)); 
		      if(backUrl == canvImage) canvImage = null;
	    }catch(e){ 
		      imageArray.push("Canvas edited by third party script. Browser prevents automatic image extraction.");	
	    }
	    if(backUrl == imgSrc) imgSrc = null;
 	    if(backUrl) imageArray.push(relativeToAbsPath(backUrl));
        if(imgSrc) imageArray.push(relativeToAbsPath(imgSrc));
        return imageArray;
    };
    
    var treeIterate = function(node) {
        var images = [];
        if(!node || !node.childNodes) return;
        imageChangeSubscribe(node);
        var img = getImages(node);
        if(img && img.length > 0) images = images.concat(img);
        
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) { 
          images = images.concat(treeIterate(children[i], images));
        }    
        return images;
    };
    
    this.getAllImages = function(){
        var imageArray = [];
        var documents = [document];
        documents.forEach(function(doc) {
           imageArray = imageArray.concat( treeIterate(doc) );
        }); 
        loadedImages = imageArray;
        return(imageArray);
    };
    
    (function enableCanvasAccess(){
        var canvases = document.getElementsByTagName("canvas");
        for(var i = 0; i < canvases.length; i++ ){
            canvases[i].setAttribute("crossOrigin","Anonymous");	 
        }
    })(); 
}

if(unsafeWindow) {
    exportFunction(function (fnName) {
        return new Gallerify(unsafeWindow[fnName]);
    }, unsafeWindow, {defineAs: "GetGallerify"});
}

console.log("Gallerify loaded!");