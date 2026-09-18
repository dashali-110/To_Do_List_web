let taskList = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");

// چک کردن یادآوری روز قبل
function checkDailyReminder() {
    let savedDate = localStorage.getItem("lastOpenDate");
    let today = new Date().toDateString();

    // اگر اولین بار هست، تاریخ امروز رو ذخیره کن
    if (!savedDate) {
        localStorage.setItem("lastOpenDate", today);
        return;
    }

    // اگر روز جدید هست
    if (savedDate !== today) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // چک کن آیا کاری انجام نشده
        let unfinished = tasks.some(t => !t.completed);

        if (unfinished) {
            alert("یادآوری: دیروز بعضی کارها رو کامل نکردی!");
        }

        // تاریخ امروز رو ذخیره کن
        localStorage.setItem("lastOpenDate", today);
    }
}

// Load saved tasks
window.onload = () => {
    checkDailyReminder();

    let saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(t => addTaskToUI(t.text, t.completed));
};

function addTask() {
    let text = taskInput.value.trim();
    if (text === "") return;

    addTaskToUI(text, false);
    saveTasks();
    taskInput.value = "";
}

function addTaskToUI(text, completed) {
    let li = document.createElement("li");
    if (completed) li.classList.add("completed");

    li.innerHTML = `
        <span onclick="toggleComplete(this)">${text}</span>
        <button class="delete-btn" onclick="deleteTask(this)">حذف</button>
    `;

    taskList.appendChild(li);
}

function toggleComplete(span) {
    span.parentElement.classList.toggle("completed");
    saveTasks();
}

function deleteTask(btn) {
    btn.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastOpenDate", new Date().toDateString());
}
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});
