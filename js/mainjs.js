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
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.paddleHeight, paddle.paddleWidth, paddle.paddleHeight);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}
function trackScore(score) {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 8, 24);
}

function checkWinCondition(score, rowCount, columnCount) {
    if (score === rowCount * columnCount) {
        result.textContent = 'You Win Mời bạn bấm play again để chơi lại';
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
                    checkWinCondition(score,bricks.length, bricks[c].length);
                    brickSound.play();
                }
            }
        }
    }
}

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
            gameOver = true;
            result.textContent = 'Game Over Mời bạn bấm Play Again để chơi lại';
        }
    }
    ball.locationX += ball.speedX;
    ball.locationY += ball.speedY;
}

let gameOver = false;
let score = 0;
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const ballSound = new Audio("sound/ball.mp3");
const brickSound = new Audio("sound/brick.mp3");
const rowCount = 5;
const columnCount = 11;
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
function resetGame(){
    let initialBallX = canvas.width / 2;
    let initialBallY = canvas.height - 40;
    ball = new Ball(9, initialBallX, initialBallY, 2, -2);
    paddle = new Paddle(canvas.width, 15, 72);
    bricks = createBricks(11, 5, 40, 24, colors, 54, 18, 1);
    score = 0;
    gameOver = false;
}

let intervalID, intervalDecreaseSize, intervalMoveObstacles, intervalMoveBricks;

