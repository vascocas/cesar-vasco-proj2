// Cria uma variável relativa ao botao "Login" e adiciona um Event Listener
const btnLogin = document.getElementById("login_btn_login");
btnLogin.onclick = login;

// Faz login e grava o nome de utilizador
async function login() {

    //Defini constante fora para guardar no localStorage
    const username_value = document.getElementById("login_usertext").value;
    const password_value = document.getElementById("login_password").value;

    let user_credentials = {
        'username' : username_value, 
        'password' : password_value
    }; 

    console.log(user_credentials);
  
    const response = await fetch('http://localhost:8080/backend/rest/users/login', {
        method: 'POST',
        headers: {
            Accept : '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_credentials)
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (response.status === 200) { 
      alert('Login successful. Redirecting...');
      // Guarda o username e password no armazenamento local
      localStorage.setItem("username", username_value);
      localStorage.setItem("password", password_value);
      // Limpa form
      document.getElementById('loginForm').reset();
      // Avança para a página Scrum Board
      window.location.href = "scrum.html";
    } else{
        //Mostra mensagem de alerta do backend
        alert('Login failed. ' + await response.text());
    }
}