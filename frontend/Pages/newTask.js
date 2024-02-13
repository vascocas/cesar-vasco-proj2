function checkAuthentication(){
  fetch(`http://localhost:8080/backend/rest/getuser`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    //Se houver usuário logado, mostra a página
    showNewTaskPage();
  })
  .catch(error => {
    window.location.href = 'login.html';
  });
}

function showNewTaskPage(){
  window.location.href = 'newTask.html';
}

// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Cria array para armazenar as tarefas
let tasks = [];

// Adiciona um Event Listener ao botao Adicionar Tarefa
const submitButton = document.getElementById("newTask_btn_submit");
submitButton.onclick = addTask;

// Criar uma nova tarefa
async function addTask() {
  // Declara e atribui variáveis para guardaar os elementos: título e descrição da tarefa
  const titleInput = document.getElementById("newTask_title");
  const descriptionInput = document.getElementById("newTask_description");
  const priorityInput = document.getElementById("newTask_priority");
  const startDateInput = document.getElementById("newTask_startDate");
  const endDateInput = document.getElementById("newTask_endDate");



  // Função para verificar end Date sempre posterior à start Date
  /*
  endDateInput.addEventListener('change', function() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
        errorMessageElement.textContent = 'End date cannot be earlier than start date.';
        endDateInput.value = ''; // Clear the end date field
    } else {
        errorMessageElement.textContent = '';
    }
  });
  */


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
  } else {
    // Cria uma nova tarefa com os atributos "title" e "description". Todas as tarefas começam na coluna TODO
    const newTask = {
      title: titleInput.value,
      description: descriptionInput.value,
      priority: priorityInput.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
    };

    const requestBody = JSON.stringify(newTask);

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
    titleInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  }
}

window.onload = function() {
  checkAuthentication();
}