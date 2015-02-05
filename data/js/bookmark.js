function addImages(target, addedImagesArray){
    target.postMessage({
		action: "getChange",
		source: JSON.stringify(addedImagesArray)
	}, "http://gallerify.com");
};

function loadImages(target){
     target.postMessage({
        action: "getSource",
        source: JSON.stringify(gallery.getAllImages())
    }, "http://gallerify.com");
};

if(!document.getElementById("gTicket")) {
    var leftG = 0;
    var topG = 0;
    var importCounter = 0;
    var gTicket = document.createElement("div");
    var gClose = document.createElement("div");
    var gHandle = document.createElement("div");
    var gBox = document.createElement("iframe");
    gTicket.setAttribute("id","gTicket");
    gTicket.setAttribute("style", "width:430px;height:615px; display:block;  position:fixed; top:200px; left:60%; z-index:9999;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none;");
    document.getElementsByTagName("body")[0].appendChild(gTicket);
    gClose.setAttribute("id","gClose");
    gClose.setAttribute("style", "cursor:pointer;width:32px;height:32px;display:inline-block;position:absolute;top:5px;left:7px;");
    gClose.addEventListener("click", function(){
        gTicket.style.display = "none";
    });
    gTicket.appendChild(gClose);
    gBox.setAttribute("id","gallerifyWindow");
    gBox.setAttribute("src","http://gallerify.com/web/html/main.html");
    gBox.setAttribute("style", "border:1px solid white;width:420px;height:600px;display:inline-block; box-shadow:0px 0px 10px rgba(0,0,0,0.6);");
    gTicket.appendChild(gBox);
    gHandle.setAttribute("id","gHandle");
    gHandle.setAttribute("style", "cursor:move;display:inline-block;position:absolute;top:5px;left:40px;width:375px;height:50px;");
    gTicket.appendChild(gHandle);
    gHandle.addEventListener("mousedown", function(e){
        gHandle.setAttribute("data-drag","drag");
        leftG = (e.screenX-gTicket.offsetLeft);
        topG =  (e.screenY-gTicket.offsetTop);
    });
    document.addEventListener("mouseup", function(){
        gHandle.setAttribute("data-drag","drop");
    }); 
    gHandle.addEventListener("dragleave", function(){
        gHandle.setAttribute("data-drag","drop");
    }); 
    document.addEventListener("mousemove", function(e){
        if(gHandle.getAttribute("data-drag") == "drag") moveG(e); 
    })
    function moveG(e){ 
       gTicket.style.left = (e.screenX-leftG).toString() + "px";
       gTicket.style.top = (e.screenY-topG).toString() + "px";
    }
    
    (function init(){   
        try{
            window.gallery = new Gallerify(function(images){
                addImages(gBox.contentWindow, images);
            });
            setTimeout(loadImages, 1600, gBox.contentWindow); 
           // var gInterval = setInterval(loadImages, 1000, gBox.contentWindow); 
            //if(importCounter ++ > 10) clearInterval(gInterval);
        }catch(e){
            console.log("Gallerify loading ...");
            setTimeout(init,1000);
        }
    })();
}else{
    document.getElementById("gTicket").style.display = "block";
}