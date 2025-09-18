// 게임 변수
let paddle, ball, bricks = [], rows = 5, cols = 8, brickW, brickH, score = 0, gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.999);
  brickW = width / cols;
  brickH = height / 18;
  paddle = {
    w: width / 5,
    h: height / 40,
    x: width / 2 - width / 10,
    y: height - height / 15,
    speed: 12
  };
  ball = {
    r: width / 40,
    x: width / 2,
    y: height - height / 15 - width / 40,
    dx: random([-6, 6]),
    dy: -7
  };
  bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 핑크 계열 그라데이션
      let base = 220 + r * 7;
      let pink = color(base, 90 + c * 10, 150 + r * 10);
      bricks.push({
        x: c * brickW,
        y: r * brickH + 40,
        w: brickW - 4,
        h: brickH - 4,
        alive: true,
        color: pink
      });
    }
  }
  score = 0;
  gameOver = false;
  background(245, 200, 220); // 핑크 배경
}

function draw() {
  background(245, 200, 220); // 핑크 배경
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  if (!gameOver) {
    moveBall();
    checkCollisions();
  } else {
    drawGameOver();
  }
}

function drawBricks() {
  for (let b of bricks) {
    if (b.alive) {
      fill(b.color);
      stroke(255, 180, 220);
      strokeWeight(2);
      rect(b.x, b.y, b.w, b.h, 8);
    }
  }
  noStroke();
}

function drawPaddle() {
  fill(255, 120, 180);
  rect(paddle.x, paddle.y, paddle.w, paddle.h, 14);
}

function drawBall() {
  fill(255, 160, 210);
  stroke(255, 200, 230);
  strokeWeight(2);
  ellipse(ball.x, ball.y, ball.r * 2);
  noStroke();
}

function drawScore() {
  fill(220, 60, 120);
  textSize(22);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 12, 10);
}

function moveBall() {
  ball.x += ball.dx*0.8;
  ball.y += ball.dy*0.9;
}

function checkCollisions() {
  // 벽
  if (ball.x - ball.r < 0 || ball.x + ball.r > width) ball.dx *= -1;
  if (ball.y - ball.r < 0) ball.dy *= -1;
  // 패들
  if (
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y < paddle.y + paddle.h
  ) {
    ball.dy *= -1;
    // 패들 중앙에서 멀수록 각도 변화
    let hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    ball.dx = hitPos * 8;
    ball.y = paddle.y - ball.r;
  }
  // 벽돌
  for (let b of bricks) {
    if (b.alive &&
      ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
      b.alive = false;
      score++;
      // 충돌 방향
      let overlapL = ball.x + ball.r - b.x;
      let overlapR = b.x + b.w - (ball.x - ball.r);
      let overlapT = ball.y + ball.r - b.y;
      let overlapB = b.y + b.h - (ball.y - ball.r);
      let minOverlap = min(overlapL, overlapR, overlapT, overlapB);
      if (minOverlap === overlapL || minOverlap === overlapR) ball.dx *= -1;
      else ball.dy *= -1;
      break;
    }
  }
  // 바닥
  if (ball.y - ball.r > height) {
    gameOver = true;
  }
  // 클리어
  if (score === rows * cols) {
    gameOver = true;
  }
}

function drawGameOver() {
  fill(255, 80, 180);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(score === rows * cols ? 'CLEAR!' : 'GAME OVER', width / 2, height / 2 - 20);
  textSize(22);
  fill(220, 60, 120);
  text('Tap to Restart', width / 2, height / 2 + 30);
}

// 모바일 터치/마우스 이동
function touchMoved() {
  paddle.x = constrain(mouseX - paddle.w / 2, 0, width - paddle.w);
  return false;
}
function mouseMoved() {
  paddle.x = constrain(mouseX - paddle.w / 2, 0, width - paddle.w);
}

function touchStarted() {
  if (gameOver) setup();
}
function mousePressed() {
  if (gameOver) setup();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.7);
  setup();
}
