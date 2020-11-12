const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 8000;

const server = http.createServer(app).listen(port);
const io = require('socket.io')(server);// create server and listen

app.use(express.static(__dirname + '/public'));

// routes
app.get('/', (req, res) => {
    res.render('index.ejs', {exist : Object.values(users)});
});

app.get('/game', (req, res) => {
  res.render('game.ejs');
});

console.log("Starting Quickmafs on port: " + port);

//socket.io - online actions
let game_status;
let p_ready = [];
let p_solved = [];
let round = 0;
let game_tab = [];
let find_nb;
let users ={};
let results = [];
let nosol = [];

//Object.values(users) this is a tab of all names
//Object.keys(users).length

io.on('connection', socket => {
  socket.on('new-user', name => {
    if(Object.values(users).includes(name)){
      console.log("username used");
      socket.emit('name_taken', Object.values(users));
    }
    else{
      users[socket.id] = name;
      io.sockets.emit('user-connected', {users : users , name : users[socket.id]});
      if(game_status == true){
      socket.emit('start', {game_tab : game_tab, find_nb : find_nb, round : round})
      socket.emit('started');
      nosol.push(name);
     }
    }
  });

  socket.on('broad_msg', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    const player = users[socket.id];
    delete users[socket.id]
    p_ready.pop(player);
    socket.broadcast.emit('user-disconnected', {users : users , name : player});
    if(Object.keys(users).length == 0){
      round = 0;
      repeat = false;
    }
    //pop solved and before out
    for(let i = 0; i < p_solved.length; i++){
      if(p_solved[i].name == player){
        p_solved.pop(p_solved[i])
      }
      if(p_solved.length == Object.values(users).length){
        repeat = false;// countd
      }
      break;
    }
    
    
  });

  socket.on('found', data => {
    p_solved.push(data);
    upd_score(data.name, data.chrono);
    io.sockets.emit('user-found', {name :users[socket.id], chrono : data.chrono});
    if(p_solved.length == Object.values(users).length){
      repeat = false;// countd
    }
  });

  socket.on('unfound', data => { // name sol chrono
    p_solved.push(data);//used for op board
    upd_score(data.name, data.chrono);
  })

  socket.on('ready', ()=>{
    p_ready.push(users[socket.id]);
    let nb_players = Object.values(users).length;
    io.sockets.emit('ready_check', users[socket.id]);
    if(nb_players === p_ready.length){
      round++;
      game_status = true;
      game_tab = roll();
      find_nb = nb_find(10,77);
      p_solved = [];
      nosol = [...p_ready];
      io.sockets.emit('start', {game_tab : game_tab, find_nb : find_nb, round : round})
      countd(100);
    }
  });

  // end if : all players solved; timeout
  socket.on('ask_op', n=> {
    p_solved.forEach(element => {
      if(element.name == n){
        socket.emit('ans_op', element.sol);
      }
    });
  });

  socket.on('nosol', n=> {
    nosol.pop(n);
    let msg = "voted for No Solution.";
    io.sockets.emit('chat-message', { message: msg, name: users[socket.id] });
    if(nosol.length == 0){
      round--;
      repeat = false
      game_status = false; 
      io.sockets.emit('end');
      p_ready = []; 
    }

  });
  
});


// let n_tab = [5];
// let dice = [5];

// Server generate the numbers and send to players
let n_tab = [1,2,3,4,5,6,7,8,9];
let dice = [3,4,5,6];
let pair_tab = [2,4,6,8];
let odd_tab = [3,5,7,9];

//take a random number from the array
function rand_array(array) {
  let rand = array[Math.floor(Math.random()*Math.floor(array.length))];
  return rand;
}
function roll(){
  let game_tab = [rand_array(n_tab), rand_array(dice), rand_array(pair_tab), rand_array(odd_tab), rand_array(dice) ]
  return game_tab;
}
function nb_find(nb_min,nb_max){
  find_nb = Math.floor(Math.random()*Math.floor(nb_max- nb_min)+nb_min);
  return find_nb
}

// chrono-countdown
let repeat = true;
function countd(count){
  repeat = true;
  // 1st second
  io.sockets.emit('count', count);
  //after
  let interval = setInterval(function(){
		count--;
		io.sockets.emit('count', count);
		if(count == 0){
			console.log("countdown done")
			repeat = false;
		}
		if(repeat == false){
			clearInterval(interval); 
			endgame();
		}
	}, 1000);
}

function endgame(){
	repeat = false
	game_status = false; 
  io.sockets.emit('end');
  p_ready = []; 
  if(round === 5){
    round = 0;
    setTimeout(function (){  //wait 1s for unfound
      //console.log(results);
      sort_obj_score(results);
      io.sockets.emit('results', results);
      results = [];
    
    }, 1000);
   
  }
}


function upd_score(name, time){
  let verify = false;
  results.forEach(e => {
    if(e.name == name){
      e.score += time;
      verify = true;
    }
  })  
  if(verify == false){
    results.push({name : name, score : time });
  }
}

// sort array of obj by score
function sort_obj_score(arr_of_obj){
  arr_of_obj.sort((a, b) => {
    return a.score - b.score;
  })
}
