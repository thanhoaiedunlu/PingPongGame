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
                if (
                    ball.locationX > brick.x - ball.size &&
                    ball.locationX < brick.x + brick.width + ball.size &&
                    ball.locationY > brick.y - ball.size &&
                    ball.locationY < brick.y + brick.height + ball.size
                ) {
                    const collisionLeft = brick.x;
                    const collisionRight = brick.x + brick.width;
                    const collisionUp = brick.y - ball.size;
                    const collisionDown = brick.y + brick.height;
                    let collision = null;
                    if (ball.locationX >= collisionLeft && ball.locationX <= collisionRight && ball.locationY > collisionDown)
                        collision = 'down';
                    if (ball.locationX >= collisionLeft && ball.locationX <= collisionRight && ball.locationY < collisionUp)
                        collision = 'up';
                    if (ball.locationY >= collisionUp && ball.locationY <= collisionDown && ball.locationX < collisionLeft)
                        collision = 'left';
                    if (ball.locationY >= collisionUp && ball.locationY <= collisionDown && ball.locationX > collisionRight)
                        collision = 'right';
                    if (['down', 'up'].includes(collision))
                        ball.speedY = -ball.speedY;
                    if (['left', 'right'].includes(collision))
                        ball.speedX = -ball.speedX;
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
        ball.speedX = -ball.speedX;
    }

    if (ball.locationY + ball.speedY < ball.size) {
        ball.speedY = -ball.speedY;
    } else if (ball.locationY + ball.speedY > canvas.height - ball.size) {
        if (ball.locationX > paddle.x && ball.locationX < paddle.x + paddle.paddleWidth) {
            ball.speedY = -ball.speedY;
        } else {
            alert("GameOver")
            resetGame();
        }
    }

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
let paddle = new Paddle(canvas.width, 15, 72);
let bricks = createBricks(11, 5, 40, 24, colors, 54, 18, 1);
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
let isPaused = false; // Biến để kiểm tra xem trò chơi có đang ở trạng thái pause hay không
