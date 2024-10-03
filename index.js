// TASK: import helper functions from utils
import { createNewTask,getTasks,deleteTask, } from './utils/taskFunctions.js';

// TASK: import initialData
import { initialData} from './initialData.js';
 
/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
 const existingTasks = localStorage.getItem('tasks');

 if (!existingTasks) {
  if (typeof initialData !== 'undefined' && initialData !== null) {
    localStorage.setItem ('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true');
    console.log('Initial data loaded into localStorage.')
  }else {
    console.error('initialData is not defined or is null')
  }
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
 addNewTaskBtn: document.getElementById('add-new-task-btn'),
 modalWindow: document.getElementById('new-task-modal-window'),
 titleInput:document.getElementById('title-input'),
 descInput : document.getElementById('desc-input'),
 selectStatus : document.getElementById('select-status'),
 columnDivs: document.querySelectorAll('column-div'),
 editBtn: document.getElementById('edit-btn'),
 editTaskDivButtonGroup: document.getElementById('save-task-changes-btn'),
 editTaskDivButtonGroup: document.getElementById('cancel-edit-btn'),
 editTaskDivButtonGroup: document.getElementById('delete-task-btn'),
 
  container: document.getElementById('task-form'),
  layout: document.getElementById('header-board-name'),
  filterDiv: document.getElementById('filterDiv'),
  sideBar: document.getElementById('side-bar'),
  sideLogoDiv: document.getElementById('side-logo-div'),
  dropdownBtn : document.getElementById('dropdownBtn'),
  iconDark : document.getElementById('icon-dark'),
  toggleDiv: document.getElementById('label-checkbox-theme'),
  iconLight: document.getElementById('icon-light'),
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  createNewTaskBtn: document.getElementById('create-task-btn'),
  themeSwitch: document.getElementById('switch'),
  labelCheck: document.getElementById('label-check-box-theme'),
  openEditTaskModal: document.getElementById('edit-task-modal-window'),
  labelModalWindow: document.getElementById('modal-title-input'),
  
}
elements.addNewTaskBtn.addEventListener('click', (event) =>{ 
  elements.modalWindow.style.display = 'flex';
  event.preventDefault();
  console.log(elements.titleInput.value)
  console.log(elements.descInput.value)
  console.log(elements.selectStatus.value)

  elements.editTaskDivButtonGroup.addEventListener('click', (event) =>{ 
    elements.editBtn.style.display = 'flex';
    event.preventDefault();
    console.log(elements.saveTaskChangesBtn.value)
    console.log(elements.cancelEditBtn.value)
    console.log(elements.delete-task-btn.value)

  }) 

})
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
    console.log(column)
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
  document.querySelectorAll('.board-btn').forEach(btn => { 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active');
    }
    else {
      btn.classList.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector(`[data-status="${task.status}"]`); 
  console.log(`[data-status="${task.status}"]`)
  console.log(column) 
  console.log(task.status)
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
  cancelEditBtn.addEventListener('click' , () => toggleModal(false, elements.openEditTaskModal));

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
};

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
};

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object

 
    const task = {
      title: elements.titleInput.value,
      status: elements.selectStatus.value,
      desc: elements.descInput.value,
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
};


function toggleSidebar(show) {
  const sidebar = document.getElementById('side-bar-div');
  sidebar.style.display = show ? 'block' : 'none';
}

function toggleTheme() {
 document.body.classList.toggle('light-theme');
};



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
  toggleModal(false, elements.openEditTaskModal);
  refreshTasksUI();
 });

  toggleModal(true, elements.openEditTaskModal); // Show the edit task modal
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
 updatedTask(updatedTask);

  // Close the modal and refresh the UI to reflect the changes
toggleModal(false, elements.openEditTaskModal);
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
