// Chamar user com o username gravado na localstorage
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
    console.log("User authenticated:", data);
    // Se o usuário estiver autenticado, continuar com o carregamento da página Scrum
    getUser(loggedInUsername);
    // Call getAllTasks() when the page loads
    getAllTasks();
  } catch (error) {
    console.error("Error checking authentication:", error);
    window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
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

// Define função para entrar na página de edição de perfil ao clicar no nume de utilizador
let userHeader = document.getElementById("logged-in-username");
userHeader.addEventListener("click", function () {
  window.location.href = "profile.html";
});

//Logout
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
    // Limpa a localstorage
    localStorage.clear();
    // Guarda o username no armazenamento local
    window.location.href = "../index.html";
  } else {
    //Mostra mensagem de alerta do backend
    alert("Logout falhou.");
  }
};

// Cria array para armazenar as tarefas
let tasks = [];

// Função para obter todas as tarefas
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
    tasks = sortTasks(preTasks); // Sort tasks before call show tasks
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

// Função para listar as tarefas nos quadros
function showTasks() {
  // Limpar os quadros antes de listar novamente
  document.getElementById("todo-cards").innerHTML = "";
  document.getElementById("doing-cards").innerHTML = "";
  document.getElementById("done-cards").innerHTML = "";

  // Iterar sobre as tarefas e adicioná-las aos quadros apropriados
  for (const t of tasks) {
    const cardElement = createCardElement(t.taskId, t.title, t.priority);
    const columnElement = document.getElementById(t.column);
    columnElement.appendChild(cardElement);
  }
}

// Função para criar um elemento de cartão HTML para uma tarefa
function createCardElement(taskId, title, priority) {
  // Cria uma Div e atribui a className "card"
  const cardElement = document.createElement("div");
  cardElement.className = "card";

  // Set the task ID as a data attribute
  cardElement.setAttribute("task_Id", taskId);

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

  // Get the task ID from the data attribute of the card element
  const taskId = cardElement.getAttribute("task_Id");

  // Cria botões, adicionar Event Listener e chama função correspondente com o parâmetro de entrada o ID da tarefa
  optionsContainer.innerHTML = `<button onclick="consultTask('${taskId}')">Consultar</button>
  <button onclick="deleteTask('${taskId}')">Apagar</button>
  <button onclick="moveTask('${taskId}')">Mover</button>`;

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
function consultTask(taskId) {
  // Grava o titulo da tarefa no armazenamento da sessão para ser utilizado na página de Consultar/Editar
  sessionStorage.setItem("taskId", taskId);
  // Avança para a página de Consultar/Editar
  window.location.href = "editTask.html";
}

// Função apagar tarefa (Segunda das opções da tarefa)
async function deleteTask(taskId) {
  //Confirmação do utilizador de apagar tarefa
  const userConfirmed = confirm(
    "Tem a certeza que pretende remover esta tarefa?"
  );
  if (userConfirmed) {
    // Remover a tarefa da lista
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
    // Atualiza a UI para refletir a remoção da tarefa
    getAllTasks();
    showTasks();
  }
}

// Função mover tarefa (Terceira das opções da tarefa)
async function moveTask(taskId) {
  // Cria uma caixa de diálogo com botões das colunas
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
      // Pesquisa a tarefa dentro do array através taskId
      let selectedTask = null;
      for (const t of tasks) {
        if (t.taskId == taskId) {
          selectedTask = t;
          break;
        }
      }
      // Verifica se se está a tentar mover para própria coluna e previne essa ação
      if (selectedTask.column === destinationColumn) {
        alert("A tarefa já se encontra nesta coluna!");
      } else {
        // Constroi variável com formato JSON para guardar elementos necessários para mudar de coluna (nome e coluna destino)
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
          await getAllTasks(); // Fetch all tasks again
          showTasks(); // Update UI
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    },
  });
}
