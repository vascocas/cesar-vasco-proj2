// Obter o nome de utilizador do armazenamento local
const username = localStorage.getItem("username");

// Atualizar a mensagem de boas vindas com o nome de utilizador
document.getElementById("userHeader").innerHTML = "Bem vindo, " + username;

// Carregar as tarefas existentes do armazenamento local, se existir um array senão cria um novo
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Adiciona um Event Listener ao botao Adicionar Tarefa
const submitButton = document.getElementById("newTask_btn_submit");
submitButton.onclick = addTask;

// Criar uma nova tarefa
async function addTask() {
  // Declara e atribui variáveis para guardaar os elementos: título e descrição da tarefa
  const titleInput = document.getElementById("newTask_title");
  const descriptionInput = document.getElementById("newTask_description");

  // Verifica tamanho máximo de caracteres do título
  const maxLength = 50;
  let title;
  if (titleInput.value.length > maxLength) {
    alert(
      "Ultrapassou o máximo de caracteres para o Título = " + maxLength + "!"
    );
    return;
  } else {
    title = titleInput.value;
  }
  let description = descriptionInput.value;

  // Verifica se o título já existe em alguma tarefa, através do método some() e devolve um boolean
  const existentTitle = tasks.some((task) => task.title === title);

  if (titleInput.value === "") {
    alert("Por favor preencha o título.");
    // Protege criação de tarefas com o mesmo título
  } else if (existentTitle) {
    alert("Já existe uma tarefa com esse título.");
  } else {
    // Cria uma nova tarefa com os atributos title, column e description. Todas as tarefas começam na coluna TODO
    const newTask = {
      column: "todo-cards",
      title: title,
      description: description
    };
    

    await fetch('http://localhost:8080/backend/rest/task/add', 
    { 
        method: 'POST', 
        headers:  
        { 
            'Accept': '*/*', 
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify(newTask) 
            
      } 
      ).then(function (response) { 
        if (response.status == 200) { 
          alert('task added successfully :)'); 
          // Adicionar a nova tarefa ao array
          tasks.push(newTask);
          localStorage.setItem("tasks", JSON.stringify(tasks));
        } else { 
          alert('something went wrong :('); 
        } 
    });
    

  }

  // Limpar os campos após adicionar uma nova tarefa
  titleInput.value = "";
  descriptionInput.value = "";
}