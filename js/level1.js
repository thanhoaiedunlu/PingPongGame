//21130360 Nguyen Thanh Hoai 09676611695
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
        result.textContent = 'You Win';
        document.location.reload();
    }
}

function checkWinnerLevel1(score){
    if (score === 10) {
        result.textContent = 'You Win';

    }
}

// function hitDetection(bricks, ball) {
//     for (let c = 0; c < bricks.length; c++) {
//         for (let r = 0; r < bricks[c].length; r++) {
//             const brick = bricks[c][r];
//             if (brick.status === 1) {
//                 const dx = ball.locationX - Math.max(brick.x, Math.min(ball.locationX, brick.x + brick.width));
//                 const dy = ball.locationY - Math.max(brick.y, Math.min(ball.locationY, brick.y + brick.height));
//                 if ((dx * dx + dy * dy) < (ball.size * ball.size)) {
//                     // Xác định hướng va chạm
//                     if (Math.abs(dx) > Math.abs(dy)) {
//                         ball.speedX = -ball.speedX;
//                     } else {
//                         ball.speedY = -ball.speedY;
//                     }
//                     brick.status = 0;
//                     score++;
//                     checkWinnerLevel1(score);
//                     brickSound.play();
//                 }
//             }
//         }
//     }
// }

function checkCollision(ball, paddle) {
    if (ball.locationX + ball.speedX > canvas.width - ball.size || ball.locationX + ball.speedX < ball.size) {
        ball.speedX = -ball.speedX; // Đảo ngược hướng di chuyển theo trục X
        ballSound.play();
    }
    if (ball.locationY + ball.speedY < ball.size) {
        ball.speedY = -ball.speedY; // Đảo ngược hướng di chuyển theo trục Y
        ballSound.play();
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
            ballSound.play();
        } else {
            gameOver = true; // Trò chơi kết thúc
            result.textContent = 'Game Over'; // Hiển thị thông báo "Game Over"
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
let gameOver = false;
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     if (!gameOver) { // Nếu trò chơi chưa kết thúc
//         drawBricks(bricks);
//         drawBall(ball);
//         drawPaddle(paddle);
//         hitDetection(bricks, ball);
//         checkCollision(ball, paddle);
//         checkWinCondition(score, rowCount, columnCount);
//         trackScore(score);
//     } else {
//         clearInterval(interval);
//     }
// }
class FallingBall {
    constructor(x, y, speedY, size) {
        this.x = x;
        this.y = y;
        this.speedY = speedY;
        this.size = size;
    }
}

let fallingBalls = [];

function createFallingBall(x, y) {
    let ball = new FallingBall(x, y, 1, 5);
    fallingBalls.push(ball);
}

function moveFallingBalls() {
    fallingBalls.forEach(ball => {
        ball.y += ball.speedY;
        drawBall(ball);
        // Kiểm tra xem quả bóng có chạm vào paddle hay không
        if (ball.y + ball.size > canvas.height - paddle.paddleHeight) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.paddleWidth) {
                gameOver = true;
                result.textContent = 'Game Over';
            }
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameOver) {
        drawBricks(bricks);
        drawBall(ball);
        drawPaddle(paddle);
        hitDetection(bricks, ball);
        moveFallingBalls();
        checkCollision(ball, paddle);
        checkWinCondition(score, rowCount, columnCount);
        trackScore(score);
    } else {
        clearInterval(interval);
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
                    if (Math.abs(dx) > Math.abs(dy)) {
                        ball.speedX = -ball.speedX;
                    } else {
                        ball.speedY = -ball.speedY;
                    }
                    createFallingBall(brick.x, brick.y); // Tạo ra quả bóng rơi xuống khi gạch phá vỡ
                    brick.status = 0;
                    score++;
                    checkWinnerLevel1(score);
                    brickSound.play();
                }
            }
        }
    }
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
    '#5c5c5c',
    '#ff6969',
    '#a5d296',
    '#4cbbb9',
    '#7aa5d2',
    '#be86e3'
];
const ballSound = new Audio("sound/ball.mp3");
const brickSound = new Audio("sound/brick.mp3");
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let score = 0; // Điểm số ban đầu
const rowCount = 5; // Số lượng hàng gạch
const columnCount = 11; // Số lượng cột gạch
let ball = new Ball(9, canvas.width / 2, canvas.height - 40, 2, -2);
let paddle = new Paddle(canvas.width, 15, 72);
let bricks = createBricks(columnCount, rowCount, 40, 24, colors, 54, 18, 1);
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.paddleWidth / 2;
    }
}
// Lấy thẻ button có id là "reset"
const resetButton = document.getElementById('reset');
const result = document.getElementById('result-h3');
const playAgain = document.getElementById('play-again');
// Thêm sự kiện click vào nút "Reset"
resetButton.addEventListener('click', function() {
    document.location.reload();
});
playAgain.addEventListener('click', function() {
    document.location.reload();
});
setInterval(draw, 10);
class FallingBall {
    constructor(x, y, speedY, size) {
        this.x = x;
        this.y = y;
        this.speedY = speedY;
        this.size = size;
    }
}

let fallingBalls = [];

function createFallingBall(x, y) {
    let ball = new FallingBall(x, y, 1, 5);
    fallingBalls.push(ball);
}

function moveFallingBalls() {
    fallingBalls.forEach(ball => {
        ball.y += ball.speedY;
        drawBall(ball);
        // Kiểm tra xem quả bóng có chạm vào paddle hay không
        if (ball.y + ball.size > canvas.height - paddle.paddleHeight) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.paddleWidth) {
                gameOver = true;
                result.textContent = 'Game Over';
            }
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameOver) {
        drawBricks(bricks);
        drawBall(ball);
        drawPaddle(paddle);
        hitDetection(bricks, ball);
        moveFallingBalls();
        checkCollision(ball, paddle);
        checkWinCondition(score, rowCount, columnCount);
        trackScore(score);
    } else {
        clearInterval(interval);
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
                    if (Math.abs(dx) > Math.abs(dy)) {
                        ball.speedX = -ball.speedX;
                    } else {
                        ball.speedY = -ball.speedY;
                    }
                    createFallingBall(brick.x, brick.y); // Tạo ra quả bóng rơi xuống khi gạch phá vỡ
                    brick.status = 0;
                    score++;
                    checkWinnerLevel1(score);
                    brickSound.play();
                }
            }
        }
    }
}
