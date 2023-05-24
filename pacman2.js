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
let enemies = []; // Array untuk musuh

// Inisialisasi tiga musuh dengan posisi dan kecepatan acak
for (let i = 0; i < 3; i++) {
  enemies.push({
    x: Math.random() * (canvas.width - 2 * enemy.radius) + enemy.radius,
    y: Math.random() * (canvas.height - 2 * enemy.radius) + enemy.radius,
    radius: 25,
    speed: 2,
    dx: 2,
    dy: 2,
  });
}

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
  context.fillStyle = "limegreen";
  context.fill();
  context.closePath();
  // Mendefinisikan audio elemen
  let eatSound = new Audio("eat.mp3"); // Ganti dengan path file audio yang sesuai

  function playEatSound() {
    eatSound.currentTime = 0; // Memulai ulang audio dari awal setiap kali diputar
    setTimeout(function () {
      eatSound.play();
    }, 100);
  }
  function playBeepSound() {
    // Bunyi beep
    const beepDataURI = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAA=";

    let beepSound = new Audio(beepDataURI);
    beepSound.play();
  }
  // // Menggambar musuh
  // for (let i = 0; i < enemies.length; i++) {
  //   context.beginPath();
  //   context.arc(enemies[i].x, enemies[i].y, enemies[i].radius, 0, 2 * Math.PI);
  //   context.fillStyle = "red";
  //   context.fill();
  //   context.closePath();
  // }
  // Menggambar musuh
  for (let i = 0; i < enemies.length; i++) {
    let enemyImage = new Image();
    enemyImage.src = "ghostpcman.png"; // Ganti dengan path gambar musuh yang sesuai
    context.drawImage(enemyImage, enemies[i].x - enemies[i].radius, enemies[i].y - enemies[i].radius, enemies[i].radius * 2, enemies[i].radius * 2);
  }
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
  /*
  Memeriksa interaksi dengan bola makanan:
  Bagian dibawah ini adalah bagian dari kode yang memeriksa interaksi antara Pac-Man dan bola makanan 
  dalam permainan.

  - `Math.sqrt(Math.pow(pacmanX - food.x, 2) + Math.pow(pacmanY - food.y, 2))` digunakan untuk 
  menghitung jarak antara posisi Pac-Man (`pacmanX`, `pacmanY`) dan posisi bola makanan 
  (`food.x`, `food.y`) menggunakan rumus jarak Euclidean.
  - Jika jarak antara Pac-Man dan bola makanan lebih kecil dari jumlah radius Pac-Man dan 
  bola makanan (`pacmanRadius * pacmanSize + food.radius`), berarti Pac-Man bersentuhan dengan 
  bola makanan dan interaksi terjadi.
  - Jika interaksi terjadi, maka langkah-langkah berikut dilakukan:
  - Skor (`score`) akan ditambah 10.
  - Ukuran Pac-Man (`pacmanSize`) akan diperbesar sebesar 10% (1.1 kali ukuran awal).
  - Bola makanan (`food`) akan ditempatkan di posisi acak baru di dalam canvas. `Math.random()
   * (canvas.width - 2 * food.radius) + food.radius` digunakan untuk menghasilkan koordinat x acak 
  di dalam canvas, sedangkan `Math.random() * (canvas.height - 2 * food.radius) + food.radius` 
  digunakan untuk menghasilkan koordinat y acak di dalam canvas.

  Dengan demikian, bagian tersebut bertanggung jawab untuk menangani interaksi antara Pac-Man 
  dan bola makanan, termasuk penambahan skor, perubahan ukuran Pac-Man, dan pemindahan posisi 
  bola makanan ke posisi acak baru setelah dimakan oleh Pac-Man. */
  if (Math.sqrt(Math.pow(pacmanX - food.x, 2) + Math.pow(pacmanY - food.y, 2)) < pacmanRadius * pacmanSize + food.radius) {
    score += 10; // Menambah skor
    pacmanSize += 0.01; // Membesarkan Pac-Man
    food.x = Math.random() * (canvas.width - 2 * food.radius) + food.radius; // Menempatkan bola makanan secara acak
    food.y = Math.random() * (canvas.height - 2 * food.radius) + food.radius;
    // playBeepSound();
  }

  // Memeriksa interaksi dengan musuh
  /*
  Bagian tersebut adalah bagian dari kode yang memeriksa interaksi antara Pac-Man dan musuh dalam 
  permainan.

  - Loop `for` digunakan untuk mengiterasi melalui setiap musuh yang ada dalam array `enemies`.
  - `Math.sqrt(Math.pow(pacmanX - enemies[i].x, 2) + Math.pow(pacmanY - enemies[i].y, 2))` digunakan 
    untuk menghitung jarak antara posisi Pac-Man (`pacmanX`, `pacmanY`) dan posisi musuh ke-i 
    (`enemies[i].x`, `enemies[i].y`) menggunakan rumus jarak Euclidean.
  - Jika jarak antara Pac-Man dan musuh ke-i lebih kecil dari jumlah radius Pac-Man dan radius musuh 
    (`pacmanRadius * pacmanSize + enemies[i].radius`), berarti Pac-Man bersentuhan dengan musuh dan 
    interaksi terjadi.
    - Jika interaksi terjadi, maka langkah-langkah berikut dilakukan:
   - Health (`health`) dikurangi sebanyak 10 poin.
   - Ukuran Pac-Man (`pacmanSize`) dikurangi sebesar 10% (0.1 kali ukuran awal), sehingga Pac-Man 
   akan mengecil.
   - Musuh ke-i (`enemies[i]`) akan ditempatkan di posisi acak baru di dalam canvas. `Math.random()
    * (canvas.width - 2 * enemies[i].radius) + enemies[i].radius` digunakan untuk menghasilkan koordinat x acak di dalam canvas, sedangkan `Math.random() * (canvas.height - 2 * enemies[i].radius) + enemies[i].radius` digunakan untuk menghasilkan koordinat y acak di dalam canvas.

  Dengan demikian, bagian tersebut bertanggung jawab untuk menangani interaksi antara Pac-Man dan musuh,
   termasuk pengurangan kesehatan, perubahan ukuran Pac-Man, dan pemindahan posisi musuh ke posisi 
   acak baru setelah bersentuhan dengan Pac-Man.

  */
  for (let i = 0; i < enemies.length; i++) {
    if (Math.sqrt(Math.pow(pacmanX - enemies[i].x, 2) + Math.pow(pacmanY - enemies[i].y, 2)) < pacmanRadius * pacmanSize + enemies[i].radius) {
      health -= 10; // Mengurangi health
      pacmanSize -= 0.1; // Mengecilkan Pac-Man
      enemies[i].x = Math.random() * (canvas.width - 2 * enemies[i].radius) + enemies[i].radius; // Menempatkan musuh secara acak
      enemies[i].y = Math.random() * (canvas.height - 2 * enemies[i].radius) + enemies[i].radius;
    }
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

  // Me-reset posisi musuh
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x = Math.random() * (canvas.width - 2 * enemies[i].radius) + enemies[i].radius;
    enemies[i].y = Math.random() * (canvas.height - 2 * enemies[i].radius) + enemies[i].radius;
  }
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
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x += enemies[i].dx;
    enemies[i].y += enemies[i].dy;
    // Memantulkan musuh saat mencapai batas-batas canvas
    if (enemies[i].x + enemies[i].radius > canvas.width || enemies[i].x - enemies[i].radius < 0) {
      enemies[i].dx *= -1;
    }
    if (enemies[i].y + enemies[i].radius > canvas.height || enemies[i].y - enemies[i].radius < 0) {
      enemies[i].dy *= -1;
    }
  }
}

// Menggambar dan menggerakkan elemen-elemen permainan secara terus menerus
function gameLoop() {
  drawPacman();
  movePacman();
  moveEnemies();

  requestAnimationFrame(gameLoop);
}

// Memulai permainan
gameLoop();
