if(typeof window !== 'undefined') {

    window.addEventListener('load', function(){

        // Cria uma variável relativa ao botao "Login" e adiciona um Event Listener
        const btnLogin = document.getElementById("login_btn_login");

        btnLogin.addEventListener('click', async function(){

            //Defini constantes para guardar no localStorage
            const username_value = document.getElementById("login_usertext").value;
            const password_value = document.getElementById("login_password").value;

            const loggedIn = await login(username_value, password_value);
        
            if(loggedIn) {
                alert('Login successful. Redirecting...');
                localStorage.setItem("username", username_value); // Corrigido de 'username' para 'username_value'
                localStorage.setItem("password", password_value); // Corrigido de 'password' para 'password_value'
                document.getElementById('loginForm').reset();
                window.location.href = "scrum.html";
            } else {
                alert('Login failed.');
            }
        });

        document.querySelector(".left-login-image").addEventListener("click", function() {

            window.location.href="../index.html";
        });

    });
    
}



// Faz login e grava o nome de utilizador
async function login(username, password) {
  
    const response = await fetch('http://localhost:8080/backend/rest/users/login', {
        method: 'POST',
        headers: {
            Accept : '*/*',
            'Content-Type': 'application/json',
            'username' : username,
            'password' : password
        },
        body: JSON.stringify({username, password})
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (response.status === 200) { 
        return true;
    } else{
        return false;
    }
}

module.exports = {
    login,
};