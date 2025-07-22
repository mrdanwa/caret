// Simple newsletter form integration
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const inputGroup = this.querySelector(".input-group");
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      // Save original content to restore later
      const originalContent = inputGroup.innerHTML;

      // Send the request to the API
      fetch("https://caret-ek3gf.ondigitalocean.app/api/newsletter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email }),
      }).then(() => {
        inputGroup.innerHTML =
          '<div style="width: 100%; padding: 0.9rem 1.2rem; color: white; font-size: 16px; font-weight: bold; text-align: center;">¡Gracias por suscribirte!</div>';

        setTimeout(() => {
          inputGroup.innerHTML = originalContent;
          inputGroup.querySelector('input[type="email"]').value = "";
        }, 3000);
      });
    });
  }
});

// Contact form integration
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const feedbackDiv = contactForm.querySelector(".zform-feedback");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("contact-name").value.trim();
      const phone = document.getElementById("contact-phone").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const message = document.getElementById("contact-message").value.trim();

      // Save original content to restore later
      const originalContent = contactForm.innerHTML;

      // Send the request to the API
      fetch("https://caret-ek3gf.ondigitalocean.app/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          message: message,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          // Show success message
          feedbackDiv.innerHTML =
            '<div style="color: #004225; font-family: "Montserrat", sans-serif;">¡Gracias! Hemos recibido tu mensaje.</div>';

          // Reset form
          contactForm.reset();

          // Restore original content after 3 seconds
          setTimeout(() => {
            feedbackDiv.innerHTML = "";
          }, 3000);
        })
        .catch((error) => {
          // Show error message
          feedbackDiv.innerHTML =
            '<div style="color: #721c24; font-family: "Montserrat", sans-serif;">Ups... algo salió mal. Intenta de nuevo.</div>';

          // Clear error message after 3 seconds
          setTimeout(() => {
            feedbackDiv.innerHTML = "";
          }, 3000);
        });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var privacyCheck = document.getElementById("privacy-check");
  var submitBtn = document.getElementById("contact-submit");
  if (privacyCheck && submitBtn) {
    privacyCheck.addEventListener("change", function () {
      submitBtn.disabled = !privacyCheck.checked;
    });
    // Por si el usuario recarga y el checkbox está marcado
    submitBtn.disabled = !privacyCheck.checked;
  }
});
