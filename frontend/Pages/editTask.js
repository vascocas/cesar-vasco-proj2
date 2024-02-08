// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Carregar as tarefas existentes no armazenamento local
const tasks = JSON.parse(localStorage.getItem("tasks"));

// Vai buscar o índice guardado no armazenamento da sessão
const index = sessionStorage.getItem("index");

// Declara e atribui variáveis aos elementos do título e descrição da tarefa
let titleText = document.getElementById("editTask_title");
let descriptionText = document.getElementById("editTask_description");

// Atribui os valores do título e da descrição da tarefa selecionada
titleText.value = tasks[index].title;
descriptionText.value = tasks[index].description;

// Adiciona um Event Listener ao botao Editar Tarefa
const editButton = document.getElementById("editTask_btn_submit");
editButton.onclick = editTask;

// Ao clicar e o botão está com o texto "Editar"
function editTask() {
  if (editButton.value === "Editar") {
    // Transforma em editável os campos de texto
    titleText.disabled = false;
    descriptionText.disabled = false;
    // Altera o nome do botão para "Gravar"
    editButton.value = "Gravar";
  }
  // Ao clicar e o botão está com o texto "Gravar"
  else if (editButton.value === "Gravar") {
    
    // Verifica tamanho máximo de caracteres do Título e grava os valores atuais do título e descrição da tarefa
    const maxLength = 50;
    if (titleText.value.length > maxLength) {
      alert("Ultrapassou o máximo de caracteres para o Título = " + maxLength + "!");
      return;
    } else {
      tasks[index].title = titleText.value;
    }
    tasks[index].description = descriptionText.value;

    // Grava a tarefa após edição no armazenamento local
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Alterações gravadas com sucesso!");
    // Avança para a página Scrum Board
    document.location.href = "scrum.html";
  }
}