//dodavanje novog taska
let btnPressN=0;
let taskCntr=1;

function testAdd(){
    if(btnPressN==0){
        document.getElementById('taskInput').style.display = "inline";
        document.getElementById('plus').style.margin = "0.25em auto 0.25em 0.25em";

        document.getElementById('taskInput').focus();
        btnPressN=1;
    }
    else if(btnPressN==1){
        btnPressN=0;

        let taskInput = document.getElementById('taskInput').value;
        document.getElementById('taskInput').value = "";
        document.getElementById('taskInput').style.display = "none";
        document.getElementById('plus').style.margin = "0.25em auto";

        if(taskInput != ''){
            taskCntr++;
            var node = document.createElement("li");                 // Create a <li> node
            var textnode = document.createTextNode("");              // Create a text node  
            node.appendChild(textnode);                              // Append the text to <li>
            node.setAttribute("id","task"+taskCntr);
            document.getElementById("tasks").appendChild(node);      // Append <li> to <ul> with id="myList"

            document.getElementById("task"+taskCntr).innerHTML = "<div class='taskDone' onclick='taskDone(this)'><i class='fa fa-check'></i></div> <div class='taskDiv'>"+taskInput+"</div> <div class='deleteDiv' onclick='deleteTask(this)'><i class='fa fa-trash'></i></div>";
            
        }
    }
}

function deleteTask(elem){
    let taskId = elem.parentNode.id;
    document.getElementById(taskId).remove();
}
function taskDone(elem){
    let taskId = elem.parentNode.id;
    
    if (document.getElementById(taskId).style.textDecoration == "" || document.getElementById(taskId).style.textDecoration == "none"){
        document.getElementById(taskId).style.textDecoration = "line-through";
    }
    else if (document.getElementById(taskId).style.textDecoration == "line-through"){
        document.getElementById(taskId).style.textDecoration = "none";
    }
}