function resetInterval() {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }
}
function resetInterval2() {
    if (intervalDecreaseSize) {
        clearInterval(intervalDecreaseSize);
        intervalDecreaseSize = null;
    }
}
function resetInterval3() {
    if (intervalMoveObstacles) {
        clearInterval(intervalMoveObstacles);
        intervalMoveObstacles = null;
    }
}
function resetInterval4() {
    if (intervalMoveBricks) {
        clearInterval(intervalMoveBricks);
        intervalMoveBricks = null;
    }
}
function selectLevel1(){
    resetGame();
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameOver) {
            drawBricks(bricks);
            drawBall(ball);
            drawPaddle(paddle);
            trackScore(score);
            hitDetection(bricks, ball);
            checkCollision(ball, paddle);
        }
    }
    intervalID = setInterval(draw, 10);
}
function selectLevel2(){
    resetGame();
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
    const minPaddleWidth = 20;
    const minBrickWidth = 10;
    const minBrickHeight = 5;
    const minBallSize = 5;
    function decreaseSize() {
        if (paddle.paddleWidth > minPaddleWidth) {
            paddle.paddleWidth -= 1;
        }
        bricks.forEach(column => {
            column.forEach(brick => {
                if (brick.width > minBrickWidth && brick.height > minBrickHeight) {
                    brick.width -= 1;
                    brick.height -= 0.5;
                    brick.padding -= 0.5;
                }
            });
        });
        if (ball.size > minBallSize) {
            ball.size -= 0.5;
        }
    }
    intervalDecreaseSize = setInterval(decreaseSize, 1000);
    const accelerationRate = 0.001;
    function increaseBallSpeed() {
        ball.speedX += ball.speedX * accelerationRate;
        ball.speedY += ball.speedY * accelerationRate;
    }
    function draw() {
        if (!gameOver) {
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
    }
    intervalID = setInterval(draw, 10);
}
function selectLevel3(){
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
    let initialBallX = canvas.width / 2;
    let initialBallY = canvas.height - 40;
    ball = new Ball(9, initialBallX, initialBallY, 2, -2);
    paddle = new Paddle(canvas.width, 15, 72);
    score = 0;
    let bricks = createBricks(9, 5, 30, 30, colors, 40, 15, 30);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    let lastPaddleX = paddle.x;
    function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            let paddleMove = relativeX - lastPaddleX;
            paddle.x = relativeX - paddle.paddleWidth / 2;
            for (let c = 0; c < bricks.length; c++) {
                for (let r = 0; r < bricks[c].length; r++) {
                    if (bricks[c][r].status === 1) {
                        bricks[c][r].x -= paddleMove;
                    }
                }
            }
            lastPaddleX = relativeX;
        }
    }
    function draw() {
        if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks(bricks);
        drawBall(ball);
        drawPaddle(paddle);
        hitDetection(bricks, ball);
        checkCollision(ball, paddle);
        checkWinCondition(score, rowCount, columnCount);
        trackScore(score);
    }
    }
    intervalID = setInterval(draw, 10);
}
function selectLevel4(){
    resetGame();
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
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
    function drawObstacle() {
        obstacles.forEach(obstacle => {
            ctx.beginPath();
            ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();
            ctx.font = "14px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText("Boom", obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2 + 6); // +6 để căn giữa theo chiều dọc
        });
    }
    function checkCollisionWithObstacle(ball) {
        obstacles.forEach(obstacle => {
            if (
                ball.locationX > obstacle.x &&
                ball.locationX < obstacle.x + obstacle.width &&
                ball.locationY > obstacle.y &&
                ball.locationY < obstacle.y + obstacle.height
            ) {
                gameOver = true;
                result.textContent = 'Game Over Mời bạn bấm Play Again để chơi lại';
            }
        });
    }
    let brickMoveSpeed = 1;
    moveBricks();
    function moveBricks() {
        intervalMoveBricks = setInterval(function() {
            for (let c = 0; c < bricks.length; c++) {
                for (let r = 0; r < bricks[c].length; r++) {
                    bricks[c][r].x += brickMoveSpeed; // Di chuyển viên gạch sang phải
                    // Nếu viên gạch đụng vào biên phải hoặc trái của canvas, đảo ngược hướng di chuyển
                    if (bricks[c][r].x + bricks[c][r].width > canvas.width || bricks[c][r].x < 0) {
                        brickMoveSpeed = -brickMoveSpeed;
                    }
                }
            }
        }, 100);
    }
    moveObstacles();
    let obstacleMoveSpeed = 1;
    function moveObstacles() {
        intervalMoveObstacles = setInterval(function() {
            for (let i = 0; i < obstacles.length; i++) {
                // Di chuyển chướng ngại vật sang trái hoặc phải
                obstacles[i].x -= obstacleMoveSpeed;
                // Nếu chướng ngại vật chạm vào biên phải hoặc trái của canvas, đảo ngược hướng di chuyển
                if (obstacles[i].x + obstacles[i].width > canvas.width || obstacles[i].x < 0) {
                    obstacleMoveSpeed = -obstacleMoveSpeed;
                }
            }
        }, 100);
    }
    function trackScore2(score) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + score, 40, 30);
    }
    function draw() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks(bricks);
            drawBall(ball);
            drawPaddle(paddle);
            hitDetection(bricks, ball);
            checkCollision(ball, paddle);
            checkWinCondition(score, rowCount, columnCount);
            trackScore2(score);
            drawObstacle();
            checkCollisionWithObstacle(ball);
        }
    }
    intervalID = setInterval(draw, 10);
}
function selectLevel5(){
    resetGame();
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
    class Obstacle {
        constructor(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();
            ctx.font = "14px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText("Boom", this.x + this.width / 2, this.y + this.height / 2 + 6);
        }

        update() {
            this.y += this.speed;
            this.draw();
        }
        isCollidingWithPaddle(paddle) {
            return this.x < paddle.x + paddle.paddleWidth &&
                this.x + this.width > paddle.x &&
                this.y < canvas.height - paddle.paddleHeight &&
                this.y + this.height > canvas.height - paddle.paddleHeight;
        }
        isOutOfCanvas() {
            return this.y > canvas.height;
        }
    }

    let obstacles = [];

    function createObstacle(x, y, width, height, speed) {
        let obstacle = new Obstacle(x, y, width, height, speed);
        obstacles.push(obstacle);
    }

    function moveObstacles() {
        obstacles.forEach((obstacle, index) => {
            obstacle.update();
            if (obstacle.isCollidingWithPaddle(paddle)) {
                gameOver = true;
                result.textContent = 'Game Over';
            }
            if (obstacle.isOutOfCanvas()) {
                obstacles.splice(index, 1); // Xóa obstacle nếu vượt ra khỏi canvas
            }
        });
    }

    function hitDetection(bricks) {
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
                        createObstacle(brick.x, brick.y, 40, 40, 1); // Tạo ra obstacle khi gạch biến mất
                        brick.status = 0;
                        score++;
                        checkWinnerLevel1(score);
                        brickSound.play();
                    }
                }
            }
        }
    }
    function trackScore2(score) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + score, 40, 30);
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameOver) {
            drawBricks(bricks);
            drawBall(ball);
            drawPaddle(paddle);
            hitDetection(bricks);
            moveObstacles();
            checkCollision(ball, paddle);
            checkWinCondition(score, rowCount, columnCount);
            trackScore2(score);
        } else {
            clearInterval(interval);
        }
    }
    intervalID =  setInterval(draw, 10);
}
function selectLevel6() {
    resetGame();
    resetInterval();
    resetInterval2();
    resetInterval3();
    resetInterval4();
    const obstacle = {
        x: canvas.width / 2 - 25,
        y: canvas.height / 2 - 25,
        width: 40,
        height: 40
    };
    const obstacles = [
        { x: 100, y: 250, width: 65, height: 65},
        { x: 330, y: 250, width: 65, height: 65},
        { x: 530, y: 250, width: 65, height: 65}
    ];
    function drawObstacle() {
        obstacles.forEach(obstacle => {
            ctx.beginPath();
            ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();
            ctx.font = "14px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(" Black Hole", obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2 + 6); // +6 để căn giữa theo chiều dọc
        });
    }
    function checkCollisionWithObstacle(ball) {
        obstacles.forEach((obstacle, index) => {
            if (
                ball.locationX > obstacle.x &&
                ball.locationX < obstacle.x + obstacle.width &&
                ball.locationY > obstacle.y &&
                ball.locationY < obstacle.y + obstacle.height
            ) {
                ball.locationX = Math.random() * canvas.width;
                ball.locationY = Math.random() * canvas.height;
            }
        });
    }
    function trackScore2(score) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + score, 40, 30);
    }
    function draw() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks(bricks);
            drawBall(ball);
            drawPaddle(paddle);
            hitDetection(bricks, ball);
            checkCollision(ball, paddle);
            checkWinCondition(score, rowCount, columnCount);
            trackScore2(score);
            drawObstacle();
            checkCollisionWithObstacle(ball);
        }
    }
    intervalID = setInterval(draw, 10);
}

const resetButton = document.getElementById('reset');
const result = document.getElementById('result-h3');
const playAgain = document.getElementById('play-again');

playAgain.addEventListener('click', function() {
    document.location.reload();
});
resetButton.addEventListener('click', function() {
    document.location.reload();
});
document.getElementById("level1").addEventListener("click", function() {
    selectLevel1();
    result.textContent = 'Level 1';
});
document.getElementById("level2").addEventListener("click", function() {
    selectLevel2();
    result.textContent = 'Level 2';
});
document.getElementById("level3").addEventListener("click", function() {
    selectLevel3();
    result.textContent = 'Level 3';
});
document.getElementById("level4").addEventListener("click", function() {
    selectLevel4();
    result.textContent = 'Level 4';
});
document.getElementById("level5").addEventListener("click", function() {
    selectLevel5();
    result.textContent = 'Level 5';
});
document.getElementById("level6").addEventListener("click", function() {
    selectLevel6();
    result.textContent = 'Level 6';
});
