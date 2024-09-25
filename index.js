// TASK: import helper functions from utils
 import { getTasks, updateTask, deleteTask } from './utils';

// TASK: import initialData
import { initialData } from './initialData';


/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
  sideBar: document.getElementById('side-bar-div'),
  sideLogoDiv: document.getElementById('side-logo-div')
  boardsNavLinksDiv: document.getElementById('boards-nav-link-div'),
  boardsNavLinksDiv: document.getElementById('headline-sidepanel'),
  toggleDiv : document.getElementById('icon-dark'),
  toggleDiv: document.getElementById('label-checkbox-theme'),
  toggleDiv: document.getElementById('icon-light'),
  hideSideBarDiv : document.getElementById('hide-side-bar-div'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  stickyHeader : document.getElementById('header'),
  headerNameDiv: document.getElementById('header'),
  headerBoardName : document.getElementById('header-board-name'),
  dropdownBtn : document.getElementById('dropdownBtn'),
  iconChevronDown : document.getElementById('dropDownIcon'),
  primaryBtn : document.getElementById('add-new-task-btn'),
  editBtn : document.getElementById('edit-board-btn'),
  editBbtn : document.getElementById('three-dots-icon'),
  editBtnsDiv: document.getElementById('editBoardDiv'),
  editBtns : document.getElementById('deleteBoardBtn'),
  columnHeadDiv: document.getElementById('todo-head-div'),
  dot : document.getElementById('todo-dot'),
  columnHeader: document.getElementById('toDoText'),
  columnHeadDiv : document.getElementById('doing-head-div'),
  columnHeader: document.getElementById('doingText'),
  columnHeadDiv: document.getElementById('done-head-div'),
  dot: document.getElementById('done-dot'),
  columnHeader: document.getElementById('doneText'),
  modalWindow : document.getElementById('new-task-modal-window'),
  labelModalWindow : document.getElementById('modal-title-input'),
  modalInput: document.getElementById('title-input'),
  inputDiv: document.getElementById('modal-desc-input'),
  inputDiv : document.getElementById('desc-input'),
  labelModalWindow: document.getElementById('modal-select-status'),
  labelModalWindow: document.getElementById('select-status'),
  submitBtn: document.getElementById('create-task-btn'),
  submitBtn : document.getElementById('cancel-add-task-btn'),
  editTaskModalWindow: document.getElementById('edit-task-form'),
  editTaskDiv : document.getElementById('edit-task-header'),
  editBtn : document.getElementById('edit-btn'),
  editTaskDescriptionInput : document.getElementById('edit-task-desc-input'),
  editTaskDiv : document.getElementById('edit-select-status'),
  editBtns: document.getElementById('save-task-changes-btn'),
  editBtns: document.getElementById('cancel-edit-btn'),
  editBtns : document.getElementById('delete-task-btn'),
 
}

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard : boards[0]; 
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener('click', () => { 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add('tasks-container');
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener('click' ,() => { 
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
  };



function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').foreach(btn => { 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active');
    }
    else {
      btn.classList.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(taskElement); 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click' , () => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click' , () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener('click' , () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      title: document.getElementById('task-title').Value,
      status: document.getElementById('task-status').Value,
      board: activeBoard,
      id: Date.now(),
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}


function toggleSidebar(show) {
 const sidebar = document.getElementById('sidebar');
 sidebar.style.display = show ? 'block' : 'none';
}

function toggleTheme() {
 document.body.classList.toggle('light-theme');
}



function openEditTaskModal(task) {
  // Set task details in modal inputs
 document.getElementById('edit-task-title').value = task.title;
 document.getElementById('edit-task-status').value = task.status;  

  // Get button elements from the task modal
 document.getElementById('save-task-btn').addEventListener('click' , () => {
    saveTaskChanges('task.id');
 });

  // Call saveTaskChanges upon click of Save Changes button
 

  // Delete task using a helper function and close the task modal
 document.getElementById('delete-task-btn').addEventListener('click' , ()  => {
  deleteTask(task.id);
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
 });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const title = document.getElementById('edit-task-title').value;
  const status = document/getElementById('edit-task-status').value;

  // Create an object with the updated task details
 const updatedTask = {
  id: taskId,
  title,
  status,
  board: activeBoard,
 };

  // Update task using a helper functoin
 updateTask(updatedTask);

  // Close the modal and refresh the UI to reflect the changes
toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}