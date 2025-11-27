const toast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Delay function for UX
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Register User
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const errorDiv = document.getElementById('registerError');
  const submitButton = this.querySelector('button[type="submit"]');

  if (!username || !password || !confirmPassword) {
    errorDiv.textContent = 'All fields are required!';
    return;
  }

  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match!';
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Registering...';

  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
      errorDiv.textContent = 'Username already exists!';
      return;
    }

    const hashedPassword = await hashPassword(password);
    users[username] = hashedPassword;
    localStorage.setItem('users', JSON.stringify(users));
    toast('Registration successful!');
    await delay(1000);
    window.location.href = 'index.html';
  } catch (error) {
    errorDiv.textContent = 'Registration failed. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Register';
  }
});

// Login User
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const submitButton = this.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  submitButton.textContent = 'Logging in...';

  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (!users[username]) {
      errorDiv.textContent = 'User not found.';
      errorDiv.classList.add('fade-out');
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.classList.remove('fade-out');
      }, 3000);
      return;
    }

    const hashedPassword = await hashPassword(password);
    if (users[username] !== hashedPassword) {
      errorDiv.textContent = 'Incorrect password.';
      errorDiv.classList.add('fade-out');
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.classList.remove('fade-out');
      }, 3000);
      return;
    }

    sessionStorage.setItem('loggedInUser', username);
    toast('Login successful!');
    setTimeout(() => window.location.href = 'welcome.html', 1000);
  } catch (error) {
    errorDiv.textContent = 'Login failed. Please try again.';
    errorDiv.classList.add('fade-out');
    setTimeout(() => {
      errorDiv.textContent = '';
      errorDiv.classList.remove('fade-out');
    }, 3000);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Login';
  }
});

// Username validation for password field visibility
document.getElementById('loginUsername')?.addEventListener('input', async function () {
  const username = this.value.trim();
  const passwordField = document.getElementById('loginPassword');

  if (!username) {
    passwordField.style.display = 'none';
    passwordField.classList.remove('fade-in');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) {
    passwordField.style.display = 'block';
    passwordField.classList.add('fade-in');
  } else {
    passwordField.style.display = 'none';
    passwordField.classList.remove('fade-in');
  }
});

// Logout function
function logout() {
  sessionStorage.clear();
  toast('Logged out successfully!');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// Confetti animation for welcome page
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ce79', '#f7a399', '#ffe066', '#a29bfe'];
  const shapes = ['circle', 'square', 'triangle'];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 10 + 6;
      this.opacity = 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 4;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 3 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity *= 0.98;
      this.size *= 0.98;
      return this.opacity > 0.05 && this.size > 1 && this.y < canvas.height + 20;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }



  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
        i--;
      } else {
        particles[i].draw();
      }
    }

    if (particles.length > 0 || generatingParticles) {
      requestAnimationFrame(animate);
    }
  }

  let generatingParticles = true;
  const interval = setInterval(() => {
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle());
    }
  }, 100);

  // Stop generating after 5 seconds
  setTimeout(() => {
    clearInterval(interval);
    generatingParticles = false;
  }, 3000);

  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('welcomeMessage')) {
    startConfetti();
  }
});




