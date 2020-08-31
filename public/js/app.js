let find_nb;
let game_tab = [];
let game_reset = [];
let all_moves = [];


function g_display(game_tab, nb_dice){
    for(let i = 0; i<nb_dice; i++){
        document.getElementById("n"+(i+1)).innerHTML = game_tab[i];
        document.getElementById("s"+(i+1)).innerHTML = game_tab[i];
    }
}


function write(id,content){
    // Grab an element
    let el = document.getElementById(id);
    // Make a new div
    child = document.createElement('div');
    // Give the new div some content
    child.innerHTML = content;
    // Jug it into the parent element
    el.appendChild(child);
    
}

function unwrite(id){
    let el = document.getElementById(id);
    if(el.childNodes.length > 0){
        el.removeChild(el.childNodes[(el.childNodes.length)-1]);
    }
}

function ready(){
    document.getElementById("btn_rd").style.visibility = "hidden";
    socket.emit('ready');
}

function already(){
    document.getElementById("btn_rd").style.visibility = "hidden";
}

function rd_again(){
    document.getElementById("btn_rd").style.visibility = "visible";
}