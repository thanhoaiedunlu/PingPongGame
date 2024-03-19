//21130360 Nguyễn Thanh Hoài
 let canvas = document.getElementById("game"),
 ctx = canvas.getContext('2d'),
 ballRadius = 9,
// x = canvas / 2,
 // x =  canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3), //vị trí ban đầu của quả bóng trên trục x
 y = canvas.height - 40,
 dx = 2, dy= -2; // tốc độ di chuyển ban đầu của quả bóng trên trục x và trục y

let paddleHeight = 15, // chiều cao và chiều rộng của thanh điều khiể
    paddleWidth = 72;
// Vi tri cua thanh
let paddleX = (canvas.width - paddleWidth) / 2;

document.addEventListener(
    "mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth / 2;
    }
}



//vẽ thanh điều khiển trên canvas.
function drawPaddle(){
    ctx.beginPath(); // Bắt đầu một đường vẽ mới
    //Vị trí x của thanh điều khiển trên canvas.
    ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth
    ,paddleHeight, 30);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}
function init(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPaddle();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    if (y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius){
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else
        {
            alert('Game over')
            document.location.reload();
        }
    }
}
setInterval(init, 10);



