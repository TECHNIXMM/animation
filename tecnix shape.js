
document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (
    e.key === "F12" ||
    (e.ctrlKey && ["u", "s", "c", "i", "j"].includes(key)) ||
    (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key))
  ) {
    e.preventDefault();
    alert("Nice try 😎");
  }
});


const typingText = document.getElementById("typingText");
const word = "TECHNIX";
let charIndex = 0;
let deleting = false;

function renderLetters(text) {
  typingText.innerHTML = text
    .split("")
    .map((char, i) => `<span class="char" data-index="${i}">${char}</span>`)
    .join("");
}

function typeEffect() {
  if (!deleting) {
    const current = word.slice(0, charIndex + 1);
    renderLetters(current);
    charIndex++;

    if (charIndex === word.length) {
      deleting = true;
      setTimeout(typeEffect, 1200);
      return;
    }
  } else {
    const current = word.slice(0, charIndex - 1);
    renderLetters(current);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
    }
  }

  setTimeout(typeEffect, deleting ? 120 : 180);
}

typeEffect();


const orbs = [
  {
    el: document.querySelector(".orb-1"),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    delay: 0.18
  },
  {
    el: document.querySelector(".orb-2"),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    delay: 0.12
  },
  {
    el: document.querySelector(".orb-3"),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    delay: 0.08
  }
];

let pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

// desktop mouse
window.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});


window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
  }
}, { passive: true });


orbs.forEach((orbObj) => {
  orbObj.el.addEventListener("click", () => {
    orbObj.el.style.transform = "translate(-50%, -50%) scale(1.35)";
    orbObj.el.style.filter = "brightness(1.2)";
    setTimeout(() => {
      orbObj.el.style.transform = "translate(-50%, -50%) scale(1)";
      orbObj.el.style.filter = "brightness(1)";
    }, 250);
  });

  orbObj.el.addEventListener("touchstart", () => {
    orbObj.el.style.transform = "translate(-50%, -50%) scale(1.35)";
    orbObj.el.style.filter = "brightness(1.2)";
    setTimeout(() => {
      orbObj.el.style.transform = "translate(-50%, -50%) scale(1)";
      orbObj.el.style.filter = "brightness(1)";
    }, 250);
  }, { passive: true });
});

function animateOrbs() {
  orbs.forEach((orbObj, index) => {
    orbObj.x += (pointer.x - orbObj.x) * orbObj.delay;
    orbObj.y += (pointer.y - orbObj.y) * orbObj.delay;

    const offset = index * 22;

    orbObj.el.style.left = `${orbObj.x + offset}px`;
    orbObj.el.style.top = `${orbObj.y + offset}px`;
    orbObj.el.style.transform = "translate(-50%, -50%)";
  });

  requestAnimationFrame(animateOrbs);
}
animateOrbs();


function reactLettersToOrb() {
  const letters = document.querySelectorAll(".typing-text .char");
  const mainOrb = orbs[0];

  letters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const letterX = rect.left + rect.width / 2;
    const letterY = rect.top + rect.height / 2;

    const dx = mainOrb.x - letterX;
    const dy = mainOrb.y - letterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 140) {
      letter.classList.add("active");
    } else {
      letter.classList.remove("active");
    }
  });

  requestAnimationFrame(reactLettersToOrb);
}
reactLettersToOrb();


const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const particles = [];
const particleCount = 85;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.2 + 1;
    this.speedX = (Math.random() - 0.5) * 1.1;
    this.speedY = (Math.random() - 0.5) * 1.1;
    this.alpha = Math.random() * 0.6 + 0.15;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    const dx = pointer.x - this.x;
    const dy = pointer.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 180) {
      this.x += dx * 0.01;
      this.y += dy * 0.01;
    }

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${this.alpha})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(34, 211, 238, 0.45)";
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.fillStyle = "rgba(9, 11, 23, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();