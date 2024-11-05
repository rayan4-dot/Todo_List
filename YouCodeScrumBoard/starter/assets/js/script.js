let deletebtn = document.getElementById("task-delete-btn");
let updatebtn = document.getElementById("task-update-btn");
const ajouteTache = document.querySelector("#addTask");
const modelTache = document.querySelector("#modal-task");
const quitteTache = document.querySelector(".btn-close");

deletebtn.style.display = "none";
updatebtn.style.display = "none";

ajouteTache.addEventListener("click", () => { modelTache.classList.add("show"); });
quitteTache.addEventListener("click", () => { modelTache.classList.remove("show"); });

function elementTache(title, 
    type, 
    priority,
    status, 
    date, 
    description
   ) {
    
    const taskItem = document.createElement("div");
    taskItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");

    taskItem.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold">${title}</div>
            <small class="text-muted">${type} | ${priority}</small><br>
            <small>${date} | ${status}</small>
            <p>${description}</p>
        </div>
        <div class="task-buttons">
            <button class="btn btn-warning btn-sm update-btn">Update</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>`;

    taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        taskItem.remove();
        supprimeTacheLocal(title, type, priority, status, date, description);
        updateTaskCounts();
    });

    taskItem.querySelector(".update-btn").addEventListener("click", () => {
        miseTache(title, type, priority, status, date, description);
        taskItem.remove();
        updateTaskCounts();
    });

    return taskItem;
}

function updateTaskCounts() {
    document.getElementById("to-do-tasks-count").textContent = document.getElementById("to-do-tasks").children.length;
    document.getElementById("in-progress-tasks-count").textContent = document.getElementById("in-progress-tasks").children.length;
    document.getElementById("done-tasks-count").textContent = document.getElementById("done-tasks").children.length;
}

function miseTache(title, type, priority, status, date, description) {
    document.getElementById("task-title").value = title;
    document.querySelector(`input[name="task-type"][value="${type}"]`).checked = true;
    document.getElementById("task-priority").value = priority;
    document.getElementById("task-status").value = status;
    document.getElementById("task-date").value = date;
    document.getElementById("task-description").value = description;
    
    modelTache.classList.add("show");
}

function sauvegarderTacheLocal(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTaskLocal() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = elementTache(task.title, task.type, task.priority, task.status, task.date, task.description);
        if (task.status === "To Do") {
            document.getElementById("to-do-tasks").appendChild(taskItem);
        } else if (task.status === "In Progress") {
            document.getElementById("in-progress-tasks").appendChild(taskItem);
        } else if (task.status === "Done") {
            document.getElementById("done-tasks").appendChild(taskItem);
        }
    });
    updateTaskCounts();
}

function supprimeTacheLocal(title, type, priority, status, date, description) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task =>
        task.title !== title ||
        task.type !== type ||
        task.priority !== priority ||
        task.status !== status ||
        task.date !== date ||
        task.description !== description
    );
    sauvegarderTacheLocal(updatedTasks);
}

document.getElementById("task-save-btn").addEventListener("click", function(event) {
    event.preventDefault();

    const title = document.getElementById("task-title").value;
    const type = document.querySelector('input[name="task-type"]:checked')?.value;
    const priority = document.getElementById("task-priority").value;
    const status = document.getElementById("task-status").value;
    const date = document.getElementById("task-date").value;
    const description = document.getElementById("task-description").value;

    const task = { title, type, priority, status, date, description };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    sauvegarderTacheLocal(tasks);

    const taskItem = elementTache(title, type, priority, status, date, description);
    if (status === "To Do") {
        document.getElementById("to-do-tasks").appendChild(taskItem);
    } else if (status === "In Progress") {
        document.getElementById("in-progress-tasks").appendChild(taskItem);
    } else if (status === "Done") {
        document.getElementById("done-tasks").appendChild(taskItem);
    }

    document.getElementById("form-task").reset();
    modelTache.classList.remove("show");
    updateTaskCounts();
});

window.onload = loadTaskLocal;