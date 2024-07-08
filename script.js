let todos = [];
let projects = [];
let todoIndex = null;

function todo(title, project, description, dueDate, priority, notes) {
  this.title = title;
  this.project = project;
  this.description = description;
  this.dueDate = dueDate;
  this.priority = priority;
  this.notes = notes;

  if (todoIndex == null) {
    todos.push(this);
  } else {
    todos.splice(todoIndex, 1);
    todos.splice(todoIndex, 0, this);
  }
}

todo.prototype.delete = function () {
  const index = todos.indexOf(this);
  if (index > -1) {
    todos.splice(index, 1);
  }
  domHandler();
};

todo.prototype.done = function () {
  this.project = "Hotovo";
  domHandler();
};

todo.prototype.edit = function () {
  document.querySelector("#formular > div > h1").innerText = "Upravit Úkol";
  document.querySelector("#formular > button").innerText = "Uložit";
  document.querySelector("#form-title").value = this.title;
  document.querySelector("#form-project").value = this.project;
  document.querySelector("#form-descr").value = this.description;
  document.querySelector("#form-date").value = this.dueDate;
  document.querySelector("#form-priority").value = this.priority;
  document.querySelector("#form-notes").value = this.notes;
  document.querySelector("#formular").style.display = "flex";
  todoIndex = todos.indexOf(this);
};

function project(title) {
  this.title = title;
  this.active = false;
  projects.splice(projects.length - 1, 0, this);
}

project.prototype.setActive = function () {
  for (let i = 0; i < projects.length; i++) {
    projects[i].active = false;
  }
  this.active = true;
};

project.prototype.delete = function () {
  const index = projects.indexOf(this);
  if (index > -1) {
    projects.splice(index, 1);
  }
  domHandler();
  selectOptions();
};

new project("Hotovo");
new project("Všechny").setActive();

function domHandler() {
  const elemTaskContainer = document.querySelector("#main");
  elemTaskContainer.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    for (let u = 0; u < projects.length; u++) {
      if (
        (todos[i].project == projects[u].title && projects[u].active == true) ||
        (projects[u].title == "Všechny" &&
          projects[u].active == true &&
          todos[i].project != "Hotovo")
      ) {
        const div = document.createElement("div");
        const title = document.createElement("h1");
        title.innerText = "Title: " + todos[i].title;

        const description = document.createElement("div");
        description.innerText = "Description: " + todos[i].description;

        const dueDate = document.createElement("div");
        dueDate.innerText = "Date: " + todos[i].dueDate;

        const priority = document.createElement("div");
        priority.innerText = "Priority: " + todos[i].priority;

        const notes = document.createElement("div");
        notes.innerText = "Notes: " + todos[i].notes;

        const delButton = document.createElement("button");
        delButton.addEventListener("click", () => {
          const delYesButton = document.createElement("button");
          const delNoButton = document.createElement("button");
          const delConfirmation = document.createElement("div");
          delConfirmation.innerText = "Are You Sure?";

          delYesButton.innerText = "Yes!";
          delYesButton.addEventListener("click", () => todos[i].delete());

          delNoButton.innerText = "No!";
          delNoButton.addEventListener("click", () =>
            elemTaskContainer.removeChild(delConfirmation)
          );

          delConfirmation.appendChild(delYesButton);
          delConfirmation.appendChild(delNoButton);
          elemTaskContainer.appendChild(delConfirmation);
        });
        delButton.innerText = "✘";

        const editButton = document.createElement("button");
        editButton.addEventListener("click", () => todos[i].edit());
        editButton.innerText = "✎";

        const doneButton = document.createElement("button");
        doneButton.addEventListener("click", () => todos[i].done());
        doneButton.innerText = "✔";

        div.append(
          doneButton,
          editButton,
          delButton,
          title,
          description,
          dueDate,
          priority,
          notes
        );
        elemTaskContainer.appendChild(div);
      }
    }
  }

  const mainTitle = document.createElement("h1");
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].active) {
      mainTitle.innerText = projects[i].title;
    }
  }
  elemTaskContainer.prepend(mainTitle);

  const projectTaskContainer = document.querySelector("#projects");
  projectTaskContainer.innerHTML = ""; // Clear existing content before re-rendering

  for (let i = 0; i < projects.length; i++) {
    const menuItem = document.createElement("div");
    const projectName = document.createElement("p");
    projectName.innerText = projects[i].title;
    projectName.addEventListener("click", () => {
      projects[i].setActive();
      domHandler();
    });

    menuItem.appendChild(projectName);

    for (let u = 0; u < todos.length; u++) {
      if (todos[u].project == projects[i].title) {
        const taskName = document.createElement("p");
        taskName.innerText = todos[u].title;

        projectName.appendChild(taskName);
      }
    }

    if (projects[i].title != "Hotovo" && projects[i].title != "Všechny") {
      var delproject = document.createElement("button");
      delproject.innerText = "✗";
      delproject.addEventListener("click", () => {
        const delConfirmation = document.createElement("div");
        const delYesButton = document.createElement("button");
        const delNoButton = document.createElement("button");

        delConfirmation.innerText = "Are you sure?";
        delYesButton.innerText = "Yes!";
        delNoButton.innerText = "No";

        delYesButton.addEventListener("click", () => projects[i].delete());
        delNoButton.addEventListener("click", () =>
          projectTaskContainer.removeChild(delConfirmation)
        );

        projectTaskContainer.appendChild(delConfirmation);
        delConfirmation.appendChild(delYesButton);
        delConfirmation.appendChild(delNoButton);
      });

      menuItem.appendChild(delproject);
    }
    projectTaskContainer.appendChild(menuItem);
  }
  save();
}

