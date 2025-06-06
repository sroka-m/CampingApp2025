const suggestedPassword = document.querySelector("#suggestedPassword");
const suggestedPasswordSvg = document.querySelector("#suggestedPasswordSvg");

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(suggestedPassword.textContent);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
  // console.dir(navigator.permissions);
  // navigator.permissions
  //   .query({ name: "write-on-clipboard" })
  //   .then((result) => {
  //     if (result.state == "granted" || result.state == "prompt") {
  //       alert("Write access granted!");
  //     }
  //   });
};

suggestedPasswordSvg.addEventListener("click", copyContent);
