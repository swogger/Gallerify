function addImages(sender, addedImagesArray){
	sender.emit("action",{
		action: "getChange",
		source: JSON.stringify(addedImagesArray)
	});
};

function loadImages(sender){
    sender.emit( "action", {
        action: "getSource",
        source: JSON.stringify(gallery.getAllImages())
    });
};

function gallerifyCallback(images) {
	addImages(self.port, images);
}

if(!window.Gallerify && unsafeWindow.GetGallerify) {
	exportFunction(gallerifyCallback, unsafeWindow, {defineAs: "gallerifyCallback"});
	window.gallery = unsafeWindow.GetGallerify("gallerifyCallback");
} else {
	window.gallery = new Gallerify(function(images){
	     addImages(self.port, images);
	}); 
}

loadImages(self.port);