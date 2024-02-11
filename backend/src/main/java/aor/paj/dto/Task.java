package aor.paj.dto;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Task {

    public static final int TODO_STATE_ID = 100;
    public static final int DOING_STATE_ID = 200;
    public static final int DONE_STATE_ID = 300;

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

    public static final int LOW_PRIORITY = 100;
    public static final int MEDIUM_PRIORITY = 300;
    public static final int  HIGH_PRIORITY = 500;

    @XmlElement
    private String priority;

    public Task() {
        this.column = "todo-cards";
    }

    // Constructor to set column based on state identifier
    public Task(String title, String description, int priorityId, String startDate, String endDate) {
        this.column = "todo-cards";
        this.title = title;
        this.description = description;

        // Set priority based on the priority identifier
        switch (priorityId) {
            case LOW_PRIORITY:
                this.priority = "low-priority";
                break;
            case MEDIUM_PRIORITY:
                this.priority = "medium-priority";
                break;
            case HIGH_PRIORITY:
                this.priority = "high-priority";
                break;
            default:
                this.priority = "low-priority";
        }

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