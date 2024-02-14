// Get the username from local storage
const username = localStorage.getItem("username");

// Update the welcome message with the username
document.getElementById("userHeader").innerHTML = "Welcome, " + username;

// Create an array to store tasks
let tasks = [];

// Function to fetch all tasks
async function getAllTasks() {
  try {
    const response = await fetch("http://localhost:8080/backend/rest/tasks", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    const preTasks = data;
    tasks = sortTasks(preTasks);
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

  // If priorities are equal, compare by start date
  if (taskA.startDate !== taskB.startDate) {
    return new Date(taskA.startDate) - new Date(taskB.startDate);
  }

  // If start dates are equal, compare by end date
  // If endDate is empty ("") for taskA but not for taskB, taskA should come after taskB
  if (taskA.endDate === "" && taskB.endDate !== "") {
    return 1;
  } else if (taskB.endDate === "" && taskA.endDate !== "") {
    // If endDate is empty ("") for taskB but not for taskA, taskB should come after taskA
    return -1;
  }
  // If both endDate are empty ("") or both are not empty, sort by end date as usual
  return new Date(taskA.endDate) - new Date(taskB.endDate);
}

// Function to sort tasks by multiple parameters
function sortTasks(tasks) {
  return tasks.sort(compareTasks);
}

(async function () {
  try {
    await getAllTasks();
    // Access tasks here
    const index = sessionStorage.getItem("index");

    // Declare and assign variables to the title and description elements of the task
    let titleText = document.getElementById("editTask_title");
    let descriptionText = document.getElementById("editTask_description");
    let priorityText = document.getElementById("editTask_priority");
    let startDateText = document.getElementById("editTask_startDate");
    let endDateText = document.getElementById("editTask_endDate");

    // Assign values to the attributes of the selected task
    titleText.value = tasks[index].title;
    descriptionText.value = tasks[index].description;
    priorityText.value = tasks[index].priority;
    startDateText.value = tasks[index].startDate;
    endDateText.value = tasks[index].endDate;

    // Create this variable to store the value for the PUT html request
    let queryText = tasks[index].title;

    // Add an Event Listener to the Edit Task button
    const editButton = document.getElementById("editTask_btn_submit");
    editButton.onclick = editTask;

    // On click and the button is labeled "Edit"
    async function editTask() {
      // Edit task logic
      if (editButton.value === "Edit") {
        // Make the text fields editable
        titleText.disabled = false;
        descriptionText.disabled = false;
        priorityText.disabled = false;
        startDateText.disabled = false;
        endDateText.disabled = false;
        // Change the button name to "Save"
        editButton.value = "Save";
      }
      // Save task logic
      else if (editButton.value === "Save") {
        // Check maximum length of Title and save current values of the task title and description
        const maxLength = 50;
        if (titleText.value.length > maxLength) {
          alert("Ultrapassou o máximo de caracteres para o título= " + maxLength + "!");
          return;
        } else {
          // Update the task on the server
          const requestBody = JSON.stringify({
            title: titleText.value,
            description: descriptionText.value,
            priority: priorityText.value,
            startDate: startDateText.value,
            endDate: endDateText.value,
          });

          const response = await fetch(
            "http://localhost:8080/backend/rest/tasks/updateTask/?taskTitle=" +
              encodeURIComponent(queryText),
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: requestBody,
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

          // Redirect to Scrum Board page
          document.location.href = "scrum.html";
        }
      }
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
})();


window.onload = async function() {
  const loggedInUsername = localStorage.getItem("username");

  if (!loggedInUsername) {
    console.error("No logged-in username found in local storage.");
    window.location.href = "login.html"; // Redireciona para a página de login se não houver usuário autenticado
    return;
  }

  // Verifica se o usuário está autenticado antes de prosseguir
  try {
    const response = await fetch(`http://localhost:8080/backend/rest/users/getuser`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("User authenticated:", data);
    // Se o usuário estiver autenticado, continue com o carregamento da página
    console.log(loggedInUsername);
    await getAllTasks();
  } catch (error) {
    console.error("Error checking authentication:", error);
    window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
  }
};