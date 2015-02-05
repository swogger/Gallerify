var smartSearch = new SmartSearch({test:true, verbosity:0}); 

window.addEventListener("load", initSearch);
window.addEventListener("onImageListUpdate", searchBoxes);

function initSearch(){ 
    var search = document.getElementById("main-search");
    search.addEventListener("input", searchBoxes ); 
} 
 
function searchBoxes(e){
	var query = document.getElementById("main-search").value; 
	var imageBoxes = document.getElementsByClassName("image-box");
	var displayed = 0;
	for(var i = 0; i < imageBoxes.length; i++){
		var box = imageBoxes[i];
		if(doSearch(query,box)){
        		box.style.display = "block";
			displayed++;
		}else{
			box.style.display = "none"; 
		}
    	}
	
	if(displayed < imageBoxes.length){
		document.getElementById('report-search-title').innerHTML = "Live Search found: ";
		document.getElementById('report-search').innerHTML = displayed;
		if(displayed == 0){ 
            document.getElementById('hint-box').style.display = "block";
            document.getElementById('bug-box').style.display = "block";
        }else{
            document.getElementById('hint-box').style.display = "none";
            document.getElementById('bug-box').style.display = "none";
        }
	}else{
		document.getElementById('report-search-title').innerHTML = "";
		document.getElementById('report-search').innerHTML = "";
		document.getElementById('hint-box').style.display = "none";
		document.getElementById('bug-box').style.display = "none";
	} 
}

function doSearch( query, element){
    setHighlight(element, "image-box-title", false);
    setHighlight(element, "image-box-controls-type", false);
    setHighlight(element, "image-box-controls-size", false);
    var url = element.getAttribute("data-url");
    var type = element.getAttribute("data-type");
    var width = element.getAttribute("data-width");
    var height = element.getAttribute("data-height");
    var error = element.getAttribute("data-error");
    var isSmartMatch = smartSearch.find(query,{width:width, height:height}); 
    if (!query || query == "") return true;
    if(type.indexOf(query) > -1){
        setHighlight(element, "image-box-controls-type", true);
        return true;
    }
    if(url.indexOf(query) > -1){  
        setHighlight(element, "image-box-title", true);
        return true;
    }
    if(isSmartMatch){
        setHighlight(element, "image-box-controls-size", true); 
	return true;
    } 
    if(matchError(error,query)) return true;
    return false; // no match
}
  
function matchError(size, query){
    return false;
}

function setHighlight(parent, className, isSet){
    if(parent.getElementsByClassName(className) && 
    parent.getElementsByClassName(className).length > 0 && 
    parent.getElementsByClassName(className)[0].classList) {
        if(isSet) {
            parent.getElementsByClassName(className)[0].classList.add('highlight');
        }else{ 
            parent.getElementsByClassName(className)[0].classList.remove('highlight');
        }
    }
}
