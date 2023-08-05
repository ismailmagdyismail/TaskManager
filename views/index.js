class MainTaskPage{
    #taskContainer;
    #activeTask;
    #tasks;
    constructor() {
        this.#tasks = {};
        // this.#buttonCreateSubTask = document.querySelector('.create-subTask');
        this.#taskContainer = document.querySelector('.task-container');
        this.#init();
    }
    #init(){
        this.setActiveTask(undefined);
        this.#taskContainer.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('create-task')){
                return createMainTaskModal.displayMainTaskCreateModal();
            }
            this.setActiveTask(event.target);
            if(this.#activeTask){
                taskContent.populate(this.#tasks[this.#activeTask.dataset.id]);
            }
            if(event.target.classList.contains('edit-task')){
                editMainTaskModal.displayModal(this.#tasks[this.#activeTask.dataset.id]);
            }
            else if(event.target.classList.contains('mark-task')){
                const data = {
                    completed:true
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${this.#activeTask.dataset.id}`,data);
                const json = await response.json();
                this.#tasks[json.data._id] = json.data;
                this.#activeTask.classList.add('completed');
            }
            else if(event.target.classList.contains(('unmark-task'))){
                const data = {
                    completed:false
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${this.#activeTask.dataset.id}`,data);
                const json = await response.json();
                this.#tasks[json.data._id] = json.data;
                this.#activeTask.classList.remove('completed');
            }
            else if(event.target.classList.contains('trash-task')){
                await deleteTask(`http://localhost:8000/api/v1/tasks/${this.#activeTask.dataset.id}`);
                delete this.#tasks[this.#activeTask.dataset.id];
                this.removeTask(this.#activeTask);
            }
        });
    }
    setActiveTask(task){
        let selectedTask = undefined;
        selectedTask = task?.closest('.main-task');
        this.#activeTask?.classList.remove('selected');
        this.#activeTask = selectedTask;
        if(!selectedTask){
            this.#taskContainer.classList.add('full-view');
            this.#activeTask = undefined;
            taskContent.hide();
            additionalInfo.hide();
        }
        else{
            this.#taskContainer.classList.remove('full-view');
            this.#activeTask?.classList.add('selected');
            taskContent.show();
            additionalInfo.show();
        }
    }
    getActiveTask(){
        return this.#activeTask;
    }
    updateActiveTask(data){
        this.#tasks[data._id] = data;
        const taskName = this.#activeTask.querySelector('.task-name');
        taskName.innerHTML= data.name;
    }
    addTask(task){
        this.#tasks[task._id] = task;
        const completed = task.completed ? 'completed':'';
        const taskElement = `
        <div class="task main-task ${completed}" data-id="${task._id}">
        <p class="task-name">${task.name}</p>
        <menu class="task-options">
          <button class="edit-task">Edit</button>
          <button class="mark-task">Mark Done</button>
          <button class="unmark-task">unMark </button>
          <button class="trash-task">Trash</button>
        </menu>
      </div>`
        this.#taskContainer.insertAdjacentHTML('beforeend',taskElement);
    }
    removeTask(task){
        delete this.#tasks[task.dataset.id];
        task.remove();
    }
    getTasks(){
        return this.#tasks;
    }
}
class TaskContentPage{
    #taskContainer;
    #activeTask;
    #description;
    constructor() {
        this.#activeTask = undefined;
        this.#taskContainer = document.querySelector('.task-content');
        this.#description = document.querySelector('.task-description')
        this.#init();
    }
    #init(){
        this.setActiveTask(undefined);
        this.#taskContainer.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('create-subTask')){
                return createSubTaskModal.displaySubTaskModal();
            }
            this.setActiveTask(event.target);
            if(event.target.classList.contains('edit-task')){
                const subtask = mainTaskPage.getTasks()[mainTaskPage.getActiveTask().dataset.id].subTasks.find(task=> task._id === this.#activeTask.dataset.id);
                editSubTaskModal.displayModal(subtask);
            }
            else if(event.target.classList.contains('mark-task')){
                const data = {
                    completed:true
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${mainTaskPage.getActiveTask().dataset.id}/subtasks/${this.#activeTask.dataset.id}`,data);
                const json = await response.json();
                let tasks = mainTaskPage.getTasks();
                tasks[json.data._id] = json.data;
                this.#activeTask.classList.add('completed');
            }
            else if(event.target.classList.contains(('unmark-task'))){
                const data = {
                    completed:false
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${mainTaskPage.getActiveTask().dataset.id}/subtasks/${this.#activeTask.dataset.id}`,data);
                const json = await response.json();
                let tasks = mainTaskPage.getTasks();
                tasks[json.data._id] = json.data;
                this.#activeTask.classList.remove('completed');
            }
            else if(event.target.classList.contains('trash-task')){
                await deleteTask(`http://localhost:8000/api/v1/tasks/${mainTaskPage.getActiveTask().dataset.id}/subtasks/${this.#activeTask.dataset.id}`);
                const mainTask = mainTaskPage.getTasks()[mainTaskPage.getActiveTask().dataset.id];
                mainTask.subTasks.splice(mainTask.subTasks.findIndex((subTask => subTask._id === this.#activeTask.dataset.id)),1);
                this.removeTask(this.#activeTask);
            }
        });
    }
    setActiveTask(task){
        let selectedTask = undefined;
        selectedTask = task?.closest('.sub-task');
        this.#activeTask?.classList.remove('selected');
        this.#activeTask = selectedTask;
        this.#activeTask?.classList.add('selected');
    }
    getActiveTask(){
        return this.#activeTask;
    }
    updateActiveTask(data){
        const taskName = this.#activeTask.querySelector('.task-name');
        taskName.innerHTML= data.name;
    }
    addTask(task){
        const completed = task.completed ? 'completed':'';
        const taskElement = `
        <div class="task sub-task ${completed}" data-id="${task._id}" >
        <p class="task-name">${task.name}</p>
        <menu class="task-options">
          <button class="edit-task">Edit</button>
          <button class="mark-task">Mark Done</button>
          <button class="unmark-task">unMark </button>
          <button class="trash-task">Trash</button>
        </menu>
      </div>`
        this.#taskContainer.insertAdjacentHTML('beforeend',taskElement);
    }
    populate(mainTask){
        this.#taskContainer.innerHTML = `
        <h2 class="task-header">${mainTask.name} Task Content</h2>
      <button class="create-subTask">New Sub-Task</button>
      <div class="description">
        <h3>Current Task Description</h3>
        <p>${mainTask.description || 'None'}</p>
      </div>
      <div class="subtask-container">
        </div>
      </div>`;
        mainTask.subTasks.forEach((task)=>this.addTask(task));
    }
    removeTask(task){
        task.remove();
    }
    hide(){
        this.#taskContainer.classList.add('hidden');
    }
    show(data){
        //data.forEach(subtask => this.addTask(subtask));
        this.#taskContainer.classList.remove('hidden');
    }
}
class AdditionalInfoPage{
    #pageContainer ;
    constructor() {
        this.#pageContainer = document.querySelector('.additional-info');
    }
    hide(){
        this.#pageContainer.classList.add('hidden');
    }
    show(){
        this.#pageContainer.classList.remove('hidden');
    }
}
class ModalContainer{
    #modalContainer;
    constructor() {
        this.#modalContainer = document.querySelector('.modal-container');
    }
    hideModal(){
        this.#modalContainer.classList.add('hidden');
    }
    showModal(){
        this.#modalContainer.classList.remove('hidden');
    }
}
class ModalEditMainTask{
    #modalEditMainTask;
    #formEditMainTask;
    #inputTaskName;
    #inputTaskDescription;
    constructor() {
        this.#modalEditMainTask = document.querySelector('.edit-main-task-modal');
        this.#formEditMainTask = document.querySelector('.edit-main-task-form');
        this.#inputTaskName = document.querySelector('#taskEditName');
        this.#inputTaskDescription = document.querySelector('#taskEditDescription');
        this.#init();
    }
    #init(){
        this.#formEditMainTask.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('close-modal')){
                event.preventDefault();
                this.hideModal();
            }
            else if(event.target.classList.contains('submit')){
                event.preventDefault();
                const taskId = mainTaskPage.getActiveTask().dataset.id;
                const data = {
                    name:this.#inputTaskName.value,
                    description:this.#inputTaskDescription.value
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${taskId}`,data);
                const json = await  response.json();
                const updatedTask = json.data;
                mainTaskPage.updateActiveTask(updatedTask);
                taskContent.populate(updatedTask);
                this.hideModal();
            }
        });
    }
    hideModal(){
        this.#modalEditMainTask.classList.add('hidden');
        modalContainer.hideModal();
    }
    displayModal(task){
        this.#modalEditMainTask.classList.remove('hidden');
        this.#inputTaskName.value = task.name;
        this.#inputTaskDescription.value = task.description;
        modalContainer.showModal();
    }
}
class ModalEditSubTask{
    #modalEditSubTask;
    #formEditSubTask;
    #inputTaskName;
    constructor() {
        this.#modalEditSubTask = document.querySelector('.edit-sub-task-modal');
        this.#formEditSubTask = document.querySelector('.edit-sub-task-form');
        this.#inputTaskName = document.querySelector('#subTaskEditName');
        this.#init();
    }
    #init(){
        this.#modalEditSubTask.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('close-modal')){
                event.preventDefault();
                this.hideModal();
            }
            else if(event.target.classList.contains('submit')){
                event.preventDefault();
                const mainTaskId = mainTaskPage.getActiveTask().dataset.id;
                const subTaskId = taskContent.getActiveTask().dataset.id;
                const data = {
                    name:this.#inputTaskName.value,
                }
                const response = await updateTask(`http://localhost:8000/api/v1/tasks/${mainTaskId}/subtasks/${subTaskId}`,data);
                const json = await response.json();
                const updatedTask = json.data.subTasks.find((subTask)=>subTask._id === subTaskId);
                mainTaskPage.getTasks()[mainTaskId] = json.data;
                taskContent.updateActiveTask(updatedTask);
                this.hideModal();
            }
        });
    }
    hideModal(){
        this.#modalEditSubTask.classList.add('hidden');
        modalContainer.hideModal();
    }
    displayModal(task){
        this.#modalEditSubTask.classList.remove('hidden');
        this.#inputTaskName.value = task.name;
        modalContainer.showModal();
    }
}
class ModalCreateMainTask {
    #modalCreateTask;
    #formMainTask;
    #inputNameMainTask;
    #inputDescriptionMainTask;
    constructor() {
        this.#modalCreateTask = document.querySelector('.main-task-modal');
        this.#formMainTask = document.querySelector('.create-main-task-form');
        this.#inputNameMainTask = document.querySelector('#taskName');
        this.#inputDescriptionMainTask = document.querySelector('#taskDescription');
        this.#init();
    }
    #init(){
        this.#formMainTask.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('close-modal')){
                this.hideMainTaskCreateModal();
            }
            else if(event.target.classList.contains('submit')){
                event.preventDefault();
                const data = {
                    name:this.#inputNameMainTask.value,
                    description:this.#inputDescriptionMainTask.value,
                }
                const response = await sendData('http://localhost:8000/api/v1/tasks/',data);
                const json = await response.json();
                const task = json.data;
                mainTaskPage.addTask(task);
                this.hideMainTaskCreateModal();
            }
        });
    }
    displayMainTaskCreateModal(){
        this.#modalCreateTask.classList.remove('hidden');
        modalContainer.showModal();
    }
    hideMainTaskCreateModal(){
        this.#modalCreateTask.classList.add('hidden');
        modalContainer.hideModal();
    }

}
class ModalCreateSubTask{
    #modalCreateSubTask;
    #formSubTask;
    #inputNameSubTask;
    constructor() {
        this.#modalCreateSubTask = document.querySelector('.sub-task-modal');
        this.#formSubTask = document.querySelector('.sub-task-form');
        this.#inputNameSubTask = document.querySelector('#subTaskName');
        this.#init();
    }
    #init(){
        this.#formSubTask.addEventListener('click',async (event)=>{
            if(event.target.classList.contains('close-modal')){
                event.preventDefault();
                this.hideSubTaskModal();
            }
            else if(event.target.classList.contains('submit')){
                event.preventDefault();
                const data = {
                    name:this.#inputNameSubTask.value,
                }
                const response = await sendData(`http://localhost:8000/api/v1/tasks/${mainTaskPage.getActiveTask().dataset.id}`,data);
                const json = await response.json();
                const subTask = json.data.subTasks[json.data.subTasks.length-1];
                taskContent.addTask(subTask);
                let tasks = mainTaskPage.getTasks();
                tasks[json.data._id].subTasks.push(subTask);
                this.hideSubTaskModal();
                this.hideSubTaskModal();
            }
        });

    }
    displaySubTaskModal(){
        this.#modalCreateSubTask.classList.remove('hidden');
        modalContainer.showModal();
    }
    hideSubTaskModal(){
        this.#modalCreateSubTask.classList.add('hidden');
        modalContainer.hideModal();
    }

}


const taskContent = new TaskContentPage();
const additionalInfo = new AdditionalInfoPage();
const mainTaskPage = new MainTaskPage();
const modalContainer = new ModalContainer();
const createMainTaskModal = new ModalCreateMainTask();
const createSubTaskModal = new ModalCreateSubTask();
const editMainTaskModal = new ModalEditMainTask();
const editSubTaskModal = new ModalEditSubTask();

document.addEventListener("DOMContentLoaded",async (event)=>{
    const response = await getData('http://localhost:8000/api/v1/tasks/');
    const json = await response.json();
    const tasks = json.data;
    tasks.forEach(task=>{
        mainTaskPage.addTask(task)
    });
});
async function sendData(url,data){
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

async function getData(url){
    return fetch(url);
}
async function updateTask(url,data){
    return fetch(url,{
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
    });
}
async function deleteTask(url){
    return fetch(url,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}