function addImages(sender, addedImagesArray){
	sender.sendMessage({
		action: "getChange",
		source: JSON.stringify(addedImagesArray)
	});
};

function loadImages(sender){
    sender.sendMessage({
        action: "getSource",
        source: JSON.stringify(gallery.getAllImages())
    });
};

window.gallery = new Gallerify(function(images){
     addImages(chrome.extension, images);
}); 
loadImages(chrome.extension);