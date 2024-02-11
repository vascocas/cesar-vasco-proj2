package aor.paj.dto;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Task {

    private final String TODO = "todo-cards";
    private final String DOING = "doing-cards";
    private final String DONE = "done-cards";
    @XmlElement
    private String column;
    @XmlElement
    private String title;
    @XmlElement
    private String description;
    @XmlElement
    private String startDate;
    @XmlElement
    private String endDate;

    private final String LOW_PRIORITY = "100";
    private final String MEDIUM_PRIORITY = "300";
    private final String HIGH_PRIORITY = "500";

    @XmlElement
    private String priority;

    public Task() {
        this.column = TODO;
        this.title = null;
        this.description = null;
        this.priority = LOW_PRIORITY;
        this.startDate = "01.01.2024";
        this.endDate =  "01.12.2024";
    }

    public Task(String title, String description, String priority, String startDate, String endDate) {
        this.column = TODO;
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