// script.js

// === Matrix Background Animation ===
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f0";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);
    drops[i] = (y * fontSize > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
  });
}

setInterval(drawMatrix, 50);

// === Login Function ===
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://hacker-net.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login Successful!\nToken:\n" + data.token);
    } else {
      alert("Login Failed:\n" + data.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}


// === Register Function ===
async function register() {
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch("https://hacker-net.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration Successful! Now login.");
      window.location.href = "index.html";
    } else {
      alert("Registration Failed:\n" + data.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}