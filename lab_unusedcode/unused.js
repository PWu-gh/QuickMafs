/* <input id="calc" type="text" >
<button onclick="calculate()">calculate</button>
<div id="ans_calc"></div> */


//solve the operation in the order typed (1+1*3 = 6)
function calculate(){
    let sequence,operators = [];
    let ans;
    let calc = document.getElementById("calc").value;
    const numbers = calc.split('');

    for(let i in numbers){
        if(numbers[i] == '+' || numbers[i] == '-' || numbers[i] == '*' || numbers[i] == '/'){
            operators.push(numbers[i]);
            numbers[i]= ' ';
        }
    }
    let update = numbers.join('');//reunite numbers with 2 or more lengths
    sequence = update.split(' ');

    for(let i in sequence){
        if( i == 0){ ans = Number(sequence[i]); }
        else{
            ans = operator(ans, Number(sequence[i]), operators[i-1]);
        }
    }
    //console.log(ans);
    document.getElementById("ans_calc").innerHTML = ans;
    write("write_op", calc);
    //verify(ans);
}


// int int string
function operator(ans,next,op){
    if(op == '+'){
        ans += next
    }
    if(op == '-'){
        ans -= next
    }
    if(op == '*'){
        ans *= next
    }
    if(op /= '/'){
        ans += next
    }
    return ans;
}