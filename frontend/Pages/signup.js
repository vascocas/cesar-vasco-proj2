if(typeof window !== 'undefined') {

    window.addEventListener('load', function(){

        document.getElementById('signup_btn_signup').addEventListener('click', async function(e) {

            e.preventDefault();

            const username = document.getElementById("signup_usertext").value;
            const password = document.getElementById("signup_password").value; 
            const email = document.getElementById("signup_email").value;
            const firstName = document.getElementById("signup_firstName").value;
            const lastName = document.getElementById("signup_lastName").value;
            const phoneNumber = document.getElementById("signup_phone").value;
            const photo = document.getElementById("signup_photoURL").value;

            const registed = await register(username, password, email, firstName, lastName, phoneNumber, photo);

            if(registed) {
                alert('Sign-up successful');
                // Limpa o formulário após a submissão
                document.getElementById('registerForm').reset();
                window.location.href='login.html';
            }else{
                //Mostra mensagem de alerta do backend
                alert('Registed failed.');
             }
        });

    });
}


//submit formulário
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

    if (response.status === 201) { 
        return true;
    } else { 
        return false;
    }
};

module.exports = {
    register,
};