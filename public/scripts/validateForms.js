(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        //without if (fileInputError)  the validation on the user/register is gooing to break, since on theese forms
        //fileInputError is not defined
        if (fileInputError) {
          if (form.children.fileInputError.firstChild) {
            console.log("inside form prevention");
            fileInputImages.classList.add("customErrorInput");
            event.preventDefault();
            event.stopPropagation();
          }
        }

        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
