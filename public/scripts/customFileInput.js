const fileInputImages = document.querySelector(".fileInputImages");
const fileInputPreview = document.querySelector(".ImagePreview");

fileInputImages.addEventListener("change", imagePreview);

function imagePreview(event) {
  const number = fileInputImages.files.length;
  fileInputPreview.innerHTML = "";
  let str = "";
  for (i = 0; i < number; i++) {
    console.log(event.target.files[i]);
    const urls = URL.createObjectURL(event.target.files[i]);
    let name = event.target.files[i].name;
    if (name.length > 8) {
      name = name.substring(0, 8) + "...";
    }
    str += `<div><img src="${urls}"><p>${name}</p></div>`;
  }
  fileInputPreview.innerHTML = str;
}

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
