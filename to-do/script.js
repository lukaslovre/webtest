//* refresh page every day (at 00:00)
/*addEventListener("DOMContentLoaded", () => {
  let date = new Date();
  date = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  let remainingTime = 86400 - date;
  console.log(remainingTime);
  setTimeout(() => {
    location.reload();
  }, remainingTime * 1000);
});
*/

//* set date in header
function writeCurrentDate() {
  //upisivanje u header
  let headerDate = document.querySelector("#headerDate");
  let date = new Date();
  let weekday = date.toLocaleDateString(undefined, { weekday: "long" }); //undefined bi trebalo dati system default
  let day = date.getDate();
  let month = date.toLocaleDateString(undefined, { month: "long" });
  headerDate.innerHTML = weekday + ", " + day + " " + month;

  //zakazanje sljedeceg "refresha"
  dateInSec =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  let remainingTime = 86400 - dateInSec; //86400
  console.log(remainingTime);
  setTimeout(() => {
    writeCurrentDate();
  }, remainingTime * 1000);
}
addEventListener("DOMContentLoaded", writeCurrentDate());

//* Mijenja vidljivost footer elemenata i fokusira input
function footerVisibilitySwitch(footerSelection, editCircle) {
  const footer = document.querySelector(".footer");
  const inputBox = document.querySelector("#taskInput");

  //provjerava se dali se dodaje novi task ili edita stari:
  //ako se dodaje novi task:
  if (footerSelection == "add") {
    inputBox.style.display = "initial";
    document.querySelector(".newTaskBtn").style.display = "none";
    document.querySelector(".editTaskBtn").style.display = "none";
    document.querySelector(".cancelDateBtn").style.display = "none";
    document.querySelector(".addTaskBtn").style.display = "initial";
  }
  //ako se edita stari task:
  else if (footerSelection == "edit") {
    let task = editCircle.parentNode.parentNode;
    let taskContent = task.querySelector(".taskText").innerHTML;
    currentlySelectedTask = task;
    inputBox.value = taskContent;

    inputBox.style.display = "initial";
    document.querySelector(".newTaskBtn").style.display = "none";
    document.querySelector(".addTaskBtn").style.display = "none";
    document.querySelector(".cancelDateBtn").style.display = "none";
    document.querySelector(".editTaskBtn").style.display = "initial";

    expandRightButton(task.querySelector(".optionsCircle"));
  }
  //ako se gasi kalendar
  else if (footerSelection == "dateCancel") {
    inputBox.style.display = "none";
    document.querySelector(".newTaskBtn").style.display = "none";
    document.querySelector(".addTaskBtn").style.display = "none";
    document.querySelector(".editTaskBtn").style.display = "none";
    document.querySelector(".cancelDateBtn").style.display = "initial";
  }
  //samo new task btn
  else if (footerSelection == "default") {
    inputBox.style.display = "none";
    document.querySelector(".newTaskBtn").style.display = "initial";
    document.querySelector(".editTaskBtn").style.display = "none";
    document.querySelector(".cancelDateBtn").style.display = "none";
    document.querySelector(".addTaskBtn").style.display = "none";
  }

  //Toggle-a klasu aktive (display:none) za footer
  /*for (let i = 0; i < footer.children.length; i++) {
    footer.children[i].classList.toggle("footerActive");
  }
  */

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
  /* newLi.innerHTML =
    '<img class="emptyCircle" src="SVG/empty-circle.svg" alt="emptyCircle" onclick="completeTask(this)" /><img class="tickedCircle" src="SVG/ticked-circle.svg" alt="tickedCircle" /><div class="textPartofTask"><p class="taskText">' +
    textInput.value +
    '</p></div><img src="SVG/options-circle.svg" alt="optionsCircle"/>';
    */
  //dole je novo
  newLi.innerHTML =
    '<img class="emptyCircle" src="SVG/empty-circle.svg" onclick="completeTask(this)"/><img class="tickedCircle" src="SVG/ticked-circle.svg"/><div class="textPartofTask"><p class="taskText">' +
    textInput.value +
    '</p><p class="taskDate"></p></div><div class="right-task-buttons"><img src="SVG/edit-circle.svg" class="right-hidden-button editCircle" onclick="footerVisibilitySwitch(\'edit\',this)"/><img src="SVG/thrash-circle.svg" class="right-hidden-button thrashCircle" onclick="deleteTask(this)"/><img src="SVG/date-circle.svg" class="right-hidden-button dateCircle" onclick="showCalendar(this)"/><img src="SVG/options-circle.svg" class="optionsCircle" onclick="expandRightButton(this)"/></div>';
  // TODO: Doda id sa counterom, dodati kad napravim counter:
  // newLi.setAttribute("id",counter)
  document.querySelector(".allTasksUl").appendChild(newLi);

  //skrivanje footera i clear-anje input forme
  textInput.value = "";

  footerVisibilitySwitch("default");
}

