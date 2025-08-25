const bookmarkForm = document.getElementById("bookmarkForm");

bookmarkForm.addEventListener("submit", saveBookmark);

document.addEventListener("DOMContentLoaded", fetchbookMarks);

function hrefClick(url) {
  window.open(url, "_blank");
}

function deleteBookmark(url) {
  let bookMarks = JSON.parse(localStorage.getItem("bookMarks"));
    let index = bookMarks.findIndex(b => b.url === url);
  if(index !==-1){
   bookMarks = bookMarks.filter((item) => item.url !== url);

  localStorage.setItem("bookMarks", JSON.stringify(bookMarks));
   new Toaster("Bookmark deleted successfully", "success");
  }

  fetchbookMarks();
}

function fetchbookMarks() {
  let bookMarks = JSON.parse(localStorage.getItem("bookMarks")) || [];
  let bookmarkOutput = document.getElementById("bookmarkOutput");
  bookmarkOutput.innerHTML = "";
  bookMarks.forEach((bookmark) => {
    bookmarkOutput.innerHTML += `<div class="card">
                <div class="card-content">
                    <div style="display:flex;justify-content:space-between">
                    <h4>${bookmark.name} </h4>
                    <span class="bookmarkDate">${bookmark.date}
                    </span>
                    
                    
                    </div>
                    <p>${bookmark.desc}</p>
                </div>
                <div class="card-footer">
                    <div class="btn-grup">
                        <button class="view-btn" onClick = "hrefClick('${bookmark.url}')">View</button>
                        <button class="del-btn" onClick = "deleteBookmark('${bookmark.url}')">Delete</button>

                    </div>
                </div>
            </div> `;
  });
}

function saveBookmark(e) {
  e.preventDefault();
  let siteName = document.getElementById("siteName").value;
  let siteUrl = document.getElementById("siteUrl").value;
  let siteDesc = document.getElementById("siteDesc").value;

  if (!validateForm(siteName, siteDesc, siteUrl)) {
    return false;
  } else {
    let today = new Date();
    let formattedDate =
      today.getDate().toString().padStart(2, "0") +
      "/" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      today.getFullYear();

    let bookmark = {
      name: siteName,
      url: siteUrl,
      desc: siteDesc,
      date: formattedDate,
    };

    let bookMarks;
    if (localStorage.getItem("bookMarks") === null) {
      bookMarks = [];
      bookMarks.push(bookmark);
      localStorage.setItem("bookMarks", JSON.stringify(bookMarks));
    } else {
      bookMarks = JSON.parse(localStorage.getItem("bookMarks"));
      bookMarks.push(bookmark);
      localStorage.setItem("bookMarks", JSON.stringify(bookMarks));
    }
  }
  bookmarkForm.reset();
  new Toaster("Bookmark created successfully", "success");
  fetchbookMarks();
}

function validateForm(siteName, siteDesc, siteUrl) {
  if (!siteName || !siteUrl || !siteDesc) {
    new Toaster("Please Fill all fields", "error");
    return false;
  }

  var expression =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (!siteUrl.match(regex)) {
    new Toaster("Site URL should be Valid", "error");
    return false;
  }

  let bookMarks = JSON.parse(localStorage.getItem("bookMarks")) || [];
  for (const bookmark of bookMarks) {
    if (bookmark.name === siteName) {
      new Toaster("Site name already exists", "error");
      return false;
    }

    if (bookmark.url === siteUrl) {
      new Toaster("Site URL already exists", "error");
      return false;
    }
  }

  return true;
}

let toastElement = null;
let toastTimeout = null;

function Toaster(message, className) {
  if (!toastElement) {
    toastElement = document.createElement("div");
    document.body.appendChild(toastElement);
  }
  toastElement.className = className;
  toastElement.style.display = "block";
  toastElement.innerHTML = "";

  const div = document.createElement("div");
  let overlay = document.getElementById("overlay");

  div.innerHTML = `<i class="fa fa-remove" onclick="removeToaster(overlay)" style="margin-right:10px;font-size:17px"></i>${message}`;
  toastElement.appendChild(div);
  if (className == "error") {
    overlay.style.display = "block";
  }

  // Remove the toast after 3 seconds

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Remove the toast after 3 seconds
  toastTimeout = setTimeout(() => {
    toastElement.innerHTML = "";
    toastElement.className = "";
    toastElement.style.display = "none";
    overlay.style.display = "none";
  }, 3000);
}

function removeToaster(overlay) {
  toastElement.style.display = "none";
  overlay.style.display = "none";
}
