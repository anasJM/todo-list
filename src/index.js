import "./style.css";
import { createNewTodo } from "./todos.js"
import { createNewProject } from "./projects.js"

const allProjects = [];

allProjects.push(createNewProject("cooking"));
allProjects.push(createNewProject("sport"));
allProjects.push(createNewProject("cleaning"));
allProjects.push(createNewProject("shoping"));

const todayUTC = new Date().toISOString().slice(0, 10);

allProjects[0].list.push(createNewTodo("tajine", "wiwiwi", todayUTC, "high"))
allProjects[0].list.push(createNewTodo("tanjia", "wiwiwi", todayUTC, "high"))
allProjects[0].list.push(createNewTodo("barrad", "wa yeeh", "2026-02-25", "high"))

console.log(allProjects)

// fetch project to sidebar
const projectSidebarList = document.querySelector("#projects-list-sidebar");
function fetchProjectToSidebar() {
    const h3 = document.createElement("h3");
    h3.textContent = "My Projects";
    projectSidebarList.innerHTML = "";
    projectSidebarList.appendChild(h3)
    allProjects.forEach(project => {
        const li = document.createElement("li");
        li.textContent = "# " + project.name;
        li.dataset.id = project.id;
        projectSidebarList.appendChild(li)
    });
}

fetchProjectToSidebar();

// fetch project select input
const selectInputProject = document.querySelector("#project-input");

function fetchProjectToSelectInput() {
    selectInputProject.innerHTML = "";
    const selectPlaceholder = document.createElement("option");
    selectPlaceholder.value = "";
    selectPlaceholder.textContent = "Select project";
    selectInputProject.appendChild(selectPlaceholder)

    allProjects.forEach(project => {
        const projectOption = document.createElement("option");
        projectOption.value = project.id;
        projectOption.textContent = project.name;
        selectInputProject.appendChild(projectOption)
    });
}

fetchProjectToSelectInput();

// add project DOM
const addProjectButton = document.querySelector("#add-project-button");
const addProjectForm = document.querySelector("#project-form");

// add project form event listener
addProjectForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(addProjectForm);
    const projectName = formData.get("name-input");
    if (formData.get("name-input") !== "") {
        allProjects.push(createNewProject(projectName));
        console.log(allProjects)

        // refetch all project in the select input
        fetchProjectToSelectInput();
        fetchProjectToSidebar();
    }
})

// add todo DOM
const addTodoform = document.querySelector("#todo-form");

// add todo from event listener
addTodoform.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addTodoform);
    // console.log(formData.get("priority-input"))
    if (formData.get("title-input") !== ""
        && formData.get("description-input") !== ""
        && formData.get("due-date-input") !== ""
        && formData.get("priority-input") !== ""
        && formData.get("project-input") !== "") {
        let projectIndex = allProjects.findIndex((project) => project.id === formData.get("project-input"));
        allProjects[projectIndex].list.push(createNewTodo(formData.get("title-input"), formData.get("description-input"), formData.get("due-date-input"), formData.get("priority-input")));

        fetchTodayTodos();
        console.log(allProjects)
    }
})

// fetch today todos
function fetchTodayTodos() {
    const todayTodos = document.querySelector("#today-todos");
    todayTodos.innerHTML = "";

    allProjects.forEach(project => {
        project.list.forEach(element => {
            if (element.dueDate === todayUTC && element.isCompleted === false) {
                const todo = document.createElement("div");
                todo.classList.add("todo");

                const radioInput = document.createElement("input");
                
                // if (element.isCompleted) {
                //     radioInput.checked = true;
                // }

                radioInput.type = "radio";
                radioInput.classList.add("radio");
                radioInput.dataset.id = element.id

                const todoTitle = document.createElement("p");
                todoTitle.textContent = element.title;

                todo.appendChild(radioInput);
                todo.appendChild(todoTitle);
                todayTodos.appendChild(todo);
            }
        })
    });
}

fetchTodayTodos();

// add event listener to radio input
const radios = document.querySelectorAll(".radio");

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("radio")) {
        const targetId = e.target.dataset.id;

        allProjects.forEach(project => {
            project.list.forEach(todo => {
                if (todo.id === targetId) {
                    todo.setTodoToComplete();
                    fetchTodayTodos();
                    console.log(todo);
                }
            });
        });
    }
});

// show dialogs

const addProjectDialogButton = document.querySelector("#show-add-project-dialog");
const addTodoDialogButton = document.querySelector("#show-add-todo-dialog");

const projectDialog = document.querySelector("#add-project-section");
const todoDialog = document.querySelector("#add-todo-section");

const todoCloseButton = document.querySelector("#todo-cancel-button")
const projectCloseButton = document.querySelector("#project-cancel-button")

addProjectDialogButton.addEventListener("click", () => {
    projectDialog.showModal();
})

addTodoDialogButton.addEventListener("click", () => {
    todoDialog.showModal();
})

todoCloseButton.addEventListener("click", () => {
    todoDialog.close();
})

projectCloseButton.addEventListener("click", () => {
    projectDialog.close();
})