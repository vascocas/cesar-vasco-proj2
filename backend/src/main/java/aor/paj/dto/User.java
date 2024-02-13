package aor.paj.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.util.ArrayList;

@XmlRootElement
public class User {

    @XmlElement
    private int id;

    protected static int ultimoId = 0;

    @XmlElement
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @XmlElement
    private String password;

    @XmlElement
    @NotBlank(message = "Email is required")
    @Email(message = "Email is not valid")
    private String email;

    @XmlElement
    private String firstName;

    @XmlElement
    private String lastName;

    @XmlElement
    @NotBlank(message = "Phone number is required")
    //reconhecer um padrão, regular expression
    @Pattern(regexp="^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @XmlElement
    private String photo;

    @XmlElement
    private ArrayList<Task> userTasks;


    public User() {
    }

    public User(String username, String password, String email, String firstName, String lastName, String phoneNumber, String photo) {
        this.id = getNextId();
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.photo = photo;
        this.userTasks = new ArrayList<>();
    }

    //Incrementa o último id identificado
    public synchronized int getNextId() {
        return ++ultimoId;
    }

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public ArrayList<Task> getUserTasks() { return userTasks; }

    public void setUserTasks(ArrayList<Task> userTasks) { this.userTasks = userTasks; }

    public String getPhoto() { return photo; }

    public void setPhoto(String profileImageUrl) { this.photo = profileImageUrl; }
}