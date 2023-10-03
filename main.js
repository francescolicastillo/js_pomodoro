const task = document.querySelector('#newTask');
const btnSubmit = document.querySelector('#btn-submit');
const HTMLELementTasks = document.querySelector('#toDoList');
const timer = document.getElementById("timer");
const submit = document.getElementById("submit");

let arrayTasks = [];
let isTimerOn = false;
let intervalId;
const stateTask = {
    id: 0,
    title: "",
    status: "",
}

const startsWithEmptySpace = () => {
    if(task.value == " "){
        setTimeout(() => {
            task.value = "";
        }, 20);
    }
}

const addTask = () => {
    if(task.value.length !== 0){
        if(stateTask.id > 0) {
            stateTask.title = task.value;
            saveChanges();
        } else {
            createNewTask();
        }
        task.value = "";
    }
}

const saveChanges = () => {
    const newArray = arrayTasks.map((task) => {
        const t = (task.id === stateTask.id ? stateTask : task);
        return t
    })
    arrayTasks = JSON.parse(JSON.stringify(newArray));
    editTaskTitle(stateTask.id, stateTask.title);
    stateTask.id = 0;
    stateTask.title = "";
    stateTask.status = "";
}

const editTaskTitle = (taskId, title) => {
    const task = document.getElementById(taskId);
    task.querySelector("span").innerText = title;
}

const createNewTask = () => {
    const newTask = {
        id: Date.now(),
        title: task.value,
        status: "new",
    }
    arrayTasks.push(newTask);
    HTMLELementTasks.insertAdjacentHTML("afterBegin", 
                                        `<div id=${newTask.id}>
                                            <button type="button" id="start-${newTask.id}" title="start">Start</button> 
                                            <span>${task.value}</span>
                                            <button class="edit" type="button" id="edit-${newTask.id}" title="edit">edit</button>
                                            <button class="delete" type="button" id="dele-${newTask.id}" title="delete">Dele</button>
                                        </div>`);
    document.getElementById(`start-${newTask.id}`).addEventListener("click", startTask);
    document.getElementById(`edit-${newTask.id}`).addEventListener("click", editTaskStatus);
    document.getElementById(`dele-${newTask.id}`).addEventListener("click", deleTask);
}


const startTask = (btnId) => {
    const task = arrayTasks.find(t => t.id == btnId.target.id.split("-")[1]);
    const btnTask = document.getElementById(`start-${task.id}`);
    btnTask.innerHTML = "In Process...";
    // btnTask.style = "display = disable";
    if(task.status !== "active") {
        task.status = "active";
        if(!isTimerOn)
            startTimer();
    }
}

const editTaskStatus = (btnId) => {
    const taskToEdit = arrayTasks.find(t => t.id == btnId.target.id.split("-")[1]);
    if(taskToEdit.status !== "active"){
        task.value = taskToEdit.title;
        stateTask.id = taskToEdit.id;
        stateTask.status = taskToEdit.status;
    }
}

const deleTask = (taskID) => {
    const taskToDelete = taskID.target.id.split("-")[1];
    console.log(arrayTasks);
    arrayTasks.map(task => (task.id !== taskToDelete ));
    console.log(arrayTasks);
    // in process
}

const startTimer = () => {
    isTimerOn = true;
    let counter = 1500;
    timer.innerHTML = "25:00";
    intervalId = setInterval(() => {
        counter = counter - 1;
        timer.innerHTML = (
            (Math.floor(counter/60) < 10 ? ("0" + Math.floor(counter/60)) : Math.floor(counter/60))
            + ":" 
            + ((counter%60) < 10 ? ("0"+(counter%60)) : (counter%60))
        );
        if(counter === 0) {
            clearInterval(intervalId);
            isTimerOn = false;
            setFinishedTasks();
        }
    }, 1000);
}

const setFinishedTasks = () => {
    arrayTasks.map(task => {
        if(task.status === "active") {
            const btnTask = document.getElementById(`start-${task.id}`);
            btnTask.innerHTML = "Finished";
            task.status = "finished";
        }
    })

}

const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
}

btnSubmit.addEventListener("click", addTask);
task.addEventListener("input", startsWithEmptySpace);
submit.addEventListener("submit", handleSubmit);