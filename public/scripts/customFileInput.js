const fileInputImages = document.querySelector(".fileInputImages");
const fileInputPreview = document.querySelector(".ImagePreview");
const pInvalidType = document.querySelector("#invalidType");
const pInvalidSize = document.querySelector("#invalidSize");
const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
const MAXFILESIZE = 1024 ** 2 * 3;

if (fileInputImages) {
  fileInputImages.addEventListener("change", updateImagePreview);
}

function updateImagePreview() {
  while (fileInputPreview.firstChild) {
    fileInputPreview.removeChild(fileInputPreview.firstChild);
  }
  let invalidTypeMsg = [];
  let invalidSizeMsg = [];
  const fragment = new DocumentFragment();

  //create document fragemnt
  for (const file of fileInputImages.files) {
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
      fragment.append(div);
    }
  }
  fileInputPreview.append(fragment);
  if (invalidTypeMsg.length !== 0) {
    pInvalidType.textContent = `File(s) ${invalidTypeMsg.join(
      ", "
    )}: Not a valid file type. Allowed formats jpeg, jpg, png. Update your selection.`;
  }
  if (invalidSizeMsg.length !== 0) {
    pInvalidSize.textContent = `File(s) ${invalidSizeMsg.join(
      ", "
    )} too large. Maximum size 3Mb.`;
  }
}

function validFileType(file) {
  return fileTypes.includes(file.type);
}

function valiadateFileSize(file) {
  console.log(file.size);
  return file.size < MAXFILESIZE ? true : false;
}

/////////////
// function imagePreview(event) {
//   const number = fileInputImages.files.length;
//   fileInputPreview.innerHTML = "";
//   let str = "";
//   for (i = 0; i < number; i++) {
//     console.log(event.target.files[i]);
//     const urls = URL.createObjectURL(event.target.files[i]);
//     let name = event.target.files[i].name;
//     if (name.length > 8) {
//       name = name.substring(0, 8) + "...";
//     }
//     str += `<div><img src="${urls}"><p>${name}</p></div>`;
//   }
//   fileInputPreview.innerHTML = str;
// }
//////////////

//need to do https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file

// fileInputImages.addEventListener("change", (event) => {
//   const number = fileInputImages.files.length;
//   fileInputPreview.innerHTML = "";
//   let str = "";
//   for (i = 0; i < number; i++) {
//     console.log(event.target.files[i]);
//     const urls = URL.createObjectURL(event.target.files[i]);
//     let name = event.target.files[i].name;
//     if (name.length > 8) {
//       name = name.substring(0, 8) + "...";
//     }
//     str += `<div><img src="${urls}"><p>${name}</p></div>`;
//   }
//   fileInputPreview.innerHTML = str;
// });

// function previewMultiple(event) {
//   const images = document.getElementById("fileInputImages");
//   document.getElementById("ImagePreview").innerHTML = "";
//   console.log(images);
//   const number = images.files.length;
//   for (i = 0; i < number; i++) {
//     console.log(event.target.files[i]);
//     var urls = URL.createObjectURL(event.target.files[i]);
//     console.log(urls);
//     document.getElementById("ImagePreview").innerHTML +=
//       '<img src="' + urls + '">';
//   }
// }
