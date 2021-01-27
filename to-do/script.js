//* refresh page every day (at 00:00)
addEventListener("DOMContentLoaded", () => {
  let date = new Date();
  date = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  let remainingTime = 86400 - date;
  console.log(remainingTime);
  setTimeout(() => {
    location.reload();
  }, remainingTime * 1000);
});

//* set time in header
addEventListener("DOMContentLoaded", () => {
  let headerDate = document.querySelector("#headerDate");
  let date = new Date();
  let weekday = date.toLocaleDateString(undefined, { weekday: "long" }); //undefined bi trebalo dati system default
  let day = date.getDate();
  let month = date.toLocaleDateString(undefined, { month: "long" });
  headerDate.innerHTML = weekday + ", " + day + " " + month;
});

//* Mijenja vidljivost footer elemenata
function footerVisibilitySwitch() {
  const footer = document.querySelector(".footer");
  //Toggle-a klasu aktive (display:none) za footer
  for (let i = 0; i < footer.children.length; i++) {
    footer.children[i].classList.toggle("footerActive");
  }
}

//* Funkcija za dodavanje novog taska (kreiranje li i ubacivanje u html):
function addNewTask() {
  let textInput = document.querySelector("#taskInput");
  if (textInput.value == "") {
    return;
  }

  //* dio za kreiranje novog taska:
  let newLi = document.createElement("li");
  let textNode = document.createTextNode("");
  newLi.appendChild(textNode);
  newLi.classList.add("task");
  newLi.innerHTML =
    '<img class="emptyCircle" src="SVG/empty-circle.svg" alt="emptyCircle" /><img class="tickedCircle" src="SVG/ticked-circle.svg" alt="tickedCircle" onclick="completeTask(this)"/><div class="textPartofTask"><p class="taskText">' +
    textInput.value +
    '</p></div><img src="SVG/options-circle.svg" alt="optionsCircle"/>';
  // TODO: Doda id sa counterom, dodati kad napravim counter:
  // newLi.setAttribute("id",counter)
  document.querySelector(".allTasksUl").appendChild(newLi);

  //* skrivanje footera i clear-anje input forme
  textInput.value = "";
  footerVisibilitySwitch();
}

//* Funkcija za označavanje taska kao obavljenog:
function completeTask(tickedCircle) {
  let wholeTask = tickedCircle.parentNode;

  //animacija kruga
  let emptyCircle = wholeTask.querySelector(".emptyCircle");
  emptyCircle.style.opacity = "0";
  tickedCircle.style.opacity = "1";

  wholeTask.style.transform = "translateX(100px)";
  wholeTask.style.opacity = "0";

  setTimeout(() => {
    console.log("donetask");
    wholeTask.classList.add("doneTask");
  }, 900);
}

//TODO: kada se bira datum: kreirati p element, appendati na .textPartofTask div, i onda classList.add("taskDate");
