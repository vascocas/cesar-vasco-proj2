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
  }
}