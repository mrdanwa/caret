$(document).ready(function () {
  // Detect current page to determine language
  const currentPage = window.location.pathname;
  const isEnglish =
    currentPage.includes("en.html") || currentPage.includes("/en/");

  // Language-specific messages
  const messages = {
    en: {
      success: "Thank you for subscribing!",
      error: "An error has occurred. Please try again.",
    },
    es: {
      success: "¡Gracias por suscribirte!",
      error: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
    },
  };

  const currentLanguage = isEnglish ? "en" : "es";
  const currentMessages = messages[currentLanguage];

  $(".newsletter-form").submit(function (e) {
    e.preventDefault();

    const email = $(this).find('input[name="EMAIL"]').val();
    const inputGroup = $(this).find(".input-group");
    const apiKey =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMDM4ODFkN2ZlMjVjNmQ2MjBjODc5ODRjNGNkMjU2NjJlZWEyM2UxNzMyMWFhODVhNDdkNTVhODQ3MjFjNzlkZDJiNjhjM2Y3ODY5OGZkMDEiLCJpYXQiOjE3NTU0NDcyMTMuNTQyNzcsIm5iZiI6MTc1NTQ0NzIxMy41NDI3NzIsImV4cCI6NDkxMTEyMDgxMy41MzgyNzYsInN1YiI6IjE3NTM4ODciLCJzY29wZXMiOltdfQ.YuZfGCcO5sYvx6AQebtgbppkuxWpoe5ktagVPYM4ISVuUfU2_CEbHQgDo4ZIWfTemoBrV0afqmxcQ9Zo5MRKYbtM5FAL6KdNtVQRJOnHSoyFxZ7NXuBzbhxnXto2ChPevZ0t_n20Um6GQzu56pUooPCWMLz5jtfBn9vxSHnz5qFG7fWmi4PG3W458Lvrg5JvYGZjKec2BiiPb_xuPy98giGdII2_yAm6GosmIqfeWwe_8jpATRtLH9iGcgjKZ1afnk3dkMoMPgUorh8VPVnyAKq-yud-kaiP1QuFIdWKN98K8B8fG4O1N8VNpgGO3usrdFFp2uueJ6PbrrmsJFW7KGYDXQgDz-cMkEqtX2X-TRsuiQU7J2-lXbwvTU2UXOh4SUe46z4O-wj1ixm10eWZOcN9WrPQjSQlrlhe4rV6176N8fBeHYF6gB7MINA6r7qjrROxB80rI1fmFR5XatYEH0srNbiFiDsK5zzFdEnvqT6lvJgZ6DV9rJhwf1yNPt3_6upC6uI62MctDQ7tTHK3ISKMqhMEM2vqvBKou2i8nyKV0zC8UD-3RQmCZyTgTHg-X641ZSEYUHwS_zXGs3ApjbqS5L8H1Tvo_cS2eUUkZEMPTQHLB2BDOUaFxX1eEUaZwE0QzajnlzNGB3a-QQ_iwJ1Z66LF-kJhuu64vRSRe4M";

    // ID del grupo "Web" en MailerLite
    const webGroupId = "171330451560990098";

    const originalContent = inputGroup.html();

    $.ajax({
      url: "https://connect.mailerlite.com/api/subscribers",
      type: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      data: JSON.stringify({
        email: email,
        groups: [webGroupId],
        resubscribe: true,
      }),
      success: function (response) {
        inputGroup.html(
          `<div style="width: 100%; padding: 0.9rem 1.2rem; color: white; font-size: 16px; font-weight: bold; text-align: center;">${currentMessages.success}</div>`
        );

        setTimeout(() => {
          inputGroup.html(originalContent);
          inputGroup.find('input[name="EMAIL"]').val("");
        }, 3000);
      },
      error: function (xhr, status, error) {
        inputGroup.html(
          `<div style="width: 100%; padding: 0.9rem 1.2rem; color: white; font-size: 16px; font-weight: bold; text-align: center;">${currentMessages.error}</div>`
        );

        setTimeout(() => {
          inputGroup.html(originalContent);
          inputGroup.find('input[name="EMAIL"]').val("");
        }, 3000);
      },
    });
  });
});
