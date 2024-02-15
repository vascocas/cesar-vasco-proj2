package aor.paj.dto;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.time.LocalDate;

@XmlRootElement
public class Task {
    @XmlElement
    private String column;
    @XmlElement
    private String title;
    @XmlElement
    private String description;
    @XmlElement
    private LocalDate startDate;
    @XmlElement
    private LocalDate endDate;
    @XmlElement
    private int priority;

    public Task() {
        this.column = "todo-cards";
    }

    // Constructor to set column based on state identifier
    public Task(String title, String description, int priority, LocalDate startDate, LocalDate endDate) {
        this.column = "todo-cards";
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

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}