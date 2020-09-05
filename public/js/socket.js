// const socket = io.connect('http://localhost:8000');
const socket = io();
const msgDisplay = document.getElementById('display_chat');
const msgInput = document.getElementById('message');
const msgForm = document.getElementById('send_msg');

const name = url_get("name");

if(regtest(name) == false){
  window.location.replace("/?reg=noreg");
} 

function regtest(str){
  const regex = /^[0-9a-zA-Z]+$/;//alphanumeric
  return regex.test(str)
}

// appendMessage('You joined the room');
socket.emit('new-user', name);

socket.on('name_taken',  data => { 
  window.location.replace("/?failed="+data);
})

socket.on('chat-message', data => {//data is an object {name, message}
  appendMessage('<strong>'+data.name+ '</strong> : '+data.message);
})

socket.on('user-connected', data => { 
  //Object.values(users) this is a tab
  //Object.keys(users).length
    appendMessage('<strong> 🠞 &nbsp;'+data.name+'</strong> joined the room.');
    display_name(Object.values(data.users));

})

socket.on('user-disconnected', data => {
  if(data.name != undefined){
    appendMessage('<strong> 🠜 &nbsp;'+data.name+ '</strong> left the room.');
  }
  display_name(Object.values(data.users));
}) 

socket.on('user-found',data => {
  update_player(data);
})

socket.on("start", data =>{// object {game_tab , find_nb}
  find_nb = data.find_nb;
  game_tab = [...data.game_tab];
  game_reset = [...game_tab];
  all_moves = [[...game_tab]];
  document.getElementById("find").innerHTML = find_nb;
  document.getElementById("n_round").innerHTML = data.round;
  g_display(game_tab, 5);
  reset_display();
  hideall(5);
  found_token = false; 
})

socket.on('ready_check', name => {
  for(let i =1; i <= 5; i++){
    if(name == document.getElementById('p'+i).innerHTML){
      colorblue('p'+i);
    }
  }
})

socket.on('count', data =>{
  document.getElementById('timer').innerHTML = data;
  if(data == 0){
    if(found_token == false){
      let sol = document.getElementById('write_op').innerHTML;
      socket.emit('unfound', {name: name, sol : sol, chrono: 150});
    }
  }
})

socket.on('started', ()=> {
  already();
})

socket.on('ans_op', data => {
  document.getElementById('modal_t').innerHTML = data;
  document.getElementById("find_s").innerHTML = find_nb;
  document.getElementById('nums').innerHTML =  document.getElementById('n_info').innerHTML
  display_modal(); 
})

socket.on('end', ()=> {
  rd_again();
  show.forEach(e => {
    document.getElementById("c"+e).style.visibility = "visible";
  })
})

socket.on('results', data => {// name score
  let string = "Score";
  document.getElementById("find_s").innerHTML = "";
  document.getElementById('nums').innerHTML =  "";
  document.getElementById('n_p').innerHTML =  "";
  data.forEach(e => {
    console.log(e)
    let str = "<li>"+e.score+" 🡄 "+e.name+"</li>"
    string = string.concat(' ', str);
  })

  document.getElementById('modal_t').innerHTML = string;
  display_modal();
})

msgForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = msgInput.value;
  appendMessage('<strong>You :</strong> '+message);
  socket.emit('broad_msg', message);
  msgInput.value = '';
})

function appendMessage(message) {
  $('#display_chat').append('<div>'+ message + '</div>');
}

//this function takes a tab 
function display_name(name){
  let cpt = 0;
  name.forEach(el => {
    cpt++;
    document.getElementById("p"+cpt).innerHTML = el;
    document.getElementById("c"+cpt).style.visibility = "hidden";
    
  });
  while(cpt != 5){// 5 the nb of players
    cpt++;
    document.getElementById("p"+cpt).innerHTML = "";
    document.getElementById("c"+cpt).style.visibility = "hidden";
   
  } 
}


let show = [];
function update_player(data){
  let cpt = 0;
  while(cpt < 5){
    cpt++;
    if(document.getElementById("p"+cpt).innerHTML == data.name){
      colorgreen("p"+cpt);
      document.getElementById('c'+cpt).innerHTML = data.chrono + " s";
      show.push(cpt);
      break;
    }
  }
}


function colorgreen(p){
  document.getElementById(p).style.backgroundColor = "palegreen";
}
function colorblue(p){
  document.getElementById(p).style.backgroundColor = "deepskyblue";
}


//put the default style when doesnt work ??
function reset_display(){
  for(let i =1; i <= 5 ; i++){
    document.getElementById("p"+i).style = "transparent";
  }
  document.getElementById("write_op").innerHTML = "";
  show = [];
  
}

function hideall(n_p){
  for(let i =1; i <= n_p; i++){
    document.getElementById("c"+i).style.visibility = "hidden";
  }
}


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