function todoAdd() {
  const title = document.querySelector("#form-title").value;
  const project = document.querySelector("#form-project").value;
  const descr = document.querySelector("#form-descr").value;
  const date = document.querySelector("#form-date").value;
  const priority = document.querySelector("#form-priority").value;
  const notes = document.querySelector("#form-notes").value;

  new todo(title, project, descr, date, priority, notes);

  domHandler();

  document.querySelector("#formular").style.display = "none";
  closeForm();
}

function selectOptions() {
  const optionContainer = document.querySelector("#form-project");
  const projectSelectContainer = document.querySelector("#project-selector");
  optionContainer.innerHTML = "";
  for (let i = 0; i < projects.length; i++) {
    const option = document.createElement("option");
    option.value = projects[i].title;
    option.text = projects[i].title;
    optionContainer.appendChild(option);
  }
}

document.addEventListener("load", selectOptions());

function projectAdd() {
  const title = document.querySelector("#project-name").value;
  new project(title);
  domHandler();
  selectOptions();
  document.querySelector("#project-formular > input").value = "";
  projectAddDel();
}

function newTodo() {
  document.querySelector("#formular").style.display = "flex";
}

function newProject() {
  document.querySelector("#project-formular").style.display = "flex";
}

function projectAddDel() {
  document.querySelector("#project-formular").style.display = "none";
  document.querySelector("#project-formular > input").value = "";
}

function closeForm() {
  document.querySelector("#formular").style.display = "none";
  document.querySelector("#form-notes").value = "";
  document.querySelector("#form-date").value = "";
  document.querySelector("#form-descr").value = "";
  document.querySelector("#form-title").value = "";
  document.querySelector("#form-project").value = "Všechny";
  document.querySelector("#form-priority").value = 3;
  document.querySelector("#rangeValue").innerHTML = "3";
  document.querySelector("#formular > div > h1").innerText = "Nový Úkol";
  document.querySelector("#formular > button").innerText = "Přidat";
  todoIndex = null;
}

function save() {
  const TodosString = JSON.stringify(todos);
  const ProjectsString = JSON.stringify(projects);
  localStorage.setItem("TodosSaved", TodosString);
  localStorage.setItem("ProjectsSaved", ProjectsString);
}

function load() {
  if (localStorage.getItem("TodosSaved") !== null) {
    const newTodos = JSON.parse(localStorage.getItem("TodosSaved"));
    for (i = 0; i < newTodos.length; i++) {
      new todo(
        newTodos[i].title,
        newTodos[i].project,
        newTodos[i].description,
        newTodos[i].dueDate,
        newTodos[i].priority,
        newTodos[i].notes
      );
    }
  }
  if (localStorage.getItem("ProjectsSaved") !== null) {
    const newProjects = JSON.parse(localStorage.getItem("ProjectsSaved"));
    for (u = 0; u < newProjects.length; u++) {
      if (
        newProjects[u].title != "Všechny" &&
        newProjects[u].title != "Hotovo"
      ) {
        new project(newProjects[u].title);
      }
    }
  }
  domHandler();
  selectOptions();
}

load();
