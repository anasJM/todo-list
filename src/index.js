import "./style.css";
import { createNewTodo } from "./todos.js"
import { createNewProject } from "./projects.js"

let allProjects = [];

// window.localStorage.clear()

// get the stored projects and todos from localstorage and store them into allProjects[] 
if (window.localStorage.getItem("allProjects")) {
    // parsing json
    const storedData = JSON.parse(window.localStorage.getItem("allProjects")) || []

    allProjects = storedData.map(p => {
        const project = createNewProject(p.name)
        project.list = p.list.map(t => {
            const todo = createNewTodo(t.title, t.description, t.dueDate, t.priority, t.id, t.isCompleted)
            todo.setTodoToComplete = function setTodoToComplete() {
                this.isCompleted = true;
            }
            todo.changeTodoPriority = function changeTodoPriority(priority) {
                this.priority = priority;
            }
            if (t.isCompleted === true) {
                todo.isCompleted = true
            }
            return todo
        })
        return project
    })

    console.log(storedData)
}

// today date UTC
const todayUTC = new Date().toISOString().slice(0, 10);

console.log(allProjects)

const projectList = document.querySelectorAll("li");
const todayTodos = document.querySelector("#today-todos");
const h2 = document.querySelector("h2")

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
        // save all projects to localstorage
        window.localStorage.allProjects = JSON.stringify(allProjects);
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
        window.localStorage.allProjects = JSON.stringify(allProjects)
        if (h2.textContent === "Todo For Today") {
            fetchTodayTodos();
        } else {
            fetchProjectTodos();
        }
        console.log(allProjects)
    }
})

// fetch today todos
function fetchTodayTodos() {
    const todayTodos = document.querySelector("#today-todos");
    h2.textContent = "Todo For Today";
    todayTodos.innerHTML = "";

    allProjects.forEach(project => {
        project.list.forEach(element => {
            if (element.dueDate === todayUTC) {
                todoDomCreation(element);
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
                    console.log(todo);
                }
            });
        });
        // refrech allProjects[] in localstorage
        window.localStorage.allProjects = JSON.stringify(allProjects)
    }
});

// add click event to delete icon

function deleteTodo(targetId) {
    for (let i = 0; i < allProjects.length; i++) {
        const project = allProjects[i];
        for (let j = 0; j < project.list.length; j++) {
            const todo = project.list[j];
            if (todo.id === targetId) {
                allProjects[i].list.splice(j, 1);

                // refrech allProjects[] in localStorage
                window.localStorage.allProjects = JSON.stringify(allProjects)

                console.log("todo deleted!")
                console.log(allProjects)
            }
        }
    }
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-icon")) {
        deleteTodo(e.target.dataset.id);
        if (h2.textContent === "Todo For Today") {
            fetchTodayTodos();
        } else {
            fetchProjectTodos(projectID);
        }
    }
})

// // edit todo + click event
// function editTodo(targetId) {

// }

// document.addEventListener("click", (e) => {
//     if (e.target.classList.contains("edit-icon")) {

//     }
// })

// todo dom manipulation (create Dom todo)

function todoDomCreation(element) {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoDiv1 = document.createElement("div");
    todoDiv1.classList.add("todo-div");

    const todoDiv2 = document.createElement("div");
    todoDiv2.classList.add("todo-div");

    // todo div 1 (radio + todo name)
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.classList.add("radio");
    radioInput.dataset.id = element.id

    if (element.isCompleted) {
        radioInput.checked = true;
    }

    const todoTitle = document.createElement("p");
    todoTitle.textContent = element.title;

    todoDiv1.appendChild(radioInput);
    todoDiv1.appendChild(todoTitle);

    // todo div 2 (delete + edit)
    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.dataset.id = element.id;

    const editIcon = document.createElement("div");
    editIcon.classList.add("edit-icon");
    editIcon.dataset.id = element.id;

    todoDiv2.appendChild(deleteIcon);
    todoDiv2.appendChild(editIcon);

    todo.appendChild(todoDiv1);
    todo.appendChild(todoDiv2);
    todayTodos.appendChild(todo);
}

// add event listener to li sidebar

let projectID;

function fetchProjectTodos(targetId) {
    todayTodos.innerHTML = "";
    allProjects.forEach(project => {
        if (project.id === targetId) {
            projectID = targetId;
            h2.textContent = project.name
            project.list.forEach(element => {
                todoDomCreation(element)
            })
        }
    })
}

