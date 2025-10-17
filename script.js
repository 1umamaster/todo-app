// ===== Get elements =====
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");

const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

// ===== State =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all"; // "all" | "active" | "completed"

// ===== Functions =====

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counter
function updateTaskCount() {
  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? "s" : ""} left`;
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    // Filter tasks
    if (
      (currentFilter === "active" && task.completed) ||
      (currentFilter === "completed" && !task.completed)
    ) return;

    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateTaskCount();
}

// Add new task
function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = {
    text: taskText,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
}

// Set current filter
function setFilter(filter) {
  currentFilter = filter;

  // Update active button
  allBtn.classList.remove("active");
  activeBtn.classList.remove("active");
  completedBtn.classList.remove("active");

  if (filter === "all") allBtn.classList.add("active");
  if (filter === "active") activeBtn.classList.add("active");
  if (filter === "completed") completedBtn.classList.add("active");

  renderTasks();
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// ===== Event listeners =====
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

allBtn.addEventListener("click", () => setFilter("all"));
activeBtn.addEventListener("click", () => setFilter("active"));
completedBtn.addEventListener("click", () => setFilter("completed"));

// ===== Initialize =====
renderTasks();