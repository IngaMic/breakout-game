const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";

// Informations about the game status
const game = {
    status: "playing",
    score: 0,
    speed: 20,
    lives: 3,
};
//
// game board
const boardWidth = 600;
const boardHeight = 500;
const boardColor = "#dedbe3";
// paddle
const paddle = {
    position: { x: boardWidth - 200 / 2, y: boardHeight - 2 * 20 },
    size: { width: 100, height: 10 },
    movingRight: false,
    movingLeft: false,
    movement: 6,
};
// ball
const ball = {
    ballPositionX: 150,
    ballPositionY: 150,
    ballRadius: 12,
    ballColor: "#404057",
    movementX: 5,
    movementY: 5,
};

// brick information

const brick = {
    position: { x: 0, y: 0 },
    size: { width: 90, height: 10 },
    status: "active",
    color: "#373748",
};
const brickPadding = 10;
const rows = 6;
const columns = 6;
let activeBricks = rows * columns;
// create bricks and set position

const bricks = createBricks(brick, rows, columns);
//
for (var row = 0; row < rows; row++) {
    for (var column = 0; column < columns; column++) {
        bricks[column][row].position.x =
            (brick.size.width + brickPadding) * column + brickPadding / 2;
        bricks[column][row].position.y =
            (brick.size.height + brickPadding) * row + brickPadding / 2;
    }
}
// Functions
//
function BallWallCollision() {
    if (ball.ballPositionX + ball.ballRadius > boardWidth) {
        ball.movementX = -ball.movementX;
    } else if (ball.ballPositionX - ball.ballRadius < 0) {
        ball.movementX = -ball.movementX;
    } else if (ball.ballPositionY - ball.ballRadius < 0) {
        ball.movementY = -ball.movementY;
    } else if (ball.ballPositionY + ball.ballRadius > boardHeight) {
        showGameOver();
        game.status = "stopped";
    }
}
function ballBrickCollision() {
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            if (
                ball.ballPositionY + ball.ballRadius >
                    bricks[column][row].position.y &&
                ball.ballPositionY - ball.ballRadius <
                    bricks[column][row].position.y +
                        bricks[column][row].size.height &&
                ball.ballPositionX + ball.ballRadius >
                    bricks[column][row].position.x &&
                ball.ballPositionX - ball.ballRadius <
                    bricks[column][row].position.x +
                        bricks[column][row].size.width &&
                bricks[column][row].status === "active"
            ) {
                bricks[column][row].status = "broken";
                activeBricks -= 1;
                ball.movementY = -ball.movementY;
            }
        }
    }
}

function ballPaddleCollision() {
    if (
        ball.ballPositionY + ball.ballRadius > paddle.position.y &&
        ball.ballPositionY - ball.ballRadius <
            paddle.position.y + paddle.size.height &&
        ball.ballPositionX + ball.ballRadius > paddle.position.x &&
        ball.ballPositionX - ball.ballRadius <
            paddle.position.x + paddle.size.width
    ) {
        ball.movementY = -ball.movementY;
    }
}
function movePaddle() {
    if (paddle.movingLeft) {
        paddle.position.x -= paddle.movement;
    } else if (paddle.movingRight) {
        paddle.position.x += paddle.movement;
    }
}

function respawnBricks() {
    if (activeBricks === 0) {
        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                bricks[column][row].status = "active";
            }
        }
    }
    activeBricks = rows * columns;
}
function loop() {
    if (game.status === "playing") {
        ball.ballPositionX = ball.ballPositionX + ball.movementX;
        ball.ballPositionY = ball.ballPositionY + ball.movementY;
        BallWallCollision();
        ballPaddleCollision();
        ballBrickCollision();
        respawnBricks();
        movePaddle();
    }
}

function draw() {
    drawBoard(boardWidth, boardHeight, boardColor);
    drawCircle(
        ball.ballPositionX,
        ball.ballPositionY,
        ball.ballRadius,
        ball.ballColor
    );
    drawRect(
        paddle.position.x,
        paddle.position.y,
        paddle.size.width,
        paddle.size.height,
        "#231c24"
    );
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            if (bricks[column][row].status === "active") {
                drawRect(
                    bricks[column][row].position.x,
                    bricks[column][row].position.y,
                    bricks[column][row].size.width,
                    bricks[column][row].size.height,
                    bricks[column][row].color
                );
            }
        }
    }
}

function onKeyDown(keyCode) {
    if (keyCode === ARROW_LEFT) {
        paddle.movingLeft = true;
    } else if (keyCode === ARROW_RIGHT) {
        paddle.movingRight = true;
    }
}

function onKeyUp(keyCode) {
    if (keyCode === ARROW_LEFT) {
        paddle.movingLeft = false;
    } else if (keyCode === ARROW_RIGHT) {
        paddle.movingRight = false;
    }
}
