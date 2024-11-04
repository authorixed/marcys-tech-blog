document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Redirect to the dashboard on successful login
        document.location.replace('/dashboard');
      } else {
        alert('Failed to log in');
      }
    }
  });
  