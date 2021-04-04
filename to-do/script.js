const viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute(
  "content",
  viewport.content + ", height=" + window.innerHeight
);

let todayDate;
//* refresh page every day (at 00:00)
/*addEventListener("DOMContentLoaded", () => {
  let todayDate = new Date();
  todayDate = todayDate.getHours() * 3600 + todayDate.getMinutes() * 60 + todayDate.getSeconds();
  let remainingTime = 86400 - todayDate;
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
  todayDate = new Date();
  let weekday = todayDate.toLocaleDateString(undefined, { weekday: "long" }); //undefined bi trebalo dati system default
  let day = todayDate.getDate();
  let month = todayDate.toLocaleDateString(undefined, { month: "long" });
  headerDate.innerHTML = weekday + ", " + day + " " + month;

  //zakazanje sljedeceg "refresha"
  let dateInSec =
    todayDate.getHours() * 3600 +
    todayDate.getMinutes() * 60 +
    todayDate.getSeconds();
  let remainingTime = 86400 - dateInSec; //86400
  console.log(remainingTime);
  setTimeout(() => {
    writeCurrentDate();
  }, remainingTime * 1000);
}
addEventListener(
  "DOMContentLoaded",
  writeCurrentDate(),
  getGeolocation(),
  getInitialTasks(),
  setVisibilityOfTask()
);

//* Set temp in header
function getGeolocation() {
  navigator.geolocation.getCurrentPosition(async function (position) {
    let lat = await position.coords.latitude;
    let long = await position.coords.longitude;
    getWeather(lat, long);
  });
}

function getWeather(lat, long) {
  async function getData() {
    let res = await fetch(url);
    let info = await res.json();
    info = info.data[0];
    document.getElementById("weatherTemperature").innerHTML =
      parseInt(info.temp) + " °C";
    document.getElementById("weatherDescription").innerHTML =
      info.weather.description;
    document.getElementById("weatherLocation").innerHTML = info.city_name;
    document.getElementById("weatherIcon").src =
      "icons/" + info.weather.icon + ".png";
  }

  let apiKey = "1ed9439028fa4302a75bcf238dd59ec0";
  let url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${apiKey}`;

  getData();
}

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

    setVisibilityOfTask();
  }

  //fokusira se na input
  inputBox.focus();
}
let taskCounter = parseInt(localStorage.getItem("taskCounter"));
if (!taskCounter) taskCounter = 1;

//* Funkcija za dodavanje novog taska (kreiranje li i ubacivanje u html):
function addNewTask() {
  let textInput = document.querySelector("#taskInput");
  let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));

  if (textInput.value == "") {
    return;
  }

  // dio za kreiranje novog taska:
  let newLi = document.createElement("li");
  let textNode = document.createTextNode("");
  newLi.appendChild(textNode);
  newLi.classList.add("task", "unfinished");

  //dole je novo
  newLi.innerHTML =
    '<img class="emptyCircle" src="SVG/empty-circle.svg" onclick="completeTask(this)"/><img class="tickedCircle" src="SVG/ticked-circle.svg"/><div class="textPartofTask"><p class="taskText">' +
    textInput.value +
    '</p><p class="taskDate"></p></div><div class="right-task-buttons"><img src="SVG/edit-circle.svg" class="right-hidden-button editCircle" onclick="footerVisibilitySwitch(\'edit\',this)"/><img src="SVG/thrash-circle.svg" class="right-hidden-button thrashCircle" onclick="deleteTask(this)"/><img src="SVG/date-circle.svg" class="right-hidden-button dateCircle" onclick="showCalendar(this)"/><img src="SVG/options-circle.svg" class="optionsCircle" onclick="expandRightButton(this)"/></div>';

  newLi.setAttribute("id", taskCounter);
  document.querySelector(".allTasksUl").appendChild(newLi);

  // !upisivanje u memoriju

  let attrib;
  if (allTasksFromMemory) {
    attrib = {
      id: taskCounter,
      taskText: textInput.value,
      state: "unfinished",
    };
  } else {
    attrib = [
      {
        id: taskCounter,
        taskText: textInput.value,
        state: "unfinished",
      },
    ];
  }

  if (allTasksFromMemory) {
    allTasksFromMemory.push(attrib);

    localStorage.setItem("tasks", JSON.stringify(allTasksFromMemory));
  } else {
    localStorage.setItem("tasks", JSON.stringify(attrib));
  }

  // !u memoriju

  //skrivanje footera i clear-anje input forme
  taskCounter++;
  localStorage.setItem("taskCounter", taskCounter);
  textInput.value = "";
  footerVisibilitySwitch("default");
}

function getInitialTasks() {
  let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));
  if (!allTasksFromMemory) return;

  for (let i = 0; i < allTasksFromMemory.length; i++) {
    console.log(allTasksFromMemory[i]);
    if (!allTasksFromMemory[i].date) allTasksFromMemory[i].date = "";

    // dio za kreiranje novog taska:
    let newLi = document.createElement("li");
    let textNode = document.createTextNode("");
    newLi.appendChild(textNode);
    newLi.classList.add("task", allTasksFromMemory[i].state); //TODO: poslati i state

    newLi.innerHTML =
      '<img class="emptyCircle" src="SVG/empty-circle.svg" onclick="completeTask(this)"/><img class="tickedCircle" src="SVG/ticked-circle.svg"/><div class="textPartofTask"><p class="taskText">' +
      allTasksFromMemory[i].taskText +
      '</p><p class="taskDate">' +
      allTasksFromMemory[i].date +
      '</p></div><div class="right-task-buttons"><img src="SVG/edit-circle.svg" class="right-hidden-button editCircle" onclick="footerVisibilitySwitch(\'edit\',this)"/><img src="SVG/thrash-circle.svg" class="right-hidden-button thrashCircle" onclick="deleteTask(this)"/><img src="SVG/date-circle.svg" class="right-hidden-button dateCircle" onclick="showCalendar(this)"/><img src="SVG/options-circle.svg" class="optionsCircle" onclick="expandRightButton(this)"/></div>';

    newLi.setAttribute("id", allTasksFromMemory[i].id);
    if (allTasksFromMemory[i].date != "") {
      newLi.querySelector(".taskDate").style.display = "initial";

      let deconstructedSelectedDate = allTasksFromMemory[
        i
      ].realDateFormat.split("-");
      deconstructedSelectedDate[2] = deconstructedSelectedDate[2].slice(0, 2);
      let selectedDate = new Date(
        deconstructedSelectedDate[0],
        parseInt(deconstructedSelectedDate[1]) - 1,
        parseInt(deconstructedSelectedDate[2]) + 1
      );

      if (selectedDate > todayDate) {
        newLi.querySelector(".taskDate").style.backgroundColor = "#695cff";
      } else {
        newLi.querySelector(".taskDate").style.backgroundColor = "#FF5C5C";
      }
    }

    document.querySelector(".allTasksUl").appendChild(newLi);
  }
}

//localStorage.clear();
/*




               !TU SVE GORE BI TREBALO RADIT 





*/
let isLocked = 0;
//* Funkcija za označavanje taska kao obavljenog ili vraćanje na neobavljeni:
function completeTask(emptyCircle) {
  if (isLocked) {
    return;
  }
  let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));
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
    for (let i = 0; i < allTasksFromMemory.length; i++) {
      if (allTasksFromMemory[i].id == task.id) {
        allTasksFromMemory[i].state = "finished";
        console.log(allTasksFromMemory);
      }
    }
  } else {
    //ako je finished->unfinished
    emptyCircle.style.opacity = "1";
    tickedCircle.style.opacity = "0";
    taskText.style.textDecoration = "none";
    task.style.animation = "300ms RightToLeftFadeOut 400ms ease-in forwards";
    task.classList.replace("finished", "unfinished");
    for (let i = 0; i < allTasksFromMemory.length; i++) {
      if (allTasksFromMemory[i].id == task.id) {
        allTasksFromMemory[i].state = "unfinished";
      }
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasksFromMemory));

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
    document.querySelector(".newTaskBtn").style.display = "initial";
  }
  //ako smo na finished tabu: prikazi finished i sakri unfinished
  else {
    unfinishedTasks.forEach((element) => {
      element.style.opacity = "0";
      element.style.display = "none";
    });
    finishedTasks.forEach((element) => {
      console.log(element);
      element.querySelector(".emptyCircle").style.opacity = "0";
      element.querySelector(".tickedCircle").style.opacity = "1";
      element.querySelector(".taskText").style.textDecoration = "line-through";

      element.style.display = "flex";
    });
    document.querySelector(".newTaskBtn").style.display = "none";
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

  let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < allTasksFromMemory.length; i++) {
    if (allTasksFromMemory[i].id == task.id) {
      allTasksFromMemory.splice(i, 1);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasksFromMemory));

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

  let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < allTasksFromMemory.length; i++) {
    if (allTasksFromMemory[i].id == currentlySelectedTask.id) {
      allTasksFromMemory[i].taskText = textInput.value;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasksFromMemory));

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
  generateCalendar();
}
function hideCalendar() {
  document.querySelector(".calendar").style.display = "none";
  document.querySelector(".allTasksUl").style.display = "initial";
  monthSelector = 0;
  yearSelector = 0;
  footerVisibilitySwitch("default");
}

