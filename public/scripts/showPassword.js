const inputPassword = document.querySelector("#password");
const showPassword = document.querySelector("#showPassword");
const hidePassword = document.querySelector("#hidePassword");
const eyeSVGcontainer = document.querySelector("#eyeSVGcontainer");

function setAttr() {
  const type =
    inputPassword.getAttribute("type") === "password" ? "text" : "password";
  inputPassword.setAttribute("type", type);
}

eyeSVGcontainer.addEventListener("click", () => {
  showPassword.classList.toggle("hide");
  hidePassword.classList.toggle("hide");
  setAttr();
});
