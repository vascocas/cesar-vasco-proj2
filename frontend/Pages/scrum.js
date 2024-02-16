// Call user with username stored in localstorage
window.onload = async function () {
  const loggedInUsername = localStorage.getItem("username");

  if (!loggedInUsername) {
    // Redirects to the login page if there is no authenticated user
    window.location.href = "login.html";
    return;
  }

  // Checks if the user is authenticated before proceeding
  try {
    const response = await fetch(
      `http://localhost:8080/backend/rest/users/getuser`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    getUser(loggedInUsername);
    // Call getAllTasks() when the page loads
    getAllTasks();
  } catch (error) {
    console.error("Error checking authentication:", error);
    // Redirects to the login page if there is an error verifying authentication
    window.location.href = "login.html";
  }
};

async function getUser(loggedInUsername) {
  try {
    const response = await fetch(
      `http://localhost:8080/backend/rest/users/${loggedInUsername}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    fillProfile(data);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

// Load all user information
function fillProfile(user) {
  // Update the welcome message with the username
  document.getElementById("logged-in-username").innerHTML =
    "Bem vindo, " + user.username;

  //Profile image
  const profilePic = document.querySelector(".profile-pic");
  if (user.photo) {
    profilePic.src = user.photo;
  } else {
    profilePic.src = "../Resources/profile_pic_default.png";
  }
}

// Defines function to enter the profile editing page by clicking on the username
let userHeader = document.getElementById("logged-in-username");
userHeader.addEventListener("click", function () {
  window.location.href = "profile.html";
});

// Logout
const btn_logout = document.getElementById("scrum_btn_logout");

btn_logout.onclick = async function () {
  const response = await fetch(
    "http://localhost:8080/backend/rest/users/logout",
    {
      method: "POST",
    }
  );
  if (response.status === 200) {
    alert("Logout realizado com sucesso.");
    // Clears localstorage
    localStorage.clear();
    // Save the username in local storage
    window.location.href = "../index.html";
  } else {
    alert("Logout falhou.");
  }
};

// Create array to store tasks
let tasks = [];

// Load all stored tasks
async function getAllTasks() {
  try {
    const response = await fetch(
      `http://localhost:8080/backend/rest/users/${localStorage.getItem(
        "username"
      )}/tasks`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    const preTasks = data;
    // Sort tasks before call show tasks
    tasks = sortTasks(preTasks);
    // Call showTasks function
    showTasks(); 
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Define a comparison function for sorting tasks
function compareTasks(taskA, taskB) {
  // First, compare by priority
  if (taskA.priority !== taskB.priority) {
    return taskB.priority - taskA.priority;
  }
  // If priority is equal, compare by start date
  const startDateA = new Date(taskA.startDate);
  const startDateB = new Date(taskB.startDate);
  if (startDateA.getTime() !== startDateB.getTime()) {
    return startDateA.getTime() - startDateB.getTime();
  }
  // If start dates are equal, compare by end date
  else {
    const endDateA = new Date(taskA.endDate);
    const endDateB = new Date(taskB.endDate);
    return endDateA.getTime() - endDateB.getTime();
  }
}

// Function to sort tasks by multiple parameters
function sortTasks(tasks) {
  return tasks.sort(compareTasks);
}

// Function to list the tasks in the tables
function showTasks() {
  // Clear the frames before listing again
  document.getElementById("todo-cards").innerHTML = "";
  document.getElementById("doing-cards").innerHTML = "";
  document.getElementById("done-cards").innerHTML = "";

  // Iterate over the tasks and add them to the appropriate boards
  for (const t of tasks) {
    const cardElement = createCardElement(t.taskId, t.title, t.priority);
    const columnElement = document.getElementById(t.column);
    columnElement.appendChild(cardElement);
  }
}

// Function to create an HTML card element for a task
function createCardElement(taskId, title, priority) {
  // Create a Div and assign the className "card"
  const cardElement = document.createElement("div");
  cardElement.className = "card";

  // Set the task ID as a data attribute
  cardElement.setAttribute("task_Id", taskId);

  // Create a Div and assign the className "card-header"
  const cardHeaderElement = document.createElement("div");
  cardHeaderElement.className = "card-header";

  // Define classes based on priority
  if (priority == 100) {
    cardHeaderElement.classList.add("low-priority");
  } else if (priority == 300) {
    cardHeaderElement.classList.add("medium-priority");
  } else if (priority == 500) {
    cardHeaderElement.classList.add("high-priority");
  }

  // Change the textContent to the task title
  cardHeaderElement.textContent = title;

  // Add Event Listener to display options
  cardHeaderElement.addEventListener("click", function () {
    showOptions(cardElement);
  });
  // Append cardHeaderElement to cardElement
  cardElement.appendChild(cardHeaderElement);
  return cardElement;
}

// Shows the options buttons for each task
function showOptions(cardElement) {
  // Check if there are already options displayed, if so, remove (avoids duplicate creation of buttons with successive clicks)
  const existingOptions = cardElement.querySelector(".task-options");
  if (existingOptions) {
    existingOptions.remove();
    return;
  }
  // Create Div to store the various task options
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "task-options";

  // Get the task ID from the data attribute of the card element
  const taskId = cardElement.getAttribute("task_Id");

  // Create buttons, add Event Listener and call corresponding function with input parameter task ID
  optionsContainer.innerHTML = `<button onclick="consultTask('${taskId}')">Consultar</button>
  <button onclick="deleteTask('${taskId}')">Apagar</button>
  <button onclick="moveTask('${taskId}')">Mover</button>`;

  // Add task options to cardElement
  cardElement.appendChild(optionsContainer);

  // Add an Event Listener to close the options when clicking outside the cardElement
  document.addEventListener("click", function closeOptions(event) {
    if (!cardElement.contains(event.target)) {
      optionsContainer.remove();
      document.removeEventListener("click", closeOptions);
    }
  });
}

// Query task function (First of the task options)
function consultTask(taskId) {
  // Saves the task title in the session storage for use on the Consult/Edit page
  sessionStorage.setItem("taskId", taskId);
  // Navigate to the Consult/Edit page
  window.location.href = "editTask.html";
}

// Delete task function (Second of the task options)
async function deleteTask(taskId) {
  // User confirmation to delete task
  const userConfirmed = confirm(
    "Tem a certeza que pretende remover esta tarefa?"
  );
  if (userConfirmed) {
    // Remove the task from the list
    await fetch(
      `http://localhost:8080/backend/rest/users/${localStorage.getItem(
        "username"
      )}/delete/?iD=` + encodeURIComponent(taskId),
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      }
    ).then(function (response) {
      if (response.status === 200) {
        response.text().then(function (successMessage) {
          alert(successMessage);
        });
      } else {
        response.text().then(function (errorMessage) {
          alert(errorMessage);
        });
      }
    });
    // Update the UI to reflect the removal of the task
    getAllTasks();
    showTasks();
  }
}

// Move task function (Third of the task options)
async function moveTask(taskId) {
  // Creates a dialogue box with column buttons
  Swal.fire({
    title: "Selecione a coluna de destino",
    input: "select",
    inputOptions: {
      "todo-cards": "TO DO",
      "doing-cards": "DOING",
      "done-cards": "DONE",
    },
    inputPlaceholder: "Selecione a coluna",
    showCancelButton: true,
    inputValidator: async (value) => {
      const destinationColumn = value;
      // Search for the task within the array using taskId
      let selectedTask = null;
      for (const t of tasks) {
        if (t.taskId == taskId) {
          selectedTask = t;
          break;
        }
      }
      // Checks if it is trying to move to its own column and prevents this action
      if (selectedTask.column === destinationColumn) {
        alert("A tarefa já se encontra nesta coluna!");
      } else {
        // Construct JSON-formatted variable to store elements needed to move the task (name and target column)
        let requestBody = JSON.stringify({
          taskId: taskId,
          column: destinationColumn,
        });
        try {
          await fetch(
            `http://localhost:8080/backend/rest/users/${localStorage.getItem(
              "username"
            )}/moveTask`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password"),
              },
              body: requestBody,
            }
          );
          // Fetch all tasks again to update UI
          await getAllTasks();
          showTasks();
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    },
  });
}
