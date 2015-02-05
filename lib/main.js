const {ToggleButton} = require('sdk/ui/button/toggle');
const panels = require('sdk/panel');
const Self = require('sdk/self');
const Tabs = require('sdk/tabs');
const PageMod = require('sdk/page-mod');

let button = ToggleButton({
	id: "my-button",
	label: "Nice extension title",
	icon: {
		"16": Self.data.url('images/16.png'),
		"32": Self.data.url('images/32.png'),
		"34": Self.data.url('images/64.png')
	},
	onChange: handleChange
});

let panel = panels.Panel({ 
    width: 422,
    height: 602,
	contentURL: Self.data.url('html/main.html'),
	onHide: handleHide,
	onShow: function () {
		panel.port.emit("show");
	}
})

function handleChange(state) {
	if(state.checked){
		panel.show({position: button});}
}

function handleHide() {
	button.state('window', {checked: false});
}

panel.port.on("executeScript", function (path) {
	//All paths are relative to data/ directory
   // panel.port.emit("message", path);
	let scriptPath = Self.data.url(path);
    
	var worker = Tabs.activeTab.attach({
		contentScriptFile: scriptPath
	});
    
	worker.port.on("action", function (source) {
		panel.port.emit("message", {action: "action", source: source});
	});

});
