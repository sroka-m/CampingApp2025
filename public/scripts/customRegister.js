const passwordInput = document.querySelector("#password");
const usernameInput = document.querySelector("#username");
const usernameTakenError = document.querySelector("#usernameTakenError");
//cannpt use build in patter attr cuz i need to chec for other stuff too and i cannot combine when using build in patttern
const passwordRegex =
  /^(?=^\S)(?=.*\S$)(?=^.{8,64}$)(?=^(?:(?!<).)*$)(?=^(?:(?!>).)*$)(?=^(?:(?!&).)*$).*$/;
const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
let passwordValue = passwordInput.value; // this does not work, the value seems to stay the same, as when it ws initialized
usernameInput.addEventListener("input", async () => {
  usernameInput.setCustomValidity("");
  if (usernameInput.value !== "" && !usernameRegex.test(usernameInput.value)) {
    usernameInput.setCustomValidity("validation with regex failed");
  }
  try {
    //only check if the username reached min length
    if (usernameInput.value.length >= 6) {
      usernameTakenError.textContent = "";
      const res = await fetch(
        `/checkExistingUsers/API?username=${usernameInput.value}`
      );
      const data = await res.json();
      console.log(data.alreadyTaken);
      if (data.alreadyTaken) {
        usernameTakenError.textContent = "Username already taken";
        usernameInput.setCustomValidity("Username already taken");
      }
    }
  } catch (e) {
    usernameInput.setCustomValidity(
      "Checking if the username is unique failed, please try again"
    );
  }
});

passwordInput.addEventListener("input", () => {
  passwordInput.setCustomValidity("");

  if (passwordInput.value !== "" && !passwordRegex.test(passwordInput.value)) {
    passwordInput.setCustomValidity("validation with regex failed");
  }

  if (passwordInput.value !== "" && usernameInput.value !== "") {
    if (
      passwordInput.value.toLowerCase() === usernameInput.value.toLowerCase()
    ) {
      //   console.log("the smae");
      passwordInput.setCustomValidity(
        "password cannot be the same as username"
      );
    }
  }
});
