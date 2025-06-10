(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const inputLocation = document.querySelector(".inputLocation");
  const radioRatingReview = document.querySelectorAll(
    'input[name="review[rating]"]'
  );

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (radioRatingReview.length !== 0) {
          let checked = false;
          // console.dir(radioRatingReview);
          radioRatingReview[1].setCustomValidity("");

          //radioRatingReview has length of 6, input[0] is noValue must always have attr checked, if not then all 5 stars will
          // appear yellow when user opens the from. Therefore the count starts with input[1]
          //i examine if input[1] to [5] are checked and if not i set input[1] as invalid to display err msg (input[1] is as good as any of the 5)
          //then i add event listeners to these inputs and as soon as the user select the stars the error msg dissapears
          for (let i = 1; i < radioRatingReview.length; i++) {
            if (radioRatingReview[i].checked) {
              checked = true;
              break;
            }
          }
          if (!checked) {
            radioRatingReview[1].setCustomValidity(
              "Please select stars 1 to 5"
            );
            for (let i = 1; i < radioRatingReview.length; i++) {
              radioRatingReview[i].addEventListener("change", () => {
                if (radioRatingReview[i].checked) {
                  radioRatingReview[1].setCustomValidity("");
                }
              });
            }
          }
        }

        if (inputLocation) {
          inputLocation.setCustomValidity("");
          if (inputLocation.value.trim() !== 0) {
            try {
              const res = await fetch(
                `https://api.maptiler.com/geocoding/${inputLocation.value.trim()}.json?key=${mapApiKey}`
              );
              const data = await res.json();
              // console.log(data);
              // console.log(data.features.length);

              if (data.features.length === 0) {
                // console.log("i am inside !data.features.length");
                inputLocation.setCustomValidity("No location were found.");
              }
            } catch (err) {
              // console.log(err);
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
