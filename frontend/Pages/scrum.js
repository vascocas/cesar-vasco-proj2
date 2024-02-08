// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Cria uma variável relativa ao botao "Voltar Login" e adiciona um Event Listener
const btnLogout = document.getElementById("scrum_btn_logout");
btnLogout.onclick = homeMenu;

// Função para voltar ao menu inicial
function homeMenu() {
  localStorage.removeItem("username");
  document.location.href = "../index.html";
}

// Carregar as tarefas existentes do armazenamento local
let tasks = JSON.parse(localStorage.getItem("tasks"));

window.onload = () => {
  // Listar as tarefas nos quadros
  showTasks();

  // Função para listar as tarefas nos quadros
  function showTasks() {
    // Limpar os quadros antes de listar novamente
    document.getElementById("todo-cards").innerHTML = "";
    document.getElementById("doing-cards").innerHTML = "";
    document.getElementById("done-cards").innerHTML = "";

    // Iterar sobre as tarefas e adicioná-las aos quadros apropriados
    for (const t of tasks) {
      const cardElement = createCardElement(t.title);
      const columnElement = document.getElementById(t.column);
      columnElement.appendChild(cardElement);
    }
  }

  // Função para criar um elemento de cartão HTML para uma tarefa
  function createCardElement(title) {
    // Cria uma Div e atribui a className "card"
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    // Cria uma Div e atribui a className "card-header"
    const cardHeaderElement = document.createElement("div");
    cardHeaderElement.className = "card-header";
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
};

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
  optionsContainer.innerHTML =
   `<button onclick="consultTask('${cardElement.querySelector(".card-header").textContent}')">Consultar</button>
    <button onclick="deleteTask('${cardElement.querySelector(".card-header").textContent}')">Apagar</button>
    <button onclick="moveTask('${cardElement.querySelector(".card-header").textContent}')">Mover</button>`;

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
function deleteTask(title) {
  // Pesquisa pelo título, o índice da tarefa dentro do array, através do método findIndex()
  const taskIndex = tasks.findIndex((task) => task.title === title);

  //Confirmação do utilizador de apagar tarefa
  const userConfirmed = confirm("Tem a certeza que pretende remover esta tarefa?");
  if (userConfirmed) {
    // Remover a tarefa da lista
    tasks.splice(taskIndex, 1);

    // Atualiza o array de tarefas no armazenamento local
    localStorage.setItem("tasks", JSON.stringify(tasks));

    alert(" A tarefa com o título: " + title + ",  foi eliminada com sucesso.");
    // Chama a função para actualizar a página após remoção da tarefa
    window.onload();
  }
}

// Função mover tarefa (Terceira das opções da tarefa)
function moveTask(title) {
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
    inputValidator: (value) => {
      const destinationColumn = value;
      // Pesquisa pelo título, o índice da tarefa dentro do array, através do método findIndex()
      const taskIndex = tasks.findIndex((task) => task.title === title);
      // Verifica se se está a tentar mover para própria coluna e previne essa ação
      if (tasks[taskIndex].column === destinationColumn) {
        alert("A tarefa já se encontra nesta coluna!");
      } else {
        // altera o valor da "column" da tarefa, para fazer a correta colocação nas Div
        tasks[taskIndex].column = destinationColumn;
        // Atualiza o array de tarefas no armazenamento local
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Chama a função para actualizar a página após mover a tarefa
        window.onload();
      }
    },
  });
}
