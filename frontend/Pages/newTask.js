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

  // Verifica tamanho máximo de caracteres do título
  const maxLength = 50;
  let newTitle;
  if (titleInput.value.length > maxLength) {
    alert(
      "Ultrapassou o máximo de caracteres para o Título = " + maxLength + "!"
    );
    return;
  } else {
    newTitle = titleInput.value;
  }
  let newDescription = descriptionInput.value;

  // Verifica se o título já existe em alguma tarefa, através do método some() e devolve um boolean
  const existentTitle = tasks.some((task) => task.title === newTitle);

  if (titleInput.value === "") {
    alert("Por favor preencha o título.");
    // Protege criação de tarefas com o mesmo título
  } else if (existentTitle) {
    alert("Já existe uma tarefa com esse título.");
  } else {
    // Cria uma nova tarefa com os atributos title, column e description. Todas as tarefas começam na coluna TODO
    const newTask = {
      title: newTitle,
      description: newDescription
    };
  
    const requestBody = JSON.stringify(newTask);
  
    await fetch('http://localhost:8080/backend/rest/tasks/add', 
    { 
        method: 'POST', 
        headers:  
        { 
            'Accept': '*/*', 
            'Content-Type': 'application/json' 
        }, 
        body: requestBody
            
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Response error:", errorMessage); // Log error message
          throw new Error(`Failed to add task: ${errorMessage}`);
        }
        alert('Task added successfully');
        tasks.push(newTask); // Added this line to push the new task to the tasks array
        //showTasks(); // Added this line to refresh the scrum board with the updated task list
      })
      .catch(error => {
        console.error('Error adding task:', error);
        alert('Failed to add task');
      });
  }

  // Limpar os campos após adicionar uma nova tarefa
  titleInput.value = "";
  descriptionInput.value = "";
}