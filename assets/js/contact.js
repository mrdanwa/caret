document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;
  const isEnglish = currentPage.includes("/en/");

  // Language-specific messages
  const messages = {
    en: {
      sending: "Sending message...",
      success: "Thank you! We have received your message.",
      error: "Oops... something went wrong. Please try again.",
    },
    es: {
      sending: "Enviando mensaje...",
      success: "¡Gracias! Hemos recibido tu mensaje.",
      error: "Ups... algo salió mal. Intenta de nuevo.",
    },
  };

  const currentLanguage = isEnglish ? "en" : "es";
  const currentMessages = messages[currentLanguage];

  const contactForm = document.getElementById("contact-form");
  const privacyCheck = document.getElementById("privacy-check");
  const submitButton = document.getElementById("contact-submit");

  // Enable/disable submit button based on privacy checkbox
  if (privacyCheck && submitButton) {
    privacyCheck.addEventListener("change", function () {
      submitButton.disabled = !this.checked;
    });
  }

  if (contactForm) {
    const feedbackDiv = contactForm.querySelector(".zform-feedback");

    // Set timestamp when form loads
    const timestampField = document.getElementById("form-timestamp");
    if (timestampField) {
      timestampField.value = Date.now();
    }

    // Function to show and clear feedback messages
    const showFeedback = (message, isError = false) => {
      const messageClass = isError ? "feedback-error" : "feedback-success";
      feedbackDiv.innerHTML = `<div class="${messageClass}">${message}</div>`;

      setTimeout(() => {
        feedbackDiv.innerHTML = "";
      }, 3000);
    };

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Show loading indicator
      showFeedback(currentMessages.sending);

      // Create form data to send
      const formData = new FormData(contactForm);
      formData.append("url", ""); // Honeypot field

      // Send data to PHP script
      fetch("/assets/php/contact.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          throw new Error("Network response was not ok");
        })
        .then(() => {
          // Show success message
          showFeedback(currentMessages.success);

          // Reset form
          contactForm.reset();
          submitButton.disabled = true;
        })
        .catch(() => {
          // Show error message
          showFeedback(currentMessages.error, true);
        });
    });
  }
});
