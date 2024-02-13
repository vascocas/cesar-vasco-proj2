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

function fillProfile(user) {
    console.log(user);

    document.getElementById("logged-in-username").innerHTML=user.username;

    document.getElementById("profile_username").value = user.username;
    document.getElementById("profile_email").value = user.email;
    document.getElementById("profile_firstName").value = user.firstName;
    document.getElementById("profile_lastName").value = user.lastName;
    document.getElementById("profile_phone").value = user.phoneNumber;

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
window.onload = function() {
    const loggedInUsername = localStorage.getItem("username");
    if (loggedInUsername) {
        console.log(loggedInUsername);
        getUser(loggedInUsername);
    } else {
        console.error("No logged-in username found in local storage.");
    }
};