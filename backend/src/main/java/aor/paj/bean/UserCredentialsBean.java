package aor.paj.bean;

import aor.paj.dto.UserCredentials;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.util.ArrayList;

@ApplicationScoped
public class UserCredentialsBean {

    final String filename = "credentials.json";
    private ArrayList<UserCredentials> usersCredentials;


    public UserCredentialsBean() {
        File f = new File(filename);
        if(f.exists()){
            try {
                FileReader filereader = new FileReader(f);
                usersCredentials = JsonbBuilder.create().fromJson(filereader, new ArrayList<UserCredentials>() {}.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        }else
            usersCredentials = new ArrayList<UserCredentials>();
    }

    public void addCredentials(UserCredentials c) {
        usersCredentials.add(c);
        writeIntoJsonFile();
    }

    public UserCredentials getUsernameCredential(String username) {
        for (UserCredentials c : usersCredentials) {
            if (c.getUsername().equals(username))
                return c;
        }
        return null;
    }

    public ArrayList<UserCredentials> getAllCredentials() {
        return usersCredentials;
    }

    public boolean removeUserCredentials(String username) {
        for (UserCredentials c : usersCredentials) {
            if (c.getUsername().equals(username)) {
                usersCredentials.remove(c);
                return true;
            }
        }
        return false;
    }

    public boolean updatePassword(String username, String newPassword) {
        for (UserCredentials u : usersCredentials) {
            if (u.getUsername().equals(username)) {
                u.setPassword(newPassword);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    private void writeIntoJsonFile(){
        Jsonb jsonb =  JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(usersCredentials, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean usernameExists(String username, ArrayList<UserCredentials> credentials) {
        for (UserCredentials c : credentials) {
            if (c.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }
}
