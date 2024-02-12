package aor.paj.bean;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.util.ArrayList;
import jakarta.enterprise.context.ApplicationScoped;
import aor.paj.dto.User;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

@ApplicationScoped
public class UserBean {

    final String filename = "users.json";
    private ArrayList<User> users;


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

    public boolean updateUser(String username,String email, String firstName, String lastName, String phoneNumber) {
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                u.setEmail(email);
                u.setFirstName(firstName);
                u.setLastName(lastName);
                u.setPhoneNumber(phoneNumber);
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
}