package aor.paj.bean;

import java.io.*;
import java.time.LocalDate;
import java.util.ArrayList;

import aor.paj.dto.Task;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

@ApplicationScoped
public class TaskBean implements Serializable {

    final String filename = "tasks.json";
    private ArrayList<Task> tasks;

    public TaskBean() {
        File f = new File(filename);
        if (f.exists()) {
            try {
                FileReader filereader = new FileReader(f);
                tasks = JsonbBuilder.create().fromJson(filereader, new ArrayList<Task>() {
                }.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else
            tasks = new ArrayList<Task>();
    }

    public void addTask(Task newTask) {
        tasks.add(newTask);
        writeIntoJsonFile();
    }

    public Task getTask(String title) {
        for (Task t : tasks) {
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
            if (t.getTitle().equals(title)) {
                tasks.remove(t);
                return true;
            }
        }
        return false;
    }

    public boolean moveTask(String title, String newColumn) {
        for (Task t : tasks) {
            if (t.getTitle().equals(title)) {
                t.setColumn(newColumn);
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    public boolean updateTask(String title, String newTitle, String newDescription, int newPriority, LocalDate newStartDate, LocalDate newEndDate) {
        for (Task t : tasks) {
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


    private void writeIntoJsonFile() {
        Jsonb jsonb = JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(tasks, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}