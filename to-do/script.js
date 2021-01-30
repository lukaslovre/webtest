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

//* set date in header
addEventListener("DOMContentLoaded", () => {
  let headerDate = document.querySelector("#headerDate");
  let date = new Date();
  let weekday = date.toLocaleDateString(undefined, { weekday: "long" }); //undefined bi trebalo dati system default
  let day = date.getDate();
  let month = date.toLocaleDateString(undefined, { month: "long" });
  headerDate.innerHTML = weekday + ", " + day + " " + month;
});

//* Mijenja vidljivost footer elemenata i fokusira input
function footerVisibilitySwitch() {
  const footer = document.querySelector(".footer");
  const inputBox = document.querySelector("#taskInput");

  //Toggle-a klasu aktive (display:none) za footer
  for (let i = 0; i < footer.children.length; i++) {
    footer.children[i].classList.toggle("footerActive");
  }

  //fokusira se na input
  inputBox.focus();
}

//* Funkcija za dodavanje novog taska (kreiranje li i ubacivanje u html):
function addNewTask() {
  let textInput = document.querySelector("#taskInput");
  if (textInput.value == "") {
    return;
  }

  // dio za kreiranje novog taska:
  let newLi = document.createElement("li");
  let textNode = document.createTextNode("");
  newLi.appendChild(textNode);
  newLi.classList.add("task", "unfinished");
  newLi.innerHTML =
    '<img class="emptyCircle" src="SVG/empty-circle.svg" alt="emptyCircle" onclick="completeTask(this)" /><img class="tickedCircle" src="SVG/ticked-circle.svg" alt="tickedCircle" /><div class="textPartofTask"><p class="taskText">' +
    textInput.value +
    '</p></div><img src="SVG/options-circle.svg" alt="optionsCircle"/>';
  // TODO: Doda id sa counterom, dodati kad napravim counter:
  // newLi.setAttribute("id",counter)
  document.querySelector(".allTasksUl").appendChild(newLi);

  //skrivanje footera i clear-anje input forme
  textInput.value = "";
  footerVisibilitySwitch();
}

/*




               !TU SVE GORE BI TREBALO RADIT 





*/

//* Funkcija za označavanje taska kao obavljenog ili vraćanje na neobavljeni:
function completeTask(emptyCircle) {
  let task = emptyCircle.parentNode;
  let tickedCircle = task.querySelector(".tickedCircle");
  let taskText = task.querySelector(".taskText");

  //animacije:
  if (task.classList.contains("unfinished")) {
    //ako je unfinished->finished
    emptyCircle.style.opacity = "0";
    tickedCircle.style.opacity = "1";
    taskText.style.textDecoration = "line-through";
    task.style.animation = "300ms LeftToRightFadeOut 400ms ease-in forwards";
    task.classList.replace("unfinished", "finished");
  } else {
    //ako je finished->unfinished
    emptyCircle.style.opacity = "1";
    tickedCircle.style.opacity = "0";
    taskText.style.textDecoration = "none";
    task.style.animation = "300ms RightToLeftFadeOut 400ms ease-in forwards";
    task.classList.replace("finished", "unfinished");
  }

  setTimeout(() => {
    setVisibilityOfTask();
  }, 700);
}

//* Funkcija za skrivanje i prikazivanje taskova ovisno koji tab je aktivan
function setVisibilityOfTask() {
  let finishedTasks = document.querySelectorAll(".finished");
  let unfinishedTasks = document.querySelectorAll(".unfinished");
  //ako smo na unfinished tabu: prikazi unfinished i sakri finished
  if (document.querySelector("#unfinishedTab").classList.contains("active")) {
    unfinishedTasks.forEach((element) => {
      element.style.display = "flex";
    });
    finishedTasks.forEach((element) => {
      element.style.opacity = "0";
      element.style.display = "none";
    });
  }
  //ako smo na finished tabu: prikazi finished i sakri unfinished
  else {
    unfinishedTasks.forEach((element) => {
      element.style.opacity = "0";
      element.style.display = "none";
    });
    finishedTasks.forEach((element) => {
      element.style.display = "flex";
    });
  }
}

//* Funkcija koja switcha finished/unfinished tab
function switchTab(tab) {
  const finishTabs = document.querySelectorAll(".finishDiv p");
  const allTasks = document.querySelector(".allTasksUl");
  let tasks = allTasks.children;
  let shownTasks = [];

  //provjerava koji gumb je stisnut (dali je stisnut vec aktivan) i postavlja odgovoran tab u .active
  if (tab.classList.contains("active")) {
    return;
  } else {
    finishTabs.forEach((element) => {
      element.classList.toggle("active");
    });
  }

  setVisibilityOfTask(); //skriva odgovarajuce taskove
  animateTabSwitch(tab.id); //animira switchanje taba
}

//* funkcija koja animira switchanje taba ovisno na koji tab se prelazi
function animateTabSwitch(activeTab) {
  let finishedTasks = document.querySelectorAll(".finished");
  let unfinishedTasks = document.querySelectorAll(".unfinished");
  //ako se prebacujemo na finished tab ova animacija se radi:
  if (activeTab == "finishedTab") {
    for (let i = 0; i < finishedTasks.length; i++) {
      //finishedTasks[i].style.opacity = "0";
      finishedTasks[i].style.animation = `200ms LeftToRightFadeIn ${
        i * 200
      }ms ease-in forwards`;
      //nakon sto prode animacija ulaza vraca opacity u 1 jer inace kada unDo-amo task onda krene od opacity 0 pa skoci na 1
      setTimeout(() => {
        finishedTasks[i].style.opacity = "1";
      }, i * 200);
    }
  }
  //ako se prebacujemo na unfiinshed tab ova animacija se radi:
  else {
    for (let i = 0; i < unfinishedTasks.length; i++) {
      unfinishedTasks[i].style.opacity = "0";
      unfinishedTasks[i].style.animation = `200ms RightToLeftFadeIn ${
        i * 200
      }ms ease-in forwards`;
      //nakon sto prode animacija ulaza vraca opacity u 1 jer inace kada unDo-amo task onda krene od opacity 0 pa skoci na 1
      setTimeout(() => {
        unfinishedTasks[i].style.opacity = "1";
      }, i * 200);
    }
  }
}
/*

ovo je nesto probno za prosirenje visine taska

let textHeight = document.querySelector(".taskText").scrollHeight;
console.log(textHeight);
let task = document.querySelector(".task");
hajt = 50 + textHeight + "px";
document.querySelector(".task").style.height = hajt;
console.log(hajt);
*/
//TODO: kada se bira datum: kreirati p element, appendati na .textPartofTask div, i onda classList.add("taskDate");
