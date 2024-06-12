const loginForm = document.getElementById('login');
const errorMessage = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.error) {
        errorMessage.textContent = data.error; // Hata mesajını göster
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
        // Handle success, redirect maybe?
        window.location.href = '/';
    }
});