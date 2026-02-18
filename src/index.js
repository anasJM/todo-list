import "./style.css";
import { createNewTodo } from "./todos.js"
import { createNewProject } from "./projects.js"

const allProjects = [];

const project1 = createNewProject("house stuff");
const project2 = createNewProject("house stuff");
project1.list.push(createNewTodo("todo title", "zefze","aezefzef", "aefezafzef"))
project2.list.push(createNewTodo("todo title", "zefze","aezefzef", "aefezafzef"))


// add project DOM
const addProjectButton = document.querySelector("#add-project-button");
const addProjectForm = document.querySelector("#project-form");
const selectInputProject = document.querySelector("#project-input");

// add project form event listener
addProjectForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(addProjectForm);
    const projectName = formData.get("name-input");
    if (formData.get("name-input") !== "") {
        allProjects.push(createNewProject(projectName));
        console.log(allProjects)

        // refetch all project in the select input
        selectInputProject.innerHTML = "";
        const selectPlaceholder = document.createElement("option");
        selectPlaceholder.value = ""
        selectPlaceholder.textContent = "Select project"
        selectInputProject.appendChild(selectPlaceholder)

        allProjects.forEach(project => {
        const projectOption = document.createElement("option");
        projectOption.value = project.id;
        projectOption.textContent = project.name;
        selectInputProject.appendChild(projectOption)
});
    }
})

// add todo DOM
const addTodoform = document.querySelector("#todo-form");

// add todo from event listener
addTodoform.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addTodoform);
    // console.log(formData.get("priority-input"))
    if (formData.get("title-input") !== "" && formData.get("description-input") !== "" && formData.get("due-date-input") !== "" && formData.get("priority-input") !== "" && formData.get("project-input") !== "") {
        let projectIndex = allProjects.findIndex((project) => project.id === formData.get("project-input"));
        allProjects[projectIndex].list.push(createNewTodo(formData.get("title-input"), formData.get("description-input"), formData.get("due-date-input"), formData.get("priority-input")));
        console.log(allProjects)
    }
})

