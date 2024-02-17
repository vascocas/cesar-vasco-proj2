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

// Add an event listener to the Add Task button
const submitButton = document.getElementById("newTask_btn_submit");
submitButton.onclick = addTask;

// Function to create a new task
async function addTask() {
  // Declare and assign variables to store task title and description elements
  let titleInput = document.getElementById("newTask_title");
  let descriptionInput = document.getElementById("newTask_description");
  let priorityInput = document.getElementById("newTask_priority");
  let startDateInput = document.getElementById("newTask_startDate");
  let endDateInput = document.getElementById("newTask_endDate");

  const maxLength = 50;

  // Check maximum length of title
  if (titleInput.value.length > maxLength) {
    alert(
      "Ultrapassou o máximo de caracteres para o título= " + maxLength + "!"
    );
    return;
  }

  // Prevent creating tasks with empty title
  else if (titleInput.value === "") {
    alert("Por favor preencha o título.");
    return;
  }

  // Prevent creating tasks without defining priority
  if (priorityInput.value === "") {
    priorityInput.value = 100;
  }

  // Check if the start date is not empty
  if (startDateInput.value.trim() === "") {
    alert("Por favor preencha a data inicial.");
    return;
  }

  // Check if the end date is not empty, if so replace for a default date to give the least priority
  if (endDateInput.value.trim() === "") {
    endDateInput.value = "2100-01-01";
  }

  // Function to ensure end date is always after start date
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  if (endDate < startDate) {
    alert("A data de conclusão não pode ser anterior à data inicial.");
    // Clear the end date field
    endDateInput.value = "";
    return;
  }

  // Create a new task with title, description, priority, start date, and end date attributes. All tasks start in the TODO column.
  const newTask = {
    title: titleInput.value,
    description: descriptionInput.value,
    priority: parseInt(priorityInput.value),
    startDate: startDateInput.value,
    endDate: endDateInput.value,
  };
  const requestBody = JSON.stringify(newTask);

  // Send a POST request to add a new task to the backend server
  await fetch(
    `http://localhost:8080/backend/rest/users/${localStorage.getItem(
      "username"
    )}/tasks`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
      body: requestBody,
    }
  ).then(function (response) {
    if (response.status === 200) {
      tasks.push(newTask);
      response.text().then(function (successMessage) {
        alert(successMessage);
        // Redirect to Scrum Board page
        document.location.href = "scrum.html";
      });
    } else {
      response.text().then(function (errorMessage) {
        alert(errorMessage);
      });
    }
  });
}
