const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', getTasks);

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;
    createTaskElement(text);
    saveLocalTasks();
    taskInput.value = "";
}

function createTaskElement(text, isCompleted = false, subtasks = []) {
    const li = document.createElement('li');
    li.className = `task-item ${isCompleted ? 'completed' : ''}`;
    li.innerHTML = `
        <div class="main-task-row">
            <div class="circle-check" onclick="toggleComplete(this)"></div>
            <span class="task-text" contenteditable="true" oninput="saveLocalTasks()">${text}</span>
            <i class="fas fa-trash trash-btn" onclick="deleteItem(this)"></i>
        </div>
        <div class="subtask-section">
            <ul class="subtask-list"></ul>
            <input type="text" class="subtask-input" placeholder="+ Add subtask" onkeypress="handleSubtaskKey(event, this)">
        </div>
    `;
    const subList = li.querySelector('.subtask-list');
    subtasks.forEach(sub => createSubtaskElement(subList, sub.text, sub.completed));
    taskList.appendChild(li);
}

function handleSubtaskKey(event, input) {
    if (event.key === "Enter" && input.value.trim() !== "") {
        createSubtaskElement(input.previousElementSibling, input.value.trim());
        saveLocalTasks();
        input.value = "";
    }
}

function createSubtaskElement(parentUl, text, isCompleted = false) {
    const subLi = document.createElement('li');
    subLi.className = `subtask-item ${isCompleted ? 'completed' : ''}`;
    subLi.innerHTML = `
        <div class="circle-check small-circle" onclick="toggleComplete(this)"></div>
        <span class="task-text" contenteditable="true" style="font-size:0.9rem;" oninput="saveLocalTasks()">${text}</span>
        <i class="fas fa-trash trash-btn" style="font-size:0.8rem;" onclick="deleteItem(this)"></i>
    `;
    parentUl.appendChild(subLi);
}

function toggleComplete(element) {
    element.parentElement.classList.toggle('completed');
    saveLocalTasks();
}

function deleteItem(element) {
    element.closest('li').remove();
    saveLocalTasks();
}

function saveLocalTasks() {
    let tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        let subtasks = [];
        item.querySelectorAll('.subtask-item').forEach(sub => {
            subtasks.push({ text: sub.querySelector('.task-text').innerText, completed: sub.classList.contains('completed') });
        });
        tasks.push({ text: item.querySelector('.main-task-row .task-text').innerText, completed: item.classList.contains('completed'), subtasks: subtasks });
    });
    localStorage.setItem('myTodoList', JSON.stringify(tasks));
}

function getTasks() {
    let savedTasks = JSON.parse(localStorage.getItem('myTodoList')) || [];
    savedTasks.forEach(task => { createTaskElement(task.text, task.completed, task.subtasks); });
}

function updateTime() {
    const dateTimeDisplay = document.getElementById('currentDateTime');
    const now = new Date();
    dateTimeDisplay.textContent = now.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
}
setInterval(updateTime, 1000);
updateTime();
taskInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });