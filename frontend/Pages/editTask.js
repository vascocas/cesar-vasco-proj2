// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Cria array para armazenar as tarefas
let tasks = [];

// Call getAllTasks to fetch tasks from the backend
async function getAllTasks() {
  await fetch("http://localhost:8080/backend/rest/tasks", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tasks = data;
    });
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

    //Create this variable to store the value for the PUT html request
    let queryText = tasks[index].title;

    // Add an Event Listener to the Edit Task button
    const editButton = document.getElementById("editTask_btn_submit");
    editButton.onclick = editTask;

    // On click and the button is labeled "Edit"
    async function editTask() {
      // Edit task logic
      if (editButton.value === "Editar") {
        // Transforma em editável os campos de texto
        titleText.disabled = false;
        descriptionText.disabled = false;
        priorityText.disabled = false;
        startDateText.disabled = false;
        endDateText.disabled = false;
        // Altera o nome do botão para "Gravar"
        editButton.value = "Gravar";
      }
      // Save task logic
      else if (editButton.value === "Gravar") {
        // Verifica tamanho máximo de caracteres do Título e grava os valores atuais do título e descrição da tarefa
        const maxLength = 50;
        if (titleText.value.length > maxLength) {
          alert(
            "Ultrapassou o máximo de caracteres para o Título = " +
              maxLength +
              "!"
          );
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