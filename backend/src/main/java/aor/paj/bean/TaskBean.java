package aor.paj.bean;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.util.ArrayList;

import aor.paj.dto.Task;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

@ApplicationScoped
public class TaskBean {

    final String filename = "tasks.json";
    private ArrayList<Task> tasks;

    public TaskBean() {
        File f = new File(filename);
        if(f.exists()){
            try {
                FileReader filereader = new FileReader(f);
                tasks = JsonbBuilder.create().fromJson(filereader, new ArrayList<Task>() {}.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        }else
            tasks = new ArrayList<Task>();
    }

    public void addTask(Task t) {
        tasks.add(t);
        writeIntoJsonFile();
    }

    public Task getTask(String title) {
        for (Task t : tasks) {
            System.out.println("Tarefa ==> "+ t);
            System.out.println("Titulo ==> "+ t.getTitle());
            if (t.getTitle().equals(title))
                return t;
        }
        return null;
    }

    public ArrayList<Task> getTasks() {
        return tasks;
    }

    public boolean removeTask(String title) {
        for (Task t : tasks) {
            if (t.getTitle().equals(title)){
                tasks.remove(t);
                return true;
            }
        }
        return false;
    }

    public boolean updateColumn(String title, String column) {
        for (Task t : tasks) {
            if (t.getTitle().equals(title)) {
                t.setColumn(column);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    public boolean updateDescription(String title, String newTitle, String description) {
        for (Task t : tasks) {
            if (t.getTitle().equals(title)) {
                t.setTitle(newTitle);
                t.setDescription(description);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }


    private void writeIntoJsonFile(){
        Jsonb jsonb =  JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(tasks, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}