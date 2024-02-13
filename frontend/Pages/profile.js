async function getUser(loggedInUsername) {
    try {
        const response = await fetch(`http://localhost:8080/backend/rest/users/${loggedInUsername}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
        const data = await response.json();
        fillProfile(data);
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}


// Preenche os campos do formulário
function fillProfile(user) {
    console.log(user);

    document.getElementById("logged-in-username").innerHTML=user.username;

    document.getElementById("profile_username").value = user.username;
    document.getElementById("profile_email").placeholder = user.email;
    document.getElementById("profile_firstName").placeholder = user.firstName;
    document.getElementById("profile_lastName").placeholder = user.lastName;
    document.getElementById("profile_phone").placeholder = user.phoneNumber;
    document.getElementById("profile_photo").placeholder = user.photo;

    //Caso exista foto de perfil lê, se não conseguir ler aparece imagem default
    const profilePic = document.querySelector('.profile-pic');
    if (user.photo) {
        profilePic.src = user.photo;
    } else {
        profilePic.src = '../Resources/profile_pic_default.png';
    }
}

//Logout
const btn_logout=document.getElementById('signout');

btn_logout.onclick= async function(){

    const response = await fetch('http://localhost:8080/backend/rest/users/logout', {
        method: 'POST',
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (response.status === 200) { 
      alert('Logout successful.');
        // Limpa a localstorage
        localStorage.clear();
        // Guarda o username no armazenamento local
        window.location.href='../index.html';
    } else{
        //Mostra mensagem de alerta do backend
        alert('Logout failed. ');
    }

};

//Edição dos atributos
document.getElementById('profile_save').addEventListener('click', async function(e){

    e.preventDefault;

    const updatedUser = {
        email: document.getElementById("profile_email").value,
        firstName: document.getElementById("profile_firstName").value,
        lastName: document.getElementById("profile_lastName").value,
        phoneNumber: document.getElementById("profile_phone").value,
        photo: document.getElementById("profile_photo").value,
    };

        const loggedInUsername = localStorage.getItem("username");

        if (loggedInUsername) {
            // Envia dados para o servidor
            const response = await fetch('http://localhost:8080/backend/rest/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'username': loggedInUsername
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.status === 201) { 
                alert('User profile updated successfully.');
                // Relê dos dados na página
                getUser(loggedInUsername);
              } else{
                  //Mostra mensagem de alerta do backend
                  alert('Erro. ' + await response.text());
              }
        } else {
            console.error("No logged-in username found in local storage.");
        }
    
});

// Chamar user com o username gravado na localstorage
window.onload = async function() {
    const loggedInUsername = localStorage.getItem("username");

  if (!loggedInUsername) {
    console.error("No logged-in username found in local storage.");
    window.location.href = "login.html"; // Redireciona para a página de login se não houver usuário autenticado
    return;
  }

  // Verifica se o usuário está autenticado antes de prosseguir
  try {
    const response = await fetch(`http://localhost:8080/backend/rest/users/getuser`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("User authenticated:", data);
        // Se o usuário estiver autenticado, continue com o carregamento da página Scrum
        console.log(loggedInUsername);
      getUser(loggedInUsername);
  } catch (error) {
    console.error("Error checking authentication:", error);
    window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
  }
};