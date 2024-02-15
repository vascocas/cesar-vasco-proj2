const loggedInUsername = localStorage.getItem("username");

const email = document.getElementById("profile_email");
const firstName = document.getElementById("profile_firstName");
const lastName = document.getElementById("profile_lastName");
const phoneNumber = document.getElementById("profile_phone");
const photo = document.getElementById("profile_url");

//Logout
const btn_logout=document.getElementById('signout');
btn_logout.onclick = logout;

//Obter o Modal Photo
let modalPhoto = document.getElementById("myModalPhoto");

//Botão que abre o Modal Photo
let btnOpenModalPhoto = document.getElementById("profile_changePhoto");

//Obter o <span> que fecha o Modal Photo e ação
let spanCloseModal = document.getElementsByClassName("close")[0];
spanCloseModal.onclick = closeModal;

//Botão que sai do Modal da foto e mantém input
let btnEditPhoto = document.getElementById("profile_savePhoto");
btnEditPhoto.addEventListener('click', function(){
    modalPhoto.style.display = "none";
    document.getElementsByClassName("container")[0].style.filter = "none";
})

//Atualiza foto instantaneamente
document.getElementById('profile_url').addEventListener('change',function(){
    readPhoto;
})

//Clicar no título reencaminha para scrum.html
let btn_title = document.getElementById('profile_titlePage');
btn_title.addEventListener('click', function(){
    goToScrum();
});

// Botão para abrir a Modal da password
const btnOpenPasswordModal = document.getElementById('profile_btnPassword');

// Abrir Modal Password no clique
btnOpenPasswordModal.onclick = openPassModal;

// Obter a Modal da password
const passwordModal = document.getElementById("passwordModal");

// Obter o  <span> que fecha a Modal
const spanClosePasswordModal = document.getElementsByClassName("close")[1];

// Fechar Modal Password no clique
spanClosePasswordModal.onclick = closePassModal;


//Ação para guardar a edição dos atributos do user
document.getElementById('profile_save').addEventListener('click', async function(e){

    e.preventDefault();

    const updatedUser = {
        email: nullBlankInput(email),
        firstName: nullBlankInput(firstName),
        lastName: nullBlankInput(lastName),
        phoneNumber: phonenumberValid(phoneNumber),
        photo: nullBlankInput(photo)
    };

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
                //Reler a informação toda e mostrar
                location.reload()=loadPage;
            } else {
                 //Mostra mensagem de alerta do backend
                alert('Erro.');
            }
        } else {
            console.error("No logged-in username found in local storage.");
        }
    
});

document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {

    e.preventDefault();

    const oldPassword = document.getElementById("profile_oldPassword").value;
    const newPassword = document.getElementById("profile_newPassword").value;
    const confirmPassword = document.getElementById("profile_confirmPassword").value;

    // Valida nova password com confirmação
    if (newPassword !== confirmPassword) {
        alert("Nova password e confirmação não são iguais.");
        return;
    }

    const save_editPass=save_editPass(oldPassword, newPassword);

    if (save_editPass === 200) {
        alert('Password changed successfully.');
        passwordModal.style.display = "none";
        } else {
        alert('Failed to change password.');
        }
});


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
    btnOpenModalPhoto.onclick = function () {

        document.getElementsByClassName("container")[0].style.filter = "blur(5px)";

        let img = document.getElementById('profile-picModal');

        if(document.getElementById('profile_url').value !== ""){
            img.src = document.getElementById('profile_url').placeholder;
        }else{
            img.src=photoUser;
        }

        modalPhoto.style.display = "block";
    };
}


async function logout(){

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

//Fechar Modal Photo
function closeModal() {
    modalPhoto.style.display = "none";
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

function goToScrum(){
    window.location.href = 'scrum.html';
}

function openPassModal(){
    //Desfoca o background do modal
    document.getElementsByClassName("container")[0].style.filter = "blur(5px)";
    //Torna modal visivel
    passwordModal.style.display = "block";
}

function closePassModal(){
    document.getElementsByClassName("container")[0].style.filter = "none";
    passwordModal.style.display = "none";
    document.getElementById('changePasswordForm').reset();
};

// Alteração da password
async function save_editPass(oldPassword, newPassword) {

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

  return response.status;
};


function readPhoto(){
    let photoInst = document.getElementById('profile-picModal');
    let url = document.getElementById('profile_url').value;

    if (url !== '') {
        photoInst.src = url;
    } else {
        photoInst.src = document.getElementById('profile_url').placeholder;
    }
}

async function loadPage(){

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