/*




               !TU SVE GORE BI TREBALO RADIT 





*/
let isLocked = 0;
//* Funkcija za označavanje taska kao obavljenog ili vraćanje na neobavljeni:
function completeTask(emptyCircle) {
  if (isLocked) {
    return;
  }
  let task = emptyCircle.parentNode;
  let tickedCircle = task.querySelector(".tickedCircle");
  let taskText = task.querySelector(".taskText");
  isLocked = 1;
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
    isLocked = 0;
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

//* funkcija expanda more-options gumb:
function expandRightButton(optionsBtn) {
  let rightButtonsDiv = optionsBtn.parentNode;
  let allHidenBtns = rightButtonsDiv.querySelectorAll(".right-hidden-button");
  let thrashBtn = rightButtonsDiv.querySelector(".thrashCircle");
  let editBtn = rightButtonsDiv.querySelector(".editCircle");
  let dateBtn = rightButtonsDiv.querySelector(".dateCircle");

  //ako gumbi nisu expandani
  if (thrashBtn.style.zIndex != 1) {
    allHidenBtns.forEach((element) => {
      element.style.zIndex = "1";
      element.style.opacity = "1";
    });
    optionsBtn.style.transform = "translateX(32px)";
    thrashBtn.style.transform = "translateY(-28px)";
    editBtn.style.transform = "translateX(-32px)";
    dateBtn.style.transform = " translateY(28px)";
  }
  //ako su gumbi vec expandani onda ih smanji
  else {
    allHidenBtns.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translate(0)";
      setTimeout(() => {
        element.style.zIndex = "-1";
      }, 200);
    });
    optionsBtn.style.transform = "translateX(0px)";
  }
}

//* funkcija briše task (delete task gumb):
function deleteTask(deleteBtn) {
  let task = deleteBtn.parentNode.parentNode;
  task.style.animation = "250ms deleteTask 50ms ease-in forwards";
  setTimeout(() => {
    task.remove();
  }, 500);
}

//* funkcija koja se aktivira kada se stisne Edit gumb na footeru:
let currentlySelectedTask; //globalna varijabla kako bi se mogao editati task (da mozemo promjeniti na odredenom tasku text)
function submitEditTask() {
  let textInput = document.querySelector("#taskInput");

  if (textInput.value == "") {
    return;
  }

  currentlySelectedTask.querySelector(".taskText").innerHTML = textInput.value;

  textInput.value = "";
  footerVisibilitySwitch("default");
}

/*

            KALENDAR:


*/

//* Dio za kalendar:

let monthSelector = 0; //globalna var za pracenje koji datum je odabran
let yearSelector = 0;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function showCalendar(taskCalendarBtn) {
  let task = taskCalendarBtn.parentNode.parentNode;
  currentlySelectedTask = task;
  let optionsBtn = task.querySelector(".optionsCircle");
  expandRightButton(optionsBtn);
  document.querySelector(".calendar").style.display = "flex";
  document.querySelector(".allTasksUl").style.display = "none";
  footerVisibilitySwitch("dateCancel");
  generateCalendar(monthSelector, yearSelector);
}
function hideCalendar() {
  document.querySelector(".calendar").style.display = "none";
  document.querySelector(".allTasksUl").style.display = "initial";
  monthSelector = 0;
  yearSelector = 0;
  footerVisibilitySwitch("default");
}

function generateCalendar(monthSelector, yearSelector) {
  let date = new Date(); //danasnji datum
  let month = date.getMonth() + monthSelector + 1; //racuna mjesec koji se treba prikazivati
  let monthFullName = monthNames[month - 1];
  let year = date.getFullYear() + yearSelector; //racuna godinu koja se treba prikazivati

  document.querySelector(".calendar-MonthYear").innerHTML =
    monthFullName + ", " + year; //upisuje mjesec u calendar-header

  let daysInMonth = getDaysInMonth(year, month); //uzima broj dana u mjesecu
  let firstDay = getFirstDay(year, month - 1); //uzima kada je prvi dan u mjesecu

  //upisuje dane u polja kalendara
  let dayCounter = 1;
  for (let i = 1; i <= 42; i++) {
    if (i >= firstDay && i <= daysInMonth + firstDay - 1) {
      document.getElementById(`day-${i}`).innerHTML = dayCounter;
      document.getElementById(`day-${i}`).style.backgroundColor = "#dfffd6";
      dayCounter++;
    } else {
      document.getElementById(`day-${i}`).innerHTML = "";
      document.getElementById(`day-${i}`).style.backgroundColor = "#f3ffe1";
    }
    if (dayCounter == date.getDate() + 1 && month == date.getMonth() + 1) {
      document.getElementById(`day-${i}`).style.backgroundColor = "#7dcfb6";
    }
  }

  //dio za odabir datuma
  let taskDateElement = currentlySelectedTask.querySelector(".taskDate");
  let calendarDays = document.querySelectorAll(".calendar-days");
  calendarDays.forEach((day) => {
    day.addEventListener("click", () => {
      if (day.innerHTML == "") {
        return;
      } else {
        if (year == date.getFullYear()) {
          taskDateElement.style.display = "initial";
          taskDateElement.innerHTML = day.innerHTML + ", " + monthFullName;
        } else {
          taskDateElement.style.display = "initial";
          taskDateElement.innerHTML =
            day.innerHTML + ", " + monthFullName + ", " + year;
        }
        hideCalendar();
      }
    });
  });
}

//

let leftArrow = document.querySelector(".leftArrow");
let rightArrow = document.querySelector(".rightArrow");

//prijasnji mjesec
leftArrow.addEventListener("click", () => {
  let date = new Date();
  monthSelector--;
  if (monthSelector + (date.getMonth() + 1) == 0) {
    monthSelector = 12 - (date.getMonth() + 1);
    yearSelector--;
  }
  generateCalendar(monthSelector, yearSelector);
});

//sljedeci mjesec
rightArrow.addEventListener("click", () => {
  let date = new Date();
  monthSelector++;
  if (monthSelector + date.getMonth() + 1 == 13) {
    monthSelector = 1 - (date.getMonth() + 1);
    yearSelector++;
  }
  generateCalendar(monthSelector, yearSelector);
});

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstDay(year, month) {
  let firstDay = new Date(year, month, 1).getDay();
  if (firstDay == 0) {
    firstDay = 7;
  }
  return firstDay;
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
