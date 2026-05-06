// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Modal Logic
const loginBtn = document.getElementById('login-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal() {
    modalOverlay.style.display = 'block';
    modalContent.style.display = 'block';
    setTimeout(() => {
        modalOverlay.classList.add('active');
        modalContent.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalContent.classList.remove('active');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        modalContent.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
}

loginBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
