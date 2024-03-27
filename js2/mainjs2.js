// 21130360 Nguyen Thanh Hoai 0367611695 DH21DTB
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

class Ball {
    // Size là kích thước của quả bóng,
    // locationX vị trí của bóng trên trục X, locationY vị trí của quả bóng trên trục Y,
    // speedX tốc độ di chuyển của bóng trên trục X, speedY tốc độ của bóng trên trục Y
    constructor(size, locationX, locationY, speedX, speedY) {
        this.size = size;
        this.locationX = locationX;
        this.locationY = locationY;
        this.speedX = speedX;
        this.speedY = speedY;
    }
}

class Brick {
    //x tọa độ x của viên gạch, y  tọa độ y của viên gạch,
    // status là trạng thái của viên gạch, color là màu, score là điểm số của gạch
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
    //canvasWidth chiều dài của canvas, paddleHeight độ dày của thanh, paddleWidth chiều dài của thanh
    constructor(canvasWidth, paddleHeight, paddleWidth) {
        this.paddleHeight = paddleHeight;
        this.paddleWidth = paddleWidth;
        this.x = (canvasWidth - paddleWidth) / 2;
    }
}

// Khởi tạo mảng gạch gồm numColumn số lượng cột gạch, numRows số lượng hàng gạch, width độ rộng của mỗi viên gạch,
// height  độ cao của mỗi viên gạch, padding khoảng cách của mỗi viên gạch, topOffset khoảng cách từ trên cùng của màn hình đến hàng gạch đầu tiên
// leftOffset khoảng cách từ mép trái của màn hình đến cột gạch đầu tiên, colors mảng chứa các màu sắc
function createBricks(numColumns, numRows, topOffset, leftOffset, colors, brickWidth, brickHeight, brickPadding) {
    let bricks = [];
    // Lặp qua mỗi cột của ma trận gạch
    for (let c = 0; c < numColumns; c++) {
        bricks[c] = [];
        // Lặp qua mỗi hàng của ma trận gạch
        for (let r = 0; r < numRows; r++) {
            bricks[c][r] = new Brick(
                c * (brickWidth + brickPadding) + leftOffset, // Tọa độ x của viên gạch
                r * (brickHeight + brickPadding) + topOffset, // Tọa độ y của viên gạch
                1, // Trạng thái
                colors[r % colors.length], // Màu
                0, // Điểm số
                brickWidth, // Độ rộng của viên gạch
                brickHeight, // Độ cao của viên gạch
                brickPadding // Khoảng cách giữa các viên gạch
            );
        }
    }
    return bricks;
}

// Vẽ các viên gạch
function drawBricks(bricks) {
    // Lặp qua mỗi cột của ma trận gạch
    for (let c = 0; c < bricks.length; c++) {
        // Lặp qua mỗi hàng của ma trận gạch
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status === 1) { // Kiểm tra nếu trạng thái là 1 (viên gạch chưa bị phá)
                let brickX = bricks[c][r].x; // Lấy tọa độ x và y
                let brickY = bricks[c][r].y;
                ctx.beginPath();
                ctx.rect(brickX, brickY, bricks[c][r].width, bricks[c][r].height); // Vẽ hình chữ nhật
                ctx.fillStyle = bricks[c][r].color; // Đặt màu sắc
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Hàm vẽ quả bóng
function drawBall(ball) {
    ctx.beginPath(); // Bắt đầu một đường vẽ mới
    ctx.arc(ball.locationX, ball.locationY, ball.size, 0, Math.PI * 2); // Vẽ quả bóng
    ctx.fillStyle = "#333"; // Đặt màu cho quả bóng
    ctx.fill(); // Điền màu vào hình dạng của quả bóng
    ctx.closePath(); // Kết thúc đường vẽ
}

// Hàm vẽ thanh chắn
function drawPaddle(paddle) {
    ctx.beginPath(); // Bắt đầu một đường vẽ mới
    ctx.rect(paddle.x, canvas.height - paddle.paddleHeight, paddle.paddleWidth, paddle.paddleHeight); // Vẽ thanh điều khiển
    ctx.fillStyle = "#333"; // Đặt màu cho thanh điều khiển
    ctx.fill(); // Điền màu vào hình dạng của thanh điều khiển
    ctx.closePath(); // Kết thúc đường vẽ
}

// Hàm kiểm tra điều kiện chiến thắng
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
    // Kiểm tra va chạm với các biên ngang
    if (ball.locationX + ball.speedX > canvas.width - ball.size || ball.locationX + ball.speedX < ball.size) {
        ball.speedX = -ball.speedX;
    }

    // Kiểm tra va chạm với biên trên
    if (ball.locationY + ball.speedY < ball.size) {
        ball.speedY = -ball.speedY;
    }

    // Kiểm tra va chạm với biên dưới và thanh điều khiển
    else if (ball.locationY + ball.speedY > canvas.height - ball.size) {
        if (ball.locationX > paddle.x && ball.locationX < paddle.x + paddle.paddleWidth) {
            ball.speedY = -ball.speedY;
        } else {
            alert('Game over');
            document.location.reload();
        }
    }

    // Cập nhật vị trí mới của quả bóng
    ball.locationX += ball.speedX;
    ball.locationY += ball.speedY;
}

function init() {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let ball = new Ball(9, canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
        canvas.height - 40, 2, -2);
    let paddle = new Paddle(canvas.width, 15, 72);
    let bricks = createBricks(9, 5, 40, 33, colors, 54, 18, 12);
    drawBricks(bricks);
    drawBall(ball);
    drawPaddle(paddle);


}

setInterval(init, 10);
