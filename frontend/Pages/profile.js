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

    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("phone").value = user.phoneNumber;
    document.getElementById('photo').value = user.photo;
    const profilePic = document.querySelector('.profile-pic');
    if (user.photo) {
        profilePic.src = user.photo;
    } else {
        profilePic.src = '../Resources/profile_pic_default.png';
    }
}

//Logout
const btn_logout=document.getElementById('signout');

btn_logout.onclick=function(){
    //limpa a localstorage
    localStorage.clear();
    console.log('clear');
    window.location.href='../index.html';
};

//Edição dos atributos
document.getElementById('profile_save').addEventListener('click', async function(e){

    e.preventDefault;

    const updatedUser = {
        email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phoneNumber: document.getElementById("phone").value,
        photo: document.getElementById("photo").value,
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
            
            if (response.ok) {
                console.log('User profile updated successfully.');
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