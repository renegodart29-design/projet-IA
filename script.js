const STORAGE_KEY = "tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");
const clearDoneBtn = document.getElementById("clear-done");

let tasks = loadTasks();

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const label = document.createElement("span");
    label.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Supprimer la tâche");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, label, deleteBtn);
    list.appendChild(item);
  });

  emptyMessage.classList.toggle("hidden", tasks.length > 0);

  const remaining = tasks.filter((t) => !t.done).length;
  if (tasks.length === 0) {
    taskCount.textContent = "";
  } else if (remaining === 0) {
    taskCount.textContent = "Toutes les tâches sont terminées !";
  } else {
    taskCount.textContent = `${remaining} tâche${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`;
  }

  clearDoneBtn.classList.toggle("hidden", !tasks.some((t) => t.done));
}

function addTask(text) {
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

clearDoneBtn.addEventListener("click", clearDone);

render();
