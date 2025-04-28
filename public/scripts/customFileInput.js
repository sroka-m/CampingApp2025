const fileInputImages = document.querySelector(".fileInputImages");
const fileInputPreview = document.querySelector(".ImagePreview");
const fileInputError = document.querySelector("#fileInputError");
const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
const MAXFILESIZE = 1024 ** 2 * 3;

if (fileInputImages) {
  fileInputImages.addEventListener("change", updateImagePreview);
}

function updateImagePreview() {
  while (fileInputPreview.firstChild) {
    fileInputPreview.removeChild(fileInputPreview.firstChild);
  }
  while (fileInputError.firstChild) {
    fileInputError.removeChild(fileInputError.firstChild);
  }
  let invalidTypeMsg = [];
  let invalidSizeMsg = [];
  const fragmentImages = new DocumentFragment();
  const fragmentErrors = new DocumentFragment();
  // console.log(typeof fileInputImages.files);
  // console.log(Array.isArray(fileInputImages.files));

  Array.from(fileInputImages.files).forEach((file, i) => {
    if (i < 4) {
      if (!validFileType(file)) {
        invalidTypeMsg.push(file.name);
      } else if (!valiadateFileSize(file)) {
        invalidSizeMsg.push(file.name);
      } else {
        const div = document.createElement("div");
        const para = document.createElement("p");
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        if (file.name.length > 8) {
          para.textContent = file.name.substring(0, 8) + "...";
        } else {
          para.textContent = file.name;
        }
        div.append(image, para);
        fragmentImages.append(div);
      }
    } else if (i === 4) {
      // console.log("cannot exceed more than 4 pictures");
      const p = document.createElement("p");
      p.textContent = "Total number of images displayed cannot exceed 4.";
      fragmentErrors.append(p);
    }
  });
  fileInputPreview.append(fragmentImages);
  // for (const file of fileInputImages.files) {
  //   if (!validFileType(file)) {
  //     invalidTypeMsg.push(file.name);
  //   } else if (!valiadateFileSize(file)) {
  //     invalidSizeMsg.push(file.name);
  //   } else {
  //     const div = document.createElement("div");
  //     const para = document.createElement("p");
  //     const image = document.createElement("img");
  //     image.src = URL.createObjectURL(file);
  //     if (file.name.length > 8) {
  //       para.textContent = file.name.substring(0, 8) + "...";
  //     } else {
  //       para.textContent = file.name;
  //     }
  //     div.append(image, para);
  //     fragment.append(div);
  //   }
  // }

  if (invalidTypeMsg.length !== 0) {
    const p = document.createElement("p");
    p.textContent = `File(s) ${invalidTypeMsg.join(
      ", "
    )}: Not a valid file type. Allowed formats jpeg, jpg, png. Update your selection.`;
    fragmentErrors.append(p);
  }
  if (invalidSizeMsg.length !== 0) {
    const p = document.createElement("p");
    p.textContent = `File(s) ${invalidSizeMsg.join(
      ", "
    )} too large. Maximum size 3Mb.`;
    fragmentErrors.append(p);
  }

  fileInputError.append(fragmentErrors);
}

function validFileType(file) {
  return fileTypes.includes(file.type);
}

function valiadateFileSize(file) {
  console.log(file.size);
  return file.size < MAXFILESIZE ? true : false;
}
