package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.dto.Task;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;


@Path("/tasks")
public class TaskService {

    @Inject
    TaskBean taskBean;

    // Get All Tasks
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        return taskBean.getTasks();
    }

    // Get Task by Name
    @GET
    @Path("/{title}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTask(@PathParam("title") String title) {
        Task task =  taskBean.getTask(title);
        if (task==null)
            return Response.status(200).entity("Task with this title is not found").build();
        else
            return Response.status(200).entity(task).build();
    }

    // Add Task
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addTask(Task t) {
        // Check if a task with the same title already exists
        for (Task existingTask : taskBean.getTasks()) {
            if (existingTask.getTitle().equals(t.getTitle())) {
                return Response.status(400).entity("Task with this title already exists").build();
            }
        }

        // Validate that end date is not earlier than start date
        /*
        if (t.getStartDate() != null && t.getEndDate() != null && t.getEndDate().isbefore(t.getStartDate())) {
            return Response.status(400).entity("End date cannot be earlier than start date").build();
        }
         */

        // Proceed with adding the task if validation passes
        taskBean.addTask(t);
        return Response.status(200).entity("A new task is created").build();
    }

    // Delete Task by Name
    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@QueryParam("title") String title) {
        boolean deleted =  taskBean.removeTask(title);
        if (!deleted)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task deleted").build();
    }

    // Delete all Tasks
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
        public Response removeAllTasks() {
        taskBean.removeAllTasks();
        return Response.status(200).entity("All Tasks deleted").build();
    }

    @PUT
    @Path("/moveTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response moveTask(Task t) {
        boolean updated = taskBean.moveTask(t.getTitle(), t.getColumn());
        if (!updated)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task moved to the new column").build();
    }

    @PUT
    @Path("/updateTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateDescription(Task t, @QueryParam("taskTitle") String taskTitle) {
        boolean updated = taskBean.updateTask(taskTitle, t.getTitle(), t.getDescription(), t.getPriority(), t.getStartDate(), t.getEndDate());
        if (!updated)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task content updated").build();
    }


}