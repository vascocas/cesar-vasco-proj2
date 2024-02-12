let lastId=0;

//submit formulário
document.getElementById('signup_btn_signup').addEventListener('click', async function(e) {
    e.preventDefault();
    
    let user = {
        'username' : document.getElementById("signup_usertext").value, 
        'password' : document.getElementById("signup_password").value, 
        'email': document.getElementById("email").value,
        'firstName' : document.getElementById("firstName").value,
        'lastName' : document.getElementById("lastName").value,
        'phoneNumber' : document.getElementById("phone").value,
        'photo' : document.getElementById("photoURL").value
    }; 
    console.log(user); 
  
    const response = await fetch('http://localhost:8080/backend/rest/users/register', { 
        method: 'POST', 
        headers: { 
            'Accept': '*/*', 
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify(user)
    });

    console.log(response.status);
    console.log(await response.text());

    if (response.status === 201) { 
        alert('Sign-up successful');
        // Limpa o formulário após a submissão
        document.getElementById('registerForm').reset();
        window.location.href='login.html';
    } else { 
        alert('Registed failed. ' + await response.text());
    }
  });