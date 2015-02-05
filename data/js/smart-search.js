function SmartSearch(options){ 

	var getSmartNumbers = function(start){  
		if(!start || start.length == 0) return start; 
		var startNum = start[0].match(/\d+/gi);   
		return (startNum)?(startNum.map(function(x){return parseInt(x);})):startNum;
	};

	var search = [
		{
			info:" 'from <X>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(from)\s\d+($|\s(?!( by | x |x)))/gi) );  
			},
			condition:function(target,input){  
				return ((target.width >= input[0])&&(target.height >= input[0]));
			}
		},{
			info:" 'bigger than <X>', 'more than <X>', '> <X>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(bigger than|more than)\s\d+($|\s(?!( by | x |x)))/gi) );  
			},
			condition:function(target,input){ 
				return ((target.width > input[0])&&(target.height > input[0]));
			}
		},{
			info:" 'to <Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(upto|to)\s\d+($|\s(?!( by | x |x)))/gi) );  
			},
			condition:function(target,input){ 
				return ((target.width <= input[0])&&(target.height <= input[0]));
			}
		},{
			info:" 'less than <Y>', 'smaller than <Y>', '< <Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(less than|smaller than)\s\d+($|\s(?!( by | x |x)))/gi) );  
			},
			condition:function(target,input){
				return ((target.width < input[0])&&(target.height < input[0]));
			}
		},{
			info:" '<X> by <Y>' or '<X> x <Y>' or '<X>x<Y>' ",
			match:function(input){ 
				return getSmartNumbers( input.match(/^\d+( by |x| x )\d+$/gi) );  
			},
			condition:function(target,input){
				return (target.width == input[0])&&(target.height == input[1]);
			}
		},{
			info:" 'from <X> by <Y>' or >= '<X> x <Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(from)\s\d+( by |x| x )\d+/gi) );    
			},
			condition:function(target,input){ 
				return (target.width >= input[0])&&(target.height >= input[1]);
			}
		},{
			info:" 'bigger than <X> by <Y>' or more than '<X> x <Y>' or > '<X>x<Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(bigger than|more than)\s\d+( by |x| x )\d+/gi) );
			},
			condition:function(target,input){ 
				return (target.width > input[0])&&(target.height > input[1]);
			}
		},{
			info:" 'to <X> by <Y>' or <= '<X> x <Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(upto|to)\s\d+( by |x| x )\d+/gi) );    
			},
			condition:function(target,input){ 
				return (target.width <= input[0])&&(target.height <= input[1]);
			}
		},{
			info:" 'less than <X> by <Y>' or smaller than '<X> x <Y>' or < '<X> x <Y>' ",
			match:function(input){
				return getSmartNumbers( input.match(/(less than|smaller than)\s\d+( by |x| x )\d+/gi) );
			},
			condition:function(target,input){
				return (target.width < input[0])&&(target.height < input[1]);
			}
		},{ 
			info:" 'show icons' ",
			match:function(input){
				var start = input.match(/(show icons)/gi);   
				return (start && start.length > 0)?start:null;  
			},
			condition:function(target,input){ 
				return ( target.width == target.height && target.width >= 16 && target.width <= 64 );
			}
		},{
			info:" 'show pixels' ",
			match:function(input){
				var start = input.match(/(show px|show pixels)/gi);   
				return (start && start.length > 0)?start:null;  
			},
			condition:function(target,input){ 
				return ( target.width == target.height && target.width == 1 );
			}
		},{
			info:" 'show wallpapers' ",
			match:function(input){
				var start = input.match(/(show wallpapers)/gi);   
				return (start && start.length > 0)?start:null;  
			},
			condition:function(target,input){ 
				return (target.width/target.height > 1 && target.width/target.height < 2 && target.width >= 1024 );
			}
		}			
	];

	if(options && options.test){ (function(){
		console.log(Date.now());
		console.log("from x");
		console.log(find("from 5", {width:10,height:15}) == true); 	
		console.log(find("bigger than 5", {width:10,height:15}) == true); 	
		console.log(find("more than 5", {width:10,height:15}) == true);	
		console.log(find("more than 55", {width:10,height:15}) == false);	
		console.log(find("more than 12", {width:10,height:15}) == false);	 
		console.log("to x by y");
		console.log(find("test upto 1 by 100 string", {width:10,height:15}) == false); 	
		console.log(find("test to 11 by 12 string", {width:10,height:15}) == false); 	
		console.log(find("test to 1 by 12 string", {width:10,height:15}) == false);	
		console.log(find("test upto 120 by 100 string", {width:10,height:15}) == true); 
		console.log(find("test to 1 by 5 string", {width:10,height:15}) == false); 	
		console.log(find("test to 50 by 100 string", {width:10,height:15}) == true); 	
		console.log("to y by x");
		console.log(find("test to 1 by 100 string", {width:15,height:10}) == false); 	
		console.log(find("test to 11 by 12 string", {width:15,height:10}) == false); 	
		console.log(find("test to 1 by 12 string", {width:15,height:10}) == false);	
		console.log(find("test to 12 by 100 string", {width:15,height:10}) == false); 	
		console.log(find("test to 1 by 5 string", {width:15,height:10}) == false); 	
		console.log(find("test to 50 by 100 string", {width:15,height:10}) == true); 
		console.log("to x by x");
		console.log(find("test to 1 by 100 string", {width:10,height:10}) == false); 	
		console.log(find("test to 11 by 12 string", {width:10,height:10}) == true); 	
		console.log(find("test to 1 by 12 string", {width:10,height:10}) == false);	
		console.log(find("test to 12 by 100 string", {width:10,height:10}) == true); 	
		console.log(find("test to 1 by 5 string", {width:10,height:10}) == false); 	
		console.log(find("test to 50 by 100 string", {width:10,height:10}) == true); 
		console.log("from x by y");
		console.log(find("test from 1 by 100 string", {width:10,height:15}) == false); 	
		console.log(find("test from 11 by 12 string", {width:10,height:15}) == false); 	
		console.log(find("test from 1 by 12 string", {width:10,height:15}) == true);	
		console.log(find("test from 12 by 100 string", {width:10,height:15}) == false); 	
		console.log(find("test from 1 by 5 string", {width:10,height:15}) == true); 	
		console.log(find("test from 50 by 100 string", {width:10,height:15}) == false); 	
		console.log("from y by x");
		console.log(find("test from 1 by 100 string", {width:15,height:10}) == false); 	
		console.log(find("test from 11 by 12 string", {width:15,height:10}) == false); 	
		console.log(find("test from 1 by 12 string", {width:15,height:10}) == false);	
		console.log(find("test from 12 by 100 string", {width:15,height:10}) == false); 	
		console.log(find("test from 1 by 5 string", {width:15,height:10}) == true); 	
		console.log(find("test from 50 by 100 string", {width:15,height:10}) == false); 
		console.log("from x by x");
		console.log(find("test from 1 by 100 string", {width:10,height:10}) == false); 	
		console.log(find("test from 11 by 12 string", {width:10,height:10}) == false); 	
		console.log(find("test from 1 by 12 string", {width:10,height:10}) == false);	
		console.log(find("test from 12 by 100 string", {width:10,height:10}) == false); 	
		console.log(find("test from 1 by 5 string", {width:10,height:10}) == true); 	
		console.log(find("test from 50 by 100 string", {width:10,height:10}) == false); 
		console.log("from x by y, to a by b");
		console.log(find("test from 5 by 10 to 20 by 25 string", {width:10,height:15}) == true); 
		console.log(find("test from 1 by 5 to 5 by 9 string", {width:10,height:15}) == false); 
		console.log(find("test from 25 by 30 to 40 by 55 string", {width:10,height:15}) == false);
		console.log("icons");
		console.log(find("show icons", {width:10,height:15}) == false);
		console.log(find("show icons", {width:32,height:15}) == false); 
		console.log(find("show icons", {width:32,height:32}) == true); 	
		console.log("wallpapers");
		console.log(find("show wallpapers", {width:2024,height:1080}) == true);
		console.log(find("show wallpapers", {width:1024,height:15}) == false);
		console.log(find("show wallpapers", {width:32,height:15}) == false); 
		console.log(find("show wallpapers", {width:32,height:32}) == false); 	
		console.log(Date.now());
	})()};

	function find(input, image){ 
		if(options && options.verbosity && options.verbosity >= 1){ console.log(input); console.log(image); }
		var compositeResult;
		for(var i = 0; i < search.length; i++){
			var result = search[i].match(input.replace( /  +/g, ' ' ).trim()); 
			var isMatch = result && search[i].condition(image, result);   
			if(isMatch !== null){ 
				if(options&&options.verbosity&&options.verbosity>=2){ console.log(search[i].info + " : "+ result+ " : "+ isMatch); }
				compositeResult = (compositeResult === undefined) ? isMatch : compositeResult && isMatch;
			}
		}	
		return (compositeResult) ? compositeResult : false;	
	}; 
	this.find = find;
}

// var search = new SmartSearch({test:true}); 
// var isMatch = search.find(query, images[i]); 


