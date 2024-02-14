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
  } catch (error) {
    console.log(error);
    console.error("Error checking authentication:", error);
    window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
  }
};

// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Update the welcome message with the username
document.getElementById("userHeader").innerHTML = "Welcome, " + username;

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
    alert("Ultrapassou o máximo de caracteres para o título= " + maxLength + "!");
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
  if (startDateInput.value.trim() === '') {
    alert("Por favor preencha a data inicial.");
    return;
  }

  // Function to ensure end date is always after start date
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (endDate < startDate) {
    alert("A data de conclusão não pode ser anterior à data inicial.");
    endDateInput.value = ""; // Clear the end date field
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
  console.log(requestBody);

  // Send a POST request to add a new task to the backend server
  await fetch("http://localhost:8080/backend/rest/tasks/add", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: requestBody,
  }).then(function (response) {
    if (response.status === 200) {
      tasks.push(newTask);
      response.text().then(function (successMessage) {
        alert(successMessage);
      });
    } else {
      response.text().then(function (errorMessage) {
        alert(errorMessage);
      });
    }
  });

  // Clear the input fields after adding a new task
  document.getElementById("newTask_form").reset();
}

