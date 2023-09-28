const task = document.querySelector('#newTask');
const btnSubmit = document.querySelector('#btn-submit');
const HTMLELementTasks = document.querySelector('#todoList');
const timer = document.getElementById("timer");
const submit = document.getElementById("submit");

const arrayTasks = [];
let isTimerOn = false;
let intervalId;
const stateTask = {
    id: 0,
    status: "",
}

const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
}

const addTask = () => {
    if(task.value.length != 0){
        const newTask = {
            id: Date.now(),
            title: task.value,
            status: "new",
        }
        arrayTasks.push(newTask);
        HTMLELementTasks.insertAdjacentHTML("afterBegin", 
                                            `<div id=${newTask.id}>
                                                <button type="button" id="start-${newTask.id}" title="start">Start</button>${task.value} 
                                                <button class="edit" type="button" id="edit-${newTask.id}" title="edit">edit</button>
                                                <button class="delete" type="button" id="dele-${newTask.id}" title="delete">Dele</button>
                                            </div>`);
        document.getElementById(`start-${newTask.id}`).addEventListener("click", startTast);
        document.getElementById(`edit-${newTask.id}`).addEventListener("click", editTast);
        // document.getElementById(`btn-${newTask.id}`).addEventListener("click", changeStatus);
        task.value = "";
    }
}

const startsWithEmptySpace = () => {
    if(task.value == " "){
        setTimeout(() => {
            task.value = "";
        }, 20);
    }
}

const startTast = (btnId) => {
    const task = arrayTasks.find(t => t.id == btnId.target.id.split("-")[1]);
    const btnTask = document.getElementById(`start-${task.id}`);
    btnTask.innerHTML = "In Process...";
    if(task.status !== "active") {
        task.status = "active";
        if(!isTimerOn)
            startTimer();
    }
}

const editTast = (btnId) => {
    const taskToEdit = arrayTasks.find(t => t.id == btnId.target.id.split("-")[1]);
    task.value = taskToEdit.title;
    stateTask.id = taskToEdit.id;
    stateTask.status = taskToEdit.status;
}

const startTimer = () => {
    isTimerOn = true;
    let counter = 15;
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

btnSubmit.addEventListener("click", addTask);
task.addEventListener("input", startsWithEmptySpace);
submit.addEventListener("submit", handleSubmit);