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
    @XmlElement
    String priority;
    @XmlElement
    String startDate;
    @XmlElement
    String endDate;

    // final LOW_PRIORITY = 100;
    // final MEDIUM_PRIORITY = 300;
    // final HIGH_PRIORITY = 500;

    // TODO = "todo-cards";
    // DOING = "doing-cards";
    // DONE = "done-cards";



    public Task() {
    }

    public Task(String column, String title, String description, String priority, String startDate, String endDate) {
        this.column = column;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}


