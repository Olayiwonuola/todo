function itemTemplate(item) {
  return `
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`;
}
//initial page load render
let ourHTML = items
  .map(function (item) {
    return itemTemplate(item);
  })
  .join();

document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

//create feature

let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (createField.value) {
    axios
      .post("/create-item", {
        text: createField.value,
      })
      .then(function (response) {
        //create html
        document
          .getElementById("item-list")
          .insertAdjacentHTML("beforeend", itemTemplate(response.data));
        createField.value = "";
        createField.focus();
      })
      .catch(function () {
        console.log("Try again later");
      });
  }
});

document.addEventListener("click", function (e) {
  //delete
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Are you sure you want to delete permanently?")) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log("Try again later");
        });
    }
  }

  //update
  if (e.target.classList.contains("edit-me")) {
    // alert("ffd");
    let userInput = prompt(
      "Enter your new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );
    // console.log(userInput);
    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(function () {
          console.log("Try again later");
        });
    }
  }
});
