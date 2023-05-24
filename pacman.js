let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let pacmanX = 200; // Koordinat awal Pac-Man
let pacmanY = 200;
let pacmanRadius = 20;
let pacmanMouth = 0;
let pacmanSize = 1; // Ukuran awal Pac-Man
let direction = null;
let score = 0; // Skor awal
let health = 100; // Health awal

let food = {
  x: 100,
  y: 100,
  radius: 10,
};

let enemy = {
  x: 300,
  y: 300,
  radius: 15,
  speed: 2,
  dx: 2,
  dy: 2,
};

function drawPacman() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Menghapus canvas sebelum menggambar ulang

  // Menggambar Pac-Man
  context.beginPath();
  context.arc(pacmanX, pacmanY, pacmanRadius * pacmanSize, pacmanMouth, pacmanMouth + 2 * Math.PI);
  context.lineTo(pacmanX, pacmanY);
  context.fillStyle = "yellow";
  context.fill();
  context.closePath();
  context.stroke();

  // Menggambar bola makanan
  context.beginPath();
  context.arc(food.x, food.y, food.radius, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();
  context.closePath();

  // Menggambar musuh
  context.beginPath();
  context.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
  context.closePath();
}

function movePacman() {
  let nextX = pacmanX;
  let nextY = pacmanY;

  if (direction === "left") {
    nextX -= 5;
  } else if (direction === "right") {
    nextX += 5;
  } else if (direction === "up") {
    nextY -= 5;
  } else if (direction === "down") {
    nextY += 5;
  }

  // Memeriksa batas-batas lingkaran
  if (nextX - pacmanRadius * pacmanSize > 0 && nextX + pacmanRadius * pacmanSize < canvas.width) {
    pacmanX = nextX;
  }
  if (nextY - pacmanRadius * pacmanSize > 0 && nextY + pacmanRadius * pacmanSize < canvas.height) {
    pacmanY = nextY;
  }

  // Memeriksa interaksi dengan bola makanan
  if (Math.sqrt(Math.pow(pacmanX - food.x, 2) + Math.pow(pacmanY - food.y, 2)) < pacmanRadius * pacmanSize + food.radius) {
    score += 10; // Menambah skor
    pacmanSize += 0.1; // Membesarkan Pac-Man
    food.x = Math.random() * (canvas.width - 2 * food.radius) + food.radius; // Menempatkan bola makanan secara acak
    food.y = Math.random() * (canvas.height - 2 * food.radius) + food.radius;
  }

  // Memeriksa interaksi dengan musuh
  if (Math.sqrt(Math.pow(pacmanX - enemy.x, 2) + Math.pow(pacmanY - enemy.y, 2)) < pacmanRadius * pacmanSize + enemy.radius) {
    health -= 10; // Mengurangi health
    pacmanSize -= 0.1; // Mengecilkan Pac-Man
    enemy.x = Math.random() * (canvas.width - 2 * enemy.radius) + enemy.radius; // Menempatkan musuh secara acak
    enemy.y = Math.random() * (canvas.height - 2 * enemy.radius) + enemy.radius;
  }

  // Memeriksa status kesehatan
  if (health <= 0) {
    gameOver();
  }

  // Mengatur mulut Pac-Man terbuka dan tertutup secara bergantian
  pacmanMouth += 0.1;
  if (pacmanMouth >= 0.4) {
    pacmanMouth = 0;
  }

  drawPacman();

  // Memperbarui informasi layar skor dan kesehatan
  document.getElementById("score").innerText = "Skor: " + score;
  document.getElementById("health").innerText = "Kesehatan: " + health + "%";
}

function gameOver() {
  // Menampilkan pesan game over dan skor
  alert("Game Over\nSkor: " + score);
  resetGame();
}

function resetGame() {
  pacmanX = 200;
  pacmanY = 200;
  pacmanSize = 1;
  direction = null;
  score = 0;
  health = 100;
  enemy.x = Math.random() * (canvas.width - 2 * enemy.radius) + enemy.radius;
  enemy.y = Math.random() * (canvas.height - 2 * enemy.radius) + enemy.radius;
}

// Event listener untuk tombol panah pada keyboard
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  }
});

// Menggerakkan musuh
function moveEnemy() {
  enemy.x += enemy.dx;
  enemy.y += enemy.dy;

  // Memantulkan musuh saat mencapai batas-batas canvas
  if (enemy.x + enemy.radius > canvas.width || enemy.x - enemy.radius < 0) {
    enemy.dx *= -1;
  }
  if (enemy.y + enemy.radius > canvas.height || enemy.y - enemy.radius < 0) {
    enemy.dy *= -1;
  }
}

// Menggambar dan menggerakkan elemen-elemen permainan secara terus menerus
function gameLoop() {
  drawPacman();
  movePacman();
  moveEnemy();

  requestAnimationFrame(gameLoop);
}

// Memulai permainan
gameLoop();
