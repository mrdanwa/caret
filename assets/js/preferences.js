$(document).ready(function () {
  const apiKey =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMDM4ODFkN2ZlMjVjNmQ2MjBjODc5ODRjNGNkMjU2NjJlZWEyM2UxNzMyMWFhODVhNDdkNTVhODQ3MjFjNzlkZDJiNjhjM2Y3ODY5OGZkMDEiLCJpYXQiOjE3NTU0NDcyMTMuNTQyNzcsIm5iZiI6MTc1NTQ0NzIxMy41NDI3NzIsImV4cCI6NDkxMTEyMDgxMy41MzgyNzYsInN1YiI6IjE3NTM4ODciLCJzY29wZXMiOltdfQ.YuZfGCcO5sYvx6AQebtgbppkuxWpoe5ktagVPYM4ISVuUfU2_CEbHQgDo4ZIWfTemoBrV0afqmxcQ9Zo5MRKYbtM5FAL6KdNtVQRJOnHSoyFxZ7NXuBzbhxnXto2ChPevZ0t_n20Um6GQzu56pUooPCWMLz5jtfBn9vxSHnz5qFG7fWmi4PG3W458Lvrg5JvYGZjKec2BiiPb_xuPy98giGdII2_yAm6GosmIqfeWwe_8jpATRtLH9iGcgjKZ1afnk3dkMoMPgUorh8VPVnyAKq-yud-kaiP1QuFIdWKN98K8B8fG4O1N8VNpgGO3usrdFFp2uueJ6PbrrmsJFW7KGYDXQgDz-cMkEqtX2X-TRsuiQU7J2-lXbwvTU2UXOh4SUe46z4O-wj1ixm10eWZOcN9WrPQjSQlrlhe4rV6176N8fBeHYF6gB7MINA6r7qjrROxB80rI1fmFR5XatYEH0srNbiFiDsK5zzFdEnvqT6lvJgZ6DV9rJhwf1yNPt3_6upC6uI62MctDQ7tTHK3ISKMqhMEM2vqvBKou2i8nyKV0zC8UD-3RQmCZyTgTHg-X641ZSEYUHwS_zXGs3ApjbqS5L8H1Tvo_cS2eUUkZEMPTQHLB2BDOUaFxX1eEUaZwE0QzajnlzNGB3a-QQ_iwJ1Z66LF-kJhuu64vRSRe4M";

  const groupIds = {
    newProjects: "170402950047335426",
    projectNewsletter: "171307225929746383",
  };

  const apiHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // Rellenar email desde URL
  const emailParam = new URLSearchParams(window.location.search).get("email");
  if (emailParam) $("#email").val(emailParam);

  $("#preferences-form").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val();
    const submitButton = $(".save-button");
    const originalContent = submitButton.html();

    const selectedGroups = [];
    if ($("#new-projects").is(":checked"))
      selectedGroups.push(groupIds.newProjects);
    if ($("#project-newsletter").is(":checked"))
      selectedGroups.push(groupIds.projectNewsletter);

    setButtonState("loading");

    // Buscar o crear suscriptor
    $.ajax({
      url: `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(
        email
      )}`,
      type: "GET",
      headers: apiHeaders,
      success: (response) =>
        updateSubscriberGroups(response.data.id, response.data.groups || []),
      error: (xhr) => {
        if (xhr.status === 404 && selectedGroups.length > 0) {
          createSubscriber();
        } else if (xhr.status === 404) {
          setButtonState("success");
        } else {
          setButtonState("error");
        }
      },
    });

    function updateSubscriberGroups(subscriberId, currentGroups) {
      const currentGroupIds = currentGroups.map((g) => g.id);
      const allGroupIds = Object.values(groupIds);
      const toRemove = allGroupIds.filter(
        (id) => currentGroupIds.includes(id) && !selectedGroups.includes(id)
      );

      if (selectedGroups.length > 0) {
        // Actualizar grupos y reactivar
        $.ajax({
          url: "https://connect.mailerlite.com/api/subscribers",
          type: "POST",
          headers: apiHeaders,
          data: JSON.stringify({
            email,
            groups: selectedGroups,
            resubscribe: true,
          }),
          success: () => removeFromGroups(subscriberId, toRemove),
          error: () => setButtonState("error"),
        });
      } else {
        // Solo remover grupos
        removeFromGroups(subscriberId, toRemove);
      }
    }

    function removeFromGroups(subscriberId, groupIds) {
      if (groupIds.length === 0) {
        setButtonState("success");
        return;
      }

      const removeOps = groupIds.map((groupId) =>
        $.ajax({
          url: `https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${groupId}`,
          type: "DELETE",
          headers: apiHeaders,
        })
      );

      $.when(...removeOps).then(
        () => setButtonState("success"),
        () => setButtonState("error")
      );
    }

    function createSubscriber() {
      $.ajax({
        url: "https://connect.mailerlite.com/api/subscribers",
        type: "POST",
        headers: apiHeaders,
        data: JSON.stringify({
          email,
          groups: selectedGroups,
          resubscribe: true,
        }),
        success: () => setButtonState("success"),
        error: () => setButtonState("error"),
      });
    }

    function setButtonState(state) {
      const states = {
        loading: {
          html: '<i class="fa fa-spinner fa-spin"></i> Guardando...',
          disabled: true,
        },
        success: {
          html: "¡Guardado!",
          bg: "linear-gradient(135deg, #00592f 0%, #006b38 100%)",
          timeout: 2000,
        },
        error: {
          html: "Error",
          bg: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
          timeout: 3000,
        },
      };

      const config = states[state];
      submitButton.html(config.html).prop("disabled", config.disabled || false);
      if (config.bg) submitButton.css("background", config.bg);

      if (config.timeout) {
        setTimeout(() => {
          submitButton
            .html(originalContent)
            .css("background", "")
            .prop("disabled", false);
        }, config.timeout);
      }
    }
  });
});