document.addEventListener("click", (e) => {
    if (e.target.localName === "li") {
        fetchProjectTodos(e.target.dataset.id);
    }
})

// home event listener
const home = document.querySelector("#home");

home.addEventListener("click", () => {
    fetchTodayTodos();
})

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


// show edit dialog

const editDialog = document.createElement("dialog");
editDialog.id = "edit-todo-section";
document.body.appendChild(editDialog);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-icon")) {
        let todoId;
        let todoTitle;
        let todoDescription;
        let todoDueDate;
        let todoPriority;
        let todoProject;
        todoPriority = "";
        todoProject = "";

        allProjects.forEach(project => {
            todoProject += `<option value="${project.id}">${project.name}</option>`
            project.list.forEach(todo => {
                if (e.target.dataset.id === todo.id) {
                    todoTitle = todo.title;
                    todoDescription = todo.description;
                    todoDueDate = todo.dueDate;
                    todoId = todo.id;

                    switch (todo.priority) {
                        case "high":
                            todoPriority = `
                                <option value="high" selected>high</option>
                                <option value="medium">medium</option>
                                <option value="low">normal</option>`
                            break;
                        
                        case "medium":
                            todoPriority = `
                                <option value="high">high</option>
                                <option value="medium" selected>medium</option>
                                <option value="low">normal</option>`
                            break;

                        case "low":
                            todoPriority = `
                                <option value="high">high</option>
                                <option value="medium">medium</option>
                                <option value="low" selected>normal</option>`
                            break;
                    
                        default:
                            break;
                    }
                }
            })
        })
        editDialog.innerHTML = `
            <h1>Edit Todo</h1>
            <form action="" method="get" name="edit-todo-form" id="edit-todo-form" data-id="${todoId}">
                <div>
                    <label for="title-input">title</label>
                    <input value="${todoTitle}" type="text" id="title-input" name="title-input" class="text-input">
                </div>

                <div>
                    <label for="description-input">description</label>
                    <textarea type="text" id="description-input" name="description-input" class="text-input">${todoDescription}</textarea>
                </div>

                <div>
                    <label for="due-date-input">due-date</label>
                    <input value="${todoDueDate}" type="date" id="date-input" name="due-date-input" class="text-input">
                </div>

                <div>
                    <label for="priority-input">priority</label>
                    <select name="priority-input" id="priority-input">
                        ${todoPriority}
                    </select>
                </div>

                <div>
                    <label for="project-input">project</label>
                    <select name="project-input" id="project-input">
                        ${todoProject}
                    </select>
                </div>

                <button class="button" type="submit" id="edit-todo-button">Add todo</button>
                <button class="button" type="button" id="edit-todo-cancel-button">Cancel</button>
            </form>`;

        console.log(editDialog)
        editDialog.showModal()
        
    }
})

editDialog.addEventListener("click", (e) => {
    if (e.target.id === "edit-todo-cancel-button") {
        editDialog.close()
    }
})

// form edit todo submit event
const editForm = document.querySelector("#edit-todo-form");
editDialog.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // console.log(event.target)
    // console.log(...formData.entries())
    let todoIndex;

    if (formData.get("title-input") !== ""
        && formData.get("description-input") !== ""
        && formData.get("due-date-input") !== ""
        && formData.get("priority-input") !== ""
        && formData.get("project-input") !== "") {

        let projectIndex = allProjects.findIndex((project) => project.id === formData.get("project-input"));
        todoIndex = allProjects[projectIndex].list.findIndex((todo) => todo.id === event.target.dataset.id);
        projectID = allProjects[projectIndex].id;
        
        allProjects[projectIndex].list[todoIndex].title = formData.get("title-input");
        allProjects[projectIndex].list[todoIndex].description = formData.get("description-input");
        allProjects[projectIndex].list[todoIndex].dueDate = formData.get("due-date-input");
        allProjects[projectIndex].list[todoIndex].priority = formData.get("priority-input");

        // refrech allProjects[] in localstorage
        window.localStorage.allProjects = JSON.stringify(allProjects)

        console.log("todo edited!!!!")
        console.log(allProjects)
            
        if (h2.textContent === "Todo For Today") {
            fetchTodayTodos();
        } else {
            fetchProjectTodos(projectID);
        }
    }
})