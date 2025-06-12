const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_MARGIN = 16;
const PLAYER_COLOR = "#00FFAA";
const AI_COLOR = "#FF4081";
const BALL_COLOR = "#FFD700";
const NET_COLOR = "#666";

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballVY = 4 * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw net
function drawNet() {
    ctx.fillStyle = NET_COLOR;
    const segLen = 18, gap = 12;
    for (let y = 0; y < canvas.height; y += segLen + gap) {
        ctx.fillRect(canvas.width / 2 - 2, y, 4, segLen);
    }
}

// Draw paddles
function drawPaddle(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Draw ball
function drawBall(x, y) {
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(x, y, BALL_SIZE, BALL_SIZE);
}

// Draw scores
function drawScores() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 4, 48);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 48);
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballVY = 4 * (Math.random() * 2 - 1);
}

// Simple AI for right paddle
function updateAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 12) {
        aiY += 4.2;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 12) {
        aiY -= 4.2;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball collisions and movement
function updateBall() {
    ballX += ballVX;
    ballY += ballVY;

    // Top/bottom wall
    if (ballY < 0) {
        ballY = 0;
        ballVY = -ballVY;
    }
    if (ballY > canvas.height - BALL_SIZE) {
        ballY = canvas.height - BALL_SIZE;
        ballVY = -ballVY;
    }

    // Left paddle collision (player)
    if (
        ballX < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballVX = -ballVX * 1.05;
        // Add some vertical speed based on where it hits the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballVY += collidePoint * 0.15;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE > canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballVX = -ballVX * 1.05;
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballVY += collidePoint * 0.15;
    }

    // Out of bounds: left or right
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX > canvas.width - BALL_SIZE) {
        playerScore++;
        resetBall();
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawScores();
    drawPaddle(PADDLE_MARGIN, playerY, PLAYER_COLOR);
    drawPaddle(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, AI_COLOR);
    drawBall(ballX, ballY);

    updateAI();
    updateBall();

    requestAnimationFrame(gameLoop);
}

// Start
resetBall();
gameLoop();
