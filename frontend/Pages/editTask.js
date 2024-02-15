window.onload = async function () {
  const loggedInUsername = localStorage.getItem("username");

  if (!loggedInUsername) {
    window.location.href = "login.html"; // Redireciona para a página de login se não houver usuário autenticado
    return;
  }

  // Verifica se o usuário está autenticado antes de prosseguir
  try {
    const response = await fetch(
      `http://localhost:8080/backend/rest/users/getuser`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    fillProfile(data);
    console.log("User authenticated:", data);
    // Se o usuário estiver autenticado, continue com o carregamento da página
  } catch (error) {
    console.error("Error checking authentication:", error);
    window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
  }
};

//Carrega toda a informação do user
function fillProfile(user) {
  // Atualizar a mensagem de boas vindas com o nome de utilizador
  document.getElementById("logged-in-username").innerHTML =
    "Bem vindo, " + user.username;

  //Imagem de perfil
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
    return taskA.priority - taskB.priority; // Change the order of subtraction
  }

  // Compare by start date
  const startDateA = new Date(taskA.startDate);
  const startDateB = new Date(taskB.startDate);
  if (startDateA.getTime() !== startDateB.getTime()) {
    return startDateA.getTime() - startDateB.getTime();
  }

  // If start dates are equal, compare by end date
  // If endDate is empty for taskA but not for taskB, taskA should come after taskB
  if (!taskA.endDate && taskB.endDate) {
    return 1;
  }
  // If endDate is empty for taskB but not for taskA, taskB should come after taskA
  else if (!taskB.endDate && taskA.endDate) {
    return -1;
  }
  // If both endDate are empty or both are not empty, sort by end date as usual
  else if (taskA.endDate && taskB.endDate) {
    const endDateA = new Date(taskA.endDate);
    const endDateB = new Date(taskB.endDate);
    return endDateA.getTime() - endDateB.getTime();
  }
  // If both endDate are empty, consider them equal
  return 0;
}

// Function to sort tasks by multiple parameters
function sortTasks(tasks) {
  return tasks.sort(compareTasks);
}

(async function () {
  try {
    await getAllTasks();

    // Access task here
    const selectedId = sessionStorage.getItem("taskId");
    let selectedTask = null;
    for (const task of tasks) {
      if (task.taskId === selectedId) {
       selectedTask = task;
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

    // On click and the button is labeled "Edit"
    async function editTask() {
      // Edit task logic
      if (editButton.value === "Editar") {
        // Make the text fields editable
        titleText.disabled = false;
        descriptionText.disabled = false;
        priorityText.disabled = false;
        startDateText.disabled = false;
        endDateText.disabled = false;
        // Change the button name to "Save"
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

        // Check if the start date and end date are not empty
        if (
          startDateText.value.trim() === "" ||
          endDateText.value.trim() === ""
        ) {
          alert("Por favor preencha as datas.");
          return;
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
