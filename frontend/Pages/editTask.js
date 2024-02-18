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
    fillProfile(data);
    // If the user is authenticated, continue loading the page
  } catch (error) {
    console.error("Error checking authentication:", error);
    // Redirects to the login page if there is an error verifying authentication
    window.location.href = "login.html";
  }
};

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

// Create an array to store tasks
let tasks = [];

// Function to fetch all tasks
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
    tasks = data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

(async function () {
  try {
    await getAllTasks();

    // Access task here
    const selectedId = sessionStorage.getItem("taskId");
    let selectedTask = null;
    for (const t of tasks) {
      if (t.taskId == selectedId) {
        selectedTask = t;
        break;
      }
    }

    // Declare and assign variables to the title and description elements of the task
    let titleText = document.getElementById("editTask_title");
    let descriptionText = document.getElementById("editTask_description");
    let priorityText = document.getElementById("editTask_priority");
    let startDateText = document.getElementById("editTask_startDate");
    let endDateText = document.getElementById("editTask_endDate");

    // Assign values to the attributes of the selected task
    titleText.value = selectedTask.title;
    descriptionText.value = selectedTask.description;
    priorityText.value = selectedTask.priority;
    startDateText.value = selectedTask.startDate;
    endDateText.value = selectedTask.endDate;

    // Add an Event Listener to the Edit Task button
    const editButton = document.getElementById("editTask_btn_submit");
    editButton.onclick = editTask;

    // On click and the button is with edit sign
    async function editTask() {
      // Edit task logic
      if (editButton.value === "✎") {
        // Make the text fields editable
        titleText.disabled = false;
        descriptionText.disabled = false;
        priorityText.disabled = false;
        startDateText.disabled = false;
        endDateText.disabled = false;
        // Change the button name to "Gravar"
        editButton.value = "Gravar";
      }
      // Save task logic
      else if (editButton.value === "Gravar") {
        const maxLength = 50;
        // Check maximum length of title
        if (titleText.value.length > maxLength) {
          alert(
            "Ultrapassou o máximo de caracteres para o título= " +
              maxLength +
              "!"
          );
          return;
        }
        // Prevent creating tasks with empty title
        else if (titleText.value === "") {
          alert("Por favor preencha o título.");
          return;
        }

        // Check if the start date is not empty
        if (startDateText.value.trim() === "") {
          alert("Por favor preencha a data inicial.");
          return;
        }

        // Check if the end date is not empty, if so replace for a default date to give the least priority
        if (endDateText.value.trim() === "") {
          endDateText.value = "2100-01-01";
        }

        // Function to ensure end date is always after start date
        const startDate = new Date(startDateText.value);
        const endDate = new Date(endDateText.value);

        if (endDate < startDate) {
          alert("A data de conclusão não pode ser anterior à data inicial.");
          endDateText.value = ""; // Clear the end date field
          return;
        }

        // Update the task on the server
        const requestBody = JSON.stringify({
          title: titleText.value,
          description: descriptionText.value,
          priority: priorityText.value,
          startDate: startDateText.value,
          endDate: endDateText.value,
        });

        const response = await fetch(
          `http://localhost:8080/backend/rest/users/${localStorage.getItem(
            "username"
          )}/updateTask/?iD=` + encodeURIComponent(selectedId),
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
        if (response.status === 200) {
          const successMessage = await response.text();
          alert(successMessage);
        } else {
          const errorMessage = await response.text();
          alert(errorMessage);
        }

        // Redirect to Scrum Board page
        document.location.href = "scrum.html";
      }
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
})();
