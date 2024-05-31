import initialData from "./datafake.js";

const TODO_APP_KEY = "TODO_APP_KEY";

const saveData = (data) => {
  localStorage.setItem(TODO_APP_KEY, JSON.stringify(data));
};
// saveData(initialData);

const loadData = () => {
  let data;
  data = JSON.parse(localStorage.getItem(TODO_APP_KEY));
  data = data ? data : [];
  return data;
};

const add_task = (new_task) => {
  let data = loadData();
  data = [...data, new_task];
  saveData(data);
};

const createTaskItem = (task, isComplete, index) => {
  return `
  <li class="task-item" index=${index} is-Complete=${isComplete}> 
                  <span onClick="markTaskComplete(${index})"> ${task}</span>
                  <div class="task-action">
                      <button onclick="removeTask(${index})">delete</button>
                      <button onclick="pushTask(${index})">Edit</button>
                  </div>
              </li>
  `;
};

const editTask = (task, index) => {
  let data = loadData();
  const btn = document.querySelector("#add_task button");
  data[index].task = task;
  btn.innerHTML = `Add Task`;

  saveData(data);
};

const addForm = document.forms.add_task;
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const tasks = document.querySelector("#task");

  const index = tasks.getAttribute("index");
  if (index) {
    editTask(tasks.value, index);
    tasks.removeAttribute("index");
  } else {
    const new_task = {
      task: tasks.value,
      isComplete: false,
    };

    add_task(new_task);
  }

  tasks.value = "";
  renderTask();
});

const renderTask = () => {
  let data,
    taskHtml,
    ulHtml,
    result,
    countResult = 0;
  data = loadData();

  taskHtml = data.map((e, index) => {
    if (e.isComplete === true) {
      countResult++;
    }
    return createTaskItem(e.task, e.isComplete, index);
  });
  ulHtml = document.querySelector("ul.tasks");
  ulHtml.innerHTML = taskHtml.join("");
  result = document.querySelector(".result");
  result.innerHTML = `Bạn đã có ${countResult} task đã hoàn thành`;
};

const markTaskComplete = (index) => {
  let data = loadData();
  data[index].isComplete = data[index].isComplete == true ? false : true;
  saveData(data);
  renderTask();
  // console.log(data[index]);
};

const removeTask = (index) => {
  let data = loadData();
  let delete_confirm = window.confirm("Are you sure?");
  if (delete_confirm === true) {
    data.splice(index, 1);
    saveData(data);
    renderTask();
  }
};

const pushTask = (index) => {
  const tasks = document.querySelector("#task");
  const btn = document.querySelector("#add_task button");
  btn.innerHTML = `Edit Task`;
  let data = loadData();
  tasks.value = data[index].task;
  tasks.setAttribute("index", index);
};

window.markTaskComplete = markTaskComplete;
window.removeTask = removeTask;
window.pushTask = pushTask;

renderTask();
