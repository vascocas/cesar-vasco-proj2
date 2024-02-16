package aor.paj.bean;

import aor.paj.dto.Task;
import aor.paj.dto.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

import java.io.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class UserBean implements Serializable {

    @Inject
    LoginBean loginBean;

    final String filename = "users.json";
    private ArrayList<User> users;
    private String filePath;


    public UserBean() {
        File f = new File(filename);
        if(f.exists()){
            try {
                FileReader filereader = new FileReader(f);
                users = JsonbBuilder.create().fromJson(filereader, new ArrayList<User>() {}.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        }else
            users = new ArrayList<User>();
    }

    public UserBean(String filePath) {
        this.filePath = filePath;
        this.users = readFromJsonFile();
    }

    public void addUser(User u) {
        users.add(u);
        writeIntoJsonFile();
    }

    public User getUser(String username) {
        for (User u : users) {
            if (u.getUsername().equals(username))
                return u;
        }
        return null;
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public boolean removeUser(String username) {
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                users.remove(u);
                return true;
            }
        }
        return false;
    }

    public boolean updateUser(String username,String email, String firstName, String lastName, String phoneNumber, String photo) {
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                if (email!=u.getEmail()){u.setEmail(email);}

                if (firstName != u.getFirstName()){u.setFirstName(firstName);}

                if (lastName!= u.getLastName()){u.setLastName(lastName);}

                if (phoneNumber!=u.getPhoneNumber()){u.setPhoneNumber(phoneNumber);}

                if (photo != u.getPhoto()){u.setPhoto(photo);}
                
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    private void writeIntoJsonFile(){
        Jsonb jsonb =  JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(users, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean usernameExists(String username,ArrayList<User> users){
        for (User u : users){
            if (u.getUsername().equals(username)){
                return true;
            }
        }
        return false;
    }

    public boolean emailExists(String email,ArrayList<User> users){
        for (User u : users){
            if (u.getEmail().equals(email)){
                return true;
            }
        }
        return false;
    }

    public boolean phoneExists(String phone,ArrayList<User> users) {
        for (User u : users) {
            if (u.getPhoneNumber().equals(phone)) return true;
        }
        return false;
    }

    public boolean validatePassword(String password){
        //Tamanho entre 4 e 12 caracteres
        if(password.length() < 4 || password.length() > 12){
            return false;
        }
        //Tem de ter pelo menos uma letra e um número.
        boolean temLetra = false;
        boolean temNumero = false;

        for(char c : password.toCharArray()){
            //Verifica se o caracter é uma letra.
            if(!Character.isLetter(c)){
                temLetra = true;
                //Verifica se o caracter é um numero.
            }else if(!Character.isDigit(c)){
                temNumero  =true;
            }
        }
        //Retorn true se a senha contiver pelo menos uma letra e um número.
        return temLetra && temNumero;
    }

    public User getLoggeduser(){
        User u = loginBean.getCurrentUser();
        if(u!= null)
            return u;
        else return null;
    }

    public boolean login(String username){
        User u = getUser(username);
        if(u!= null){
            loginBean.setCurrentUser(u);
            return true;
        }
        else
            return false;
    }

    public boolean verifyPassword(String username, String oldPassword){

        User user=getUser(username);

        if (user!=null){
            String password = user.getPassword();
            return password.equals(oldPassword);
        }
        return false;
    }

    public boolean updatePassword(String username, String newPassword) {

        User user = getUser(username);
        if (user != null) {
            user.setPassword(newPassword);
            writeIntoJsonFile();
            return true;
        }
        return false;
    }

    public boolean verifyUsername(String userPath, String user) {
        if (user.equals(userPath)) {
            return true;
        }
        else return false;
    }

    public boolean verifyTaskTitle(String userPath, String title) {
        boolean exist = false;
        for (Task existingTask : getUser(userPath).getUserTasks()) {
            if (existingTask.getTitle().equals(title)) {
                exist = true;
            }
        }
        return exist;
    }

    public void addTaskUser(String username, Task t) {
        User u = getUser(username);
        u.getUserTasks().add(t);
        writeIntoJsonFile();
    }

    public ArrayList<Task> getTasks(String username) {

        return getUser(username).getUserTasks();
    }

    public boolean removeTask(String userPath, String title) {
        for (Task t : getUser(userPath).getUserTasks()) {
            if (t.getTitle().equals(title)) {
                getUser(userPath).getUserTasks().remove(t);
                return true;
            }
        }
        return false;
    }

    public boolean moveTask(String userPath, String title, String newColumn) {
        for (Task t : getUser(userPath).getUserTasks()) {
            if (t.getTitle().equals(title)) {
                t.setColumn(newColumn);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    public boolean updateTask(String userPath, String title, String newTitle, String newDescription, int newPriority, LocalDate newStartDate, LocalDate newEndDate) {
        for (Task t : getUser(userPath).getUserTasks()) {
            if (t.getTitle().equals(title)) {
                t.setTitle(newTitle);
                t.setDescription(newDescription);
                t.setPriority(newPriority);
                t.setStartDate(newStartDate);
                t.setEndDate(newEndDate);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    private ArrayList<User> readFromJsonFile() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                return new ArrayList<>(); // Se o arquivo não existe, retorna uma lista vazia
            }
            return mapper.readValue(file, new TypeReference<ArrayList<User>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>(); // Em caso de erro, retorna uma lista vazia
        }
    }
}