// create ne project
function createNewProject(name) {
    const id = crypto.randomUUID();
    return {
        id,
        name,
        list: []
    }
}

// fetch project

// add todo to project
// function addTodoToProject(todoObject, project) {
//     project.list.push({todoObject});
// }

export {
    createNewProject,
}