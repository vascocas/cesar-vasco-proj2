package aor.paj.bean;

import jakarta.enterprise.context.SessionScoped;
import aor.paj.dto.User;

import java.io.Serializable;

@SessionScoped
public class LoginBean implements Serializable {

    User currentUser;

    public LoginBean(){

    }

    public LoginBean (User currentUser){this.currentUser = currentUser;}

    public User getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }
}