function generateCalendar() {
  let month = todayDate.getMonth() + monthSelector + 1; //racuna mjesec koji se treba prikazivati
  let monthFullName = monthNames[month - 1];
  let year = todayDate.getFullYear() + yearSelector; //racuna godinu koja se treba prikazivati

  document.querySelector(".calendar-MonthYear").innerHTML =
    monthFullName + ", " + year; //upisuje mjesec u calendar-header

  let daysInMonth = getDaysInMonth(year, month); //uzima broj dana u mjesecu
  let firstDay = getFirstDay(year, month - 1); //uzima kada je prvi dan u mjesecu

  //upisuje dane u polja kalendara
  let dayCounter = 1;
  for (let i = 1; i <= 42; i++) {
    if (i >= firstDay && i <= daysInMonth + firstDay - 1) {
      document.getElementById(`day-${i}`).innerHTML = dayCounter;
      document.getElementById(`day-${i}`).style.backgroundColor = "#dbefff"; // #dfffd6
      dayCounter++;
    } else {
      document.getElementById(`day-${i}`).innerHTML = "";
      document.getElementById(`day-${i}`).style.backgroundColor = "#fcf7fc"; //#f3ffe1
    }
    if (
      i == todayDate.getDate() + firstDay - 1 &&
      month == todayDate.getMonth() + 1 &&
      year == todayDate.getFullYear()
    ) {
      document.getElementById(`day-${i}`).style.backgroundColor = "#e7cbfd"; //#7dcfb6
    }
  }
}

