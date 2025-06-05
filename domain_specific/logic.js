let player = true;//player1(red)=true  player2(yellow)=false
let p1TimeDisplay = document.querySelector('#p1TimeDisplay');
let p2TimeDisplay = document.querySelector('#p2TimeDisplay');
let columnButtons = document.querySelectorAll('.columnButtons');
let pause = document.querySelector('#pause');
let resume = document.querySelector('#resume'); 
let reset = document.querySelector('#reset');
let mute = document.querySelector('#mute');
let darkmode = document.querySelector('#darkmode');
let winDisplay = document.querySelector('#winDisplay');
let p1Time = 5*60;
let p2Time = 5*60;
let p1Timer;
let p2Timer;
let newChance = true;
let isPaused = false;
let isMute = false;
let isDarkmode = false;
let boxArr = [];
let clickSound = new Audio('mouse-click.mp3');
let selectSound = new Audio('selectaudio.wav');
let winSound = new Audio('win.mp3');
let dropSound = new Audio('drop.wav');
let numberOfMoves = 0;

for(let i = 0; i<6; i++){
    boxArr.push([0,0,0,0,0,0,0]);
}

function player1Timer(){
    p1Timer = setInterval(()=>{       
        p1Time--;
        if(p1Time%60 < 10) p1TimeDisplay.innerHTML = `Player 1: ${Math.floor(p1Time/60)}:0${p1Time % 60}`;
        else p1TimeDisplay.innerHTML = `Player 1: ${Math.floor(p1Time/60)}:${p1Time % 60}`; 
        if(p1Time == 0){
            winDisplay.innerHTML = "🎊 Player 2 Wins 🎉";
            if(!(isMute)) winSound.play();
            clearInterval(p1Timer);
        }            
    },1000);    
}
function player2Timer(){
    p2Timer = setInterval(()=>{
        p2Time--;
        if(p2Time%60 < 10) p2TimeDisplay.innerHTML = `Player 2: ${Math.floor(p2Time/60)}:0${p2Time % 60}`;
        else p2TimeDisplay.innerHTML = `Player 2: ${Math.floor(p2Time/60)}:${p2Time % 60}`; 
        if(p2Time == 0){
            winDisplay.innerHTML = "🎊 Player 1 Wins 🎉";
            if(!(isMute)) winSound.play();
            clearInterval(p2Timer);
        }            
    },1000);
}
player1Timer();//initially starting p1 timer

let flag = 0;
columnButtons.forEach((btn, index)=>{
    btn.addEventListener('click',()=>{
        if(newChance && isPaused == false && boxArr[0][index] == 0){//can only block if uppermost is unfilled
            for(let i = 0; i<7; i++){                               //can only block if player can drop disc in any other column
                if(i != index && boxArr[0][i] == 0){
                    btn.style.backgroundColor = 'green';
                    newChance = false;
                    flag = btn;
                    if(!(isMute)) selectSound.play();
                    break;
                }
            }          
                        
        }else{
            for(let i = 5; i>=0; i--){
                if(boxArr[i][index] == 0 && btn != flag){
                    numberOfMoves++;
                    let box = document.querySelector(`#box${i}${index}`);
                    if(player){
                        box.innerHTML = '&#128308;';
                        boxArr[i][index] = 1;
                        clearInterval(p1Timer);
                        player2Timer();
                    }else{
                        box.innerHTML = '&#x1F7E1;';
                        boxArr[i][index] = 2;
                        clearInterval(p2Timer);
                        player1Timer();
                    }
                     if(!(isMute)) dropSound.play();
                    if(drawCondition()) winDisplay.innerHTML = "It's a draw!🤝";
                    if(winningCondition()){
                        clearInterval(p1Timer);
                        clearInterval(p2Timer);
                        p1Timer = null;
                        p2Timer = null;
                        if(!(isMute)) winSound.play();
                        
                        if(player){
                            updateHighScores(numberOfMoves, 1);
                            winDisplay.innerHTML='🎊 Player 1 Wins 🎉';
                        } else {
                            updateHighScores(numberOfMoves, 2);
                            winDisplay.innerHTML='🎊 Player 2 Wins 🎉';
                        }
                    }
                    player = !player;
                    flag.style.backgroundColor = '';
                    newChance = true;
                    break;
                }
                
            }
            
        }
    });
});

