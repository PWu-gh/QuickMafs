// const socket = io.connect('http://localhost:8000');
const socket = io.connect('https://quickmafs/herokuapp.com');
const msgDisplay = document.getElementById('display_chat');
const msgInput = document.getElementById('message');
const msgForm = document.getElementById('send_msg');

const name = url_get("name");

// appendMessage('You joined the room');
socket.emit('new-user', name);

socket.on('name_taken',  data => {
  console.log("lol")
  window.location.replace("/?failed="+data);
})

socket.on('chat-message', name => {//data is an object {name, message}
  appendMessage('<strong>'+name+ '</strong> : '+data.message);
})

socket.on('user-connected', data => { 
  //Object.values(users) this is a tab
  //Object.keys(users).length
    appendMessage('<strong> 🠞 &nbsp;'+data.name+'</strong> joined the room.');
    display_name(Object.values(data.users));

})

socket.on('user-disconnected', data => {
  appendMessage('<strong> 🠜 &nbsp;'+data.name+ '</strong> left the room.');
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
})

socket.on('count', data =>{
  document.getElementById('timer').innerHTML = data;
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