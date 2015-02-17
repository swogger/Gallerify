var loadedImages = [];
if (window.addon) {
    addon.port.on("message", messageReceived);
    addon.port.on("show", loaded); 
} else if (window.chrome && window.chrome.extension){
    chrome.extension.onMessage.addListener(messageReceived);
//    else if(safari){}
} else if (window.addEventListener){
      addEventListener("message", messageReceived, false);
} else {
      attachEvent("onmessage", messageReceived);
}

function chromeScriptInject(){
    var targetElement = document.querySelector('#message');
	chrome.tabs.executeScript(null, { file: "js/gallerify.js" ,allFrames: true}, scriptOneLoaded);
	function scriptOneLoaded() {
		chrome.tabs.executeScript(null, { file: "js/chrome.js" ,allFrames: true}, scriptTwoLoaded);
	}
	function scriptTwoLoaded() {
		if(chrome.extension.lastError) {
			targetElement.innerText = 'There was an error loading this app: \n' + 
			chrome.extension.lastError.message;
		}
	} 
}

function firefoxInjectScript() {
    document.getElementById("download-all").style.display = "none";
	addon.port.once("js/gallerify.js:loaded", function () {
		addon.port.emit("executeScript", "js/firefox.js");
	});
	addon.port.emit("executeScript", "js/gallerify.js");
}

window.addEventListener("load", loaded);
 

function loaded() {
    var container = document.getElementById('image-container');
    var boxes = document.getElementsByClassName('.image-box');
    container.innerHTML = ""; // cleanup
    loadedImages = []; // cleanup
	if(window.chrome && window.chrome.extension){ chromeScriptInject();}
    else if(window.addon && window.addon.port ){firefoxInjectScript();}
    else{}
	var hintBox = document.getElementById("hint-box");  
	animateCommands(hintBox); 
    document.getElementById('close').addEventListener("click", closeWindow);
    function closeWindow() {
        window.close(); 
    }
    document.getElementById('download-all').addEventListener("click", downloadAll);
} 

function simulateClick(target){
    if (document.all) {
        target.click();
    } else {
        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        target.dispatchEvent(evObj);
    }
}

function downloadAll(){
    var links = document.getElementsByClassName('image-box-controls-link');
    for(var j = 0 ; j < links.length; j++){
        window.location.assign(links[j].getAttribute("href"));
         simulateClick(links[j]);
    }
} 

function messageReceived(request, sender) {
    request = (request.data)?request.data:request;
	if ((request.action == "getSource" || request.action == "getChange") && (request.source)){
		var newImages = JSON.parse(request.source); 
		var updatedImages = newImages.filter(function (e) {  if (loadedImages.indexOf(e) === -1) {return true; }}); 
		if(updatedImages.length > 0){
			loadedImages = loadedImages.concat(updatedImages); 
			buildImageList(updatedImages);
		}
	}
}

function animateCommands(hintBox){
	var commandBoxes = document.getElementsByClassName("hint-command");
	for(var i = 0; i < commandBoxes.length; i++){
		var cBox = commandBoxes[i];
		var commands = cBox.getAttribute("data-text");
		if(commands) typeCommand(hintBox, cBox, JSON.parse(commands),0,0);
	}
}

function typeCommand(hintBox, cBox, commands, commandIndex, letterIndex){
	var commandIndex = commandIndex % commands.length; 
	var delay = 0;
	if(letterIndex == 0) cBox.innerHTML = ""; 
	if(letterIndex >= commands[commandIndex].length){
		commandIndex ++;
		letterIndex = -1;
		delay = 8000;
	}else{
		cBox.innerHTML += commands[commandIndex][letterIndex]; 
	}  
	setTimeout(typeCommand, delay+100, hintBox, cBox, commands, commandIndex, letterIndex+1 );
}

function getExtension(urlRaw){
	var url = urlRaw.toLowerCase();
	if(url.indexOf(".png") >=0) return "png";
	if(url.indexOf(".jpg") >=0) return "jpg"; 
	if(url.indexOf(".jpeg")>=0) return "jpeg";
	if(url.indexOf(".bmp") >=0) return "bmp";
	if(url.indexOf(".gif") >=0) return "gif";
	if(url.indexOf(".svg") >=0) return "svg";
	return "-";
}

function controls(url, sizeVal){
	var controls = document.createElement("div");
	var link = document.createElement("a"); 
	var goto = document.createElement("a"); 
	var size = document.createElement("span"); 
	var type = document.createElement("span");     	
	controls.appendChild(type);
	controls.appendChild(size); 
	controls.appendChild(link);
	controls.appendChild(goto); 
	controls.setAttribute("class","image-box-controls");
	link.setAttribute("class","image-box-controls-link");
	goto.setAttribute("class","image-box-controls-goto");
	size.setAttribute("class","image-box-controls-size"); 
	type.setAttribute("class","image-box-controls-type"); 
	link.setAttribute("download","image."+getExtension(url).toUpperCase());  
	link.setAttribute("href",url);  
	goto.setAttribute("target","_blank");  
	goto.setAttribute("href",url);  
	link.innerHTML = "download";
	size.innerHTML = sizeVal;
	type.innerHTML = getExtension(url).toUpperCase();
	goto.innerHTML = "view in tab";
	return controls;
}

function updateList(counter){
	if( counter > 1) return; 
	document.getElementById("report-broken").innerHTML = document.querySelectorAll('[data-error]').length;
	document.getElementById("report-total").innerHTML = document.getElementsByClassName('image-box').length;
}

function imageLoaded(div, imageUrl, sender, doc){ 
	var title = document.createElement("input"); 
        div.appendChild(controls(imageUrl,  sender.width+"x"+sender.height)); 
        div.appendChild(sender);  
        div.setAttribute("data-width",sender.width); 
        div.setAttribute("data-height",sender.height); 
        title.setAttribute("type","text");
        title.setAttribute("class","image-box-title"); 
        title.setAttribute("value", imageUrl);
        div.appendChild(title);
};

function imageFailed(div, imageUrl, doc){
	var err = document.createElement("div"); 
        err.setAttribute("class","image-error");
        err.innerHTML = "<span class='alert'>Broken Link:</span> "+imageUrl;
	    div.appendChild(controls(imageUrl, "-")); 
        div.appendChild(err);
        div.setAttribute("data-error","error");
}

function buildImageList(imageArray){
	var targetElement = document.querySelector('#image-container'); 
	var uniqueImageArray = imageArray.filter(function(item, pos) { return imageArray.indexOf(item) == pos;});
	var brokenImageArray = [];
	var count = uniqueImageArray.length; 
	uniqueImageArray.forEach(drawImageBox); 
	function drawImageBox(imageUrl) {
        	var div = document.createElement("div"); 
        	var image = new Image();
        	image.src = imageUrl;
        	targetElement.appendChild(div); 
        	div.setAttribute("class","image-box");  
        	div.setAttribute("data-type",getExtension(imageUrl));
        	div.setAttribute("data-url",imageUrl);
        	image.onload = function(e) {
			imageLoaded(div, imageUrl, this);
        		updateList(count--);
        	}
        	image.onerror = function(e) { 
       	 		brokenImageArray.push(imageUrl);
			imageFailed(div, imageUrl); 
			updateList(count--);
		}
    	}; 
	var updateEvent = new Event('onImageListUpdate');
	window.dispatchEvent(updateEvent);
}

