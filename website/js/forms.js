(() => {
  "use strict";

  document.querySelectorAll("form[data-simulated-form]").forEach((form) => {
    const submitButton = form.querySelector("[type=submit]");
    const status = form.querySelector("[data-form-status]");
    let submitted = false;

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      const error = form.querySelector(`[data-error-for="${field.name}"]`);

      const updateError = () => {
        if (!error) return;
        if (field.validity.valid) {
          error.textContent = "";
          field.removeAttribute("aria-invalid");
        } else {
          error.textContent = field.validity.valueMissing ? "This field is required." : "Please enter a valid value.";
          field.setAttribute("aria-invalid", "true");
        }
      };

      field.addEventListener("blur", updateError);
      field.addEventListener("input", updateError);
      field.addEventListener("invalid", updateError);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (submitted || (submitButton && submitButton.disabled)) return;

      if (!form.checkValidity()) {
        form.querySelectorAll("input, select, textarea").forEach((field) => {
          if (!field.validity.valid) field.dispatchEvent(new Event("invalid"));
        });
        form.querySelector(":invalid")?.focus();
        return;
      }

      submitted = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Request Simulated";
      }

      if (status) {
        status.hidden = false;
        status.textContent = form.dataset.simulatedForm === "reservation"
          ? "Reservation request simulated successfully. No customer information was sent or stored."
          : "Message simulated successfully. No customer information was sent or stored.";
      }
    });
  });
})();
