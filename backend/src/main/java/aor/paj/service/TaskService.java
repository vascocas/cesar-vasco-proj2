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

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        return taskBean.getTasks();
    }

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

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addTask(Task t) {
        boolean added = taskBean.addTask(t);
        if(!added)
            return Response.status(400).entity("Task with this title already exists").build();
        else
            return Response.status(200).entity("A new task is created").build();
    }

    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@QueryParam("title") String title) {
        boolean deleted =  taskBean.removeTask(title);
        if (!deleted)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task deleted").build();
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