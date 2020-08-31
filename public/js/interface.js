let nb_token = 0;
let op_token = 0;
let op_sign= "";
let btn_tab = [];
const time = 120;

function nb_button(btn){
    const pressed = game_tab[btn-1];
    if(op_token == 0 && pressed != null){
        if(nb_token == 0){
            nb_token = 1;
            btn_tab.push(btn);
        }
        if(nb_token == 1 && pressed != null){  // change 1st number
            btn_tab[0] = btn;
        }    
    }
    else{
        let ans;
        if(pressed != null && btn_tab[0] != btn){
            btn_tab.push(btn); // 2nd number
            ans = compute(game_tab[btn_tab[0]-1], game_tab[btn_tab[1]-1], op_sign);
            write("write_op"," ✏ &nbsp;&nbsp;"+game_tab[btn_tab[0]-1]+" "+ sign_x(op_sign)+" " +game_tab[btn_tab[1]-1]+ "&nbsp;=&nbsp;"+ ans)
            update_numbers(btn_tab[0], btn_tab[1], ans);
        }
        //solution found !
        if(ans == find_nb){
            let chrono = time -document.getElementById('timer').innerHTML;
            let sol = document.getElementById('write_op').innerHTML;
            socket.emit('found', {name: name, sol : sol, chrono: chrono});        
        }
    }
}

function op_button(btn){
    if(nb_token == 1 && op_token ==0){
        // if(btn == '+' || btn == '-' || btn == '*' || btn == '/')
        op_token = 1;
        op_sign = btn;
        nb_token = 0;
    }
    else if(nb_token == 0 && op_token ==1){
        op_sign = btn;
    }                                     
    else{
        console.log("please pick a number first");
    }
}


//replace btn 1 value by (btn1 op btn2)
function update_numbers(btn1, btn2, ans){
    game_tab[btn1-1] = ans;
    game_tab[btn2-1] = null;
    document.getElementById("n"+btn1).innerHTML = game_tab[btn1-1];
    document.getElementById("n"+btn2).innerHTML = game_tab[btn2-1];
    btn_tab = [];
    all_moves.push([...game_tab]);
}



function compute(tab1, tab2, op){
    if(op == '+'){
        tab1 += tab2;
    }
    else if(op == '-'){
        tab1 -= tab2;
    }
    else if(op == '*'){
        tab1 = tab1*tab2;
    }
    else{ //(op == '/')
        tab1 = tab1/tab2;
    }
    op_token = 0;
    return tab1;
}

function g_reset(){
    game_tab = [...game_reset];
    g_display(game_tab, 5);
    all_moves = [[...game_tab]];
    op_token = 0;
    nb_token = 0;
    btn_tab = [];
    document.getElementById("write_op").innerHTML = "";

    console.log("game reseted");
}

function cancel_bt(){
    if(op_token == 1){// repick nb
        op_token = 0;
        nb_token = 0;
        btn_tab = [];
    }
    else{// if op_token == 0
        if(all_moves.length > 1){
            all_moves.pop();
            game_tab = all_moves[all_moves.length-1];
            g_display(game_tab, 5);
            unwrite("write_op");
        }
    }
}

//convert * to x
function sign_x(op){
    if(op == "*"){
        return "&times;";
    }return op;
}
                                                     
function ask_op(num){//c1 1
    let n = document.getElementById('p'+num).innerHTML;
    socket.emit('ask_op', n);
    document.getElementById('n_p').innerHTML = n;
}


window.addEventListener("keydown", checkKeyPress);

// Keyboard shortcut
let nkey = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG"];
let opkey = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];


function checkKeyPress(key){
    key.preventDefault();// disable arrow page scrolling
    switch(key.code){
        case nkey[0]:
            nb_button(1);
            break;
        case nkey[1]:
            nb_button(2);
            break;
        case nkey[2]:
            nb_button(3);
            break;
        case nkey[3]:
            nb_button(4);
            break;
        case nkey[4]:
            nb_button(5);
            break;
        case "ArrowUp":
            op_button('-');
            break;
        case "ArrowLeft":
            op_button('+');
            break;        
        case "ArrowDown":
            op_button('*');
            break;
        case "ArrowRight":
            op_button('/');
            break;
        case "Backspace":
            cancel_bt();
            break;
        case "Numpad0":
            g_reset();
            break;
        default:
            console.log('noting');
    }
    
}

function rm_event(){
    window.removeEventListener("keydown", checkKeyPress);
}

document.addEventListener("click", e => {
    if(e.target.id == "message"){
        rm_event();
    }
    else{
        window.addEventListener("keydown", checkKeyPress);
    }
})
