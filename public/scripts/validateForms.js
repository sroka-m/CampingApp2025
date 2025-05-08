(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const inputLocation = document.querySelector(".inputLocation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (inputLocation) {
          inputLocation.setCustomValidity("");
          if (inputLocation.value.trim() !== 0) {
            try {
              const res = await fetch(
                `https://api.maptiler.com/geocoding/${inputLocation.value.trim()}.json?key=${mapApiKey}`
              );
              const data = await res.json();
              console.log(data);
              console.log(data.features.length);

              if (data.features.length === 0) {
                console.log("i am inside !data.features.length");
                inputLocation.setCustomValidity("No location were found.");
              }
            } catch (err) {
              console.log(err);
              inputLocation.setCustomValidity(
                "Location validation failed, please try again."
              );
            }
          }
        }

        form.classList.add("was-validated");

        // submit only if everything (including async) passed
        if (form.checkValidity()) {
          form.submit(); // native submit
        }
      },
      false
    );
  });
})();
