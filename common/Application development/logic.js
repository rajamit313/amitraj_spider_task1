let line = document.createElementNS("http://www.w3.org/2000/svg",'line');
let svg = document.querySelector("#svg");
let p1 = document.querySelector('#p1');
let p2 = document.querySelector('#p2');
let winDisplay = document.querySelector('#winDisplay');
let turn = 1;
line.setAttribute('x1','500');
line.setAttribute('y1','100');
line.setAttribute('x2','900');
line.setAttribute('y2','100');
line.setAttribute('stroke','blue');
line.setAttribute('stroke-width',15);
svg.appendChild(line);
let x1 = 500;
let y1 = 100;
let x2,y2;
let R = 400;
x2 = 900;
let timer = null;
let dir, s = 1;
function time(){
     timer = setInterval(()=>{      
            if(x2 <= 100) dir = 1;
            if(x2 >= 900) dir = -1;
            if(x2>=400 && x2<=600){
                x2 += 3*dir;      
            }else if((x2<400 && x2>150) || (x2>600 && x2<850)){
                x2 = x2 + dir;        
            }else if(x2<=150 || x2>=850){
                x2 += 0.2*dir;                     
            }
            if((R*R-(x2-500)*(x2-500))<0){
                y2 = 100;
            }else{
                y2 = Math.sqrt(R*R-(x2-500)*(x2-500)) + 100;
            }
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        svg.appendChild(line);
    },5);
}
time();
let score1;
document.addEventListener('keydown',(e)=>{
    if(e.key == "Enter"){
        if(winDisplay.innerHTML != "") location.reload();
        let score = Math.abs(Math.atan((y2-y1)/(x2-x1))) * (180/Math.PI) * (10/9);  
        score = score.toFixed(2);
        if(turn == 1){
            p1.innerHTML = `Player 1: ${score}`;
            x2 = 900;
            score1 = score;
            turn = 2;
        }else{
            p2.innerHTML = `Player 2: ${score}`;
            clearInterval(timer);
            if(score1 > score) winDisplay.innerHTML = "Player 1 wins!🎉";
            else if(score1 < score) winDisplay.innerHTML = "Player 2 wins!🎉";
            else winDisplay.innerHTML = "It's a tie!🤝";
        }
        
    }
})
