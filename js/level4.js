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
                const dx = ball.locationX - Math.max(brick.x, Math.min(ball.locationX, brick.x + brick.width));
                const dy = ball.locationY - Math.max(brick.y, Math.min(ball.locationY, brick.y + brick.height));
                if ((dx * dx + dy * dy) < (ball.size * ball.size)) {
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
        ball.speedX = -ball.speedX;
    }
    if (ball.locationY + ball.speedY < ball.size) {
        ball.speedY = -ball.speedY;
    } else if (ball.locationY + ball.speedY > canvas.height - paddle.paddleHeight) {
        if (ball.locationX > paddle.x && ball.locationX < paddle.x + paddle.paddleWidth) {
            const paddleCenter = paddle.x + paddle.paddleWidth / 2;
            const distance = ball.locationX - paddleCenter;
            const reflectionAngle = (distance / (paddle.paddleWidth / 2)) * (Math.PI / 4);
            const newSpeedX = ball.speedX * Math.cos(reflectionAngle) - ball.speedY * Math.sin(reflectionAngle);
            const newSpeedY = ball.speedX * Math.sin(reflectionAngle) + ball.speedY * Math.cos(reflectionAngle);
            ball.speedX = newSpeedX;
            ball.speedY = -newSpeedY;
        } else {
            // alert("GameOver");
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
    drawObstacle();
    checkCollisionWithObstacle(ball);
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
    let initialBallX = canvas.width / 2;
    let initialBallY = canvas.height - 40;
    ball = new Ball(8, initialBallX, initialBallY, 2, -2);

    paddle = new Paddle(canvas.width, 15, 50);

    bricks = createBricks(9, 5, 30, 30, colors, 40, 15, 30);
    // Khởi tạo lại vị trí ban đầu của chướng ngại vật
    obstacles.forEach((obstacle, index) => {
        obstacles[index].x = obstacleInitialPositions[index].x;
        obstacles[index].y = obstacleInitialPositions[index].y;
    });
    score = 0;
    draw();
}

let ball = new Ball(8, canvas.width / 2, canvas.height - 40, 2, -2);
let paddle = new Paddle(canvas.width, 15, 50);
let bricks = createBricks(9, 5, 30, 30, colors, 40, 15, 30);

document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.paddleWidth / 2;
    }
}

let brickMoveSpeed = 1;
moveBricks();

function moveBricks() {
    setInterval(function() {
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                bricks[c][r].x += brickMoveSpeed; // Di chuyển viên gạch sang phải
                // Nếu viên gạch đụng vào biên phải hoặc trái của canvas, đảo ngược hướng di chuyển
                if (bricks[c][r].x + bricks[c][r].width > canvas.width || bricks[c][r].x < 0) {
                    brickMoveSpeed = -brickMoveSpeed;
                }
            }
        }
    }, 100); // Cập nhật vị trí mỗi 100 miliseconds
}
moveObstacles();
// Khai báo và khởi tạo biến obstacleMoveSpeed
let obstacleMoveSpeed = 1;

// Hàm moveObstacles() di chuyển các chướng ngại vật
function moveObstacles() {
    setInterval(function() {
        for (let i = 0; i < obstacles.length; i++) {
            // Di chuyển chướng ngại vật sang trái hoặc phải
            obstacles[i].x -= obstacleMoveSpeed;

            // Nếu chướng ngại vật chạm vào biên phải hoặc trái của canvas, đảo ngược hướng di chuyển
            if (obstacles[i].x + obstacles[i].width > canvas.width || obstacles[i].x < 0) {
                obstacleMoveSpeed = -obstacleMoveSpeed;
            }
        }
    }, 100); // Cập nhật vị trí mỗi 100 miliseconds
}

setInterval(draw, 10);

const resetButton = document.getElementById('reset');

resetButton.addEventListener('click', function() {
    document.location.reload();
});
// Thêm chướng ngại vật
const obstacle = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 40,
    height: 40
};
const obstacles = [
    { x: 100, y: 250, width: 30, height: 30 },
    { x: 330, y: 250, width: 30, height: 30 },
    { x: 530, y: 250, width: 30, height: 30}
];

// Vẽ chướng ngại vật
function drawObstacle() {
    obstacles.forEach(obstacle => {
        // Vẽ hình chữ nhật đại diện cho vật cản
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.closePath();

        // Ghi chữ "boom" vào bên trong vật cản
        ctx.font = "14px Arial";
        ctx.fillStyle = "#FFFFFF"; // Màu chữ trắng
        ctx.textAlign = "center";
        ctx.fillText("Boom", obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2 + 6); // +6 để căn giữa theo chiều dọc
    });
}


// Kiểm tra va chạm với chướng ngại vật
function checkCollisionWithObstacle(ball) {
    obstacles.forEach(obstacle => {
        if (
            ball.locationX > obstacle.x &&
            ball.locationX < obstacle.x + obstacle.width &&
            ball.locationY > obstacle.y &&
            ball.locationY < obstacle.y + obstacle.height
        ) {

        }
    });
}

