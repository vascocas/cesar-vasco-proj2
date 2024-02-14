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
      showProfilePage();
    })
    .catch(error => {
      window.location.href = 'login.html';
    });
}
  
function showProfilePage(){
window.location.href = 'profile.html';
}


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

    let photoUser=user.photo;

    document.getElementById("logged-in-username").innerHTML=user.username;

    document.getElementById("profile_username").value = user.username;
    document.getElementById("profile_email").placeholder = user.email;
    document.getElementById("profile_firstName").placeholder = user.firstName;
    document.getElementById("profile_lastName").placeholder = user.lastName;
    document.getElementById("profile_phone").placeholder = user.phoneNumber;
    document.getElementById('profile_url').placeholder = photoUser;


    //Caso exista foto de perfil lê, se não conseguir ler aparece imagem default
    const profilePic = document.querySelector('.profile-pic');
    if (user.photo) {
        profilePic.src = photoUser;
    } else {
        profilePic.src = '../Resources/profile_pic_default.png';
    }

    //Ao clicar no botão de alterar fotografia, abrir Modal
    btnOpenModal.onclick = function () {

        document.getElementsByClassName("container")[0].style.filter = "blur(5px)";

        let img = document.getElementById('profile-picModal');

        if(document.getElementById('profile_url').value !== ""){
            img.src = document.getElementById('profile_url').placeholder;
        }else{
            img.src=photoUser;
        }

        modal.style.display = "block";
    };
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

    e.preventDefault();

    let email = document.getElementById("profile_email");
    let firstName = document.getElementById("profile_firstName");
    let lastName = document.getElementById("profile_lastName");
    let phoneNumber = document.getElementById("profile_phone");
    let photo = document.getElementById("profile_url");

    const updatedUser = {
        email: nullBlankInput(email),
        firstName: nullBlankInput(firstName),
        lastName: nullBlankInput(lastName),
        phoneNumber: phonenumberValid(phoneNumber),
        photo: nullBlankInput(photo)
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

            if (response.status === 200) { 
                alert('User profile updated successfully.');
                // Relê dos dados na página
                getUser(loggedInUsername);
                console.log(response.status);
                //Reler a informação toda e mostrar
                location.reload()=loadPage;
              } else{
                  //Mostra mensagem de alerta do backend
                  alert('Erro. ' + await response.text());
                  console.log(response.status);
              }
        } else {
            console.error("No logged-in username found in local storage.");
        }
    
});

//Obter o Modal
let modal = document.getElementById("myModal");

//Botão que abre o Modal
let btnOpenModal = document.getElementById("profile_changePhoto");

//Obter o <span> que fecha o Modal
let spanCloseModal = document.getElementsByClassName("close")[0];

//Botão que guarda o edit da foto
let btnEditPhoto = document.getElementById("profile_savePhoto");

//Guardar foto
btnEditPhoto.addEventListener('click', async function(e){

    e.preventDefault();

    let email = document.getElementById("profile_email");
    let firstName = document.getElementById("profile_firstName");
    let lastName = document.getElementById("profile_lastName");
    let phoneNumber = document.getElementById("profile_phone");
    let photo = document.getElementById("profile_url");

    const updatedUser = {
        email: nullBlankInput(email),
        firstName: nullBlankInput(firstName),
        lastName: nullBlankInput(lastName),
        phoneNumber: nullBlankInput(phoneNumber),
        photo: nullBlankInput(photo)
    };

        const loggedInUsername = localStorage.getItem("username");

        if (loggedInUsername) {
            // Envia dados para o servidor
            const response = await fetch('http://localhost:8080/backend/rest/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'username': loggedInUsername,
                    'password': user.password,
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.status === 200) {
                alert('Photo profile updated successfully.');
                // Relê os dados na página
                getUser(loggedInUsername);
                console.log(response.status);
                //Fecha Modal e reseta
                modal.style.display = "none";
                document.getElementsByClassName("container")[0].style.filter = "none";
                document.getElementById("profile_url").value = "";
              } else{
                  //Mostra mensagem de alerta do backend
                  alert('Erro. ' + await response.text());
                  console.log(response.status);
              }
        } else {
            console.error("No logged-in username found in local storage.");
        }

});

//Ao clicar no (x), fechar Modal
spanCloseModal.onclick = function () {
    modal.style.display = "none";
    document.getElementsByClassName("container")[0].style.filter = "none";
    document.getElementById("profile_url").value = "";
};


//Restrição telefone PT
function phonenumberValid(input) {
  let phone = /^([9]{1})([0-9]{8})$/;
  if(input.value.match(phone)) {
        return input.value;
    } else {
        alert('Invalid phone number. Your previous number is unchanged.');
        return input.placeholder;
    }
}

//Se campo não for preenchido, retorna placeholder
function nullBlankInput(input){
    if(input.value==""){
        return input.placeholder;
    }else{
        return input.value;
    }
}

//Clicar no título reencaminha para scrum.html
let btn_title = document.getElementById('profile_titlePage');

btn_title.addEventListener('click', function(){
    window.location.href = 'scrum.html';
});

// Botão para abrir a Modal da password
const btnOpenPasswordModal = document.getElementById('profile_btnPassword');

// Obter a Modal da password
const passwordModal = document.getElementById("passwordModal");

// Obter o  <span> que fecha a Modal
const spanClosePasswordModal = document.getElementsByClassName("close")[1];

// Abrir Modal no clique
btnOpenPasswordModal.onclick = function() {
  passwordModal.style.display = "block";
}

// Fechar Modal no clique
spanClosePasswordModal.onclick = function() {
  passwordModal.style.display = "none";
}


// Alteração da password
document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Valida nova password com confirmação
  if (newPassword !== confirmPassword) {
    alert("Nova password e confirmação não são iguais.");
    return;
  }

  // Send a request to change the password
  const loggedInUsername = localStorage.getItem("username");

  const response = await fetch('http://localhost:8080/backend/rest/users/update/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'username': loggedInUsername,
      'oldpassword': oldPassword,
      'newpassword': newPassword
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });

  if (response.status === 200) {
    alert('Password changed successfully.');
    passwordModal.style.display = "none";
  } else {
    alert('Failed to change password. ' + await response.text());
  }
});


document.getElementById('profile_url').addEventListener('change',function(){

    let photoInst = document.getElementById('profile-picModal');
    let url = document.getElementById('profile_url').value;

    if (url !== '') {
        photoInst.src = url;
    } else {
        photoInst.src = document.getElementById('profile_url').placeholder;
    }

})

async function loadPage(){
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
        // Se o usuário estiver autenticado, continue com o carregamento da página Scrum
        console.log("User authenticated:", data);
        getUser(loggedInUsername);
  } catch (error) {
        console.error("Error checking authentication:", error);
        window.location.href = "login.html"; // Redireciona para a página de login se houver um erro ao verificar a autenticação
  }
};

window.onload = loadPage;