package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;

public class UserCredentials {
    @XmlElement
    private String username;
    @XmlElement
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
