// Configuration
const API_URL = "https://caret-ek3gf.ondigitalocean.app/api";
const FRONTEND_URL = "https://caret-ek3gf.ondigitalocean.app";

async function handleAreaPrivadaClick(event) {
  event.preventDefault();

  const button = event.target;
  button.textContent = "VERIFICANDO...";
  button.disabled = true;

  try {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      try {
        await fetch(`${API_URL}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rememberMe }),
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }

    const response = await fetch(`${API_URL}/is-authenticated/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok && (await response.json()).success) {
      window.location.href = `${FRONTEND_URL}/dashboard`;
    } else {
      window.location.href = `${FRONTEND_URL}/login`;
    }
  } catch (error) {
    window.location.href = `${FRONTEND_URL}/login`;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("area-privada-btn");
  if (button) {
    button.addEventListener("click", handleAreaPrivadaClick);
  }
});
