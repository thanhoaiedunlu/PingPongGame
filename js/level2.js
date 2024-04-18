const minPaddleWidth = 20;
const minBrickWidth = 10;
const minBrickHeight = 5;
const minBallSize = 5; // Kích thước tối thiểu cho quả bóng

function decreaseSize() {
    if (paddle.paddleWidth > minPaddleWidth) {
        paddle.paddleWidth -= 1; // Giảm kích thước của thanh paddle
    }
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.width > minBrickWidth && brick.height > minBrickHeight) {
                brick.width -= 1; // Giảm kích thước của gạch
                brick.height -= 0.5;
                brick.padding -= 0.5;
            }
        });
    });
    if (ball.size > minBallSize) {
        ball.size -= 0.5; // Giảm kích thước của quả bóng
    }
}

// Gọi hàm decreaseSize mỗi giây (1000 milliseconds)
setInterval(decreaseSize, 1000);

const accelerationRate = 0.001; // Tốc độ tăng tốc

function increaseBallSpeed() {
    // Tăng tốc độ theo các thành phần speedX và speedY
    ball.speedX += ball.speedX * accelerationRate;
    ball.speedY += ball.speedY * accelerationRate;
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
    increaseBallSpeed();
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

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let score = 0; // Điểm số ban đầu
const rowCount = 5; // Số lượng hàng gạch
const columnCount = 9; // Số lượng cột gạch

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
    constructor(x, y, status, color, width, height, padding) {
        this.x = x;
        this.y = y;
        this.status = status;
        this.color = color;
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
                ctx.beginPath();
                ctx.rect(brickX, brickY, bricks[c][r].width, bricks[c][r].height);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
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

function resetGame() {
    // Khởi tạo lại vị trí ban đầu của quả bóng
    let initialBallX = canvas.width / 2; // Đặt giữa canvas
    let initialBallY = canvas.height - 40; // Vị trí y không thay đổi
    ball = new Ball(9, initialBallX, initialBallY, 2, -2);

    // Khởi tạo lại vị trí ban đầu của thanh paddle
    paddle = new Paddle(canvas.width, 15, 72);

    // Khởi tạo lại các viên gạch
    bricks = createBricks(11, 5, 40, 24, colors, 54, 18, 1);

    // Đặt lại điểm số về 0
    score = 0;

    // Vẽ lại tất cả các phần tử trò chơi
    draw();
}

let ball = new Ball(9, canvas.width / 2, canvas.height - 40, 2, -2);
paddle = new Paddle(canvas.width, 15, 72);
bricks = createBricks(11, 5, 40, 24, colors, 54, 18, 1);
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.paddleWidth / 2;
    }
}

setInterval(draw, 10);

// Lấy thẻ button có id là "reset"
const resetButton = document.getElementById('reset');

// Thêm sự kiện click vào nút "Reset"
resetButton.addEventListener('click', function() {
    document.location.reload(); // Tải lại trang để reset trò chơi
});

