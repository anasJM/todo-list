// create a new to todo function
function createNewTodo(title, description, dueDate, priority) {
    const id = crypto.randomUUID();
    let isCompleted = false;
    return {
        id,
        title,
        description,
        dueDate,
        priority,
        isCompleted,
        setTodoToComplete: function setTodoToComplete() {
            this.isCompleted = true;
        },
        changeTodoPriority: function changeTodoPriority(priority) {
            this.priority = priority;
        }
    }
}

// export functions
export {
    createNewTodo,
}