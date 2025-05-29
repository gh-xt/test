// Authentication functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize authentication based on current page
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "login.html" || currentPage === "") {
    initializeLogin();
  } else {
    checkAuthenticationStatus();
  }
});

function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Check if already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "dashboard.html";
  }
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginButton = document.querySelector(".login-button");

  // Clear previous errors
  clearErrors();

  // Validate inputs
  if (!validateEmail(email)) {
    showError("email", "Please enter a valid email address");
    return;
  }

  if (!validatePassword(password)) {
    showError("password", "Password must be at least 6 characters long");
    return;
  }

  // Show loading state
  setLoadingState(loginButton, true);

  // Simulate authentication (replace with real authentication)
  setTimeout(() => {
    authenticateUser(email, password)
      .then((success) => {
        if (success) {
          // Store authentication state
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("loginTime", new Date().toISOString());

          // Redirect to dashboard
          window.location.href = "dashboard.html";
        } else {
          showError("password", "Invalid email or password");
          setLoadingState(loginButton, false);
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        showError("password", "An error occurred. Please try again.");
        setLoadingState(loginButton, false);
      });
  }, 1000);
}

function authenticateUser(email, password) {
  return new Promise((resolve) => {
    // Simulate authentication logic
    // In a real application, this would make an API call to your authentication service

    // Demo credentials
    const validCredentials = [
      { email: "admin@dspm.com", password: "admin123" },
      { email: "user@dspm.com", password: "user123" },
      { email: "demo@dspm.com", password: "demo123" },
    ];

    const isValid = validCredentials.some(
      (cred) => cred.email === email && cred.password === password,
    );

    resolve(isValid);
  });
}

function logout() {
  // Clear authentication state
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("loginTime");

  // Clear any session data
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "login.html";
}

function checkAuthenticationStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loginTime = localStorage.getItem("loginTime");

  if (!isLoggedIn || isLoggedIn !== "true") {
    redirectToLogin();
    return false;
  }

  // Check if session has expired (24 hours)
  if (loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      logout();
      return false;
    }
  }

  return true;
}

function redirectToLogin() {
  window.location.href = "login.html";
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

// UI Helper functions
function showError(fieldName, message) {
  const field = document.getElementById(fieldName);
  if (field) {
    field.classList.add("error");

    // Remove existing error message
    const existingError = field.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
  }
}

function clearErrors() {
  const errorFields = document.querySelectorAll(".form-input.error");
  errorFields.forEach((field) => {
    field.classList.remove("error");
  });

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    message.remove();
  });
}

function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
    button.textContent = "Signing In...";
  } else {
    button.classList.remove("loading");
    button.disabled = false;
    button.textContent = "Sign In";
  }
}

// Auto-logout on tab close/refresh
window.addEventListener("beforeunload", function () {
  // Optional: You might want to keep the session active
  // For now, we'll keep the user logged in across browser sessions
});

// Check authentication status periodically
setInterval(checkAuthenticationStatus, 5 * 60 * 1000); // Check every 5 minutes

// Export functions for global access
window.logout = logout;
window.checkAuthenticationStatus = checkAuthenticationStatus;

// Handle browser back/forward navigation
window.addEventListener("popstate", function () {
  checkAuthenticationStatus();
});
