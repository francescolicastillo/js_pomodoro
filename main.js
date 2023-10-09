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
                                            <button type="button" id="start-${newTask.id}" class="start pointer" title="Start">Start</button> 
                                            <span>${task.value}</span>
                                            <button type="button" id="edit-${newTask.id}" class="edit pointer" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button type="button" id="delete-${newTask.id}" class="delete pointer" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                        </div>`);
    document.getElementById(`start-${newTask.id}`).addEventListener("click", startTask);
    document.getElementById(`edit-${newTask.id}`).addEventListener("click", editTaskStatus);
    document.getElementById(`delete-${newTask.id}`).addEventListener("click", deleteTask);
}

const startTask = (btnId) => {
    const task = arrayTasks.find(t => t.id == btnId.target.id.split("-")[1]);
    const btnTask = document.getElementById(`start-${task.id}`);
    btnTask.innerHTML = "In Process...";
    btnTask.setAttribute('title',"Stop task");
    document.getElementById(`start-${task.id}`).classList.add("active");
    document.getElementById(`start-${task.id}`).classList.remove("start");
    document.getElementById(`edit-${task.id}`).disabled = true;
    document.getElementById(`edit-${task.id}`).classList.remove("pointer");
    document.getElementById(`delete-${task.id}`).disabled = true;
    document.getElementById(`delete-${task.id}`).classList.remove("pointer");
    if(task.status === "active") {
        finishTask(task.id);
        areTasksActived();
    }
    else if (task.status !== "active") {
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

const deleteTask = (taskID) => {
    const taskToDelete = taskID.target.id.split("-")[1];
    arrayTasks = arrayTasks.filter((task) => task.id != taskToDelete );
    const elementDelete = document.getElementById(taskToDelete);
    elementDelete.remove();
    task.value = "";
    stateTask.id = 0;
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

const finishTask = (id) => {
    const btnTask = document.getElementById(`start-${id}`);
    btnTask.innerHTML = "Finished";
    btnTask.classList.remove("active");
    btnTask.classList.add("finished");
    btnTask.setAttribute('title',"Start again");
    document.getElementById(`edit-${id}`).disabled = false;
    document.getElementById(`edit-${id}`).classList.add("pointer");
    document.getElementById(`delete-${id}`).disabled = false;
    document.getElementById(`delete-${id}`).classList.add("pointer");
    arrayTasks.map(task => {
        if(task.id === id)
            task.status = "finished";
    });
}

const areTasksActived = () => {
    let result = arrayTasks.some(task => task.status === "active");
    if(!result){
        clearInterval(intervalId);
        isTimerOn = false;
        timer.innerHTML = "00:00";
    }
}

const setFinishedTasks = () => {
    arrayTasks.map(task => {
        if(task.status === "active") {
            const btnTask = document.getElementById(`start-${task.id}`);
            btnTask.innerHTML = "Finished";
            btnTask.setAttribute('title',"Start again");
            btnTask.classList.remove("active")
            btnTask.classList.add("finished")
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