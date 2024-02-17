if(typeof window !== 'undefined') {

    window.addEventListener('load', function(){

        document.getElementById('signup_btn_signup').addEventListener('click', async function(e) {

            e.preventDefault();

            const username = document.getElementById("signup_usertext");
            const password = document.getElementById("signup_password"); 
            const email = document.getElementById("signup_email");
            const firstName = document.getElementById("signup_firstName");
            const lastName = document.getElementById("signup_lastName");
            const phoneNumber = document.getElementById("signup_phone");
            const photo = document.getElementById("signup_photoURL");

            const registed = await register(username.value, password.value, email.value, firstName.value, lastName.value, phoneNumber.value, photo.value);

            const usernameExists = await checkIfUsernameExists(username.value);

            console.log(phonenumberValid(phoneNumber) + " phone");
            console.log(isPasswordValid(password.value) + " password");
            console.log(usernameExists + " user");


            if(registed===201 && phonenumberValid(phoneNumber) && isPasswordValid(password.value)) {
                alert('Registo efetuado com sucesso.');
                // Limpa o formulário após a submissão
                document.getElementById('registerForm').reset();
                window.location.href='login.html';
            }else if(registed===409 && usernameExists) {
                alert('Username já existe.');
            }else if(!isPasswordValid(password.value)) {
                alert('Password inválida.');
            }else if(registed===403){
                alert('Email já usado.');
            }else if(!phonenumberValid(phoneNumber)) {
                alert('Número de telefone inválido.');
            }
             
        });

        document.querySelector(".left-login-image").addEventListener("click", function() {

            window.location.href="../index.html";
        });

    });
}

//Valida password
function isPasswordValid(password){
    
    if (password.length < 4 || password.length > 12) {
        return false; 
    }

    //verifica se tem letra
    let temLetra = /[a-zA-Z]/.test(password);

    //verifica se tem número
    let temNumero = /[0-9]/.test(password);

    return temLetra && temNumero;
}

//Valida telefone
function phonenumberValid(input) {
    //padrão validação de telefone a começar em 9 
    let phone = /^([9]{1})([0-9]{8})$/;
    if(input.value.match(phone)) {
        return true;
    } else {
        return false;
    }
};



//Registo
async function register(username, password, email, firstName, lastName, phoneNumber, photo) {
    
    const response = await fetch('http://localhost:8080/backend/rest/users/register', { 
        method: 'POST', 
        headers: { 
            Accept: '*/*', 
            'Content-Type': 'application/json',
            'username' : username,
            'password' : password,
            'email' : email,
            'firstName' : firstName,
            'lastName' : lastName,
            'phoneNumber' : phoneNumber,
            'photo' : photo,
        }, 
    });

    console.log(response.status);
    console.log(await response.text());

    return response.status;

};

async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:8080/backend/rest/users/all');
        if (!response.ok) {
            throw new Error('Não foi possível obter os usuários.');
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Erro ao obter os usuários:', error);
        throw error; // Propaga o erro para que ele seja tratado externamente
    }
}

async function checkIfUsernameExists(input) {
    
    const users = await getAllUsers();
    // Verifica se o input já existe entre os usuários
    for (let user of users) {
        if (user.username === input) {
            return true;
        }
    }
    return false;
}

module.exports = {
    register,
    getAllUsers,
};