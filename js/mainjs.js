    //21130360 Nguyễn Thanh Hoài
 let canvas = document.getElementById("game"),
 ctx = canvas.getContext('2d'),
 ballRadius = 9,
     //vị trí ban đầu của quả bóng trên trục x
 x =  canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
 y = canvas.height - 40,

     // tốc độ di chuyển ban đầu của quả bóng trên trục x và trục y
 dx = 2, dy= -2;

    // chiều cao và chiều rộng của thanh điều khiển
let paddleHeight = 15,
    paddleWidth = 72;

    // Vị trí ban đầu của thanh điều khiển
let paddleX = (canvas.width - paddleWidth) / 2;

    //di chuyển chuột để di chuyển thanh điều khiển
document.addEventListener(
    "mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth / 2;
    }
}
//gach
let rowCount = 5, // Số lượng hàng gạch
    columnCount = 9, // Số lượng cột gạch
    brickWidth = 54, // Độ rộng của mỗi viên gạch
    brickHeight = 18,// Độ cao của mỗi viên gạch
    brickPadding = 12,// Khoảng cách giữa các viên gạch
    toOffset = 40,// Khoảng cách từ trên cùng của màn hình đến hàng gạch đầu tiên
    leftOffset = 33, // Khoảng cách từ mép trái của màn hình đến cột gạch đầu tiên
    score = 0;// Điểm số ban đầu của người chơi

// khởi tao gach
let bricks =[];
for (let c = 0; c < columnCount; c++){
    bricks[c] = [];
    for (let r = 0; r < rowCount; r++){
        // Gán vị trí và trạng thái cho từng viên gạch
        bricks[c][r] = {x: 0, y: 0, status: 1}
        // Vị trí x và y sẽ được cập nhật sau khi tính toán dựa trên vị trí và kích thước của từng viên gạch
    }
}

// ve gach
function drawBricks(){
    for (let c = 0; c < columnCount; c++){
        for (let r = 0; r < rowCount; r++){
            if (bricks[c][r].status === 1){ // == bang 1  van con
                let brickX = (c * (brickWidth + brickPadding))
                + leftOffset;
                let brickY = (r * (brickHeight + brickPadding))
                    + toOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath(); // ve duong path moi
                ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// ve ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

//vẽ thanh điều khiển trên canvas.
function drawPaddle(){
    ctx.beginPath(); // Bắt đầu một đường vẽ mới
    //Vị trí x của thanh điều khiển trên canvas.
    ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth,paddleHeight, 30);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}
    function checkWinCondition() {
        if (score === rowCount * columnCount) {
            alert('You Win');
            document.location.reload();
        }
    }

// xu ly va cham giua bong va gach
function hitDetection(){
    for (let c = 0; c < columnCount; c++){
        for (let r = 0; r < rowCount; r ++){
            let b = bricks[c][r];
            if (b.status === 1){
                if (x > b.x && x < b.x + brickWidth && y > b.y  && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    checkWinCondition();
                }
            }
        }
    }
}
function trackScore(){
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 8, 24);

}
function checkCollision() {
        // Kiểm tra va chạm với các biên ngang
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        // Kiểm tra va chạm với biên trên
        if (y + dy < ballRadius) {
            dy = -dy;
        }

        // Kiểm tra va chạm với biên dưới và thanh điều khiển
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert('Game over');
                document.location.reload();
            }
        }

        // Đảo ngược hướng di chuyển nếu quả bóng chạm vào biên trên hoặc dưới
        if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        // Cập nhật vị trí mới của quả bóng
        x += dx;
        y += dy;
    }

function init(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPaddle();
    drawBricks();
    drawBall();
    hitDetection();
    trackScore();
    checkCollision();
}
setInterval(init, 10);



