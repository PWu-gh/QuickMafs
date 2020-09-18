// This script is only used in index.ejs

function url_get(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);
	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

const param = url_get("failed");
const param_reg = url_get("reg");
if(param_reg != null){
	document.getElementById('repick').innerHTML = " Please pick an username with only alphanumeric characters!"
}
if(param != null){
	document.getElementById('repick').innerHTML = " Please pick an available username !"
}

$('input[type="text"]').keydown(function(e){
	//not include in  48-90 96-105    0-Z   numpad0-numpad 9 
	let keyC = [13,8,46,37,38,39,40, 109, 16, 20, 18, 222] //Enter back suppr arrows
	if(!((e.keyCode >= 48 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || keyC.includes(e.keyCode))){
		e.preventDefault();
		document.getElementById('repick').innerHTML = " Only alphanumeric char!"
	}
});
