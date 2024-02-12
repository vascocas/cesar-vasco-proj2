// Cria uma variável relativa ao botao "Login" e adiciona um Event Listener
const btnLogin = document.getElementById("index_btn_login");
btnLogin.onclick = login;

// Faz login e grava o nome de utilizador
function login() {  
  window.location.href = "Pages/login.html";
}

// Cria uma variável relativa ao botao "Registar" e adiciona um Event Listener
const btnSignup = document.getElementById("index_btn_signup");
btnSignup.onclick = signup;

// Faz login e grava o nome de utilizador
function signup() {  
  window.location.href = "Pages/signup.html";
}