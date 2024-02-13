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

//Carreagar toda a informação do user
function fillProfile(user) {
  console.log(user);

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

// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
let userHeader = document.getElementById("logged-in-username");
userHeader.addEventListener("click", function () {
  window.location.href = "profile.html";
});

// Cria uma variável relativa ao botao "Voltar Login" e adiciona um Event Listener
const btnLogout = document.getElementById("scrum_btn_logout");
btnLogout.onclick = homeMenu;

// Função para voltar ao menu inicial
function homeMenu() {
  localStorage.removeItem("username");
  document.location.href = "../index.html";
}

// Cria array para armazenar as tarefas
let tasks = [];

// Função para obter todas as tarefas
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
    showTasks(); // Call showTasks after tasks have been fetched
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
  }
  // If endDate is empty ("") for taskB but not for taskA, taskB should come after taskA
  else if (taskB.endDate === "" && taskA.endDate !== "") {
    return -1;
  }
  // If both endDate are empty ("") or both are not empty, sort by end date as usual
  return new Date(taskA.endDate) - new Date(taskB.endDate);
}

// Function to sort tasks by multiple parameters
function sortTasks(tasks) {
  return tasks.sort(compareTasks);
}

// Função para listar as tarefas nos quadros
function showTasks() {
  // Limpar os quadros antes de listar novamente
  document.getElementById("todo-cards").innerHTML = "";
  document.getElementById("doing-cards").innerHTML = "";
  document.getElementById("done-cards").innerHTML = "";

  // Iterar sobre as tarefas e adicioná-las aos quadros apropriados
  for (const t of tasks) {
    const cardElement = createCardElement(t.title, t.priority);
    const columnElement = document.getElementById(t.column);
    columnElement.appendChild(cardElement);
  }
}

// Função para criar um elemento de cartão HTML para uma tarefa
function createCardElement(title, priority) {
  // Cria uma Div e atribui a className "card"
  const cardElement = document.createElement("div");
  cardElement.className = "card";

  // Cria uma Div e atribui a className "card-header"
  const cardHeaderElement = document.createElement("div");
  cardHeaderElement.className = "card-header";

  // Definir classes com base na prioridade
  if (priority == 100) {
    cardHeaderElement.classList.add("low-priority");
  } else if (priority == 300) {
    cardHeaderElement.classList.add("medium-priority");
  } else if (priority == 500) {
    cardHeaderElement.classList.add("high-priority");
  }

  // Altera o textContent para o título da tarefa
  cardHeaderElement.textContent = title;

  // Adicionar Event Listener para exibir opções
  cardHeaderElement.addEventListener("click", function () {
    showOptions(cardElement);
  });
  // Adiciona a Div cardHeaderElement dentro da cardElement
  cardElement.appendChild(cardHeaderElement);
  return cardElement;
}

// Mostra os botões de opções de cada tarefa
function showOptions(cardElement) {
  // Verificar se já há opções exibidas, se sim, remover (evita duplicar criação de botões com clicks sucessivos)
  const existingOptions = cardElement.querySelector(".task-options");
  if (existingOptions) {
    existingOptions.remove();
    return;
  }
  // Criar Div para guardar as várias opções da tarefa
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "task-options";
  // Cria botões, adicionar Event Listener e chama função correspondente com o parâmetro de entrada o título da tarefa
  optionsContainer.innerHTML = `<button onclick="consultTask('${
    cardElement.querySelector(".card-header").textContent
  }')">Consultar</button>
    <button onclick="deleteTask('${
      cardElement.querySelector(".card-header").textContent
    }')">Apagar</button>
    <button onclick="moveTask('${
      cardElement.querySelector(".card-header").textContent
    }')">Mover</button>`;

  // Adicionar opções de tarefa ao cardElement
  cardElement.appendChild(optionsContainer);

  // Adicionar um Event Listener para fechar as opções quando se clica fora do cardElement
  document.addEventListener("click", function closeOptions(event) {
    if (!cardElement.contains(event.target)) {
      optionsContainer.remove();
      document.removeEventListener("click", closeOptions);
    }
  });
}

// Função consultar tarefa (Primeira das opções da tarefa)
function consultTask(title) {
  // Pesquisa pelo título, o índice da tarefa dentro do array, através do método findIndex()
  const taskIndex = tasks.findIndex((task) => task.title === title);
  // Grava o index no armazenamento da sessão para ser utilizado na página de Consultar/Editar
  sessionStorage.setItem("index", taskIndex);
  // Avança para a página de Consultar/Editar
  window.location.href = "editTask.html";
}

// Função apagar tarefa (Segunda das opções da tarefa)
async function deleteTask(title) {
  //Confirmação do utilizador de apagar tarefa
  const userConfirmed = confirm(
    "Tem a certeza que pretende remover esta tarefa?"
  );
  if (userConfirmed) {
    // Remover a tarefa da lista
    await fetch(
      "http://localhost:8080/backend/rest/tasks/delete/?title=" +
        encodeURIComponent(title),
      {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
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
    // Remove a tarefa da lista local
    tasks = tasks.filter((task) => task.title !== title);

    // Atualiza a UI para refletir a remoção da tarefa
    showTasks();
  }
}

// Função mover tarefa (Terceira das opções da tarefa)
async function moveTask(inputTitle) {
  // Cria uma caixa de diálogo com botões das colunas
  Swal.fire({
    title: "Selecione a coluna de destino",
    input: "select",
    inputOptions: {
      "todo-cards": "ToDo",
      "doing-cards": "Doing",
      "done-cards": "Done",
    },
    inputPlaceholder: "Selecione a coluna",
    showCancelButton: true,
    inputValidator: async (value) => {
      const destinationColumn = value;
      // Pesquisa pelo título, o índice da tarefa dentro do array, através do método findIndex()
      const taskIndex = tasks.findIndex((task) => task.title === inputTitle);
      // Verifica se se está a tentar mover para própria coluna e previne essa ação
      if (tasks[taskIndex].column === destinationColumn) {
        alert("A tarefa já se encontra nesta coluna!");
      } else {
        // Constroi variável com formato JSON para guardar elementos necessários para mudar de coluna (nome e coluna destino)
        let requestBody = JSON.stringify({
          title: inputTitle,
          column: destinationColumn,
        });

        try {
          await fetch("http://localhost:8080/backend/rest/tasks/moveTask", {
            method: "PUT",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            body: requestBody,
          });

          await getAllTasks(); // Fetch all tasks again
          showTasks(); // Update UI
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    },
  });
}

// Chamar user com o username gravado na localstorage
window.onload = function () {
  const loggedInUsername = localStorage.getItem("username");
  if (loggedInUsername) {
    console.log(loggedInUsername);
    getUser(loggedInUsername);
  } else {
    console.error("No logged-in username found in local storage.");
  }
  // Call getAllTasks() when the page loads
  getAllTasks();
};
