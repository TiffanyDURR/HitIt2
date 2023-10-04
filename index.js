let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 580;
canvas.height = 680;
let scoreInfoDiv = document.querySelector(".score-info");
let hitScoreDiv = document.querySelector(".hit-score");
let comboScoreDiv = document.querySelector(".combo-score");
let gameOver = false;
let intervalId;
let isPaused = false;
let points = 0;
let multiplier = 1;
let combo = 0;
let comboArray = [];
let score = 0;
let level = 1;
let indice;

let lives = 30;
let speed = 6;
let cadence = 400;

let image1 = new Image();
image1.src = "assets/c1.png";
let image2 = new Image();
image2.src = "assets/c1.png";
let image3 = new Image();
image3.src = "assets/c1.png";
let image4 = new Image();
image4.src = "assets/c1.png";

let keys = {
  q: { x: canvas.width * 0.15, y: canvas.height - 110, image: image1 },
  s: { x: canvas.width * 0.35, y: canvas.height - 110, image: image2 },
  l: { x: canvas.width * 0.55, y: canvas.height - 110, image: image3 },
  m: { x: canvas.width * 0.75, y: canvas.height - 110, image: image4 },
};

function createCircle(key) {
  return { key: key, y: -50 };
}

function startGame() {
  intervalId = setInterval(function () {
    let keysArray = Object.keys(keys);
    for (let i = 0; i < 1; i++) {
      let randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
      circles.push(createCircle(randomKey));
    }
  }, cadence);
}

startGame();

function pauseGame() {
  clearInterval(intervalId);
}

window.addEventListener("keydown", function (event) {
  if (event.key === "p") {
    if (isPaused) {
      isPaused = false;
      startGame();
    } else {
      isPaused = true;
      pauseGame();
    }
  }
});

function draw() {
  if (!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let key in keys) {
      let hitzone = keys[key];
      ctx.fillStyle = "blue";
      ctx.fillRect(hitzone.x, hitzone.y, 110, 110);
    }

    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      let keyInfo = keys[circle.key];
      circle.y += speed;
      ctx.beginPath();
      ctx.arc(keyInfo.x + 55, circle.y, 25, 0, Math.PI * 2);
      ctx.drawImage(keyInfo.image, keyInfo.x + 55 - 25, circle.y - 25, 50, 50);

      if (circle.y > canvas.height) {
        // Fail
        combo = 0;
        points = 0;
        multiplier = 1;
        score += 0;
        lives--;
        updateLives();
        displayinfos();
        circles.splice(i, 1);
        i--;
      }
    }
  }
  requestAnimationFrame(draw);
}

let circles = [];
function createCircle(key, time) {
  return { key: key, y: -50, time: time };
}

draw();

