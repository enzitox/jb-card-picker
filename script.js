async function loadCards() {
  const response = await fetch('cartas.txt', { cache: "no-store" });
  const text = await response.text();
  return text.split('\n').filter(line => line.trim() !== '');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const grid = document.getElementById("grid");

loadCards().then(contents => {
  const shuffledContents = shuffleArray(contents);

  shuffledContents.forEach(content => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="card-inner">
        <div class="card-face front">
          <img src="https://i.imgur.com/zmHq2Q8.png" alt="Carta">
        </div>
        <div class="card-face back">${content}</div>
      </div>
    `;

    div.addEventListener("click", () => {
      div.classList.toggle("flipped");
      setTimeout(() => openZoom(content), 300);
    });

    grid.appendChild(div);

    adjustBackTextSize(div);
  });
});

function adjustBackTextSize(card) {
  const back = card.querySelector('.back');
  let fontSize = 20;
  back.style.fontSize = fontSize + 'px';
  back.style.display = 'flex';
  back.style.justifyContent = 'center';
  back.style.alignItems = 'center';

  while (back.scrollWidth > back.clientWidth && fontSize > 8) {
    fontSize -= 1;
    back.style.fontSize = fontSize + 'px';
  }
}

// --- Popup y confeti ---
let confettiAnimation;
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confetti = [];

function openZoom(text) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  overlay.innerHTML = `
    <div class="zoom-card">
      <div>${text}</div>
      <button id="acceptBtn">Aceptar</button>
    </div>
  `;

  document.body.appendChild(overlay);
  launchConfetti();

  overlay.querySelector("#acceptBtn").addEventListener("click", () => {
    overlay.remove();
    document.querySelectorAll(".card").forEach(card => card.classList.remove("flipped"));
    stopConfetti();
  });
}

function launchConfetti() {
  confetti = [];
  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  confettiAnimation = setInterval(drawConfetti, 16);
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach((c) => {
    ctx.beginPath();
    ctx.lineWidth = c.r;
    ctx.strokeStyle = c.color;
    ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
    ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
    ctx.stroke();
  });
  updateConfetti();
}

function updateConfetti() {
  let angle = 0.01;
  confetti.forEach((c) => {
    c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
    c.x += Math.sin(angle);
    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
  });
}

function stopConfetti() {
  clearInterval(confettiAnimation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const colorPicker = document.getElementById("bgColorPicker");
colorPicker.addEventListener("input", (e) => {
  document.body.style.background = e.target.value;
});