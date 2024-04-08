let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let score = 0; // Điểm số ban đầu
const rowCount = 5; // Số lượng hàng gạch
const columnCount = 9; // Số lượng cột gạch
let rowDirection = 1; // Hướng di chuyển của các hàng gạch
let brickMoveSpeed = 1; // Tốc độ di chuyển của các hàng gạch

class Ball {
    constructor(size, locationX, locationY, speedX, speedY) {
        this.size = size;
        this.locationX = locationX;
        this.locationY = locationY;
        this.speedX = speedX;
        this.speedY = speedY;
    }
}

class Brick {
    constructor(x, y, status, color, score, width, height, padding) {
        this.x = x;
        this.y = y;
        this.status = status;
        this.color = color;
        this.score = score;
        this.width = width;
        this.height = height;
        this.padding = padding;
    }
}

class Paddle {
    constructor(canvasWidth, paddleHeight, paddleWidth) {
        this.paddleHeight = paddleHeight;
        this.paddleWidth = paddleWidth;
        this.x = (canvasWidth - paddleWidth) / 2;
    }
}

function createBricks(numColumns, numRows, topOffset, leftOffset, colors, brickWidth, brickHeight, brickPadding) {
    let bricks = [];
    for (let c = 0; c < numColumns; c++) {
        bricks[c] = [];
        for (let r = 0; r < numRows; r++) {
            bricks[c][r] = new Brick(
                c * (brickWidth + brickPadding) + leftOffset,
                r * (brickHeight + brickPadding) + topOffset,
                1,
                colors[r % colors.length],
                0,
                brickWidth,
                brickHeight,
                brickPadding
            );
        }
    }
    return bricks;
}

function drawBricks(bricks) {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = bricks[c][r].x;
                let brickY = bricks[c][r].y;
                brickY += rowDirection * brickMoveSpeed; // Cập nhật vị trí của hàng gạch dựa trên rowDirection và tốc độ
                ctx.beginPath();
                ctx.rect(brickX, brickY, bricks[c][r].width, bricks[c][r].height);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
                // Kiểm tra xem hàng gạch có chạm vào biên của canvas không
                if (brickY <= 0 || brickY + bricks[c][r].height >= canvas.height) {
                    rowDirection *= -1; // Đảo ngược hướng di chuyển của hàng gạch
                }
            }
        }
    }
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.locationX, ball.locationY, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.paddleHeight, paddle.paddleWidth, paddle.paddleHeight);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function checkWinCondition(score, rowCount, columnCount) {
    if (score === rowCount * columnCount) {
        alert('You Win');
        document.location.reload();
    }
}

function hitDetection(bricks, ball) {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                const dx = ball.locationX - Math.max(brick.x, Math.min(ball.locationX, brick.x + brick.width));
                const dy = ball.locationY - Math.max(brick.y, Math.min(ball.locationY, brick.y + brick.height));
                if ((dx * dx + dy * dy) < (ball.size * ball.size)) {
                    // Xác định hướng va chạm
                    if (Math.abs(dx) > Math.abs(dy)) {
                        ball.speedX = -ball.speedX;
                    } else {
                        ball.speedY = -ball.speedY;
                    }
                    brick.status = 0;
                    score++;
                    checkWinCondition(score, rowCount, columnCount);
                }
            }
        }
    }
}

function checkCollision(ball, paddle) {
    if (ball.locationX + ball.speedX > canvas.width - ball.size || ball.locationX + ball.speedX < ball.size) {
        ball.speedX = -ball.speedX; // Đảo ngược hướng di chuyển theo trục X
    }
    if (ball.locationY + ball.speedY < ball.size) {
        ball.speedY = -ball.speedY; // Đảo ngược hướng di chuyển theo trục Y
    } else if (ball.locationY + ball.speedY > canvas.height - paddle.paddleHeight) {
        // Kiểm tra va chạm với thanh paddle
        if (ball.locationX > paddle.x && ball.locationX < paddle.x + paddle.paddleWidth) {
            // Quả bóng va chạm với thanh paddle
            const paddleCenter = paddle.x + paddle.paddleWidth / 2;
            const distance = ball.locationX - paddleCenter;
            const reflectionAngle = (distance / (paddle.paddleWidth / 2)) * (Math.PI / 4);
            const newSpeedX = ball.speedX * Math.cos(reflectionAngle) - ball.speedY * Math.sin(reflectionAngle);
            const newSpeedY = ball.speedX * Math.sin(reflectionAngle) + ball.speedY * Math.cos(reflectionAngle);
            ball.speedX = newSpeedX;
            ball.speedY = -newSpeedY;
        } else {
            // Nếu quả bóng không va chạm với thanh paddle, kết thúc trò chơi
            alert("GameOver");
            resetGame();
        }
    }
    // Cập nhật vị trí mới của quả bóng
    ball.locationX += ball.speedX;
    ball.locationY += ball.speedY;
}

function trackScore(score) {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 8, 24);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(bricks);
    drawBall(ball);
    drawPaddle(paddle);
    hitDetection(bricks, ball);
    checkCollision(ball, paddle);
    checkWinCondition(score, rowCount, columnCount);
    trackScore(score);
}

const colors = [
    '#ff6969',
    '#e8a650',
    '#ffd369',
    '#a5d296',
    '#4cbbb9',
    '#7aa5d2',
    '#be86e3',
    '#9c4f97',
    '#ff8fb2',
    '#5c5c5c'
];

function resetGame() {
    // Khởi tạo lại vị trí ban đầu của quả bóng
    let initialBallX = canvas.width / 2; // Đặt giữa canvas
    let initialBallY = canvas.height - 40; // Vị trí y không thay đổi
    ball = new Ball(6, initialBallX, initialBallY, 3, -3);

    // Khởi tạo lại vị trí ban đầu của thanh paddle
    paddle = new Paddle(canvas.width, 15, 50);

    // Khởi tạo lại các viên gạch
    bricks = createBricks(9, 5, 30, 30, colors, 40, 15, 30);

    // Đặt lại điểm số về 0
    score = 0;

    // Vẽ lại tất cả các phần tử trò chơi
    draw();
}

let ball = new Ball(6, canvas.width / 2, canvas.height - 40, 2, -2);
let paddle = new Paddle(canvas.width, 15, 50);
let bricks = createBricks(9, 5, 30, 30, colors, 40, 15, 30);

// Hàm cập nhật vị trí của các hàng gạch
function moveBricks() {
    setInterval(function() {
        draw();
    }, 10); // Cập nhật vị trí mỗi 10 miliseconds
}

moveBricks(); // Bắt đầu di chuyển các hàng gạch tự động

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.paddleWidth / 2;
    }
}

// Lấy thẻ button có id là "reset"
const resetButton = document.getElementById('reset');

// Thêm sự kiện click vào nút "Reset"
resetButton.addEventListener('click', function() {
    document.location.reload(); // Tải lại trang để reset trò chơi
});