//

//dio za odabir datuma
let calendarDays = document.querySelectorAll(".calendar-days");
calendarDays.forEach((day) => {
  //na svaki dan dodaje eventlistener
  day.addEventListener("click", () => {
    let taskDateElement = currentlySelectedTask.querySelector(".taskDate");
    let month = todayDate.getMonth() + monthSelector;
    let monthFullName = monthNames[month];
    let year = todayDate.getFullYear() + yearSelector;
    let odabraniDatum = new Date(year, month, day.innerHTML);
    let odabraniDatumSutra = new Date(year, month, parseInt(day.innerHTML) - 1);
    let odabraniDatumJučer = new Date(year, month, parseInt(day.innerHTML) + 1);

    //provjera dali polje sadrži datum
    if (day.innerHTML == "") {
      return;
    } else {
      taskDateElement.style.display = "initial";
      //provjera dali je odabrani datum u trenutnoj godini
      if (year == todayDate.getFullYear()) {
        //provjera dali je odabrani dan danas:
        /* if (
          odabraniDatum.getDate() == todayDate.getDate() &&
          odabraniDatum.getMonth() == odabraniDatum.getMonth()
        ) {
          taskDateElement.innerHTML = "Today";
        }
        //provjera dali je odabrani dan sutra:
        else if (
          odabraniDatumSutra.getDate() == todayDate.getDate() &&
          odabraniDatumSutra.getMonth() == todayDate.getMonth()
        ) {
          taskDateElement.innerHTML = "Tomorrow";
        }
        //provjera dali je odabrani dan jučer:
        else if (
          odabraniDatumJučer.getDate() == todayDate.getDate() &&
          odabraniDatumJučer.getMonth() == todayDate.getMonth()
        ) {
          taskDateElement.innerHTML = "Yesterday";
        }
        
        //ako nije onda ispisati cijeli datum
        else {
          */
        taskDateElement.innerHTML = day.innerHTML + ", " + monthFullName;
        //}
      }
      //ako nije u trenutnoj godini:
      else {
        taskDateElement.innerHTML =
          day.innerHTML + ", " + monthFullName + ", " + year;
      }

      //provjera dali je odabrani datum prošao:
      if (odabraniDatumJučer > todayDate) {
        taskDateElement.style.backgroundColor = "#695cff";
      } else {
        taskDateElement.style.backgroundColor = "#FF5C5C";
      }

      // Upisivanje u memoriju:
      let taskId = currentlySelectedTask.id;
      let allTasksFromMemory = JSON.parse(localStorage.getItem("tasks"));

      allTasksFromMemory.forEach((task) => {
        if (task.id == taskId) {
          task.date = taskDateElement.innerHTML;
          task.realDateFormat = odabraniDatumJučer;
        }
      });
      console.log(allTasksFromMemory);
      localStorage.setItem("tasks", JSON.stringify(allTasksFromMemory));

      hideCalendar();
    }
  });
});

let leftArrow = document.querySelector(".leftArrow");
let rightArrow = document.querySelector(".rightArrow");

//prijasnji mjesec
leftArrow.addEventListener("click", () => {
  monthSelector--;
  if (monthSelector + (todayDate.getMonth() + 1) == 0) {
    monthSelector = 12 - (todayDate.getMonth() + 1);
    yearSelector--;
  }
  generateCalendar();
});

//sljedeci mjesec
rightArrow.addEventListener("click", () => {
  monthSelector++;
  if (monthSelector + todayDate.getMonth() + 1 == 13) {
    monthSelector = 1 - (todayDate.getMonth() + 1);
    yearSelector++;
  }
  generateCalendar();
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
