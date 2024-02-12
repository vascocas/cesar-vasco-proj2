// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Cria array para armazenar as tarefas
let tasks = [];

// Adiciona um Event Listener ao botao Adicionar Tarefa
const submitButton = document.getElementById("newTask_btn_submit");
submitButton.onclick = addTask;

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// Criar uma nova tarefa
async function addTask() {
  // Declara e atribui variáveis para guardaar os elementos: título e descrição da tarefa
  let titleInput = document.getElementById("newTask_title");
  let descriptionInput = document.getElementById("newTask_description");
  let priorityInput = document.getElementById("newTask_priority");
  let startDateInput = document.getElementById("newTask_startDate");
  let endDateInput = document.getElementById("newTask_endDate");

  const maxLength = 50;

  // Verifica tamanho máximo de caracteres do título
  if (titleInput.value.length > maxLength) {
    alert(
      "Ultrapassou o máximo de caracteres para o Título = " + maxLength + "!"
    );
    return;
  }
  // Protege criação de tarefas com o título vazio
  else if (titleInput.value === "") {
    alert("Por favor preencha o título.");
    return;
  }

  // Protege criação de tarefas sem definir prioridade
  if (priorityInput.value === "") {
    priorityInput.value = 100;
  }

  // Função para verificar end Date sempre posterior à start Date
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (endDate < startDate) {
    alert("Data de conclusão não pode ser anterior à data de início.");
    endDateInput.value = ""; // Clear the end date field
    return;
  }

  // Usage example
const formattedStartDate = formatDate(startDate);
const formattedEndDate = formatDate(endDate);

  // Cria uma nova tarefa com os atributos "title" e "description". Todas as tarefas começam na coluna TODO
  const newTask = {
    title: titleInput.value,
    description: descriptionInput.value,
    priority: parseInt(priorityInput.value),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };

  const requestBody = JSON.stringify(newTask);
  console.log(requestBody);

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

  // Limpar os campos após adicionar uma nova tarefa
  document.getElementById("newTask_form").reset();
}