function animateHit(key) {
  let hitzone = keys[key];
  let start = Date.now();

  function frame() {
    let progress = (Date.now() - start) / 400;
    let scale = progress < 0.5 ? 1 + progress * 0.4 : 1 - progress;
    let opacity = 1 - progress;

    ctx.save();
    ctx.translate(hitzone.x + 55, hitzone.y + 55);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    ctx.shadowBlur = progress < 0.5 ? progress * 10 : (1 - progress) * 10;
    ctx.shadowColor = "#ec0853";

    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fillStyle = hitzone.color;
    ctx.fill();

    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

window.addEventListener("keydown", function (event) {
  let hit = false;
  if (keys[event.key]) {
    for (let i = circles.length - 1; i >= 0; i--) {
      let circle = circles[i];
      if (
        circle.key === event.key &&
        circle.y >= keys[event.key].y &&
        circle.y <= keys[event.key].y + 110
      ) {
        hit = true;
        let distance = Math.abs(circle.y - (keys[event.key].y + 55));

        if (distance === 0) {
          points = 50;
        } else if (distance <= 5) {
          points = 15;
        } else if (distance <= 15) {
          points = 10;
        } else if (distance <= 30) {
          points = 5;
        } else if (distance <= 55) {
          points = 1;
        }
        win();
        circles.splice(i, 1);
        animateHit(event.key);
        return;
      }
    }

    if (!hit) {
      // Loupé
      fail();
    }
  }
});

function win() {
  combo++;
  if (combo >= 4000) multiplier = 250;
  else if (combo >= 3000) multiplier = 100;
  else if (combo >= 2000) multiplier = 50;
  else if (combo >= 1000) multiplier = 30;
  else if (combo >= 900) multiplier = 14;
  else if (combo >= 800) multiplier = 13;
  else if (combo >= 700) multiplier = 12;
  else if (combo >= 600) multiplier = 11;
  else if (combo >= 500) multiplier = 10;
  else if (combo >= 400) multiplier = 4;
  else if (combo >= 300) multiplier = 5;
  else if (combo >= 200) multiplier = 4;
  else if (combo >= 100) multiplier = 3;
  else if (combo >= 50) multiplier = 2;
  if (combo >= 5000) multiplier = 500;
  points *= multiplier;
  score += points;
  comboArray.push(combo);
  displayinfos();
}

function saveGame() {
  let games = JSON.parse(localStorage.getItem("games")) || [];
  let maxCombo = comboArray.length > 0 ? Math.max(...comboArray) : 0;
  games.push({ score: score, combo: maxCombo });
  games.sort((a, b) => b.score - a.score);
  games = games.slice(0, 20);
  localStorage.setItem("games", JSON.stringify(games));
  comboArray = [];
}

window.onload = function () {
  let games = JSON.parse(localStorage.getItem("games")) || [];
  for (let i = 0; i < games.length; i++) {
    scoreInfoDiv.innerHTML += `<div>${i + 1}</div>`;
    hitScoreDiv.innerHTML += `<div>${games[i].score}</div>`;
    comboScoreDiv.innerHTML += `<div>${games[i].combo}</div>`;
  }
};

function gameLoop() {
  if (lives > 0) {
    updateGame();
    requestAnimationFrame(gameLoop);
    levels();
  } else {
    saveGame();
    updateGame();
    pauseGame();
    console.log("End Game");
  }
}

function updateGame() {
  if (lives <= 0) {
    pauseGame();
    return;
  }
}

requestAnimationFrame(gameLoop);

function fail() {
  combo = 0;
  points = 0;
  multiplier = 1;
  score += 0;
  lives--;
  updateLives();
  displayinfos();
}

function levels() {
  if (score < 500) {
    speed = 6;
    cadence = 400;
    level = 1;
  } else if (score < 3000) {
    speed = 7;
    cadence = 350;
    level = 2;
  } else if (score < 5000) {
    speed = 8;
    cadence = 300;
    level = 3;
  } else if (score < 10000) {
    speed = 9;
    cadence = 250;
    level = 4;
  } else if (score < 20000) {
    speed = 10;
    cadence = 200;
    level = 5;
  } else if (score < 35000) {
    speed = 11;
    cadence = 150;
    level = 6;
  } else if (score < 50000) {
    speed = 12;
    cadence = 100;
    level = 7;
  } else if (score > 75000) {
    speed = 20;
    cadence = 50;
    level = max;
  }
}

/* function updateLevel() {
  if (combo >= 25) {
    level++;
    speed += 1;
    cadence -= 50;
    combo = 0;
    console.log(`Niveau ${level}`);
    console.log("combo" + combo);
  }
}
*/

function initializeLives() {
  for (let i = 0; i < lives; i++) {
    const life = document.createElement("div");
    life.classList.add("life");
    if (i < 6) life.classList.add("blue");
    else if (i < 12) life.classList.add("green");
    else if (i < 18) life.classList.add("yellow");
    else if (i < 24) life.classList.add("orange");
    else if (i < 30) life.classList.add("red");
    else life.classList.add("gray");
    lifeContainer.appendChild(life);
  }
}

function updateLives() {
  const lifeElements = Array.from(lifeContainer.getElementsByClassName("life"));
  if (lives >= 0) {
    lifeElements[lifeElements.length - lives - 1].classList.remove(
      "blue",
      "green",
      "yellow",
      "orange",
      "red"
    );
    lifeElements[lifeElements.length - lives - 1].classList.add("gray");
  }
}

initializeLives();

function displayinfos() {
  const scoreDIV = document.querySelector(".score");
  const pointsDIV = document.querySelector(".statut");
  const multiplierDIV = document.querySelector(".multiplier");
  const comboDIV = document.querySelector(".combo");
  const levelDIV = document.querySelector(".level");

  scoreDIV.innerHTML = score;
  pointsDIV.innerHTML = points;
  multiplierDIV.innerHTML = multiplier;
  comboDIV.innerHTML = combo;
  levelDIV.innerHTML = level;
}
