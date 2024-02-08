package aor.paj.dto;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Task {
    @XmlElement
    String column;
    @XmlElement
    String title;
    @XmlElement
    String description;


    public Task() {
        this.column = "todo-cards";
        this.title = null;
        this.description = null;

    }

    public Task(String title, String description) {
        this.column = "todo-cards";
        this.title = title;
        this.description = description;
    }


    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}