function updateHighScores(numberOfMoves, playerNumber) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];//JSON.parse will convert string into array
    leaderboard.push(numberOfMoves);
    leaderboard.sort((a, b) => a - b);
    leaderboard = leaderboard.slice(0, 5);
    for(let i = 0; i<5; i++){
        if(leaderboard[i] == undefined){
            leaderboard[i] = 42;
        }
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    leaderboard = JSON.parse(localStorage.getItem('leaderboard'))
    let lb = document.querySelector('#h2');
    lb.innerHTML = 'Leaderboard';
    lb.style.fontStyle = 'italic';
    for(let i = 0; i<5; i++){
        let h = document.querySelector(`#l${i+1}`);
        h.innerHTML = `${i+1}.&nbsp;&nbsp;&nbsp;${leaderboard[i]}`;
    }
}
function winningCondition() {
    //horizontal
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (boxArr[i][j] !== 0 &&
                boxArr[i][j] === boxArr[i][j+1] &&
                boxArr[i][j] === boxArr[i][j+2] &&
                boxArr[i][j] === boxArr[i][j+3]) {
                return true;
            }
        }
    }
    //vertical
    for (let j = 0; j < 7; j++) {
        for (let i = 0; i < 3; i++) {
            if (boxArr[i][j] !== 0 &&
                boxArr[i][j] === boxArr[i+1][j] &&
                boxArr[i][j] === boxArr[i+2][j] &&
                boxArr[i][j] === boxArr[i+3][j]) {
                return true;
            }
        }
    }
    //positive diagonal
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (boxArr[i][j] !== 0 &&
                boxArr[i][j] === boxArr[i+1][j+1] &&
                boxArr[i][j] === boxArr[i+2][j+2] &&
                boxArr[i][j] === boxArr[i+3][j+3]) {
                return true;
            }
        }
    }
    //negative diagonal
    for (let i = 3; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (boxArr[i][j] !== 0 &&
                boxArr[i][j] === boxArr[i-1][j+1] &&
                boxArr[i][j] === boxArr[i-2][j+2] &&
                boxArr[i][j] === boxArr[i-3][j+3]) {
                return true;
            }
        }
    }
    return false;
}

//Draw condition
function drawCondition(){
    for(let i = 0; i<7; i++){
        if(boxArr[0][i] == 0) return false;
    }
    return true;
}

//Buttons
pause.addEventListener('click',()=>{
    if(!(isMute)) clickSound.play();
    if(!(isPaused) && winDisplay.innerHTML == ""){
        isPaused = true;
        clearInterval(p1Timer);
        clearInterval(p2Timer);
    }
});
resume.addEventListener("click",()=>{
    if(!(isMute)) clickSound.play();
    if(isPaused){
        player? player1Timer() : player2Timer();
        isPaused = false;
    }
});
reset.addEventListener('click',()=>{
    if(!(isMute)) clickSound.play();
    setTimeout(()=>{
        location.reload();
    },600);
});
mute.addEventListener('click',()=>{
    clickSound.play();
    if(isMute){
        isMute = false;
        mute.innerHTML = '🔇';
    }
    else{
        isMute = true;
        mute.innerHTML = '🔉';
    }
});
darkmode.addEventListener('click',()=>{
    let body = document.querySelector('#body');
    if(!(isMute)) clickSound.play();
    if(isDarkmode){
        isDarkmode = false;
        darkmode.innerHTML = '☽';
        winDisplay.style.color = '';
        body.style.backgroundColor = 'rgba(255, 140, 0, 0.775)';
        for(let i = 0; i<6; i++){
            for(let j = 0; j<7; j++){
            let box = document.querySelector(`#box${i}${j}`);
            box.classList.toggle('darkColour');
            }
        }
    }else{
        isDarkmode = true;
        darkmode.innerHTML = '☀️';
        winDisplay.style.color = 'cyan';
        body.style.backgroundColor = 'rgba(0, 0, 0, 0.94)';
        for(let i = 0; i<6; i++){
            for(let j = 0; j<7; j++){
            let box = document.querySelector(`#box${i}${j}`);
            box.classList.toggle('darkColour');
            }
        }
    }
});

